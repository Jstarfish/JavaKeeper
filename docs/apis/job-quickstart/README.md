# Job Quickstart Guide

## Getting Started

The aiWARE Job API allows you to easily integrate cognitive functionality
such as object detection, language translation, and voice transcription
with just a few lines of code.
The Job API is a set of calls that takes you through the workflow for
performing cognitive task processing — from file ingestion to engine
processing and retrieving output results.

aiWARE's API is built around the GraphQL paradigm to provide a more
efficient way to deliver data with greater flexibility than a traditional REST approach.
GraphQL is a [query language](http://graphql.org/learn/queries/) that operates over a single
endpoint using conventional HTTP requests and returning JSON responses.
The structure not only lets you call multiple nested resources in a single query,
it also allows you to define requests so that only requested data is sent back.

This quickstart guide provides resources, detailed documentation, and example requests and responses to help get your integration up and running to perform the following operations:

1. [Create a TDO (recording container)](#create-a-tdo)
1. [Create a job](#create-a-job) consisting of one or more tasks
1. [Check the status of a job](#check-the-job-status)
1. [Retrieve job results](#retrieve-job-output)
1. [Delete a TDO (recording container)](#delete-a-tdo-andor-its-content)

We designed this quickstart to be user friendly and example filled,
but if you have any questions, please don’t hesitate to reach out to our [Developer Support Team](mailto:devsupport@veritone.com) for help.

### Base URL

aiWARE uses a single endpoint for accessing the API.
All calls to the API are POST requests and are served over *http* with *application/json* encoded bodies.
The base URL varies based on the geographic region where the services will run.
When configuring your integration, choose the base URL from the list below that supports your geographic location.

| Region | Base URL |
| ------ | -------- |
| United States (Default) | https://api.veritone.com/v3/graphql |
| United Kingdom | https://api.uk.veritone.com/v3/graphql |

> The above base URLs are provided for use within SaaS environments.
Applications using GovCloud, on-prem, or other deployments access the API via an endpoint that's custom configured to the private network.

### Making Sample Requests

To make it easier to explore, write, and test the API, we set up [GraphiQL](https://api.veritone.com/v3/graphiql) &mdash; an interactive playground that gives you a code editor with autocomplete, validation, and syntax error highlighting features.
Use the [GraphiQL interface](https://api.veritone.com/v3/graphiql) to construct and execute queries, experiment with different schema modifications, and browse documentation.
In addition, GraphiQL bakes authorization right into the schema and automatically passes the `Authentication` header with a valid token when you’re logged into the aiWARE system.

aiWARE’s [GraphiQL interface](https://api.veritone.com/v3/graphiql) is the recommended method for ad hoc API requests, but calls can be made using any HTTP client.
All requests must be HTTP POST to the base URL designated for your geographic region with the `query` parameter and `application/json` encoded bodies.
In addition, requests must be authenticated using an API Token.
Pass the token in your request using the *Authorization* header with a value `Bearer token`.
If you’re using a raw HTTP client, the query body contents must be sent in a string with all quotes escaped.

The sample requests provided in this documentation are structured for use in our [GraphiQL interface](https://api.veritone.com/v3/graphiql), but we’ve also included the basic cURL structure for your reference below.
Please note that the examples shown throughout this guide do not use client information and are not language specific.
For fields that require account-specific data (such as a containerId), replace the value with your own.
In addition, the sample requests shown are not all-inclusive — they highlight the minimum requirements and relevant information.
Additional attributes for each request can be found in our [GraphQL docs](https://api.veritone.com/v3/graphqldocs/).

#### Basic cURL Structure for Requests

```bash
curl -X POST \
  https://api.veritone.com/v3/graphql \
  -H 'authorization: Bearer 31gcf6:2e76022093e64732b4c48f202234394328abcf72d50e4981b8043a19e8d9baac' \
  -H 'content-type: application/json' \
  -d '{"query": "mutation { createTDO( input: { startDateTime: 1507128535, stopDateTime: 1507128542, name: \"My New Video\", description: \"The latest video in the series\" }) { id,  status } }" }'
```

### Authentication

<!--TODO:
This is pretty duplicate content with authorization stuff.
Consider whether we can just include or link instead of duplicating.
-->

aiWARE's Job API uses bearer token authentication for requests. To authenticate your calls, provide a valid API Token in the `Authentication` header of the request with the value `Bearer token`.
Requests made without this header or with an invalid token will return an error code.

An API Token can be generated in the Veritone Admin App by your Organization Administrator.
If your organization does not use the Admin App, please contact your Veritone Account Manager for assistance.

**To generate an API Token:**

1. Log into the aiWARE Platform and select **Admin** from the *App Picker* drop-down. The *Admin App* opens.

1. Click the **API Keys** tile. The *API Key* page opens.

  ![Get API Token](../_media/Get-API-Token-1.png)

1. Click **New API** Key. The *New API Key* window opens.

  ![Get API Token](../_media/Get-API-Token-2.png)

1. Enter a token name and select the permissions needed for the token to perform the required API tasks. Click **Generate Token** to save. The *Token Generated *window opens.

1. Copy your token and click **Close** when finished.

?> Once the *Token Generated* window closes, the token code no longer displays and it cannot be viewed again.
If you misplace the token, you should delete the token and generate a new one.

## How to Create a Cognitive Processing Job: High-Level Summary

For this quickstart, we will run a transcription job on a video file (.mp4) stored at an Amazon S3 URL.
This is a relatively simple example, but it shows the overall pattern you will follow in running cognitive processing jobs.
The approach is to:

<!--TODO: This list looks redundant with the one above.  Consolidate?-->

1. Create a TDO.
2. Create the job.
3. Poll for status.
4. Obtain the output of the job.
5. Clean up.

Each of these steps involves its own mutation or query.

The second step not only specifies the tasks associated with the job, but actually queues and kicks off the job.

Note that a job can contain one or more *tasks*.
Each task is associated with an engine.
The task will also usually specify an asset to operate against.
(You will see how this works in the [Create a Job](#create-a-job) section below.)
The choice of how many related tasks to wrap in a given job is up to you.
A lot depends on the scenario.
For example, in a job that will create a transcript from an audio or video file, there may
need to be  a `Transcoding` task to convert the file to a supported format for processing.

Some of these concepts will become clearer as you read through the example shown below.

## Create a TDO

In aiWARE, jobs and job-related artifacts (such as media files) need to be associated with
a container called a [Temporal Data Object (TDO)](https://api.veritone.com/v3/graphqldocs/temporaldataobject.doc.html).
The first step in the Job workflow is thus to create a TDO. This is easy to do:

```graphql
mutation createTDO {
  createTDO(
    input: {
      startDateTime: "2019-04-24T21:49:04.412Z",
      stopDateTime: "2019-04-24T21:50:04.412Z"
    }
  )
  {
    id
  }
}
```

?> The `startDateTime` and `stopDateTime` values are required, but can be dummy values.
The only firm requirements are that the values exist, and that the
second value is greater than the first (but not by more than a year).
You can supply an integer here (milliseconds), or any ISO-8601-legal string.
E.g. `"20190424T174428Z"` and `"2019-04-24T21:49:04.412Z"` are both acceptable string values.

> Set the TDO's `addToIndex` field to `false` if you want to _disable_ automatic indexing of TDO assets for purposes of Search.

A successful response will look like:

```json
{
  "data": {
    "createTDO": {
      "id": "460907869"
    }
  }
}
```

Take note of the `id`. You will need it to create a job.

## Create a Job

If you know the URI of the media file you wish to process, you can immediately create the job that will run against that media file.
You just need the URI of the file, the `targetId` of the TDO you created in the previous step,
and the `engineId` values of any engines that will be called upon to ingest and process the file.

For example, to run a transcription job on an `.mp4` file:

```graphql
mutation createJob {
  createJob(input: {
    targetId: "460907869", # the TDO ID (from the previous step)
    tasks: [{
      engineId: "9e611ad7-2d3b-48f6-a51b-0a1ba40feab4", # ID of webstream adapter
      payload: {
         url: "https://s3.amazonaws.com/dev-chunk-cache-tmp/AC.mp4"
      }
    },{
      engineId: "54525249-da68-4dbf-b6fe-aea9a1aefd4d" # ID of a transcription engine
    }]
  }) {
    id
  }
}
```

This job has two tasks: one representing ingestion, and the other representing transcription.

The response will look like:

```json
{
  "data": {
    "createJob": {
      "id": "19041508_f2qIbo9qAh"
    }
  }
}
```

Take note of the returned `id` value.
This is the value by which you will refer the job in the next step.

> If you want to process files larger than 100MB, please see additional information on
[Uploading Large Files](/apis/tutorials/uploading-large-files.md).

## Check the Job Status

Jobs run asynchronously.
You can check the job status (and also the individual `status` fields of the tasks)
with a query similar to this:

```graphql
query queryJobStatus {
  job(id:"19041508_f2qIbo9qAh") {
    id
    status
    targetId
    tasks{
      records{
        id
        status
        engine{
          id
          name
        }
        # taskOutput <= For more granular/verbose output, include this field
      }
    }
  }
}
```

> The possible job statuses are `cancelled`, `complete`, `pending`, `queued`, or `running`.
Tasks can have those same statuses, as well as `aborted`, `accepted`,
`failed`, `resuming`, `standby_pending`, or `waiting`.

The response may look similar to:

```json
{
  "data": {
    "job": {
      "status": "complete",
      "createdDateTime": "2019-04-15T19:45:44.000Z",
      "targetId": "460907869",
      "tasks": {
        "records": [
          {
            "status": "complete",
            "createdDateTime": "2019-04-15T19:45:44.000Z",
            "modifiedDateTime": "2019-04-15T19:49:40.000Z",
            "id": "19041615_krfPuFO0jVj713Z",
            "engine": {
              "id": "54525249-da68-4dbf-b6fe-aea9a1aefd4d",
              "name": "Transcription - DR - English (Global)",
              "category": {
                "name": "Transcription"
              }
            }
          },
          {
            "status": "complete",
            "createdDateTime": "2019-04-15T19:45:44.000Z",
            "modifiedDateTime": "2019-04-15T19:46:42.000Z",
            "id": "19041615_krfPuFO0jVOsxjE",
            "engine": {
              "id": "ea0ada2a-7571-4aa5-9172-b5a7d989b041",
              "name": "Stream Ingestor",
              "category": {
                "name": "Intracategory"
              }
            }
          },
          {
            "status": "complete",
            "createdDateTime": "2019-04-15T19:45:44.000Z",
            "modifiedDateTime": "2019-04-15T19:46:04.000Z",
            "id": "19041615_krfPuFO0jVtiZFm",
            "engine": {
              "id": "9e611ad7-2d3b-48f6-a51b-0a1ba40feab4",
              "name": "Webstream Adapter",
              "category": {
                "name": "Pull"
              }
            }
          }
        ]
      }
    }
  }
}
```

## Retrieve Job Output

Once a job's status is `complete`, you can request the output of a task,
such as a transcript, translation, or object detection results.

Use the TDO `id`, along with the appropriate engine `id`, to query the item of interest.

```graphql
query getEngineOutput {
  engineResults(tdoId: "460907869",
    engineIds: ["54525249-da68-4dbf-b6fe-aea9a1aefd4d"]) {  # ID of the transcription engine
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

The response will be a (potentially sizable) JSON object.
The following example has a shortened `series` array; normally it is much longer.

```json
{
  "data": {
    "engineResults": {
      "records": [
        {
          "tdoId": "460907869",
          "engineId": "54525249-da68-4dbf-b6fe-aea9a1aefd4d",
          "startOffsetMs": 0,
          "stopOffsetMs": 172250,
          "jsondata": {
            "taskId": "19041615_krfPuFO0jVj713Z",
            "generatedDateUTC": "0001-01-01T00:00:00Z",
            "series": [
              {
                "startTimeMs": 0,
                "stopTimeMs": 960,
                "words": [
                  {
                    "word": "We",
                    "confidence": 1,
                    "bestPath": true,
                    "utteranceLength": 1
                  }
                ],
                "language": "en"
              }
            ],
            "modifiedDateTime": 1555357780000,
            "sourceEngineId": "54525249-da68-4dbf-b6fe-aea9a1aefd4d"
          },
          "assetId": "450192755_lJFc2CsiOz",
          "userEdited": null
        }
      ]
    }
  }
}
```

As you can see, transcripts contain time-correlated, word-based text fragments with
beginning and ending times. A successful call returns the transcript data, with an `assetId`, and
other details specified in the request. Otherwise, an error is returned.

## Requesting a Specific Output Format

Sometimes you may want a particular flavor of output (such as `ttml` or `srt` for captioning).
In that case, you can use the `createExportRequest` mutation:

```graphql
mutation createExportRequest {
  createExportRequest(input: {
    includeMedia: false,
    tdoData: [{tdoId: "431011721"}],
    outputConfigurations: [{
      engineId: "71ab1ba9-e0b8-4215-b4f9-0fc1a1d2b44d",
      formats: [{
        extension: "vtt",
        options: {newLineOnPunctuation: false}
      }]
    }]
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

The response:

```json
{
  "data": {
    "createExportRequest": {
      "id": "a2efc2bb-e09f-40bf-a2bc-1d25297ac2f7",
      "status": "incomplete",
      "organizationId": "17532",
      "createdDateTime": "2019-04-25T20:45:20.784Z",
      "modifiedDateTime": "2019-04-25T20:45:20.784Z",
      "requestorId": "960b3fa8-1812-4303-b58d-4f0d227f2afc",
      "assetUri": null
    }
  }
}
```

Since an export request may take time to process, you should poll until the status is complete,
using the `id` returned above.

```graphql
query exportRequest {
  exportRequest(id: "a2efc2bb-e09f-40bf-a2bc-1d25297ac2f7") {
    status
    assetUri
    requestorId
  }
}
```

The response (showing that the export is, in this case, incomplete):

```json
{
  "data": {
    "exportRequest": {
      "status": "incomplete",
      "assetUri": null,
      "requestorId": "960b3fa8-1812-4303-b58d-4f0d227f2afc"
    }
  }
}
```

When the status becomes `complete`, you can retrieve the results at the URL returned in the `assetUri` field.

## Delete a TDO and/or Its Content

If a TDO is no longer needed, it can be deleted from an organization’s files
to free up storage space or comply with organizational policies.
The API provides flexible options that allow you to delete a TDO and all of its assets,
or clean up a TDO's content by removing the associated assets so the TDO can be reused
and new assets can be created.

!> Deleting a TDO data permanently removes contents from aiWARE and they will no longer be accessible via CMS, search, or any other method.
**Deleting a TDO cannot be undone**!

### Delete a TDO and All Assets

To delete a TDO and all asset metadata, make a request to the `deleteTDO` mutation
and pass the TDO `id` as an argument.
This operation is processed immediately at the time of the request and
permanently deletes the specified TDO *as well as its assets* from the organization's account.
Any subsequent requests against the TDO or assets will return an error.

First, we'll look at how to delete the entire TDO.
Then we'll discuss how to remove *just the content items*.

#### Example: Delete a TDO

```graphql
mutation{
  deleteTDO(id: "44512341")
     {
      id
      message
      }
    }
```

The response is:

```json
{
  "data": {
    "deleteTDO": {
      "id": "44512341",
      "message": "TemporalDataObject 44512341 was deleted."
    }
  }
}
```

### Remove TDO Content

To remove just the asset (content) associated with a TDO, while retaining the TDO/container
and asset metadata, make a request to the `cleanupTDO` mutation with the TDO `id`.
This mutation uses the `options` parameter along with any combination of the values below
to specify the type(s) of data to be deleted.

* `storage`: Deletes the TDO's assets from storage, including engine results. Asset metadata will remain until the TDO/container is deleted.
* `searchIndex`: Deletes all search index data. The TDO and its assets will no longer be accessible through search.
* `engineResults`: Deletes engine results stored on related task objects. Engine results that are stored as assets will remain unless `storage` is passed as a value in the request.

!> Requests that do not use the `options` parameter will remove the TDO's content from `storage` and the `search index` by default.

#### Example: Remove TDO Content (storage, engineResults)

```graphql
mutation {
  cleanupTDO(id: "44512341", options: [storage, engineResults]) {
      id
      message
      }
    }
```

Response:

 ```json
 {
  "data": {
    "cleanupTDO": {
      "id": "44512341",
      "message": "Data deleted from 44512341:  storage,engineResults"
    }
  }
}
```

<!-- TODO: Create some "What Next?" or "See Also" links here, anticipating customer questions. -->
