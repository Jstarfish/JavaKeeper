# Cleaning up TDO data

As part of the cognition workflow, organizations may upload large amounts of content (media files, etc.) to object storage. Furthermore, as engines run, they may store their results in additional assets and tables. Sometimes it may become necessary to clean up, or delete, some of this content either to save space or comply with certain policies. But the organization may not wish to entirely delete all data.

The Veritone GraphQL API allows users fine-grained control over what data is delete is what is left on Veritone's servers.

In the GraphQL schema a temporal data object, or TDO, is the top-level container for media assets and engine results (TDO is called "recording" in the CMS application). To clean up data in a TDO, using the following procedure.

First, log into the Veritone platform if you haven't already.

You'll need to know the ID of the TDO, or recording, to operate on. You can get this from CMS – when you click on the media detail in CMS, the ID is the final part of the URL that appears in the browser's address bar.

Then you can open the interactive GraphQL user interface, called GraphiQL, at https://api.veritone.com/v3/graphiql.

On the left panel you can type your GraphQL query. A GraphQL query is like a small computer program that uses a simplified language to interact with Veritone's services. The UI has built-in help and auto-completion (CTRL-space) to assist.

A query that modified information is called a mutation. The specific mutation used to clean up TDO content is cleanupTDO.

To use the default settings, type this and hit the arrow button or CTRL-ENTER to execute the query:

```graphql
mutation {
 cleanupTDO(id: "<insert TDO ID here>") {
   id
   message
 }
}
```

On the right panel, you will see a result indicating that the operation ran successfully and the requested data was deleted. The TDO itself is still in the database, along with the records of all engine tasks run against it.

For more precise control over the data that is deleted, you can pass an additional options parameter. Possible values are:

* `storage`:  Indicates that all assets should be deleted from storage, including those used to store engine results. Metadata about the assets will remain until the container `TemporalDataObject` is permanently deleted.
* `searchIndex`:  Indicates that all search index data should be deleted. The `TemporalDataObject` and its assets will no longer be accessible through search.*
* `engineResults`:  Indicates that engine results stored on related task objects should be deleted. Engine results stored as assets will remain until assets are removed using the storage option.

The default behavior is to use the `storage` and `searchIndex` settings. To change this, pass any combination of valid option values as shown below:

```graphql
mutation {
 cleanupTDO(id: "<insert TDO ID here>", options: [engineResults, storage]) {
   id
   message
 }
}
```

To delete a TDO entirely, use the `deleteTDO` mutation. This will delete the TDO and all metadata about its assets, but will not delete any task records or engine results.
