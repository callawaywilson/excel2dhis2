## Document Mapping

### Definitions

```javascript
{
  params: {
    year: null,
    orgUnits: null
  },
  definition: {
    defaults: {
      categoryOptionCombo: "XXXXXXXXX",
      attributeOptionCombo: "XXXXXXXXX",
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
      a. year
      b. reference to org mappings
  2. Populate `params` and place global in execution to reference.
  3. Place `definition` into global.
  4. Iterate over `sheets`:
      a. Find sheet matching names/regexes in `names`.
      b. Iterate over `mappings` in row.sheet, starting at startRow:
          i. Take value in column `column`
          ii. Execute `mapping` function if present (pass in value and row)
          iii. Assign `dataElement`, `categoryOptionCombo`, `attributeOptionCombo`
          iv. Assign `period` and `orgUnit` if has dataElement
          v. Place in `row` values and continue to next mapping
      c. Store row output dataElements for JSON output
  5. Output JSON of all dataElements


#### Mappings

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

