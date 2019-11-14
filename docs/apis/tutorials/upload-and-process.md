# Uploading and Processing Files

A very common workflow for Veritone integrations is to upload a file, process it, and
download the results.  In Veritone's API, that flow is modeled by the following requests:

1. Create a Temporal Data Object (TDO)
2. Create an Asset under the TDO
3. Create a job to run specific engines against the TDO
4. Check for job completion
5. When job is complete, download the results

_Veritone's Sample React App implements this request flow in its
[example workflow](https://github.com/veritone/veritone-sample-app-react/blob/master/src/modules/mediaExample/index.js#L126)
and is a good example to look at or copy and paste from._

## 1. Create a Temporal Data Object (TDO)

Temporal Data Objects (TDOs) are the main container for all data in Veritone's system.
They contain merely a start and stop time (in UTC) so results can be correlated to
Veritone's master timeline in its Temporal Elastic Database™.

Here's a sample query that creates a TDO and returns its ID and date range.  The ID will
be used in subsequent calls.

```graphql
mutation {
  createTDO(input: {
    startDateTime: "2018-01-01T10:00:00"
    stopDateTime: "2018-01-01T11:00:00"
  }) {
    id
    startDateTime
    stopDateTime
  }
}
```

```json
{
  "data": {
    "createTDO": {
      "id": "52359027",
      "startDateTime": "2018-01-01T10:00:00.000Z",
      "stopDateTime": "2018-01-01T11:00:00.000Z"
    }
  }
}
```

## 2. Upload an Asset

Assets are always contained in TDOs.  Here's an example request to add an asset
through GraphQL.

```graphql
mutation {
  createAsset(input: {
    containerId: "52359027",
    assetType: "media",
    contentType: "video/mp4",
    uri: "<file path goes here>"
  }) {
    id
  }
}
```

```json
{
  "data": {
    "createAsset": {
      "id": "be8611e8-d833-4ce9-b731-ca8f7b153e38"
    }
  }
}
```

Alternatively, if the file is not available on a publicly accessible URL, you can issue
a `multipart/form-data` request with the file contents in the file form field.

## 3. Create a Job

To process the file you've uploaded, you construct a job that has one or more tasks.
Each task contains an engineId and optionally a JSON payload defining field selections
and/or library information (for trainable engines).

To explore which engines and fields are available, see the tutorial on
[looking up available engines](/apis/tutorials/get-engines).

```graphql
mutation {
  createJob(input: {
    targetId: "52359027",
    tasks: [{
      engineId: "<engineId goes here>"
    }, {
      engineId: "<second engineId goes here>",
      payload: {
        picklistField: "value",
        multiPicklistField: ["value", "another value"]
      }
    }]
  }) {
    id
  }
}
```

```json
{
  "data": {
    "createJob": {
      "id": "cc60a74e-be58-4366-8f8e-4a2590852b96"
    }
  }
}
```

## 4. Check for Job Completion

Jobs run asynchronously, run their tasks in parallel, and can be queried for their status.
Using the job ID you received when creating the job, you will want to periodically check
on the status of the job and its associated tasks.

```graphql
query {
  job(id: "cc60a74e-be58-4366-8f8e-4a2590852b96") {
    status
    tasks {
      records {
        id
        engineId
        status
      }
    }
  }
}
```

```json
{
  "data": {
    "job": {
      "status": "running",
      "tasks": {
        "records": [
          {
            "id": "cc60a74e-be58-4366-8f8e-4a2590852b96-a60847d3-4f40-4929-abbc-1406ee2d1c46",
            "engineId": "fc004413-89f0-132a-60b2-b94522fb7e66",
            "status": "running"
          },
          {
            "id": "cc60a74e-be58-4366-8f8e-4a2590852b96-55ad3c97-0d55-4e32-b397-2c7b737a4b84",
            "engineId": "f44aa80e-4650-c55c-58e7-49c965019790",
            "status": "pending"
          }
        ]
      }
    }
  }
}
```

## 5. Download Results

When the job completes, there are two places to look for information:

- The `taskStatus` on the task: where engines can report a single piece of information
- The `assets` in the TDO: where engines can write multiple formats of output

```graphql
query {
  job(id: "cc60a74e-be58-4366-8f8e-4a2590852b96") {
    targetId
    tasks {
      records {
        engineId
        taskOutput
      }
    }
  }

  temporalDataObject(id: "52359027") {
    assets {
      records {
        assetType
        signedUri
        sourceData {
          taskId
          engineId
        }
      }
    }
  }
}
```

```json
{
  "data": {
    "job": {
      "targetId": "52359027",
      "tasks": {
        "records": [
          {
            "engineId": "fc004413-89f0-132a-60b2-b94522fb7e66",
            "taskOutput": {}
          },
          {
            "engineId": "f44aa80e-4650-c55c-58e7-49c965019790",
            "taskOutput": null
          }
        ]
      }
    },
    "temporalDataObject": {
      "assets": {
        "records": [
          {
            "assetType": "media",
            "signedUri": "<file path goes here>",
            "sourceData": {
              "taskId": null,
              "engineId": "48b690ee-8a36-4ede-b1e0-d27b035ac8bd"
            }
          }
        ]
      }
    }
  }
}
```
