# Uploading assets

Recall that in the Veritone data model, a piece of data such as a
media recording, face image, or PDF is an _asset_. Every asset is created
in a container that stores additional metadata and ties associated assets
together for engine processing and searching; this container is called
a _temporal data object_.

[Upload and process](/apis/tutorials/upload-and-process) describes a typical control
flow in which a client uploads some data, runs an engine to process the
data, and downloads results. The basic mutations involved are `createTDO`
and `createAsset`.

As a shortcut, the `createTDOWithAsset` can be used to create a TDO and
upload an asset in a single step. This mutation is useful for simple cases
where the client just needs to upload a single piece of data for processing.

This mutation works just like `createAsset` in that the caller can pass a file
using multipart form post or a plain URI to store a reference. See [GraphQL Basics](/apis/tutorials/graphql-basics)
for details on making such requests.

To use `createTDOWithAsset`, provide basic metadata about the asset. In this
case we'll store a reference:

```gql
mutation {
  createTDOWithAsset(input: {
    assetType:"media"
    uri: "https://static.veritone.com/samples/media.mp4"
    startDateTime: "2017-12-28T22:30:57.000Z"
    stopDateTime: "2017-12-28T22:30:58.000Z"
  }) {
    id
    primaryAsset(assetType: "media") {
      id
      uri
    }
  }
}
```

Note that we've included put the primary asset in the response fields section
so that we get back the new asset ID along with the new TDO ID:

```json
{
  "data": {
    "createTDOWithAsset": {
      "id": "400004331",
      "primaryAsset": {
        "id": "747f3d1b-eec1-4b38-8495-be38fb70d88b",
        "uri": "https://static.veritone.com/samples/media.mp4"
      }
    }
  }
}
```

This mutation provides quickest, simplest way to get data into the platform and
start processing.
