require 'optparse'
require 'io/console'
require 'json'
require 'rest-client'

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: update_co_combos.rb [options]"
  opts.on('-h', '--host HOST', 'DHIS2 Server host') { |v| options[:host] = v }
  opts.on('-u', '--user USER', 'Log in username') { |v| options[:user] = v }
end.parse!

unless options[:host] && options[:user]
  raise ArgumentError, "host and user are required arguments"
end

puts "Password for #{options[:user]}: "
options[:pass] = STDIN.noecho(&:gets).chomp

host = "http://#{options[:user]}:#{options[:pass]}@#{options[:host]}"

attributes = JSON.parse RestClient.get("#{host}/api/29/attributes.json", {accept: :json})
@ntdcode_id = attributes["attributes"].find{|a| a['displayName'] == 'NTDCode'}['id']


def get_ntdcode obj
  if obj['attributeValues'].empty?
    nil
  else
    obj['attributeValues'].find{|a| a['attribute']['id'] == @ntdcode_id}['value']
  end
end

def set_ntdcode! obj, value
  obj['attributeValues'] = [] if obj['attributeValues'].nil?
  obj['attributeValues'].delete_if{|v| v['attribute']['id'] == @ntdcode_id}
  obj['attributeValues'] << {"value" => value, "attribute" => {"id" => @ntdcode_id}}
  obj['code'] = value
  return obj
end

# Get all categories combos (to order options in combos)
category_combos = JSON.parse(RestClient.get("#{host}/api/29/categoryCombos.json?fields=id,name,attributeValues&pageSize=1000", {accept: :json}))['categoryCombos']
category_combo_map = {}
category_combos.each do |category_combo|
  category_combo_map[category_combo['id']] = category_combos
end

# Get all category options
category_options = JSON.parse(RestClient.get("#{host}/api/29/categoryOptions.json?fields=id,name,attributeValues,categories&pageSize=1000", {accept: :json}))['categoryOptions']
category_option_map = {}
category_options.each do |category_option|
  category_option_map[category_option['id']] = category_option
end

# Get all categories option combos
category_option_combos = JSON.parse(RestClient.get("#{host}/api/29/categoryOptionCombos.json?fields=id,name,attributeValues,categoryOptions,categoryCombo&pageSize=1000", {accept: :json}))['categoryOptionCombos']

category_option_combos.each do |coc|
  # Sort categoryOptions according to name
  names_order = coc['name'].split(',').map{|s|s.strip.gsub(/\s+/, ' ')}
  # category_combo = category_combo_map[coc['categoryCombo']['id']]
  category_option_ids = coc['categoryOptions'].map{|c| c['id']}
  category_option_ids.sort_by! do |co_id|
    # x_name = category_option_map[x]['name']
    # y_name = category_option_map[y]['name']
    # puts "#{x_name}: #{names_order.index(x_name)}, #{y_name}: #{names_order.index(y_name)}"
    # names_order.index(x_name) <=> names_order.index(y_name)
    names_order.index(category_option_map[co_id]['name'])
  end

  ntd_codes = category_option_ids.map do |option_id|
    get_ntdcode category_option_map[option_id]
  end

  set_ntdcode! coc, ntd_codes.join('-')
end

category_option_combos.each do |category_option_combo|
  puts "\"#{category_option_combo['name']}\",#{get_ntdcode(category_option_combo)}" 
  RestClient.put("#{host}/api/29/categoryOptionCombos/#{category_option_combo['id']}",
    JSON.dump(category_option_combo), {content_type: :json, accept: :json})
end

