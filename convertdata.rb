require 'optparse'
require 'io/console'
require 'json'

def mapValue value
  newDataElement = value['dataElement']
  newCategoryOptionCombo = value['categoryOptionCombo']
  newPeriod = value['period']

  if value['period'] =~ /Q1/
    newPeriod = value['period'].gsub /Q1/, '03'
  elsif value['period'] =~ /Q2/
    newPeriod = value['period'].gsub /Q2/, '06'
  elsif value['period'] =~ /Q3/
    newPeriod = value['period'].gsub /Q3/, '09'
  elsif value['period'] =~ /Q4/
    newPeriod = value['period'].gsub /Q4/, '12'
  end

  if value['dataElement'] == 'pcn-pop-trgt'
    if value['categoryOptionCombo'] =~ /pc-ntd-ov/
      newDataElement = 'pcn-pop-trgt-ov'
      newCategoryOptionCombo = value['categoryOptionCombo'].gsub /pc-ntd-ov-/, ''
    elsif value['categoryOptionCombo'] =~ /pc-ntd-lf/
      newDataElement = 'pcn-pop-trgt-lf'
      newCategoryOptionCombo = value['categoryOptionCombo'].gsub /pc-ntd-lf-/, ''
    elsif value['categoryOptionCombo'] =~ /pc-ntd-sth/
      newDataElement = 'pcn-pop-trgt-sth'
      newCategoryOptionCombo = value['categoryOptionCombo'].gsub /pc-ntd-sth-/, ''
    elsif value['categoryOptionCombo'] =~ /pc-ntd-sch/
      newDataElement = 'pcn-pop-trgt-sch'
      newCategoryOptionCombo = value['categoryOptionCombo'].gsub /pc-ntd-sch-/, ''
    elsif value['categoryOptionCombo'] =~ /pc-ntd-trachoma/
      newDataElement = 'pcn-pop-trgt-tr'
      newCategoryOptionCombo = value['categoryOptionCombo'].gsub /pc-ntd-trachoma-/, ''
    end
  end

  if value['dataElement'] == 'pcn-pop-trt'
    if value['categoryOptionCombo'] =~ /pcnd-treatment-ov/
      newDataElement = 'pcn-pop-trt-ov'
      newCategoryOptionCombo = value['categoryOptionCombo'].gsub /pcnd-treatment-ov-/, ''
    elsif value['categoryOptionCombo'] =~ /pcnd-treatment-lf/
      newDataElement = 'pcn-pop-trt-lf'
      newCategoryOptionCombo = value['categoryOptionCombo'].gsub /pcnd-treatment-lf-/, ''
    elsif value['categoryOptionCombo'] =~ /pcnd-treatment-sth/
      newDataElement = 'pcn-pop-trt-sth'
      newCategoryOptionCombo = value['categoryOptionCombo'].gsub /pcnd-treatment-sth-/, ''
    elsif value['categoryOptionCombo'] =~ /pcnd-treatment-sch/
      newDataElement = 'pcn-pop-trt-sch'
      newCategoryOptionCombo = value['categoryOptionCombo'].gsub /pcnd-treatment-sch-/, ''
    elsif value['categoryOptionCombo'] =~ /pc-ntd-trachoma-age/
      newDataElement = 'pcn-pop-trt-tr-ztabs'
      newCategoryOptionCombo = value['categoryOptionCombo'].gsub /pc-ntd-trachoma-/, ''
    elsif value['categoryOptionCombo'] =~ /pcnd-trachoma-tetra/
      newDataElement = 'pcn-pop-trt-tr-teo'
      newCategoryOptionCombo = value['categoryOptionCombo'].gsub /pcnd-trachoma-tetra-/, ''
    elsif value['categoryOptionCombo'] =~ /pcnd-trachoma-zith-syrp/
      newDataElement = 'pcn-pop-trt-tr-zsyrup'
      newCategoryOptionCombo = value['categoryOptionCombo'].gsub /pcnd-trachoma-zith-syrp-/, ''
    end
  end

  if value['period'].length < 6
    return nil
  end

  return value.merge({
    'dataElement' => newDataElement,
    'period' => newPeriod,
    'categoryOptionCombo' => newCategoryOptionCombo
  })
end

options = {}
OptionParser.new do |opts|
  opts.banner = "Usage: convertdata.rb [options]"
  opts.on('-f', '--file FILE', 'Input JSON file') { |v| options[:file] = v }
end.parse!

unless options[:file]
  raise ArgumentError, "input file is required"
end

data = JSON.parse File.read(options[:file])
newData = []

newData = data['dataValues'].map{|value| mapValue(value) }.compact

puts JSON.dump({"dataValues" => newData})