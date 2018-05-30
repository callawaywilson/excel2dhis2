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
| Population - PreSAC         | E  | HMJ3Hth1ry7[clHYCgF9jys] | |
| Population - SAC            | F  | HMJ3Hth1ry7[AVegvKfvlnS] | |
| Population - Adults         | G  | HMJ3Hth1ry7[yW288iFizUY] | |
| Population - Adults         | G  | HMJ3Hth1ry7[yW288iFizUY] | |
| Prevalence - LF             | H  | Nva0k6G5RsF[RIEjTfuzC1z] | |
| Prevalence - Oncho          | I  | Nva0k6G5RsF[SjE9LhAEw1i] | |
| Prevalence - STH            | J  | Nva0k6G5RsF[MgZwyzoI9Ka] | |
| Prevalence - SCH            | K  | Nva0k6G5RsF[eFifYMTcO2T] | |
| Endemicity - LF             | H  | BwX5xyuCQQU[RIEjTfuzC1z] | |
| Endemicity - Oncho          | I  | BwX5xyuCQQU[SjE9LhAEw1i] | |
| Endemicity - STH            | J  | BwX5xyuCQQU[MgZwyzoI9Ka] | |
| Endemicity - SCH            | K  | BwX5xyuCQQU[eFifYMTcO2T] | |


### TEMF & Zithromax Application

#### TEMF

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| Geoconnect ID           | D  | Organization.attributes['Geoconnect ID']  | |
| Year of Current Survey  | F  | fwocIchmkBs[]                  | |
| Current TF %            | G  | iB2QByaVoiB[]                  | |
| Current TT %            | H  | L36uJKin4xW[]                  | |
| TT Age Group            | I  | tYEOhAimtsQ[] | String like "F & M ≥ 15", parse to min age |
| TT Sex                  | I  | mPMdsgLyqev[] | String like "F & M ≥ 15", parse to sex |
| TT Data Source          | J  | vbohuRxSxDE[] | |
| TT Surgery - F          | K  | d7TTTQDQSEL[XxPgNmIyWEx] | |
| TT Surgery - M          | L  | d7TTTQDQSEL[H8q1t9ex8OR] | |
| Month of MDA            | O  | wjJTQ33NCbj[] | Sheet has month, translate to date |
| Antib. - Az tabs - F    | P  | NrsJDmb5ymd[xtUty2s6rb9] | Use either P&Q or R.  If all 3, use P&Q |
| Antib. - Az tabs - M    | Q  | NrsJDmb5ymd[rVAT5UlKOVq] | Use either P&Q or R.  If all 3, use P&Q |
| Antib. - Az tabs - Unk  | R  | NrsJDmb5ymd[uE0CxADyNck] | Use either P&Q or R.  If all 3, use P&Q |
| Antib. - Az Oral - F    | S  | NrsJDmb5ymd[AkUk2I8UYdo] | Use either S&T or U.  If all 3, use S&T |
| Antib. - Az Oral - M    | T  | NrsJDmb5ymd[ueQESuOZbTK] | Use either S&T or U.  If all 3, use S&T |
| Antib. - Az Oral - Unk  | U  | NrsJDmb5ymd[VDJkgG8WuMr] | Use either S&T or U.  If all 3, use S&T |
| Antib. - Tet Oin - F    | V  | NrsJDmb5ymd[igXj2FYlmQ3] | Use either V&W or X.  If all 3, use V&W |
| Antib. - Tet Oin - M    | W  | NrsJDmb5ymd[GoajnE9epLK] | Use either V&W or X.  If all 3, use V&W |
| Antib. - Tet Oin - Unk  | X  | NrsJDmb5ymd[VnTPvQznpOf] | Use either V&W or X.  If all 3, use V&W |
| Antib. - Az Drops - F   | Y  | NrsJDmb5ymd[vcUu6ODYhLw] | Use either Y&Z or AA.  If all 3, use Y&Z |
| Antib. - Az Drops - M   | Z  | NrsJDmb5ymd[hskrbPDMQ8u] | Use either Y&Z or AA.  If all 3, use Y&Z |
| Antib. - Az Drops - Unk | AA | NrsJDmb5ymd[lmiSrZd1dDJ] | Use either Y&Z or AA.  If all 3, use Y&Z |
| F - time of MDA         | AD | o33d514b4LM[WUjsOlQ1ta4] | LIKE "At time of MDA" |
| F - school-based        | AD | o33d514b4LM[JVgAvwuqe6H] | LIKE "School Based" |
| F - radio/media         | AD | o33d514b4LM[gzyIHIx7qQd] | LIKE "Radio Message and/or other mass media" |
| F - CHW                 | AD | o33d514b4LM[cAbNbOtOV5Y] | LIKE "Village health worker or equivalent" |
| F - Primary healthcare  | AD | o33d514b4LM[yGcTqXGXmQs] | LIKE "Primary healthcare" |
| F - Other               | AD | o33d514b4LM[qClFirrlViZ] | LIKE "Other" |
| F - None                | AD | o33d514b4LM[dSbmqcOKis2] | LIKE "None" |
| E - Latrine/NTTF        | AE | gqnbsVPxSoV[bcqX62Vavtz] | LIKE "Latrine construction by NTTF Member" |
| E - Water Point/NTTF    | AE | gqnbsVPxSoV[Kb8PX7E8r2j] | LIKE "Water point construction by NTTF member" |
| E - Latrine/Other       | AE | gqnbsVPxSoV[Q26YQD2JeWO] | LIKE "Latrine construction by other stakeholders" |
| E - Water Point/Other   | AE | gqnbsVPxSoV[Ue60RFoLwWi] | LIKE "Water point construction by other stakeholders" |
| E - Comm-led sani       | AE | gqnbsVPxSoV[wVxHAvy7psp] | LIKE "Community led total sanitation" |
| E - Other               | AE | gqnbsVPxSoV[fS91yAIC7qR] | LIKE "Other" |
| E - None                | AE | gqnbsVPxSoV[JMe37GzRyb3] | LIKE "None" *Added None post export, double check categoryCombo option |
| Comments                | AF | zknpxa5S7P0[] | |


### 5 - Zithromax Application

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| Geoconnect ID           | D  | Organization.attributes['Geoconnect ID']  | |
| Intervention Status     | K  | yD4patF6TMc[] | |
| Treatment Request       | L  | XpXE3AYoW4V[] | |
| MDA Partner             | M  | qXfluft9WvF[] | |
| Month of MDA            | N  | FtgUASI0s26[] | |
| MDA Funding approved    | O  | HDIz3YLsw73[] | |
| MDA Funding source      | P  | dEFippgWHZi[] | |
| Next impact survey year | Q  | fY74mfHG6Xr[] | |
| Next impact survey month| R  | QZpTVwpsbw1[] | |



### Joint Reporting Form

#### MDA1

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| MDA 1 - Date                   | E  | DoE8a6k9C4R[] | |
| MDA 1 - Pop Targeted / SAC     | G  | Fewjj1kZFy6[AVegvKfvlnS] | |
| MDA 1 - Pop Targeted / Adult   | H  | Fewjj1kZFy6[yW288iFizUY] | |
| MDA 1 - Pop Treated / SAC     | K  | BEb0GZkSRPJ[AVegvKfvlnS] | |
| MDA 1 - Pop Treated / Adult   | L  | BEb0GZkSRPJ[yW288iFizUY] | |

#### MDA2

| MDA 2 - Date                   | E  | Dq51uK1OS8i[] | |
| MDA 2 - Pop Targeted / PreSAC  | F  | knszUMU2VJz[clHYCgF9jys] | |
| MDA 2 - Pop Targeted / SAC     | G  | knszUMU2VJz[AVegvKfvlnS] | |
| MDA 2 - Pop Targeted / Adult   | H  | knszUMU2VJz[yW288iFizUY] | |
| MDA 2 - Pop Treated / PreSAC   | J  | McBm4Bsq7Qu[clHYCgF9jys] | |
| MDA 2 - Pop Treated / SAC      | K  | McBm4Bsq7Qu[AVegvKfvlnS] | |
| MDA 2 - Pop Treated / Adult    | L  | McBm4Bsq7Qu[yW288iFizUY] | |

#### MDA3

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| MDA 3 - Date                   | E  | ktCOzVn5CKC[] | |
| MDA 3 - Pop Targeted / SAC     | F  | AtIZ8IS3pyd[AVegvKfvlnS] | |
| MDA 3 - Pop Targeted / Adult   | G  | AtIZ8IS3pyd[yW288iFizUY] | |
| MDA 3 #1 - Pop Targeted / SAC     | I  | BFUaToyQOwN[AVegvKfvlnS] | |
| MDA 3 #1 - Pop Targeted / Adult   | J  | BFUaToyQOwN[yW288iFizUY] | |
| MDA 3 #2 - Pop Targeted / SAC     | L  | yn8ZrOTU6cV[AVegvKfvlnS] | |
| MDA 3 #2 - Pop Targeted / Adult   | M  | yn8ZrOTU6cV[yW288iFizUY] | |

#### T1

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| T1 - Date                   | F  | Myt2Cf5A5ik[] | |
| T1 - Medicine Selection     | E  | cx7mIjgV6m1[] | |
| T1 - Pop Targeted / SAC-ALB | H  | dsEgJ1Dxrg3[O4UwQ6XVJmU] | |
| T1 - Pop Targeted / SAC-PZQ | I  | dsEgJ1Dxrg3[RSDW04F7B7O] | |
| T1 - Pop Treated / PreSAC   | F  | Xk4IHafTNfW[clHYCgF9jys] | |
| T1 - Pop Treated / SAC      | G  | Xk4IHafTNfW[AVegvKfvlnS] | |
| T1 - Pop Treated / Adult    | H  | Xk4IHafTNfW[yW288iFizUY] | |

#### T2

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| T2 - Date                   | E  | Dq51uK1OS8i[] | |
| T2 - Pop Targeted / PreSAC  | F  | nXCbgQjGEf7[clHYCgF9jys] | |
| T2 - Pop Targeted / SAC     | G  | nXCbgQjGEf7[AVegvKfvlnS] | |
| T2 - Pop Targeted / Adult   | H  | nXCbgQjGEf7[yW288iFizUY] | |
| T2 - Pop Treated / PreSAC   | J  | xmJ0f5OzOVe[clHYCgF9jys] | |
| T2 - Pop Treated / SAC      | K  | xmJ0f5OzOVe[AVegvKfvlnS] | |
| T2 - Pop Treated / Adult    | L  | xmJ0f5OzOVe[yW288iFizUY] | |

#### T3_R1

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| T3R1 - Date                   | F  | I0HzUP1djpJ[] | |
| T3R1 - Medicine Selection     | E  | uaCLJBX6YC5[] | |
| T3R1 - Pop Targeted / PreSAC  | G  | QNO43BaqL3B[clHYCgF9jys] | |
| T3R1 - Pop Targeted / SAC     | H  | QNO43BaqL3B[AVegvKfvlnS] | |
| T3R1 - Pop Targeted / Adult   | I  | QNO43BaqL3B[yW288iFizUY] | |
| T3R1 - Pop Treated / PreSAC   | K  | SlpX7bo7ZDU[clHYCgF9jys] | |
| T3R1 - Pop Treated / SAC      | L  | SlpX7bo7ZDU[AVegvKfvlnS] | |
| T3R1 - Pop Treated / Adult    | M  | SlpX7bo7ZDU[yW288iFizUY] | |

#### T3_R2

| Name    | Column  | Mapping | Logic |
| ------- | ------- | ------- | ----- |
| T3R2 - Date                   | F  | k8dqjv7btGO[] | |
| T3R2 - Medicine Selection     | E  | l576SEiEppI[] | |
| T3R2 - Pop Targeted / PreSAC  | G  | iKHUsxY44Du[clHYCgF9jys] | |
| T3R2 - Pop Targeted / SAC     | H  | iKHUsxY44Du[AVegvKfvlnS] | |
| T3R2 - Pop Targeted / Adult   | I  | iKHUsxY44Du[yW288iFizUY] | |
| T3R2 - Pop Treated / PreSAC   | K  | dNlHjGevP1d[clHYCgF9jys] | |
| T3R2 - Pop Treated / SAC      | L  | dNlHjGevP1d[AVegvKfvlnS] | |
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
