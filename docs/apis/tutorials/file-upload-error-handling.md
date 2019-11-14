# Handling File Upload Errors

Veritone supports a number of methods for easily and securely uploading files, however there are certain conditions that can cause an upload to fail. If you encounter an error when uploading a file, review the information provided below to help determine the cause and find suggested courses of action you can take to resolve it.

To learn more about uploading content to Veritone, including supported upload methods, source types, and size limits, see our [Uploading Large Files](apis/tutorials/uploading-large-files.md) tutorial.

## Local System File Upload Error

Attempting to upload or attach a file that exceeds 100MB will return an HTTP 413 error response that looks similar to the following:

```json
{
  "errors":[
    {
      "code":"LIMIT_FILE_SIZE",
      "field":"file",
      "storageErrors":[],
      "data":{
        "limitInBytes":104857600,
        "requestSize":"2295200106",
        "errorId":"ab3efd8f-c0de-4c84-b299-1d7698b4a9b8"
      },
      "name":"invalid_input",
      "message":"The file upload was larger than the limit allowed by this server. The maximum file upload size is 104857600 bytes (100 mb)."
    }
  ]
}
```

If your file exceeds the allowable limit, there are two options to work around the 100MB restriction.

* Split the file into smaller chunks. Although 100MB is a reasonable size for most artifacts (such as long multimedia recordings), cognitive engine processing and analysis performs more efficiently and reliably with smaller object sizes.
* If you’re unable to divide a file larger than 100MB, use the [raw](#direct-httphttps-url-upload) or [pre-signed](#pre-signed-url-upload) URL methods to upload the file without splitting it.

## Pre-Signed URL Upload Error

A pre-signed URL upload failure will result in a 403 error. If you receive a 403 error, be sure your request conforms to the following guidelines:

* Verify that you are doing an `HTTP PUT` (not `GET` or `POST`) and that the URL has not expired. The `expiresInSeconds` field indicates the amount of time remaining (in seconds) before the URL expires.
* If you’re using a client-side HTTP library, check to be sure that no headers have been added to the request and that the URL has not been modified in any way.

## Query Size Error

Requests that exceed the maximum allowed query size will return a HTTP 413 response with the following message in the response body:

```json
{
  "errors":[
    {
      "data":{
        "limitInBytes":1000000,
        "requestSize":"1200011",
        "errorId":"752b9354-8fbd-4071-9a2b-522add55b944"
      },
      "name":"invalid_input",
      "message":"The request payload was larger than the limit allowed by this server. The maximum JSON request size is 10000000 bytes (10 mb)."
    }
  ]
}
```

Typically, this error is encountered when the request payload exceeds the maximum 10MB limit. Below we describe two common causes of this error and some suggested courses of action for correction.

### Automated Querying

A manually constructed query is unlikely to exceed the size capacity. However, queries that are machine-generated through a loop or other input type may attempt to retrieve or edit too many objects in batch and, as a result, they will exceed the allowable limit. You can work around this issue by modifying your code and splitting the query into batches of bounded size. Then, submit the smaller queries using multiple sequential requests.

### Arbitrary JSON Input

Although some mutation and data type fields take arbitrary JSON as input, these fields are not designed to consume large objects. An input field with a large JSON representation could alone exceed the allowable 10MB limit and cause the request to fail. For example, the output field of the updateTask mutation could contain a large JSON input value. In this case, even though the base GraphQL query may be small, the size of the output field value could exceed the maximum query size limit.

To work around this issue, simply reduce the size of the payload by either splitting the input into multiple objects or by uploading it as a file.
