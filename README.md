## Usage

```
$ node import -p parsers/temf.js -o output.json -u orgunits.json -t 2018 temf_file.xlsx
```

Options:

  - `-p`, `--parser` - Parser file (see defintion below) to load
  - `-o`, `--output` - Destination file for DHIS2 data
  - `-u`, `--orgUnits` - Org Units file (export from DHIS2 in JSON)
  - `-t`, `--period` - Period to use for imports (passed to parser)


## Document Mapping

### Definitions

```javascript
{
  params: {
    period: null,
    orgUnits: null
  },
  definition: {
    defaults: {
      categoryOptionCombo: "XXXXXXXXX",
      attributeOptionCombo: "XXXXXXXXX"
    }
  },
  sheets: [
    {
      names: [/4-[\D]{4} TEMF/],    // String or Regex, names of tabs to match
      startRow: 7,                  // Row to start parsing on.  Continues to end.
      row: {
        invariants: {
          period: function(row) {
            return params.year; 
          },
          orgUnit: function(row) {
            // some logic to map row data onto orgUnit ID.
          }
        },
        mappings: [
          {
            column: "D",
            variable: "geoconnectID"
          },
          {
            column: "F",
            dataElement: "XXXXXXXX",
            categoryOptionCombo: "XXXXXXXX",
            attributeOptionCombo: "XXXXXXXX",
            mapping: function(inputValue, row) {
              return value; //default returns input value
            }
          }
        ]
      }
    }
  ]
}
```

### Process

  1. Execute import script on Excel file with parameters:
      1. year
      2. reference to org mappings
  2. Populate `params` and place global in execution to reference.
  3. Place `definition` into global.
  4. Iterate over `sheets`:
      1. Find sheet matching names/regexes in `names`.
      2. Iterate over `mappings` in row.sheet, starting at startRow:
          1. Take value in column `column`
          2. Execute `mapping` function if present (pass in value and row)
          3. Assign `dataElement`, `categoryOptionCombo`, `attributeOptionCombo`
          4. Assign `period` and `orgUnit` if has dataElement
          5. Place in `row` values and continue to next mapping
      3. Store row output dataElements for JSON output
  5. Output JSON of all dataElements


### Population Numbers - From JRF

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| Population - PreSAC         | E  | ntd-pop[age-presac] | |
| Population - SAC            | F  | ntd-pop[age-sac] | |
| Population - Adults         | G  | ntd-pop[age-adult] | |
| Prevalence - LF             | H  | pcn-prevalence[pc-ntd-lf] | |
| Prevalence - Oncho          | I  | pcn-prevalence[pc-ntd-ov] | |
| Prevalence - STH            | J  | pcn-prevalence[pc-ntd-sth] | |
| Prevalence - SCH            | K  | pcn-prevalence[pc-ntd-sch] | |
| Endemicity - LF             | H  | pcn-endemicity[pc-ntd-lf] | |
| Endemicity - Oncho          | I  | ppcn-endemicity[pc-ntd-ov] | |
| Endemicity - STH            | J  | pcn-endemicity[pc-ntd-sth] | |
| Endemicity - SCH            | K  | pcn-endemicity[pc-ntd-sch] | |


### TEMF & Zithromax Application

#### TEMF

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| Geoconnect ID           | D  | Organization.attributes['Geoconnect ID']  | |
| Year of Current Survey  | F  | pcn-survey-year[]                  | |
| Current TF %            | G  | trch-tf-pct[]                  | |
| Current TT %            | H  | trch-tt-pct[]                  | |
| TT Age Group            | I  | trch-tt-age[] | String like "F & M ≥ 15", parse to min age |
| TT Sex                  | I  | trch-tt-sex[] | String like "F & M ≥ 15", parse to sex |
| TT Data Source          | J  | trch-tt-survey[] | |
| TT Surgery - F          | K  | trch-surgeries[XxPgNmIyWEx] | |
| TT Surgery - M          | L  | trch-surgeries[H8q1t9ex8OR] | |
| Month of MDA            | O  | :fire [] | Sheet has month, translate to date |
| Antib. - Az tabs - F    | P  | pcn-pop-trt[xtUty2s6rb9] | Use either P&Q or R.  If all 3, use P&Q |
| Antib. - Az tabs - M    | Q  | pcn-pop-trt[rVAT5UlKOVq] | Use either P&Q or R.  If all 3, use P&Q |
| Antib. - Az tabs - Unk  | R  | pcn-pop-trt[uE0CxADyNck] | Use either P&Q or R.  If all 3, use P&Q |
| Antib. - Az Oral - F    | S  | pcn-pop-trt[AkUk2I8UYdo] | Use either S&T or U.  If all 3, use S&T |
| Antib. - Az Oral - M    | T  | pcn-pop-trt[ueQESuOZbTK] | Use either S&T or U.  If all 3, use S&T |
| Antib. - Az Oral - Unk  | U  | pcn-pop-trt[VDJkgG8WuMr] | Use either S&T or U.  If all 3, use S&T |
| Antib. - Tet Oin - F    | V  | pcn-pop-trt[igXj2FYlmQ3] | Use either V&W or X.  If all 3, use V&W |
| Antib. - Tet Oin - M    | W  | pcn-pop-trt[GoajnE9epLK] | Use either V&W or X.  If all 3, use V&W |
| Antib. - Tet Oin - Unk  | X  | pcn-pop-trt[VnTPvQznpOf] | Use either V&W or X.  If all 3, use V&W |
| Antib. - Az Drops - F   | Y  | pcn-pop-trt[vcUu6ODYhLw] | Use either Y&Z or AA.  If all 3, use Y&Z |
| Antib. - Az Drops - M   | Z  | pcn-pop-trt[hskrbPDMQ8u] | Use either Y&Z or AA.  If all 3, use Y&Z |
| Antib. - Az Drops - Unk | AA | pcn-pop-trt[lmiSrZd1dDJ] | Use either Y&Z or AA.  If all 3, use Y&Z |
| F - time of MDA         | AD | tra-outreach-fc[tra-outreach-fc-mda-time] | LIKE "At time of MDA" |
| F - school-based        | AD | tra-outreach-fc[tra-outreach-fc-school] | LIKE "School Based" |
| F - radio/media         | AD | tra-outreach-fc[tra-outreach-fc-media] | LIKE "Radio Message and/or other mass media" |
| F - CHW                 | AD | tra-outreach-fc[tra-outreach-fc-chw] | LIKE "Village health worker or equivalent" |
| F - Primary healthcare  | AD | tra-outreach-fc[tra-outreach-fc-primaryhc] | LIKE "Primary healthcare" |
| F - Other               | AD | tra-outreach-fc[tra-outreach-fc-other] | LIKE "Other" |
| F - None                | AD | tra-outreach-fc[tra-outreach-fc-none] | LIKE "None" |
| E - Latrine/NTTF        | AE | tra-outreach-ei[tra-outreach-ei-latrinenttf] | LIKE "Latrine construction by NTTF Member" |
| E - Water Point/NTTF    | AE | tra-outreach-ei[tra-outreach-ei-waterpointnttf] | LIKE "Water point construction by NTTF member" |
| E - Latrine/Other       | AE | tra-outreach-ei[tra-outreach-ei-latrineother] | LIKE "Latrine construction by other stakeholders" |
| E - Water Point/Other   | AE | tra-outreach-ei[tra-outreach-ei-waterpointother] | LIKE "Water point construction by other stakeholders" |
| E - Comm-led sani       | AE | tra-outreach-ei[tra-outreach-ei-commsani] | LIKE "Community led total sanitation" |
| E - Other               | AE | tra-outreach-ei[tra-outreach-ei-other] | LIKE "Other" |
| E - None                | AE | tra-outreach-ei[tra-outreach-ei-none] | LIKE "None" *Added None post export, double check categoryCombo option |
| Comments                | AF | zknpxa5S7P0[] | |


### 5 - Zithromax Application

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| Geoconnect ID           | D  | Organization.attributes['Geoconnect ID']  | |
| Intervention Status     | K  | yD4patF6TMc[] | |
| Treatment Request       | L  | XpXE3AYoW4V[] | |
| MDA Partner             | M  | qXfluft9WvF[] | |
| Month of MDA            | N  | pcn-pcdate[] | |
| MDA Funding approved    | O  | HDIz3YLsw73[] | |
| MDA Funding source      | P  | dEFippgWHZi[] | |
| Next impact survey year | Q  | fY74mfHG6Xr[] | |
| Next impact survey month| R  | QZpTVwpsbw1[] | |



### Joint Reporting Form

#### MDA1

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| MDA 1 - Date                   | E  | DoE8a6k9C4R[] | |
| MDA 1 - Pop Targeted / SAC     | G  | Fewjj1kZFy6[age-sac] | |
| MDA 1 - Pop Targeted / Adult   | H  | Fewjj1kZFy6[yW288iFizUY] | |
| MDA 1 - Pop Treated / SAC     | K  | BEb0GZkSRPJ[age-sac] | |
| MDA 1 - Pop Treated / Adult   | L  | BEb0GZkSRPJ[yW288iFizUY] | |

#### MDA2

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| MDA 2 - Date                   | E  | Dq51uK1OS8i[] | |
| MDA 2 - Pop Targeted / PreSAC  | F  | knszUMU2VJz[age-presac] | |
| MDA 2 - Pop Targeted / SAC     | G  | knszUMU2VJz[age-sac] | |
| MDA 2 - Pop Targeted / Adult   | H  | knszUMU2VJz[yW288iFizUY] | |
| MDA 2 - Pop Treated / PreSAC   | J  | McBm4Bsq7Qu[age-presac] | |
| MDA 2 - Pop Treated / SAC      | K  | McBm4Bsq7Qu[age-sac] | |
| MDA 2 - Pop Treated / Adult    | L  | McBm4Bsq7Qu[yW288iFizUY] | |

#### MDA3

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| MDA 3 - Date                   | E  | ktCOzVn5CKC[] | |
| MDA 3 - Pop Targeted / SAC     | F  | AtIZ8IS3pyd[age-sac] | |
| MDA 3 - Pop Targeted / Adult   | G  | AtIZ8IS3pyd[yW288iFizUY] | |
| MDA 3 #1 - Pop Targeted / SAC     | I  | BFUaToyQOwN[age-sac] | |
| MDA 3 #1 - Pop Targeted / Adult   | J  | BFUaToyQOwN[yW288iFizUY] | |
| MDA 3 #2 - Pop Targeted / SAC     | L  | yn8ZrOTU6cV[age-sac] | |
| MDA 3 #2 - Pop Targeted / Adult   | M  | yn8ZrOTU6cV[yW288iFizUY] | |

#### T1

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| T1 - Date                   | F  | Myt2Cf5A5ik[] | |
| T1 - Medicine Selection     | E  | cx7mIjgV6m1[] | |
| T1 - Pop Targeted / SAC-ALB | H  | dsEgJ1Dxrg3[O4UwQ6XVJmU] | |
| T1 - Pop Targeted / SAC-PZQ | I  | dsEgJ1Dxrg3[RSDW04F7B7O] | |
| T1 - Pop Treated / PreSAC   | F  | Xk4IHafTNfW[age-presac] | |
| T1 - Pop Treated / SAC      | G  | Xk4IHafTNfW[age-sac] | |
| T1 - Pop Treated / Adult    | H  | Xk4IHafTNfW[yW288iFizUY] | |

#### T2

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| T2 - Date                   | E  | Dq51uK1OS8i[] | |
| T2 - Pop Targeted / PreSAC  | F  | nXCbgQjGEf7[age-presac] | |
| T2 - Pop Targeted / SAC     | G  | nXCbgQjGEf7[age-sac] | |
| T2 - Pop Targeted / Adult   | H  | nXCbgQjGEf7[yW288iFizUY] | |
| T2 - Pop Treated / PreSAC   | J  | xmJ0f5OzOVe[age-presac] | |
| T2 - Pop Treated / SAC      | K  | xmJ0f5OzOVe[age-sac] | |
| T2 - Pop Treated / Adult    | L  | xmJ0f5OzOVe[yW288iFizUY] | |

#### T3_R1

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| T3R1 - Date                   | F  | I0HzUP1djpJ[] | |
| T3R1 - Medicine Selection     | E  | uaCLJBX6YC5[] | |
| T3R1 - Pop Targeted / PreSAC  | G  | QNO43BaqL3B[age-presac] | |
| T3R1 - Pop Targeted / SAC     | H  | QNO43BaqL3B[age-sac] | |
| T3R1 - Pop Targeted / Adult   | I  | QNO43BaqL3B[yW288iFizUY] | |
| T3R1 - Pop Treated / PreSAC   | K  | SlpX7bo7ZDU[age-presac] | |
| T3R1 - Pop Treated / SAC      | L  | SlpX7bo7ZDU[age-sac] | |
| T3R1 - Pop Treated / Adult    | M  | SlpX7bo7ZDU[yW288iFizUY] | |

#### T3_R2

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| T3R2 - Date                   | F  | k8dqjv7btGO[] | |
| T3R2 - Medicine Selection     | E  | l576SEiEppI[] | |
| T3R2 - Pop Targeted / PreSAC  | G  | iKHUsxY44Du[age-presac] | |
| T3R2 - Pop Targeted / SAC     | H  | iKHUsxY44Du[age-sac] | |
| T3R2 - Pop Targeted / Adult   | I  | iKHUsxY44Du[yW288iFizUY] | |
| T3R2 - Pop Treated / PreSAC   | K  | dNlHjGevP1d[age-presac] | |
| T3R2 - Pop Treated / SAC      | L  | dNlHjGevP1d[age-sac] | |
| T3R2 - Pop Treated / Adult    | M  | dNlHjGevP1d[yW288iFizUY] | |


### Joint Request for Selected PC Medicines

#### LF

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| Type of Survey                | A   | GY0DIuqIei9 |  |
| Name of survey site           | B   | imuAHltsaov |  |
| Date of Survey                | E   | nciytFVbQol |  |
| Date of the first PC round    | H   | gz4hHQXzVS0 |  |
| PC Rounds delivered prior     | I   | P9iRMnvQu08 |  |
| Diagnostic Test               | J   | oKD5iLYEkCN |  |
| Min Age                       | K   | E0ZexaeMoAo |  |
| Max Age                       | K   | WlMTnbyM2WB |  |
| Survey Site                   | L   | JGWdINJrLak |  |
| Survey Type                   | M   | KEVPtXXyHQV |  |
| Target sample size            | N   | gBS9GWku36T |  |
| Number of people examined     | O   | fSwd2C6xiqW |  |
| Number of people positive     | P   | SwiTL6UfvVv |  |
| Number of invalid tests       | R   | tIjR1abWHwk |  |
| LF Decision                   | S   | Ru9qu8oDDdb |  |
| LF - Number of Patients (Lymphoedema)            | T   | P57ddvXSAOa |  |
| LF - Method of Patient Estimation (Lymphoedema)  | U   | udPN6puZqbt |  |
| LF - Date of Patient Estimation (Lymphoedema)    | V   | ZbBcICa2ZFL |  |
| LF - Number of Health Facilities (Lymphoedema)   | W   | C6kJXQ965vc |  |
| LF - Number of Patients (Hydrocele)              | X   | BdGNHpuJ5rj |  |
| LF - Method of Patient Estimation (Hydrocele)    | Y   | rtCyuvva9LX |  |
| LF - Date of Patient Estimation (Hydrocele)      | Z   | fsru6N01Tur |  |
| LF - Number of Health Facilities (Hydrocele)     | AA  | qGExiSa3EMS |  |


#### Oncho

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| Type of Survey                | A   | OCB7xrl5og0 |  |
| Community Surveyed            | D   | a2nbxmFN7I3 |  |
| Date of First PC Round        | H   | gz4hHQXzVS0 |  |
| Oncho Treatment Strategy      | I   | oqNUs0mZrq8 |  |
| Pre-control Prevalence        | J   | I1b1mzCkfHq |  |
| Rounds delivered p. to survey | K   | P9iRMnvQu08 |  |
| MF Skin Snip - Diagnostic Method      | L   | cg0paY8on36 |  |
| MF Skin Snip - Number People Examined | M   | mLCVHr0rhni |  |
| Oncho - MF Skin Snip - Minimum Age    | N   | icN4AkulJGC |  |
| Oncho - MF Skin Snip - Maximum Age    | N   | PljKluU3jfw |  |
| MF Skin Snip - Number People Positive | O   | Eviv4dwEmAM |  |
| MF Skin Snip - CMFL                   | Q   | TTQweaIKeoF |  |
| Serology -  Diagnostic                | R   | v88aw43TrCe |  |
| Serology -  Sampling method           | S   | KfkfNfxq18n |  |
| Serology -  # Examined                | T   | w4i03vkP8bP |  |
| Serology -  Min Age                   | U   | oHQS85o8Fju |  |
| Serology -  Max Age                   | U   | KrRyIHEklhu |  |
| Serology -  # Positive                | V   | Nx9AA4QYa8K |  |
| PCR-BF - # Flies Examined             | X   | RWt5suL4HyS |  |
| PCR-BF - Species of vector            | Y   | CLMHpu1T3s1 |  |
| PCR-BF - % poolscreen positive        | Z   | iAJgdhzlboL |  |
| Crab  - # Crabs examined              | AA  | SyjrMOaIx5f |  |
| Crab  - Species of vector             | AB  | KZleAN2NyHB |  |
| Crab  - % MF Positive                 | AC  | zaGCXSvfUUn |  |
| Programmatic Decision                 | AD  | sG6crE6N2fY |  |
