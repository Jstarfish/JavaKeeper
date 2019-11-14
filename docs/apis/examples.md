# API Examples (GraphQL)

## Authentication

### Log In and Get Session Token

```graphql
mutation userLogin {
  userLogin(input: {userName: "jdoe@mycompany.com" password: "Password123"}) {
    token
  }
}
```

RESPONSE:

```json
{
  "data": {
    "userLogin": {
      "token": "98b80884-a9f5-49ef-a7c6-bab43751218e"
    }
  }
}
```

ERRORS: (User not found)

```json
{
  "data": {
    "userLogin": null
  },
  "errors": [
    {
      "message": "The requested object or entity could not be found",
      "name": "not_found",
      "time_thrown": "2019-03-04T17:13:49.691Z",
      "data": {
        "serviceMessage": "404 - undefined",
        "requestId": "0A0B018B:47AA_0A0B664F:0050_5C7D5CCC_98997F2:6132",
        "errorId": "d089ba45-e0a5-408f-b5b3-fefa33951f73"
      },
      "path": [
        "userLogin"
      ],
      "locations": [
        {
          "line": 2,
          "column": 3
        }
      ]
    }
  ]
}
```

### Validate Token

```graphql
mutation validateToken {
  validateToken(token: "78cac3d0-684d-486e-8d86-8890dbae72e2") {
    token
  }
}
```

### Log Out User Session

```graphql
mutation userLogout {
  userLogout(token: "3c15e237-94a5-4563-9be7-4882acc7fa74")
}
```

## Builds and Deployment

### Get an Engine's Name, State, Build, and Deployment Model

```graphql
query {
  engine(id:"3929002a-6902-4c59-b81c-7a79fcd8b9c0"){
    id
    name
    state
    deploymentModel
    builds(buildStatus:deployed) {
      records{
        id
      }
    }
  }
}
```

RETURNS:

```json
{
  "data": {
    "engine": {
      "id": "3929002a-6902-4c59-b81c-7a79fcd8b9c0",
      "name": "Amazon Transcribe - V2F (EU West)",
      "state": "active",
      "deploymentModel": "NonNetworkIsolated",
      "builds": {
        "records" : [  ]
      }
    }
  }
}
```

### Pause the Build

Before changing an engine's `deploymentModel`, it should be paused.

> Use caution not to pause an engine that might currently be in use.

```graphql
mutation pauseBuild{
  updateEngineBuild(input:{
    id: "6ff2cd01-a648-4ce1-afe4-9392b8821057"
    engineId: "0fe8e64c-6c70-4727-9d89-de06f5231a6f"
    action: pause
  }){
    id
    engineId
    status
  }
}
```

Possible values for `action` include the following:

```graphql
enum BuildUpdateAction {
  deploy
  pause
  unpause
  approve
  disapprove
  invalidate
  submit
  upload
  delete
}
```

### Update an Engine's Deployment Model

> The engine should be paused (as demonstrated above) prior to running this command.

```graphql
mutation updateModel{
  updateEngine(input:{
    id:"0fe8e64c-6c70-4727-9d89-de06f5231a6f"
    deploymentModel: FullyNetworkIsolated
  }){
    id
    name
    deploymentModel
  }
}
```

### Unpause the Build

```graphql
mutation unpauseBuild{
  updateEngineBuild(input:{
    id:"6ff2cd01-a648-4ce1-afe4-9392b8821057"
    engineId:"0fe8e64c-6c70-4727-9d89-de06f5231a6f"
    action:unpause
  }){
    id
    engineId
    status
  }
}
```

### Deploy a Build

> If you have changed an engine's `deploymentModel` using the foregoing commands, you should `deploy` it again.

```graphql
mutation deployBuild{
  updateEngineBuild(input:{
    id:"6ff2cd01-a648-4ce1-afe4-9392b8821057"
    engineId:"0fe8e64c-6c70-4727-9d89-de06f5231a6f"
    action:deploy
  }){
    id
    engineId
    status
  }
}
```

## Collections

### Create a Collection

```graphql
mutation newCollection {
  createCollection(input:{
    name:"Test Collection",
    image:"https://edit.co.uk/uploads/2016/12/Image-1-Alternatives-to-stock-photography-Thinkstock.jpg"
    folderDescription:"Interesting Folder"
  }) {
    id
  }
}
```

RESPONSE:

```json
{
  "data": {
    "createCollection": {
      "id": "10570"
    }
  }
}
```

### Get Collections

```graphql
query getCollections {
  collections {
    records {
      id
    }
  }
```

RESPONSE:

```json
{
  "data": {
    "collections": {
      "records": [
        {
          "id": "10566"
        },
        {
          "id": "10570"
        },
        {
          "id": "10569"
        }
      ]
    }
  }
}
```

### Update a Collection

```graphql
mutation {
  updateCollection(input: {folderId: "10566", name: "First Collection", folderDescription: "Folder description of first collection"}) {
    id
    name
  }
}
```

RESPONSE:

```json
{
  "data": {
    "updateCollection": {
      "id": "10566",
      "name": "First Collection"
    }
  }
}
```

### Delete a Collection

```graphql
mutation removeCollection {
  deleteCollection(id: "10566") {
    id
  }
}
```

## Ingestion

### Create TDO and Upload Asset

This is probably the easiest way to upload a file.
Given a public file URL it will create a container TDO and upload the file as the primary media asset for that TDO.

> "uri" must be a public URL

```graphql
mutation createTDOWithAsset {
  createTDOWithAsset(
    input: {
      startDateTime: 1533761172,
      stopDateTime: 1533761227,
      contentType: "video/mp4",
      assetType: "media",
      addToIndex: true,
      uri: "https://s3.amazonaws.com/hold4fisher/s3Test.mp4"
    }
  )
  {
    id
    status
    assets {
      records {
        id
        assetType
        contentType
        signedUri
      }
    }
  }
}
```

### Create Empty TDO (No Asset)

This can be useful for creating a container TDO that you can upload assets into later with the `createAsset` mutation.

```graphql
mutation createTDO {
  createTDO(
    input: {
      startDateTime: 1548432520,
      stopDateTime: 1548436341
    }
  )
  {
    id
    status
  }
}
```

## Jobs and Tasks

### Run Engine Job on Existing TDO

> The last three "engineId" values are needed for the TDO to appear correctly in CMS.

```graphql
mutation runEngineJob {
  createJob(
    input: {
      targetId: "102014611",
      tasks: [
        {
          engineId: "8081cc99-c6c2-49b0-ab59-c5901a503508"
        },
        {
          engineId: "insert-into-index"
        },
        {
          engineId: "thumbnail-generator"
        },
        {
          engineId: "mention-generate"
        }
      ]
    }
  )
  {
    id
  }
}
```

### Run Engine Job on External File (using Web Stream Adapter) and Add Results to Existing TDO

> "url" must be public; change only the second "engineId" value.  The existing TDO must be empty (no assets).

```graphql
mutation runRTEngineJob {
  createJob(input: {
    targetId: "88900861",
    tasks: [{
      engineId: "9e611ad7-2d3b-48f6-a51b-0a1ba40feab4",  # Webstream Adapter's Engine ID
      payload: {
        url: "https://s3.amazonaws.com/hold4fisher/s3Test.mp4"
      }
    },
    {
      engineId: "38afb67a-045b-43db-96db-9080073695ab"  # Some engine ID you want to use for processing
    }]
  }) {
    id
  }
}
```

### Run Engine Job with Standby Task

```graphql
mutation createTranscriptionJobWithStandby {
  createJob(input: {
      targetId: "53796349",
      tasks: [{
        engineId: "transcribe-speechmatics-container-en-us",
        standbyTask: {
          engineId: "transcribe-speechmatics-container-en-us",
          standbyTask: {
            engineId: "transcribe-voicebase",
            payload: { language: "en-US", priority: "low" }
          }
        }
      }]
    }) {
      id
      tasks {
        records {
          id
        }
    }
  }
}
```

### Run Library-Enabled Engine Job (e.g. Face Recognition)

> "libraryEngineModelId" can be obtained by running the [Get Library Training Stats](#get-library-training-stats) query in the "Library" section

```graphql
mutation runLibraryEngineJob {
  createJob(input: {
    targetId: "119586271"
    tasks: [
      {
        engineId: "0744df88-6274-490e-b02f-107cae03d991"
        payload: {
          libraryId: "ef8c7263-6c7c-4b8f-9cb5-93784e3d89f5"
          libraryEngineModelId: "5750ca7e-8c4a-4ca4-b9f9-df8617032bd4"
        },
      }
      ]
    }) {
    id
    targetId
    tasks {
      records {
        id
        engineId
        order
        payload
        status
      }
    }
  }
}
```

### Create (Kick Off) a Job

This job will reprocess face detection in Redact.

```graphql
mutation reprocessFaceDetection {
   createJob(input : {
     targetId: "331580431"
     tasks:[{
       engineId: "b9eca145-3bd6-4e62-83e3-82dbc5858af1",
       payload: {
         recordingId: "331580431"
         confidenceThreshold: 0.7
         videoType: "Bodycam"
       }
     }]
   }){
     id
   }
}
```

### Get Jobs for a Given TDO

```graphql
query getJobs {
  jobs(targetId: "102014611") {
    records {
      id
      createdDateTime
      status
      tasks {
        records {
          id
          status
          engine {
            id
            name
            category {
              name
            }
          }
        }
      }
    }
  }
}
```

### Get List of Running Jobs

In this example, we ask for a `limit` of 50 running jobs.
The `status` can be `pending`, `cancelled`, `queued`, `running`, or `complete`.

```graphql
query runningJobs {
  jobs(status: running, limit: 50) {
    count
    records {
      id
      targetId
      createdDateTime
      tasks {
        records {
          id
          payload
        }
      }
    }
  }
}
```

### Check Job Status of a Specific Job

```graphql
query jobStatus {
  job(id: "18114402_busvuCo21J") {
    status
    createdDateTime
    targetId
    tasks {
      records {
        status
        createdDateTime
        modifiedDateTime
        id
        engine {
          id
          name
          category {
            name
          }
        }
      }
    }
  }
}
```

RESPONSE:

```json
{
  "data": {
    "job": {
      "status": "complete",
      "createdDateTime": "2019-02-26T21:15:59.000Z",
      "targetId": "380612136",
      "tasks": {
        "records": [
          {
            "status": "complete",
            "createdDateTime": "2019-02-26T21:15:59.000Z",
            "modifiedDateTime": "2019-02-26T21:15:59.000Z",
            "id": "19020926_wUALxLYqjoDh5N8",
            "engine": {
              "id": "915bb300-bfa8-4ce6-8498-50d43705a144",
              "name": "mention-generate",
              "category": {
                "name": "Search"
              }
            }
          },
          {
            "status": "complete",
            "createdDateTime": "2019-02-26T21:15:59.000Z",
            "modifiedDateTime": "2019-02-26T21:15:59.000Z",
            "id": "19020926_wUALxLYqjolDUtw",
            "engine": {
              "id": "c2aaa6d7-14fa-f840-f77e-4d2c0b857fa8",
              "name": "Add to Index",
              "category": {
                "name": "Search"
              }
            }
          }
        ]
      }
    }
  }
}
```

### Check the Status of a Specific Task

If you know the Task ID, you can do:

```graphql
query {
  task(id:"19020926_wUALxLYqjoDh5N8") {
    status
  }
}
```

RESPONSE:

```json
{
  "data": {
    "task": {
      "status": "complete"
    }
  }
}
```

### Get Transcription Jobs

You can (optionally) use the `dateTimeFilter` field to filter responses by date (as shown below).
This example fetches a max `limit` of 3 transcription jobs, with a `status` of `complete`, created after 9/25/2018.

```graphql
query getTranscriptionJobs {
  jobs(dateTimeFilter: {fromDateTime: "2018-09-25T03:10:40.000Z", field: createdDateTime}, limit: 3, status: complete, engineCategoryIds: ["67cd4dd0-2f75-445d-a6f0-2f297d6cd182"]) {
    count
    records {
      id
      targetId
      createdDateTime
      tasks {
        records {
          id
          payload
        }
      }
    }
  }
}
```

### Get Information on Most Recent Jobs

The following query will retrieve information on the most recent 10 jobs.

```graphql
query {
 jobs(orderBy: {field: createdDateTime, direction: desc}, limit: 10) {
   records {
     id
     status
     createdDateTime
     target {
       id
       streams {
         uri
         protocol
       }
       assets {
         records {
           id
           assetType
           uri
           details
         }
       }
     }
     tasks {
       records {
         id
         status
         engine {
           id
           name
         }
         queuedDateTime
         completedDateTime
         payload
       }
     }
   }
 }
}
```

RESPONSE:

```json
{
  "data": {
    "jobs": {
      "records": [
        {
          "id": "19020926_0N2iBMnL1D",
          "status": "complete",
          "createdDateTime": "2019-02-26T21:15:59.000Z",
          "target": {
            "id": "380612133",
            "streams": [],
            "assets": {
              "records": [
                {
                  "id": "380612133_33TR5wyYyh",
                  "assetType": "media",
                  "uri": "https://inspirent.s3.amazonaws.com/assets/41020140/aca39ac2-181e-4837-a059-378acc6b24bd.mp4",
                  "details": null
                }
              ]
            }
          },
          "tasks": {
            "records": [
              {
                "id": "19020926_0N2iBMnL1DuhMEl",
                "status": "complete",
                "engine": {
                  "id": "915bb300-bfa8-4ce6-8498-50d43705a144",
                  "name": "mention-generate"
                },
                "queuedDateTime": "2019-02-26T21:15:59.000Z",
                "completedDateTime": "2019-02-26T21:15:59.000Z",
                "payload": {
                  "organizationId": 17532
                }
              },
              {
                "id": "19020926_0N2iBMnL1D8bJUX",
                "status": "complete",
                "engine": {
                  "id": "c2aaa6d7-14fa-f840-f77e-4d2c0b857fa8",
                  "name": "Add to Index"
                },
                "queuedDateTime": "2019-02-26T21:15:59.000Z",
                "completedDateTime": "2019-02-26T21:15:59.000Z",
                "payload": {
                  "organizationId": 17532
                }
              }
            ]
          }
        },
        {
          "id": "19020926_gYlCLxSgXT",
          "status": "complete",
          "createdDateTime": "2019-02-26T21:15:59.000Z",
          "target": {
            "id": "380612134",
            "streams": [],
            "assets": {
              "records": [
                {
                  "id": "380612134_7dMz22o8KH",
                  "assetType": "media",
                  "uri": "https://inspirent.s3.amazonaws.com/assets/41020181/9474d32f-557d-4d72-894e-5cfa6d31d93f.mp4",
                  "details": null
                }
              ]
            }
          },
          "tasks": {
            "records": [
              {
                "id": "19020926_gYlCLxSgXT7zWh3",
                "status": "complete",
                "engine": {
                  "id": "915bb300-bfa8-4ce6-8498-50d43705a144",
                  "name": "mention-generate"
                },
                "queuedDateTime": "2019-02-26T21:15:59.000Z",
                "completedDateTime": "2019-02-26T21:15:59.000Z",
                "payload": {
                  "organizationId": 17532
                }
              },
              {
                "id": "19020926_gYlCLxSgXTiRPjY",
                "status": "complete",
                "engine": {
                  "id": "c2aaa6d7-14fa-f840-f77e-4d2c0b857fa8",
                  "name": "Add to Index"
                },
                "queuedDateTime": "2019-02-26T21:15:59.000Z",
                "completedDateTime": "2019-02-26T21:15:59.000Z",
                "payload": {
                  "organizationId": 17532
                }
              }
            ]
          }
        },
        {
          "id": "19020926_sArl2PbD38",
          "status": "complete",
          "createdDateTime": "2019-02-26T21:15:59.000Z",
          "target": {
            "id": "380612135",
            "streams": [],
            "assets": {
              "records": [
                {
                  "id": "380612135_s3N6dLAS5n",
                  "assetType": "media",
                  "uri": "https://inspirent.s3.amazonaws.com/assets/41020653/ad14cbf3-9ee1-4a05-84cf-e71326c35537.mp4",
                  "details": null
                }
              ]
            }
          },
          "tasks": {
            "records": [
              {
                "id": "19020926_sArl2PbD38W6bwr",
                "status": "complete",
                "engine": {
                  "id": "915bb300-bfa8-4ce6-8498-50d43705a144",
                  "name": "mention-generate"
                },
                "queuedDateTime": "2019-02-26T21:15:59.000Z",
                "completedDateTime": "2019-02-26T21:15:59.000Z",
                "payload": {
                  "organizationId": 17532
                }
              },
              {
                "id": "19020926_sArl2PbD38fZ6MS",
                "status": "complete",
                "engine": {
                  "id": "c2aaa6d7-14fa-f840-f77e-4d2c0b857fa8",
                  "name": "Add to Index"
                },
                "queuedDateTime": "2019-02-26T21:15:59.000Z",
                "completedDateTime": "2019-02-26T21:15:59.000Z",
                "payload": {
                  "organizationId": 17532
                }
              }
            ]
          }
        },
        {
          "id": "19020926_wUALxLYqjo",
          "status": "complete",
          "createdDateTime": "2019-02-26T21:15:59.000Z",
          "target": {
            "id": "380612136",
            "streams": [],
            "assets": {
              "records": [
                {
                  "id": "380612136_qEqiALGKtI",
                  "assetType": "media",
                  "uri": "https://inspirent.s3.amazonaws.com/assets/41020144/dbf21c78-909a-4d6f-8cd1-1b55d721ab07.mp3",
                  "details": null
                }
              ]
            }
          },
          "tasks": {
            "records": [
              {
                "id": "19020926_wUALxLYqjoDh5N8",
                "status": "complete",
                "engine": {
                  "id": "915bb300-bfa8-4ce6-8498-50d43705a144",
                  "name": "mention-generate"
                },
                "queuedDateTime": "2019-02-26T21:15:59.000Z",
                "completedDateTime": "2019-02-26T21:15:59.000Z",
                "payload": {
                  "organizationId": 17532
                }
              },
              {
                "id": "19020926_wUALxLYqjolDUtw",
                "status": "complete",
                "engine": {
                  "id": "c2aaa6d7-14fa-f840-f77e-4d2c0b857fa8",
                  "name": "Add to Index"
                },
                "queuedDateTime": "2019-02-26T21:15:59.000Z",
                "completedDateTime": "2019-02-26T21:15:59.000Z",
                "payload": {
                  "organizationId": 17532
                }
              }
            ]
          }
        }
      ]
    }
  }
}
```

### Get Information about a Task

```graphql
query {
  task(id:"19020926_wUALxLYqjoDh5N8") {
    id
    status
    name
    engine {
      id
      name
      displayName
    }
    engineId
  }
}
```

RESPONSE:

```json
{
  "data": {
    "task": {
      "id": "19020926_wUALxLYqjoDh5N8",
      "status": "complete",
      "name": null,
      "engine": {
        "id": "915bb300-bfa8-4ce6-8498-50d43705a144",
        "name": "mention-generate",
        "displayName": "mention-generate"
      },
      "engineId": "915bb300-bfa8-4ce6-8498-50d43705a144"
    }
  }
}
```

### Get Logs for Tasks

```graphql
query getLogs {
  temporalDataObject(id: "331178425") {
    tasks {
      records {
        engine {
          id
          name
        }
        id
        status
        startedDateTime
        completedDateTime
        log {
          text
          uri
        }
      }
    }
  }
}
```

### Cancel Job in Progress

```graphql
mutation cancelJob {
    cancelJob(id: "18114402_busvuCo21J") {
      id
      message
    }
  }
  ```

### Delete TDO

```graphql
mutation deleteTDO {
  deleteTDO(id: "64953347") {
    id
    message
  }
}
```

## Retrieval

### Get Assets for TDO

```graphql
query getAssets {
  temporalDataObject(id: "280670774") {
    assets {
      records {
        sourceData {
          engine {
            id
            name
          }
        }
        id
        createdDateTime
        assetType
        signedUri
      }
    }
  }
}
```

### Get Engine Results in Veritone Standard Format

```graphql
query getEngineOutput {
  engineResults(tdoId: "102014611", engineIds: ["transcribe-speechmatics-container-en-us"]) {
    records {
      tdoId
      engineId
      startOffsetMs
      stopOffsetMs
      jsondata
      assetId
      userEdited
    }
  }
}
```

### Get Transcription and Speaker Detection Results in Veritone Standard Format

```graphql
query vtn {
  engineResults(tdoId: "107947027", engineIds: ["40356dac-ace5-46c7-aa02-35ef089ca9a4", "transcribe-speechmatics-container-en-us"]) {
    records {
      jsondata
    }
  }
}
```

### Get Task Output by Job ID

Task output displays the debug/log information reported by the engine at the completion of the task

```graphql
query getEngineOutputByJob {
  job(id: "18083316_nNXUOSnxJH") {
    tasks {
      records {
        id
        output
        status
        engine {
          id
          name
          category {
            name
          }
        }
      }
    }
  }
}
```

### Get Task Output (Log Information) by TDO ID

Task output displays the debug/log information reported by the engine at the completion of the task

```graphql
query getEngineOutputByTDO {
  temporalDataObject(id: "102014611") {
    tasks {
      records {
        id
        engine {
          id
          name
          category {
            name
          }
        }
        status
        output
      }
    }
  }
}
```

### Export Transcription Results

This example shows how to limit line length to 32 characters for 3 of the 4 transcript formats, while setting it to 50 for `txt`.

```graphql
mutation createExportRequest {
 createExportRequest(input: {
   includeMedia: true
   tdoData: [{tdoId: "96972470"}, {tdoId: "77041379"}]
   outputConfigurations:[
     {
       engineId:"transcribe-speechmatics"
       categoryId:"67cd4dd0-2f75-445d-a6f0-2f297d6cd182"
       formats:[
         {
           extension:"srt"
           options: {
             maxCharacterPerLine:32
             linesPerScreen: 3
             newLineOnPunctuation: true
           }
         },
         {
           extension:"vtt"
           options: {
             maxCharacterPerLine:32
             linesPerScreen: 2
             newLineOnPunctuation: false
           }
         },
         {
           extension:"ttml"
           options: {
             maxCharacterPerLine:32
             newLineOnPunctuation: true
           }
         },
         {
           extension:"txt"
           options: {
             maxCharacterPerLine:50
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

### Check the status of an export request

```graphql
query checkExportStatus {
 exportRequest(id:"10f6f809-ee36-4c12-97f4-d1d0cf04ea85") {
  status
   assetUri
   requestorId
 }
}
```

### Get Transcription Output in JSON Format (Legacy Method)

!> This output format is deprecated in favor of using the [engineResults query](#Get-Engine-Results-in-Veritone-Standard-Format) for `vtn-standard` output
and the [`createExportRequest` mutation](#export-transcription-results) for transforming to other formats.

```graphql
query getTranscriptJSON {
  temporalDataObject(id: "102014611") {
    primaryAsset(assetType: "transcript") {
      signedUri
      transform(transformFunction: Transcript2JSON)
    }
    details
  }
}
```

## Search

See the [search quickstart guide](apis/search-quickstart/) for details on the searchMedia query syntax.

### Search Structured Data

This example shows how to search for structured data using the search API.
In this case, we're looking for media where the `QUANTITY` value equals `2` or the `ORG_ID` value equals `"12343"`.

```graphql
query searchSDO {
    searchMedia(search: {
        index: ["mine"],
        limit: 20,
        offset: 0,
        query: {
            conditions: [
                { operator: "term", field: "QUANTITY", value: 2 }
                { operator: "term", field: "ORD_ID", value: "12343" }
            ],
            operator: "or"
        },
        type: "<schemaId goes here>"
    })
    {
        jsondata
    }
}
```

## Folders

### Create a Folder

Before you can create a folder, you must know the ID of the intended parent folder.
If you want to place the new folder under the `rootFolder`, you can discover the `rootFolder` ID by (for example) running a query using `organizations(id:<your org ID>)`.

```graphql
mutation {
  createFolder(input:{
    name:"scratch"
    description:"temporary files",
    parentId:"c13df18e-314d-47fb-b4cd-aa171bc1bce6",
    rootFolderType:watchlist
  }) {
    id
    name
  }
}
```

RESPONSE:

```json
{
  "data": {
    "createFolder": {
      "id": "4f6e98d5-168a-407d-b22f-d5607bd4a9a6",
      "name": "scratch"
    }
  }
}
```

ERRORS:

Note that all four input fields (`name`, `description`, `parentId`, and `rootFolderType`) are mandatory.
The `rootFolderType` should correspond to the folder type of the `parentId` folder and should be one of `cms`, `collection`, or `watchlist`.

### List Folders in CMS and Contained TDOs

```graphql
query listFolders {
  rootFolders(type: cms) {
    id
    name
    subfolders {
      id
      name
      childTDOs {
        count
        records {
          id
        }
      }
    }
    childTDOs {
      count
      records {
        id
      }
    }
  }
}
```

### Get Folder Info by TDO ID

```graphql
query getFolderInfoByTDO {
  temporalDataObject(id: "112971783") {
    folders {
      id
      name
      childTDOs {
        records {
          id
        }
      }
    }
  }
}
```

### Get Folder Info by Folder ID

```graphql
query getFolderInfo {
  folder(id: "0ef7e0e3-63f5-47b9-8ed1-4c172c5a1e0a") {
    id
    name
    childTDOs {
      records {
        id
      }
    }
  }
}
```

## Library

### Get Entity Info

```graphql
query getEntityInfo {
  entity(id: "02de18d5-4f70-450c-9716-de949668ec40") {
    name
    jsondata
  }
}
```

### Get Unpublished Entities in Library

```graphql
query unpublishedEntities {
  entities(libraryIds: "ffd171b9-d493-41fa-86f1-4e02dd769e73", isPublished: false, limit: 1000) {
    count
    records {
      name
      id
    }
  }
}
```

### Publish/Train Library

```graphql
mutation publishLibrary {
  publishLibrary(id: "169f5db0-1464-48b2-b5e1-59fe5c9db7d9") {
    name
  }
}
```

### Get Library Training Stats

Get trainJobId value for desired engine model (e.g. "Machine Box Facebox Similarity")

```graphql
query getTrainJobID {
  library(id: "1776029a-8447-406a-91bc-2402bf33443b") {
    engineModels {
      records {
        id
        createdDateTime
        modifiedDateTime
        engine {
          id
          name
        }
        libraryVersion
        trainStatus
        trainJobId
      }
    }
  }
}
```

### Use trainJobId value to obtain train job details

```graphql
query getTrainJobDetails {
  job(id: "18104324_t5XpqlGOfm") {
    tasks {
      records {
        id
        status
        startedDateTime
        completedDateTime
      }
    }
  }
}
```

### Check if Engine is Library-Trainable

```graphql
query engineLibraryTrainable {
  engine(id: "95d62ae8-edc2-4fb9-ad08-fe33646f0ece") {
    libraryRequired
  }
}
```

### Update Entity Thumbnail in library

First, obtain the URL for the entity's first identifier:

```graphql
query getEntityImageURL {
  entity(id: "3fd506ec-aa31-43b3-b51e-5881a57965a1") {
    identifiers(limit: 1) {
      records {
        url
      }
    }
  }
}
```

Then pass the identifier's URL in as the value of `profileImageUrl`

```graphql
mutation updateEntityThumbnail {
  updateEntity(input: {
    id: "3fd506ec-aa31-43b3-b51e-5881a57965a1",
    profileImageUrl: "https://veritone-aiware-430032233708-us-gov-prod-sled2-recordings.s3-us-gov-west-1.amazonaws.com/3b82ec4a-0679-49cf-999b-7e76b899de56/3fd506ec-aa31-43b3-b51e-5881a57965a1/75a5f021-7c06-495a-9f03-ed5dc209dff3.jpeg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAWIH7LETWO45I3Q7X%2F20190117%2Fus-gov-west-1%2Fs3%2Faws4_request&X-Amz-Date=20190117T232649Z&X-Amz-Expires=86400&X-Amz-Security-Token=FQoDYXdzEDIaDO0%2FlJcJeJRIyJ86myLABEvH3vewwLDedka8Cn%2FcSPfDPA8rGer8JiyVtS7rB4mbYJ8kCkTzmWYdkm9DmBVyNxcMSqxUz9sW7U1yexuERkYcpD5ajBThw2JS8uwQeL4%2FXsO3vlk9ODBjFoT%2BWn%2B7p%2Bti54npv7BPSNHk7I%2BHLMfrSQQB6CmM8RZNAjGiyh%2FWk8Ls2ykyU92lIqAZKdKYbvhNfIGgSalH%2B%2BWnrEzVeBbDKN6ahLcqCbIsqfEIChjGk8XAwvfrTmnkXGjNZWheb6rHnl%2F24chxOyX4utZVuJeJIGZh6%2BOR%2F8TU4pSGiyvTuePmcdZkczLQKLu1g3TB5WbEPR2Ip1t%2F9Xr%2Fc54ph2qBXk4dEMlFHii0DCt4Ov7HXqsQtFS0fpNY3yrg3MxVLNfx5zpsUN0jwSB%2BAWGJ3jIOCe4djCx75dejnxAEse2lxxImPZnIhi1OspqHbb6TxTUfIkNHqLrFQ3Ari%2FtRnjRJID0ocwtziGgY7Husm1lWrJMyyhY9PGv1pHtfCmlXEcNKa0VLz52vsR9sOr6zIhM20GWJ8aSakEbauKBKDUeoA43ZQMZn4p05QAuIHIVOxcJ1VwPdrSLDFgi5MJawZYMgHbjIgSLpn6AD4aaIL7dkX6EiLrKir0OEXAiyU9P33btNVMPgWIWv%2FGGF%2FGakalGhTK8%2FoTlo%2BJIZdxmfk%2FH%2F%2BeAbTtHU0yVDwgh0PIGHUmL1rg2MkOXCEN4fT8dSY99s56Axrsr%2FhYIrimid2CI0AoFzCCyXGmng3VsScUeCoCiXuYPiBQ%3D%3D&X-Amz-Signature=d31cfb938032f55c73251ead4deadfaf0ab46d8b38728f4da998b517dd207859&X-Amz-SignedHeaders=host"
  }) {
    id
    profileImageUrl
  }
}
```

## Structured Data

### Get Currently Published Schema ID

The ID you see in Developer's URL is the `dataRegistry` ID, which contains multiple schemas.
To get the ID of the currently published one (for use in the `createStructuredData` mutation for example), you can use a query like this:

```graphql
query {
  dataRegistry(id: "<data registry ID>") {
    publishedSchema {
      id
    }
  }
}
```

## Users

### Get an Organization's Users

Supply one or more `organizationId` values inside an array:

```graphql
query {
  users(organizationIds:[17532]) {
    records {
      id
      name
    }
  }
}
```

### Create a New User

The only *required* fields are `name` and `organizationId`.

```graphql
mutation {
  createUser(input: {
    name: "Arby Arbiti",
    requestorId: "960b3fa8-1812-4303-b58d-4f0d227f2afc",
    password: "",
    organizationId: 17532,
    sendNewUserEmail: false,
    email: "something@something.com",
    firstName: "Arby",
    lastName: "Arbiti"
    })
    {
        id
    }
}
```

## Miscellaneous

### Enumerate Cognition Engine Categories

```graphql
query enumerateCognitionEngineCategories {
  engineCategories(type:"Cognition") {
    records {
      categoryType
      totalEngines
      id
      description
      type {
        name
      }
    }
  }
}
```

RESPONSE:

```json
{
  "data": {
    "engineCategories": {
      "records": [
        {
          "categoryType": "transcode",
          "totalEngines": 28,
          "id": "581dbb32-ea5b-4458-bd15-8094942345e3",
          "description": null,
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "transcript",
          "totalEngines": 787,
          "id": "67cd4dd0-2f75-445d-a6f0-2f297d6cd182",
          "description": "Convert the spoken word into readable text",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "sentiment",
          "totalEngines": 46,
          "id": "f2554098-f14b-4d81-9be1-41d0f992a22f",
          "description": "Infer the sentiment or emotion being emitted in media",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "fingerprint",
          "totalEngines": 14,
          "id": "17d62b84-8b49-465b-a6be-fe3ea3bc8f05",
          "description": "Find the same audio by using audio fingerprints",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "face",
          "totalEngines": 282,
          "id": "6faad6b7-0837-45f9-b161-2f6bf31b7a07",
          "description": "Detect and Identify multiple faces within rich media content",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "object",
          "totalEngines": 360,
          "id": "088a31be-9bd6-4628-a6f0-e4004e362ea0",
          "description": "Recognize Object and Logos within the Video Media",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "translate",
          "totalEngines": 157,
          "id": "3b2b2ff8-44aa-4db4-9b71-ff96c3bf5923",
          "description": "Translate transcribed text from one language to another",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "audio",
          "totalEngines": 10,
          "id": "c6e07fe3-f15f-48a7-8914-951b852d54d0",
          "description": "Detect characteristics of sound, including alarms, breaking glass, gunshots and more within audio",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "music",
          "totalEngines": 0,
          "id": "c96b5d0e-3ce1-4fd7-9c38-d25ddef87a5f",
          "description": "Identify the music playing in the background of media",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "geolocation",
          "totalEngines": 5,
          "id": "203ad7c2-3dbd-45f9-95a6-855f911563d0",
          "description": "Extract Location, acceleration, velocity and altitude from the media",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "conductor",
          "totalEngines": 32,
          "id": "892960cb-14c7-4743-a6e2-d6e437d6c5bb",
          "description": null,
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "stationPlayout",
          "totalEngines": 1,
          "id": "935c4838-dcf6-415c-99c4-5ceb0a8944be",
          "description": "Find ads and songs for radio station mentions",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "ocr",
          "totalEngines": 108,
          "id": "3b4ac603-9bfa-49d3-96b3-25ca3b502325",
          "description": "Recognize Text within the Video Media",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "logo",
          "totalEngines": 50,
          "id": "5a511c83-2cbd-4f2d-927e-cd03803a8a9c",
          "description": "Recognize Logos within the Video Media",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "utility",
          "totalEngines": 13,
          "id": "f951fbf9-aa69-47a2-87c8-12dfb51a1f18",
          "description": "Miscellaneous utility engines for cognition",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "speech",
          "totalEngines": 4,
          "id": "09f48865-c9e5-47b9-be79-8581047477c4",
          "description": "Convert text to speech",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "correlation",
          "totalEngines": 18,
          "id": "a70df3f6-84a7-4570-b8f4-daa122127e37",
          "description": "Correlates structured data to recordings",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "voice",
          "totalEngines": 4,
          "id": "19bfa716-309a-41dc-9dac-d07a1e7008cd",
          "description": "Detect and Identify multiple voices within rich media content",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "speaker",
          "totalEngines": 14,
          "id": "a856c447-1030-4fb0-917f-08179f949c4e",
          "description": "Detect the change in speakers within your transcription results",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "workflow",
          "totalEngines": 8,
          "id": "c5458876-43d2-41e8-a340-f734702df04a",
          "description": "",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "reducer",
          "totalEngines": 3,
          "id": "70e54f46-7586-4ff1-876c-5f918357aec6",
          "description": "Combine engine outputs from multiple segments",
          "type": {
            "name": "Cognition"
          }
        },
        {
          "categoryType": "human",
          "totalEngines": 11,
          "id": "3b3cfe77-da94-4362-9ac2-3ed89747a68b",
          "description": "Tasks to be performed by humans",
          "type": {
            "name": "Cognition"
          }
        }
      ]
    }
  }
}
```

### Search for Engines by Capability

Find all transcription engines:

```graphql
query getAllTranscriptionEngines {
  engines(categoryId: "67cd4dd0-2f75-445d-a6f0-2f297d6cd182") {
    records {
      id
      name
      category {
        id
      }
    }
  }
}
```

### Get TDO Details (Filename, Tags, etc.)

```graphql
query getTDODetails {
  temporalDataObject(id: "102014611") {
    details
  }
}
```

### Get Duration of Media File (In Seconds)

```graphql
query getDuration {
  temporalDataObject(id: "112971783") {
    tasks {
      records {
        id
        mediaLengthSec
      }
    }
  }
}
```

### Get Organization Info for Current Session

```graphql
query getOrgInfo {
  me {
    organization {
      name
      id
    }
  }
}
```

### List Available Engines

?> For demonstration purposes this query uses `limit: 1000`.
In actual practice you will want to use a lower limit and ensure that you are paginating through the list of engines by using the `offset` parameter until you receive an empty list.

```graphql
query listEngines {
  engines(limit: 1000) {
    count
    records {
      id
      name
      category {
        id
        name
      }
      fields {
        name
        type
        max
        min
        step
        info
        label
        defaultValue
        options {
          key
          value
        }
      }
    }
  }
}
```

### List Available Engines (Grouped By Category)

?> For demonstration purposes this query uses `limit: 1000`.
In actual practice you will want to use a lower limit and ensure that you are paginating through the list of engines by using the `offset` parameter until you receive an empty list.

```graphql
query listEnginesByCategory {
  engineCategories {
    records {
      id
      name
      engines(limit: 1000) {
        records {
          id
          name
          fields {
            name
            options {
              value
            }
          }
        }
      }
    }
  }
}
```

### List Available Engine Categories

```graphql
query listEngineCategories {
  engineCategories {
    records {
      id
      name
      description
    }
  }
}
```

### List Engines for a Specific Category

?> For demonstration purposes this query uses `limit: 1000`.
In actual practice you will want to use a lower limit and ensure that you are paginating through the list of engines by using the `offset` parameter until you receive an empty list.

```graphql
query listEnginesForCategory {
  engines(category: "transcription", limit: 1000) {
    count
    records {
      id
      name
      fields {
        name
        type
        max
        min
        step
        info
        label
        defaultValue
        options {
          key
          value
        }
      }
    }
  }
}
```

### List Engine’s Custom Fields

```graphql
query engineCustomFields {
  engine(id: "b396fa74-83ff-4052-88a7-c37808a25673") {
    id
    fields {
      type
      name
      defaultValue
      info
      options {
        key
        value
      }
    }
  }
}
```

### Add Engines to White List

!> This operation requires elevated rights in the system.

```graphql
mutation addToWhiteList {
  addToEngineWhitelist(toAdd:{
    organizationId:13456
    engineIds:["<engine Id>","<engine2 Id>"]
  }){
    organizationId
    engines{
      name
      id
    }
  }
}
```

### Get All Roles in an Organization

> This method requires elevated rights in the system.

```graphql
query getAllRoles {
  organization(id: 17532) {
    roles {
      name
      id
      permissions {
        records {
          id
          name
          description
        }
      }
    }
  }
}
```

### Fix Video Playback Issue in CMS

Step 1: List all TDOs and identify which ones have a bad primary asset based on `signedUri` field.

```graphql
query listPrimaryAsset {
  temporalDataObjects(limit: 100) {
    records {
      id
      primaryAsset(assetType:"media"){
        signedUri
      }
    }
  }
}
```

Step 2: Identify the right Asset ID to use as the TDO's primary asset.

```graphql
query primaryAsset {
  temporalDataObject(id: "117679345") {
    details
    primaryAsset(assetType: "media") {
      signedUri
      type
    }
    assets {
      records {
        id
        assetType
        signedUri
      }
    }
  }
}
```

Step 3: Update the primary asset.

```graphql
mutation setPrimaryAsset {
  updateTDO( input: {
    id: 117679345,
    primaryAsset:
      { id: "117679345_t6l92LBhp0", assetType: "media" }
  })
  {
    id
  }
}
```

## Real Time

Step 1: Create a TDO or "Container" for use in Step 2:

```graphql
mutation createTDOWithAsset {
  createTDOWithAsset(input: {
    startDateTime: 1548880932,
    updateStopDateTimeFromAsset: true,
    contentType: "video/mp4",
    assetType: "media", addToIndex: true,
    uri: "https://s3.amazonaws.com/hold4fisher/Manchester+United+4-3+Real+Madrid+-+UEFA+CL+2002_2003+%5BHD%5D-W7HM1RfNfS4.mp4"
  })
  {
    id
    status
    assets {
      records {
        id
        type
        contentType
        signedUri
      }
    }
  }
}
```

RESPONSE:

```json
{
  "data": {
    "createTDOWithAsset": {
      "id": "390257661",
      "status": "recorded",
      "assets": {
        "records": [
          {
            "id": "390257661_R9Ij9DhD9L",
            "type": "media",
            "contentType": "video/mp4",
            "signedUri": "https://s3.amazonaws.com/hold4fisher/Manchester+United+4-3+Real+Madrid+-+UEFA+CL+2002_2003+%5BHD%5D-W7HM1RfNfS4.mp4"
          }
        ]
      }
    }
  }
}
```

Step 2: Create a Job involving face recognition, using the ID obtained from the response to Step 1:

```graphql
mutation createJob {
  createJob(input: {
    targetId: "390257661",
    isReprocessJob:true
    tasks: [
      {engineId: "5e651457-e102-4d16-a8f2-5c0c34f58851"}]}) {
    id
    status
  }
}
```

RESPONSE:

```json
{
  "data": {
    "createJob": {
      "id": "19031004_ADKtN72ZWZ",
      "status": "pending"
    }
  }
}
```

Step 3: Get the results of the job created in step 2:

```graphql
query getEngineResults {
  engineResults(tdoId: "390257661", engineIds: ["5e651457-e102-4d16-a8f2-5c0c34f58851"]) {
    records {
      jsondata
    }
  }
}
```

You can also provide the `jobId` instead of the `engineId`:

```graphql
query getEngineResults {
  engineResults(tdoId: "390257661", jobId:"19031004_ADKtN72ZWZ") {
    records {
      jsondata
    }
  }
}
```
