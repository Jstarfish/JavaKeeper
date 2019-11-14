# Uploading Large Files

Veritone provides API for securely and reliably uploading files to your account. Several mutations in the Veritone API accept file upload, but if your data is large in size or exceeds the maximum upload limit, you may experience slower upload speed, timeouts, or failed requests.

For best performance and to make file uploading as easy and flexible as possible, Veritone supports multiple methods that allow you to upload files of virtually any size. Depending on the size of the data and the requirements of your environment, you can choose from the following options and send upload requests in the way that best meets your needs:

* **Local System Upload:** Attach and upload a file 100MB in size or less using a local file path. This method includes an option to chunk large files into a sequence of parts and upload them in parallel.
* **HTTP/HTTPS URL Upload:** Upload a file larger than 100MB using a publicly accessible HTTP or HTTPS URL to the file.
* **Pre-Signed URL Upload:** Generate a temporary URL that provides a path to upload content from your server to Veritone for a limited amount of time.

This tutorial includes everything you need to know about performing successful file uploads. It describes basic content storage concepts, outlines the general file upload process, defines size requirements, details the different upload methods, covers some common pitfalls, and provides corrective actions you can take to resolve errors. You can read this tutorial end-to-end to get all the details or use the links below to jump to a specific section if you already know what you’re looking for.

* [Content Storage and Upload Concepts](#content-storage-and-upload-concepts)
* [Size Limitations](#size-limitations)
* [Local System File Upload](#local-file-system-upload)
* [HTTP/HTTPS URL File Upload](#direct-httphttps-url-upload)
* [Pre-signed URL Upload](#pre-signed-url-upload)
* [Handling Errors](#handling-errors)

## Content Storage and Upload Concepts

### Content Storage Overview

Content that’s ingested and stored in Veritone is organized as *containers* and *assets*.

* **Container:** A container is similar to a conventional system directory or folder. It holds an uploaded file and any number of additional assets, which are renditions of the original uploaded file (e.g., a thumbnail generated from the original file). The Veritone GraphQL API refers to a container as a "Temporal Data Object" (or TDO). Each container has a unique TDO ID that’s used to identify it and connect it to its associated assets.

* **Asset:** An asset is much like a file. It represents an object in a container and consists of binary or text content and metadata. Videos, images, and transcripts that are stored in Veritone are examples of assets. Each asset is identified by a unique ID and contains the TDO ID it’s associated with as well as the URL path to the location where the file is stored in Veritone. When a file is uploaded to a container, it becomes the container’s original asset. While an asset can only be associated with one container, a container may hold multiple rendition assets of the original uploaded file. Some rendition assets are created by default based the original asset’s file type. Examples of renditions include generating a thumbnail image or encoding the original file into a format compatible for engine processing. Additional rendition assets are also produced when a task is executed on an existing asset, such as creating a transcription from an audio file.

### File Upload Process Overview

The general file upload process consists of two distinct functions that occur in a single request. A call to the `createTDOWithAsset` mutation first creates an empty container (or TDO) and then uploads the file to it. Once a file is successfully uploaded, it’s stored as an asset and can be used as the input for performing other actions, such as cognitive processing.

## Size Limitations

To safeguard the performance and integrity of the system, the Veritone API has built-in size limiting mechanisms on inbound requests and file uploads. These limits apply to both the `application/json` and `multipart/form-data` request protocols. The following sections provide details on the the limits accepted by Veritone to help you in setting up and managing your requests.

### Maximum Query Size

Veritone supports a maximum request size of 10MB. This limit exceeds the size of most typical requests and is well-suited for most purposes. There’s no limit to the number of elements a request contains as long as the overall query size doesn’t exceed 10MB. It’s important to note that this limitation applies only to the size of the GraphQL request body — external resources contained in a query (e.g., a file attachment) do not count toward the 10MB limit. Calls that exceed the maximum will return an error. If you encounter a query size error, see the [Handling Errors](#handling-errors) section for possible error codes that can be returned along with suggested actions you can take to resolve them.

### Maximum File Upload Size

The Veritone API enforces certain file size limitations to ensure the reliability of data uploads. These limits are based on what can be reliably uploaded with a single request in a reasonable amount of time. The following table shows the size limits per request for various file types and upload methods. When uploading a single file, the defined limit is the maximum allowed size for that file. When a file is uploaded in parts, it’s the maximum allowed size for each of the file chunks. Files that are larger than the limits cannot be transferred in a single request. Veritone provides options to accommodate larger file uploads, which are outlined in the *Recommended Best Practice* column of the table and described in detail later in this guide.

<!-- markdownlint-disable no-inline-html -->
<table>
  <tr align="center">
  <td colspan="4"><h4><b>File Size Limits</b></h4>
</td>
</tr>
  <tr>
    <td><h5>File Type</h5></td>
    <td><h5>Upload Method</h5></td>
    <td><h5>Max Size Limit Per Request</h5></td>
    <td><h5>Recommended Best Practice</h5></td>
  </tr>
  <tr>
    <td rowspan="2"><b>video or audio</b></td>
    <td>Local Path</td>
    <td>100MB</td>
    <td>For files that exceed 100MB:
Split the file into smaller chunks and upload as a multipart/form request.
-OR-
Upload the file via URL</td>
  </tr>
  <tr>
    <td>URL</td>
    <td>No limit*</td>
    <td>Split larger files into chunks no more than 15 minutes in length. </td>
  </tr>
  <tr>
    <td rowspan="2"><b>image, text, or application<b></td>
    <td>Local Path</td>
    <td>100MB</td>
    <td>For files that exceed 100MB:
Split the file into smaller chunks and upload as a multipart/form request.
-OR-
Upload the file via URL</td>
  </tr>
  <tr>
    <td>URL</td>
    <td>No limit*</td>
    <td>Split files that exceed 250MB into smaller chunks.</td>
  </tr>
  <tr>
    <td colspan="4">*Note:*  Although there are no restrictions imposed by Veritone for URL uploads, it’s important to note that cognition engines may set their own limits for data processing and analysis. Therefore, it’s recommended to split large files into smaller chunks to optimize performance and reduce the risk of error. </td>
  </tr>
</table>
<!-- markdownlint-enable no-inline-html -->

## Local File System Upload

You can upload files from your local system up to 100MB in a single operation by doing a `multipart/form-data` HTTP request. This method structures requests in multiple parts that represent different characteristics of the file. In each request, form field data specifying information about the file and a query containing details about the asset are sent along with `Authentication` and `Content-Type` headers. When a file is successfully uploaded, a `TDO/container ID` and `URL` to the file’s storage location are returned in the response. These values can then be used with other Veritione API to perform additional actions, such as cognitive processing.

Files that are larger than the 100MB limit can be split into smaller, more manageable pieces and uploaded independently, in any order, and in parallel. All file chunks should be the same size (up to 100MB each), except for the last chunk, which can be any size under 100MB. If you want to send a large file without dividing it, you can use the raw or pre-signed URL upload method.

> If you encounter an error during a local file upload, see the [Handling Errors](#handling-errors) section for possible error codes that can be returned along with suggested actions you can take to resolve them.

To upload a local file, make a request to the `createTdoWithAsset` mutation. When structuring your request, be sure to set the `Content-Type` header to `multipart/form-data` and use the `form-data` keys `query`, `file`, and `filename` in the body. Currently, GraphiQL does not support multipart/form requests, so a different HTTP client must be used for making sample calls.

If you’re uploading a large file that’s segmented into smaller parts, upload the first chunk of the file in the `createTdoWithAsset` request and then use the `TDO ID` returned in the response to upload the remaining chunks to the same container in the `createAsset` mutation.

### Step 1. Create Container and Upload File

Create the TDO/container and upload a local file up to 100 MB or the primary file chunk of a larger, split file.

#### Sample Request Payload — Create TDO with Asset (local file upload)

```graphql
-H content-type:  => A header that specifies the content type. Enter "multipart/form-data" as the value.(required)
-F filename       => The name of the first file chunk to upload. The value must match the name of the saved file. (required)
-F file           => The path of the file to upload. (required)
-F query=mutation {
-----------request fields-----------
  createTDOWithAsset(input:{  => The mutation type and input variable. (required)
   startDateTime: "string"    => The starting date and time of the file to be uploaded in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format. (required)
   stopDateTime: "string"    => The ending date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format. The value is calculated by adding the length of the file to the startDateTime value. If a value is not provided, a 15-minute default value will be applied. (optional)
   contentType: "string"     => The MIME type of the file being uploaded (e.g., "audio/mp3"). If a value is not provided, the default value "video/mp4" will be applied. (optional)
   assetType: "string"       => A label that classifies the file to be uploaded, such as "transcript," "media," or "text." If a value is not specified, the default value "media" will be applied. (optional)
   addToIndex:               => A Boolean that adds the uploaded file to the search index when set to true. (optional and recommended)
 }){
-----------return fields-----------
   id              => The unique ID associated with the TDO/container, provided by the server. (required)
   status          => The status of the request’s progress. (required)
   assets{         => The Assets object parameter that contains the TDO's assets. (required)
     records {     => The Records object parameter that contains data specific to individual assets. (required)
       id          => The unique ID of the new asset, provided by the server. (required)
       type        => A label that classifies the asset. This reflects the value specified in the request or the default value "media" if no request value was set. (required)
       contentType => The MIME type of the asset. This reflects the value specified in the request or the default value "video/mp4" if no request value was set. (required)
       signedUri   => The secure URI of the asset. (required)
```

#### Sample Request: Create TDO with Asset (local file upload)

```bash
curl -X POST \
  https://api.veritone.com/v3/graphql \
  -H 'authorization: Bearer 31gcf6:2e76022093e64732b4c48f202234394328abcf72d50e4981b8043a19e8d9baac' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -F 'filename=rescued puppies road trip.mp4' \
  -F 'file=@/Users/bobjones/Downloads/rescued puppies road trip.mp4' \
  -F 'query=mutation {
  createTDOWithAsset(
    input: {
      startDateTime: 1507128535
      stopDateTime: 1507128542
      contentType: "video/mp4"
      assetType: "media"

      addToIndex: true
    } ) {
    id
    status
    assets{
      records {
        id
        type
        contentType
        signedUri
      }
    }
  }
}'
```

#### Sample Response: Create TDO with Asset (local file upload)

```json
{
  "data": {
    "createTDOWithAsset": {
      "id": "44512341",
      "status": "recorded",
      "assets": {
        "records": [
          {
            "id": "7acfab47-f648-4cfc-9042-74b4cafb1605",
            "type": "media",
            "contentType": "video/mp4",
            "signedUri": "https://inspirent.s3.amazonaws.com/assets/44512341/fd3bd480-2c23-4107-a283-3a2b54d6e512.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAJ6G7HKQBDKQ35MFQ%2F20180713%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180713T155226Z&X-Amz-Expires=3600&X-Amz-Security-Token=FQoDYXdzEF0aDAJG7F%2FR22OpH5fwNCK3A10D6Sx3CYJ6G7kk0ykfjR59f4cLoDNE87BbY2BE0L6ivCD1GN2ZQP4XV8Im6NxQogv5aNqsFnolF5kY9fT%2BSRQwOPNkQA%2FGqPiFJMHkjwvz5zl8SvkW%2FvfAlhIEFEcVKR36jQxNZcrHi10TwMGj3w88bs1lSGz2NOIKZwKOrFSHioxkznZhHLMCzYImVQNmoX2g8qA%2BZVUlsuBh4QvlL3pg7ww%2BXpPaQ1U6vNmpIZEuZIw2TBG%2BmZh9NwNWqFuRtvfxX%2FzoKq71wmI%2F%2F4CGdQ9t%2BUbbWLvT0iVdv7fvoZPbRr6iGvfBsQ2SAD7tXM2iqz2XO%2B8cqKRbeBZ%2BLEzN3K2v2LIGOaHp1%2BDpyYSjo0WcHAVx2KWkq%2BrdvfLH%2Bl%2FANyRMOQdEZrlbkS0ZMrtLIQU4b74ylkslkwhbpP6K%2FxvdDSi7TPQH4xRNdz2OCiELHWKVs%2FHc5Gx1BUrg%2F4C%2BeXTIWFHY2qrqgOhnfW3wZq4p4J%2BZCNbORIOnePb21ZIQtUVQWOEuvmwKKpsz4eDDV%2FvZduq%2Bhkwtwhcr8AimWDbcJyoL9jRwrzqwI9ri12RP7O%2FwYT410jIoxJyi2gU%3D&X-Amz-Signature=e75c68ab486a356da011ba413c88ebb7db3eeacbfa1ebd5b68d469211e736e09&X-Amz-SignedHeaders=host"
          }
        ]
      }
    }
  }
}
```

### Step 2. Upload Additional File Chunks (Split Files Only)

Once the TDO is created and primary file chunk is uploaded, use the `TDO/container ID` returned in the response from the previous step and make individual calls to the `createAsset` mutation to upload each of the remaining file chunks.

#### Sample Request Payload — Create Asset (local file upload)

```graphql
-H content-type:  => A header that specifies the content type. Enter "multipart/form-data" as the value.(required)
-F filename       => The name of the file chunk to upload. The value must match the name of the saved file. (required)
-F file           => The path of the file to upload. (required)
-F query=mutation {
-----------request fields-----------
  createAsset(input:{  => The mutation type and input variable. (required)
    containerId: "string"     => The TDO/Container ID returned in the createTDOWithAsset response. (required)
    contentType: "string"     => The MIME type of the file being uploaded (e.g., "audio/mp3"). If a value is not provided, the default value "video/mp4" will be applied. (optional)
    assetType: "string"       => A label that classifies the file to be uploaded, such as "transcript," “media,” or “text.” If a value is not specified, the default value "media" will be applied. (optional)
  }){
-----------return fields-----------
    id          => The unique ID of the new asset, provided by the server. (required)
    assetType   => A label that classifies the asset. This reflects the value specified in the request or the default value "media" if no request value was set.
    contentType => The MIME type of the asset (e.g., "audio/mp3"). This reflects the value specified in the request or the default value "video/mp4" if no request value was set. (required)
    containerId => The unique ID associated with the TDO/container, provided by the server. (required)
    signedUri   => The secure URI of the asset. (required)
```

#### Sample Request — Create Asset (local file upload)

```bash
curl -X POST \
  https://api.veritone.com/v3/graphql \
  -H 'authorization: Bearer 31rzg6:2e76022093e64732b4c48f202234394328abcf72d50e4981b8043a19e8d9baac' \
  -H 'cache-control: no-cache' \
  -H 'content-type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW' \
  -H 'postman-token: e73ec9f6-050a-0c1f-2a50-8ca09ad8ac4d' \
  -F 'query=mutation {
             createAsset(
               input: {
                   containerId: "44512341"
                   contentType: "video/mp4"
                   type: "media"
               }) {
               id
               assetType
               contentType
               containerId
               signedUri
}
}
' \
  -F 'filename=rescued puppies road trip.mp4' \
  -F 'file=@/Users/lisafontaine/Downloads/rescued puppies road trip.mp4'
```

#### Sample Response — Create Asset (local file upload)

```json
{
  "data": {
    "createAsset": {
      "id": "eaf6795e-9e9a-435b-9878-cde23c261d38",
      "assetType": "media",
      "contentType": "video/mp4",
      "containerId": "44512341",
      "signedUri": "https://inspirent.s3.amazonaws.com/assets/44512341/eaf6795e-9e9a-435b-9878-cde23c261d38.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAJPATTVSBG43PWIIA%2F20180723%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180723T180739Z&X-Amz-Expires=3600&X-Amz-Security-Token=FQoDYXdzEGIaDJ3ILmUthQ1diK3A4dlKa1djhm%2Bq3qtrSsxd7m4HDp8HSNt6rOoHISeQrRZpL9%2FSAqRNkNsb6nW4%2FV7aXtdbhWPw4naw5TuVAQga7qHx3aIQ6nyYZQ5%2BqgJh0ZRHp6XrGXKTbngb5PrqyBoE%2FxTyvXF6a5l3odiJeHSrZ5vjVgINKRqlRTUH%2FI0KIBwn7WBXaBoLsjfV1ilwJiGnFD2Mlv03kx90zgf8fiog9rI3LXd6TIBDUtWDX5VrIKp3u19ddjWes%2FSsV6W9K1BG0gs97kwCdn%2BGD%2BQF5znIzO79P8Mle%2BnFeW5opZQWuLXb3zi8k7qaj13WU411VhxGq46mNSg5iT0V%2FddoKYehXprfbJajC%2BVkP5LRHDuLPuWz0FfeHfK%2BpKMiZ35ZMhNmu2dE9cu%2BUB9DoUuRYGYkdZNp7wvFhHG2x%2FsacvE0n1m0VtbBHr%2B5qrxaaKC01XSvbB28T%2BxQkmoaTx4BsDZNRsmsDuEwLRu9Aqz3vRJovHUqeqQpS02SSoHSyncrNq%2BxBswJyS%2BuwNAx6LJRu4%2FL5Qx3wk%2Bv6RqGVqoOAxTuy9p9hOrw%2B%2F6BsYyZJrSja7tFJsTaocGYwgo0ZjY2gU%3D&X-Amz-Signature=ff191f86b188891c2eb9ff654459afce2fdbf7ce9b45810f159cc3b30e8141&X-Amz-SignedHeaders=host"
    }
  }
}
```

## Direct HTTP/HTTPS URL Upload

If the file you want to upload is publicly available online, you can pass the HTTP or HTTPS URL in the request instead of uploading the actual file data. This method allows you to upload files of almost any size, making it useful for adding large files that exceed 100MB in size. Although Veritone does not impose any limits on the size of the file being uploaded using a URL, it’s important to note that cognition engines can set their own limits for data processing and analysis. To prevent performance degradation and to ensure data processing reliability, it’s recommended to follow the [file size limit](#size-limitations) best practices.

When uploading a file from a URL, include the `uri` parameter in the request with the publicly accessible URL to the file set as the value. Files uploaded from a URL are not saved in the database — only the URL path is stored, which is used to redirect users directly to the file location. This provides you with additional privacy and management of your data by allowing you to control how long the file is available. If a saved URL becomes invalid, the file is no longer accessible.

### Upload a File via URL

To upload a file using a URL, make a call to the `createTDOWithAsset` mutation and pass the URL in the input body of the request.

The following example creates a TDO/container and uploads a file from the specified URL location.

#### Sample Request Payload — Create TDO with Asset (URL upload)

```graphql
mutation {
-----------request fields-----------
  createTDOWithAsset(input:{  => The mutation type and input variable.
    startDateTime: "string"    => The starting date and time of the file to be uploaded in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format. (required)
    stopDateTime: "string"    => The ending date and time in [ISO 8601](https://en.wikipedia.org/wiki/ISO_8601) format. The value is calculated by adding the length of the file to the startDateTime value. If a value is not provided, a 15-minute default value will be applied. (optional)
    addToIndex:               => A Boolean that adds the uploaded file to the search index when set to true. (optional and recommended)
   contentType: "string"     => The MIME type of the file being uploaded (e.g., "audio/mp3"). If a value is not provided, the default value "video/mp4" will be applied. (optional)
   assetType: "string"       => A label that classifies the file to be uploaded, such as "transcript," "media," or "text." If a value is not specified, the default value "media" will be applied. (optional)
   addToIndex:               => A Boolean that adds the uploaded file to the search index when set to true. (optional and recommended)
    uri: "string"             => The publicly available URL to the file.
  }){
-----------return fields-----------
    id              => The unique ID associated with the TDO/container, provided by the server.
    status          => The status of the request’s progress.
    assets{         => The Assets object parameter that contains the TDO's assets.
      records {     => The Records object parameter that contains data specific to individual assets.
        id          => The unique ID of the new asset, provided by the server.
        type        => A label that classifies the asset. This is the value specified in the request or the default value "media" if no request value was set.
        contentType => The MIME type of the asset. This is the value specified in the request or the default value "video/mp4" if no request value was set.
        signedUri   => The secure URI of the asset.
```

#### Sample Request — Create TDO with Asset (URL upload)

```graphql
mutation {
  createTDOWithAsset(
    input:{
      startDateTime: 1507128535
      stopDateTime: 1507128542
      contentType: "video/mp4"
      assetType: "media"
      uri: "https://www.youtube.com/watch?v=LUzGYV-_qkQ"
    }
  ) {
    id
    status
    assets{
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

#### Sample Response — Create TDO with Asset (URL upload)

```json
{
  "data": {
    "createTDOWithAsset": {
      "id": "44512341",
      "status": "recorded",
      "assets": {
        "records": [
          {
            "id": "7acfab47-f648-4cfc-9042-74b4cafb1605",
            "type": "media",
            "contentType": "video/mp4",
            "signedUri": "https://www.youtube.com/watch?v=LUzGYV-_qkQ"
          }
        ]
      }
    }
  }
}
```

## Pre-Signed URL Upload

For added security, you can use a pre-signed URL to upload a file of nearly any size from your own server. A pre-signed URL is a temporary link that can be used access to a file in your storage facility and upload it directly to Veritone’s S3 without making it publicly available.

Pre-signed URLs are scoped to allow access to a specific operation (PUT), bucket, and key for a limited amount of time. They also account for security permissions required to access the file once it’s been uploaded to Veritone. Uploading a file with this method involves the following steps:

1. Generate a pre-signed URL.
2. Make an HTTP PUT request to the signed URL to upload the file.
3. Create an asset with the uploaded file.

In addition to generating the pre-signed `url`, requests will also return an `unsignedUrl` and a `getUrl`. These additional URLs are used for different purposes and are only effective once the file has been uploaded to Veritone. The `unsignedUrl` indicates the upload location of the file and is used to create an asset with the uploaded file. The `getUrl` allows the file object to be retrieved after the pre-signed URL expires. This is useful if you want to make the file data available without giving free-range access to your storage.

### Additional Notes

* By default, a pre-signed URL is valid for 10,800 seconds (or three hours).
* Veritone does not impose any limits on the size of the file being uploaded with a pre-signed URL, but it’s important to note that cognition engines can set their own limits for data processing. To prevent performance degradation and to ensure the reliability of data processing, it’s recommended to follow the best practices related to file size limits.
* A separate pre-signed URL must be created for each chunk in a large file upload.
* To upload a file using your own pre-signed URL, follow the [Direct HTTP/HTTPS Upload](#direct-httphttps-url-upload) instructions and provide the path in the `uri` field of the request.

> If you encounter an error using the pre-signed URL upload method, see the [Handling Errors](#handling-errors) section for a list of possible error codes that can be returned along with suggested actions you can take to resolve them.

### Step 1 — Generate a Pre-Signed URL

To generate a pre-signed URL, make a request to the `getSignedWritableUrl` query as demonstrated in the example below.

#### Sample Request Payload — Get Signed Writable URL

```graphql
query {
-----------request fields-----------
  getSignedWritableUrl     => The mutation type.
    (key: "filename.txt")  => The unique identifier for an object within a bucket. Every object in a bucket has exactly one key. This is an optional parameter to specify a custom prefix for the object key. A key can be anything, but it’s most commonly a file name.
  {
-----------return fields-----------
    key => The unique UUID for the file object to be uploaded. If a key prefix was included in the request, the UUID will be appended to the specified input value.
    bucket => The name of the s3 bucket where the object will reside.
    url => The signed, writable URL used to directly upload the file. The URL accepts HTTP PUT (only).
    getUrl => A signed URL that can be used with HTTP GET to retrieve the contents of the file after it has been uploaded.
    unsignedUrl => The raw, unsigned URL to the object. Once the file has been uploaded, this URL value is used to create an asset.
    expiresInSeconds => The amount of time (in seconds) that the user has to start uploading the file. This is set to 10800 seconds by default, meaning the user will have 3 hours to start sending the file. If file upload takes longer than 3 hours to complete, the connection will not be closed.
  }
}
```

#### Sample Request — Get Signed Writable URL

```graphql
query {
  getSignedWritableUrl(key: "your-filename.mp4") {
    key
    bucket
    url
    getUrl
    unsignedUrl
    expiresInSeconds
  }
}
```

#### Sample Response — Get Signed Writable URL

```json
{
  "data": {
    "getSignedWritableUrl": {
      "key": "rescued-puppies-roadtrip-b15e37e7-2fe6-48e9-9d57-865983bebd55.mp4",
      "bucket": "prod-api.veritone.com",
      "url": "https://s3.amazonaws.com/prod-api.veritone.com/rescued-puppies-roadtrip-b15e37e7-2fe6-48e9-9d57-865983bebd55.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJSGMPJHUC4ZLIYMQ%2F20180507%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180507T223634Z&X-Amz-Expires=10800&X-Amz-Signature=1eed5e973843e397510def0325437571d350b3ad90320a4f8dc9f4d9b503f798&X-Amz-SignedHeaders=host",
      "getUrl": "https://s3.amazonaws.com/prod-api.veritone.com/your-filename-b15e37e7-2fe6-48e9-9d57-865983bebd55.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAJSGMPJHUC4ZLIYMQ%2F20180507%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180507T223634Z&X-Amz-Expires=10800&X-Amz-Signature=25b1753f8c46a204c2a5f1e9c4bb23fdb98cf1d2c0a4d02936ac2978417b8ab1&X-Amz-SignedHeaders=host",
      "unsignedUrl": "https://s3.amazonaws.com/prod-api.veritone.com/your-filename-b15e37e7-2fe6-48e9-9d57-865983bebd55.mp4",
      "expiresInSeconds": 10800
    }
  }
}
```

### Step 2. Use the Pre-Signed URL to Upload a File

To upload the file using the pre-signed URL, make a PUT request to the `url` value returned in the previous step. Successful requests will return a 200 response with no additional data.

#### Sample Request Structure — Upload File Using Pre-Signed URL

```bash
curl
  -X PUT '<url field value returned in getSignedWritableUrl response> \
  -d "@/path/to/filename"
```

#### Sample Request — Upload File Using Pre-Signed URL

```bash
curl -v
-X PUT
"https://s3.amazonaws.com/prod-api.veritone.com/rescued-puppies-roadtrip-b15e37e7-2fe6-48e9-9d57-865983bebd55.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAIO2KSNIJXJIKRDJQ%2F20180724%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180724T144431Z&X-Amz-Expires=10800&X-Amz-Security-Token=FQoDYXdzEHcaDHs3x4EGqZ0Dw%2B3q1yK3A4T%2F0FdzMxilgPNhEHH55WltvT6LDTDMtPHFur02%2FabCgnvjdQvPXhw1DNsSZewayHYoYdREYeZcYj5K3hMuCBV7RRZl%2F5n%2BfNhDo4GkSzYMeXAPdoJMYBEaaivBNV386AZyUy%2BQ79B4Ij5jVNAiP62KqbsvSzIHonlpX6nflAzJMxohs%2F38nCSpwfRJ97QyaFvTIy9ekiv%2BGHuWXci3nRFIEWwaHyoiLq1sNzhQ4D2LDkb2dZ2AnBFrPusvB%2B%2FULbxIy41XBr0JycfM0Mlc55yPnaZr%2FzIB7KKNI2vESGFu7EPkoZdwwX58wvaCkXPaFV7l3a3jeMeASKN00Fg5JfpSYZltiHK9%2FSqHPZso1uRBBshJiYrla4okNiR0r4zfq%2BkO9pYJDQZ1UNy81Dw6yjcSLNB438M0F3oIYQj2J1lHGe9%2Bok9koE4umB9sC3Wvgz46O25Q3MN9H6zk4cw1Nf0UzeEoKduO1B3gZ7HD7IJT2dcN5L3y5Qih1QrJMS2GeKo7Z75j5a1EeZu7%2F0fqaX1nTafEfM3pLQu0qlRhiwjmMiBgFdpDsLN3Iz4f%2BG3N5tJ%2BPK2lHIwo2OPc2gU%3D&X-Amz-Signature=ac1ad0a9194aee797047ebfea7abee7f1cd40d9e00f97942db29042ac4032d47&X-Amz-SignedHeaders=host"
  -d "@rescued-puppies-roadtrip.mp4"
```

### Step 3. Create an Asset

Once the file is uploaded, pass the `unsignedUrl` value returned in the response of Step 1 to the `createTDOWithAsset` mutation to create a TDO/container and file asset.

#### Sample Request Payload — Create TDO with Asset (pre-signed URL upload)

```graphql
mutation {
-----------request fields-----------
  createTDOWithAsset(input:{  => The mutation type and input variable.
    startDateTime: integer    => The starting date and time of the file to be uploaded in [Unix/Epoch (https://www.epochconverter.com/) timestamp format.
    stopDateTime: integer     => The ending date and time in [Unix/Epoch](https://www.epochconverter.com/) timestamp format, calculated by adding the length of the file to the startDateTime. If a value is not specified, a 15-minute default value will be applied. (optional)
    addToIndex:               => A Boolean that adds the uploaded file to the search index when set to true. (optional and recommended)
    contentType: "string"     => The MIME type of the file being uploaded (e.g., audio/mp3). If a value is not specified, the default value "video/mp4" will be applied. (optional)
    assetType: "string"       => A label that classifies the file to be uploaded, such as "transcript," “media,” or “text.” If a value is not specified, the default value "media" will be applied. (optional)
    uri: "string"             => The URL location of the file. Use the unsignedUrl value returned in the getSignedWritableUrl response (Step 1).
  }){
-----------return fields-----------
    id              => The unique ID associated with the TDO/container, provided by the server.
    status          => The status of the request’s progress.
    assets{         => The Assets object parameter that contains the TDO's assets.
      records {     => The Records object parameter that contains data specific to individual assets.
        id          => The unique ID of the new asset, provided by the server.
        type        => A label that classifies the asset. This is the value specified in the request or the default value "media" if no request value was set.
        contentType => The MIME type of the asset (e.g., audio/mp3).
        signedUri   => The secure URI of the asset.
      }
    }
  }
}
```

#### Sample Request — Create TDO with Asset (pre-signed URL upload)

```graphql
mutation {
  createTDOWithAsset(
    input:{
      startDateTime: 1507128535
      stopDateTime: 1507128542
      contentType: "video/mp4"
      assetType: "media"
      uri: "https://s3.amazonaws.com/prod-api.veritone.com/your-filename-b15e37e7-2fe6-48e9-9d57-865983bebd55.mp4"
    }
  ) {
    id
    status
    assets{
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

#### Sample Response — Create TDO with Asset (pre-signed URL upload)

```json
{
  "data": {
    "createTDOWithAsset": {
      "id": "44512341",
      "status": "recorded",
      "assets": {
        "records": [
          {
            "id": "b15e37e7-2fe6-48e9-9d57-865983bebd55",
            "type": "media",
            "contentType": "video/mp4",
            "signedUri": "https://s3.amazonaws.com/prod-api.veritone.com/your-filename-b15e37e7-2fe6-48e9-9d57-865983bebd55.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAJNBZJF3A6AQ7XYZQ%2F20180724%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20180724T150615Z&X-Amz-Expires=3600&X-Amz-Security-Token=FQoDYXdzEHcaDNfCYgj1hIAxUC1NJCK3A5FG9Z2goJG12uAqPBMaHpMqDdZpFynoeeW0HB85xBKPxn3sTutO84skuR7O2y3XyajQdtsVtFFlZQo85gE26LKwI8aHJE1iQ%2Bjg90bmom1iEmqLwv7ZSIzlnVp8rMQbCob1JyVuBly%2Bd7KVRGwzkvThnVI1SJAcnnV3oNdPP2I%2FQcZLRuIgRrnJTOVQb3PU3RecWfjBc1zAc9VR7rDyqNxg48Nt4uxqdZfwdZZALG9%2F5AZrGTx%2B%2Fe3KsOfSrridcfe1J3XPyybLPBGJr5x%2F4BhKL3yY%2FuCNuCosm2h4pbU0sw1KisGg4wstn0DSLQuG8EAd8hmbCFRlJoelfOVFJShq4WWZp9X1tdUTZ1hMs9%2FGe2PL3X0WAuIylH1SFZCPMrU3tHLMbMWI6i6cZ7wI9IzQO%2BKXgL07G1IDcvFKpOZVE5QrSsmDh73R7L%2B3NTitMUlTDH6WVV4WvishMWAqULRh0oIbMtIMPUhBfBWtyW%2F%2Fq2w%2B3sAIOZoEYgdTXS8PGfmnt0GK58EroO5MC2oEhrIVz4wqhmbj%2B7elQa7NtvdXlgDae9u9HJLd1PXBJ5zYAQNTR%2Fi3qfko1%2Bfc2gU%3D&X-Amz-Signature=c1fe009a408aea900ba909e3402e6f25915b8f0ab2fbe842cec3468e816fcdf9&X-Amz-SignedHeaders=host"
          }
        ]
      }
    }
  }
}
```

## Handling Errors

### Query Size Error

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

#### Automated Querying

A manually constructed query is unlikely to exceed the size capacity. However, queries that are machine-generated through a loop or other input type may attempt to retrieve or edit too many objects in batch and, as a result, they will exceed the allowable limit. You can work around this issue by modifying your code and splitting the query into batches of bounded size. Then, submit the smaller queries using multiple sequential requests.

#### Arbitrary JSON Input

Although some mutation and data type fields take arbitrary JSON as input, these fields are not designed to consume large objects. An input field with a large JSON representation could alone exceed the allowable 10MB limit and cause the request to fail. For example, the output field of the updateTask mutation could contain a large JSON input value. In this case, even though the base GraphQL query may be small, the size of the output field value could exceed the maximum query size limit.

To work around this issue, simply reduce the size of the payload by either splitting the input into multiple objects or by uploading it as a file.

### Local System File Upload Error

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

### Pre-Signed URL Upload Errors

If you receive a 403 error, there are a few things you can check.

* Verify that you are doing an `HTTP PUT` (not `GET` or `POST`) and that the URL has not expired. The `expiresInSeconds` field indicates the amount of time remaining (in seconds) before the URL expires.
* If you’re using a client-side HTTP library, check to be sure that no headers have been added to the request and that the URL has not been modified in any way.
