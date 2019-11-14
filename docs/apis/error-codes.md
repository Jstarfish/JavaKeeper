# Error Codes

Error handling in a GraphQL API is slightly different than error
handling in a typical REST API:

- there is only one URL endpoint
- a single request can specify any number of queries, mutations, and fields therein

The GraphQL specification does not explicitly state how errors should be
treated, but there are documented conventions and best practices. The
Veritone API follows these conventions and also leverages a commonly
used library (apollo-error) for error handling consistent with what you
may find in other GraphQL APIs.

An HTTP status code of 200 indicates that the GraphQL server was able to
parse the incoming query and attempt to resolve all fields.

Therefore, a non-200 status code indicates that either the query did not
reach the GraphQL server, or that the server was unable to parse it. The
follow table lists several HTTP status code you may encounter and their
meanings.

| Code | Meaning                                                                                                                                                                                                                                                                                   |
| ---- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 200  | GraphQL server received the query, parsed it, and attempted to resolve                                                                                                                                                                                                                    |
| 404  | Not found. In GraphQL, there is only one URL endpoint. Therefore, this error means that the caller's URL path was wrong.                                                                                                                                                                  |
| 400  | Malformed request. The request should have the 'Content-Type' header set to either 'application/json' or 'multipart/form-data'. The request must contain a 'query' parameter containing JSON, and that JSON should have a 'query' element containing, as a string, a valid GraphQL query. |
| 500  | An internal server error prevented the server from handling the request. This error will not happen under normal circumstances.                                                                                                                                                           |
| 502  | HTTP gateway error. This could indicate an internal server error or timeout. Neither will occur under normal circumstances.                                                                                                                                                               |

A HTTP 200 status code will be accompanied by a normal GraphQL response
body in JSON format. Fields that were successfully resolved will have
their data. Fields that *cannot* be successfully resolved will have a
null value and a corresponding error set in the *errors* field.

Here's an example where we attempt to create three objects and only one
succeeds:

```graphql
mutation {
  create1: createAsset(input: {
    containerId: 123
  }) {
    id
  }

  create2: createAsset(input: {
    containerId: "400001249"
    type:"media"
    contentType: "video/mp4"
  }) {
    id
  }

  create3: createAsset(input: {
    containerId: "400001249"
    type:"media"
    contentType: "video/mp4"
    uri: "http://localhost/myvideo.mp4"
  }) {
    id
  }
}
```

The response:

```json
{
  "data": {
    "create1": null,
    "create2": null,
    "create3": {
      "id": "e6a8e6b1-955a-4d0c-be3b-d1ff83833a15"
    }
  },
  "errors": [
    {
      "message": "The requested object was not found",
      "name": "not_found",
      "time_thrown": "2017-12-12T01:15:48.875Z",
      "data": {
        "objectId": "123",
        "objectType": "TemporalDataObject"
      }
    },
    {
      "message": "One of uri or file (upload) must be provided to create an asset.",
      "name": "invalid_input",
      "time_thrown": "2017-12-12T01:15:48.964Z"
    }
  ]
}
```

Here's another example where we attempt to retrieve three objects, but only one is found:

```graphql
{
  asset1: asset(id: "2426dbe5-eef3-4167-9da8-fb1eeec61c67") {
    id
  }
  asset2: asset(id: "2426dbe5-eef3-4167-9da8-fb1eeec61c68") {
    id
  }
  asset3: asset(id: "1fa65e5a-8008-48e4-9968-272fbef54cc2") {
    id
  }
}
```

The response:

```json
{
  "data": {
    "asset1": null,
    "asset2": null,
    "asset3": {
      "id": "1fa65e5a-8008-48e4-9968-272fbef54cc2"
    }
  },
  "errors": [
    {
      "message": "The requested object was not found",
      "name": "not_found",
      "time_thrown": "2017-12-12T01:21:30.243Z",
      "data": {
        "objectId": "2426dbe5-eef3-4167-9da8-fb1eeec61c67",
        "objectType": "Asset"
      }
    },
    {
      "message": "The requested object was not found",
      "name": "not_found",
      "time_thrown": "2017-12-12T01:21:30.247Z",
      "data": {
        "objectId": "2426dbe5-eef3-4167-9da8-fb1eeec61c68",
        "objectType": "Asset"
      }
    }
  ]
}
```

So, to check for errors you should first verify HTTP status 200, and then check for an errors array in the response body. Or, if a field you expected to find a value in has null, look in the `errors` array for an explanation.

Detailed error information is shown in a consistent format. Each entry in the `errors` array will be an object with the following fields:

| Field | Description |
| ----- | ----------- |
| message | A human-readable description of the error cause |
| name | A machine-readable error code in string form |
| time_thrown | Timestamp |
| data | Operation-specific supplementation information about the error. For example on a not_found the data field will often have objectId with the ID that could not be found. |

A standard set of error codes is used across the API. This list may grow over time.

| Error code | Meaning | Recommended action |
| ---------- | ------- | ------------------ |
| not_found | A requested object was not found. This could mean that the object never existed, existed and has been deleted, or exists but the caller does not have access to it. | Verify that object exists and that the caller has rights to it. |
| not_allowed | The caller is not authorized to perform the requested operation. For example, a user with the Viewer role on the CMS app would get a not_allowed error if attempting to use the createAsset example shown above. | Either provision the caller with the required rights or do not attempt to access the object. |
| invalid_input | Although the query contains syntactically valid GraphQL according to the schema, something was wrong with the parameters on the field. For example, an integer parameter have have been outside the allowed range. | Indicates a client error. Refer to the schema documentation to fix the client code. |
| capacity_exceeded | Server capacity allocated to the client was exceeded while processing the request. | Try again later or, if the query was a complex one that may be expensive to resolve, break it apart or use a smaller page size. |
| authentication_error | The client did not supply a valid authentication token or the token was not of the type required for the requested operation. Not all fields require authentication, but an attempt to access one that does without supplying a valid token will cause this error. | Get and submit a current authentication token. If the token is current, the field may require a specific type of token such as api or user. Consult the schema documentation and correct the client code. |
| not_implemented | The requested query, mutation, or field is not available on this server. The cause may be a configuration issue or operational problem affecting a required subsystem. | Verify that the operation is actually supported by consulting schema docs. If so, try again later or contact Veritone support. |
| service_unavailable | A required service could not be reached. This error can indicate a temporary outage or a misconfiguration. | Try again later or contact Veritone support. |
| service_failure | A required service was accessible, but failed to respond or fulfill a request successfully. This error can indicate a temporary outage or a misconfiguration. | Try again later or contact Veritone support. |
| internal_error | An internal server error prevented the field from being resolved. | Try again later or contact Veritone support. |
