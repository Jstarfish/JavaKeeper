# Creating Export Requests

Export requests can be made to export data out of aiWARE in specific formats.
They are requested via the [`createExportRequest` mutation](/apis/reference/mutation/?id=createexportrequest).

An example mutation might look like this:

```graphql
mutation createExportRequest {
 createExportRequest(input: {
   includeMedia: true
   tdoData: [{tdoId: "96972470"}, {tdoId: "77041379"}]
   outputConfigurations:[
     {
       engineId:"<engine ID>"
       categoryId:"67cd4dd0-2f75-445d-a6f0-2f297d6cd182"
       formats:[
         {
           extension:"ttml"
           options: {
             maxCharacterPerLine:32
             newLineOnPunctuation: true
           }
         }
       ]
     }
   ]
 }) {
   id
   status
   organizationId
   createdDateTime
   modifiedDateTime
   requestorId
   assetUri
 }
}
```

See the [API reference](https://api.veritone.com/v3/graphqldocs/createexportrequest.doc.html) for full documentation on all the available parameters.

## Format-Specific Options

The `options` block under `formats` is (by definition) optional.
When it is used, please note that different options apply to different formats.

<!-- markdownlint-disable no-inline-html -->
| Format | Available Options |
| ---- | ---- |
| `txt` | `maxCharacterPerLine`<br/>`withSpeakerData`<br/>`timeGapToSeparateParagraphMs` |
| `ttml` | `maxCharacterPerLine`<br/>`newLineOnPunctuation`<br/>`withSpeakerData` |
| `vtt` | `maxCharacterPerLine`<br/>`newLineOnPunctuation`<br/>`withSpeakerData`<br/>`linesPerScreen` |
| `srt` | `maxCharacterPerLine`<br/>`newLineOnPunctuation`<br/>`withSpeakerData`<br/>`linesPerScreen` |
<!-- markdownlint-enable no-inline-html -->
