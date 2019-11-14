# Mutation Methods

The table below gives a quick summary of GraphQL [mutation](https://api.veritone.com/v3/graphqldocs/mutation.doc.html) methods, alphabetized by name. 

Click any name to see the complete method signature, and other info.

| Method name | Short Description  |
| -- | -- |
| [addLibraryDataset](#addlibrarydataset) | Add recordings to a dataset library |
| [addMediaSegment](#addmediasegment) | Add a single media segment to a TemporalDataObject |
| [addTasksToJobs](#addtaskstojobs) | Add tasks to jobs |
| [addToEngineBlacklist](#addtoengineblacklist) | Add to engine blacklist |
| [addToEngineWhitelist](#addtoenginewhitelist) | Add to engine whitelist |
| [applicationWorkflow](#applicationworkflow) | Apply an application workflow step, such as "submit" or "approve" |
| [bulkDeleteContextMenuExtensions](#bulkdeletecontextmenuextensions) | Bulk delete context meu extensions |
| [bulkUpdateWatchlist](#bulkupdatewatchlist) | Apply bulk updates to watchlists |
| [cancelJob](#canceljob) | Cancel a job |
| [changePassword](#changepassword) | Change the current authenticated user's password |
| [cleanupTDO](#cleanuptdo) | Delete partial information from a temporal data object |
| [createApplication](#createapplication) | Create a new application |
| [createAsset](#createasset) | Create a media asset |
| [createCognitiveSearch](#createcognitivesearch) | Create cognitive search |
| [createCollection](#createcollection) | Create (ingest) a structured data object |
| [createCollectionMention](#createcollectionmention) | Add a mention to a collection |
| [createCollectionMentions](#createcollectionmentions) | Create collection mentions |
| [createCreative](#createcreative) | Create a creative |
| [createDataRegistry](#createdataregistry) | Create a structured data registry schema metadata |
| [createEngine](#createengine) | Create a new engine |
| [createEngineBuild](#createenginebuild) | Create an engine build |
| [createEntity](#createentity) | Create a new entity |
| [createEntityIdentifier](#createentityidentifier) | Create an entity identifier |
| [createEntityIdentifierType](#createentityidentifiertype) | Create an entity identifier type, such as "face" or "image" |
| [createEvent](#createevent) | Create a new event |
| [createExportRequest](#createexportrequest) | Create an export request |
| [createFolder](#createfolder) | Create a new folder |
| [createFolderContentTempate](#createfoldercontenttempate) | Create new content template into a folder |
| [createIngestionConfiguration](#createingestionconfiguration) | Create an ingestion configuration |
| [createJob](#createjob) | Create a job |
| [createLibrary](#createlibrary) | Create a new library |
| [createLibraryConfiguration](#createlibraryconfiguration) | Create Dataset Library Configuration |
| [createLibraryEngineModel](#createlibraryenginemodel) | Create a library engine model |
| [createLibraryType](#createlibrarytype) | Create a library type, such as "ad" or "people" |
| [createMediaShare](#createmediashare) | Create Media Share |
| [createMention](#createmention) | Create a mention object |
| [createMentionComment](#creatementioncomment) | Create a mention comment |
| [createMentionExportRequest](#creatementionexportrequest) | Create a mention export request |
| [createMentionRating](#creatementionrating) | Create a mention rating |
| [createMentions](#creatementions) | Create Mention in bulk |
| [createOrganization](#createorganization) | Create a new organization |
| [createPasswordResetRequest](#createpasswordresetrequest) | Create a password reset request |
| [createPasswordUpdateRequest](#createpasswordupdaterequest) | Force a user to update password on next login |
| [createProcessTemplate](#createprocesstemplate) | Create a processTemplate in CMS |
| [createRootFolders](#createrootfolders) | Create root folder for an organization |
| [createSavedSearch](#createsavedsearch) | Create a new Saved Search |
| [createStructuredData](#createstructureddata) | Create (ingest) a structured data object |
| [createSubscription](#createsubscription) | Create subscription |
| [createTDO](#createtdo) | Create a new temporal data object |
| [createTDOWithAsset](#createtdowithasset) | Create a TDO and an asset with a single call |
| [createTaskLog](#createtasklog) | Create a task log by using multipart form POST |
| [createTriggers](#createtriggers) | Create trigger for events or types |
| [createUser](#createuser) | Create a new user within an organization |
| [createWatchlist](#createwatchlist) | Create watchlist |
| [createWidget](#createwidget) | Creates a widget associated with a collection |
| [deleteApplication](#deleteapplication) | Delete an application |
| [deleteAsset](#deleteasset) | Delete an asset |
| [deleteCognitiveSearch](#deletecognitivesearch) | Delete cognitive search |
| [deleteCollection](#deletecollection) | Delete Collection |
| [deleteCollectionMention](#deletecollectionmention) | Remove a mention from a collection |
| [deleteCreative](#deletecreative) | Delete a creative |
| [deleteEngine](#deleteengine) | Delete an engine |
| [deleteEngineBuild](#deleteenginebuild) | Delete an engine build |
| [deleteEntity](#deleteentity) | Delete an entity |
| [deleteEntityIdentifier](#deleteentityidentifier) | Delete an entity identifier |
| [deleteFolder](#deletefolder) | Delete a folder |
| [deleteFolderContentTempate](#deletefoldercontenttempate) | Delete existing folder content template by folderContentTemplateId |
| [deleteFromEngineBlacklist](#deletefromengineblacklist) | Delete from engine blacklist |
| [deleteFromEngineWhitelist](#deletefromenginewhitelist) | Delete from engine whitelist |
| [deleteIngestionConfiguration](#deleteingestionconfiguration) | Delete an ingestion configuration |
| [deleteLibrary](#deletelibrary) | Delete a library |
| [deleteLibraryConfiguration](#deletelibraryconfiguration) | Delete Dataset Library Configuration |
| [deleteLibraryDataset](#deletelibrarydataset) | Remove recordings from a dataset library |
| [deleteLibraryEngineModel](#deletelibraryenginemodel) | Delete a library engine model |
| [deleteMentionComment](#deletementioncomment) | Delete a mention comment |
| [deleteMentionRating](#deletementionrating) | Delete a mention rating |
| [deleteProcessTemplate](#deleteprocesstemplate) | Delete a processTemplate by ID in CMS |
| [deleteSavedSearch](#deletesavedsearch) | Delete a saved search |
| [deleteStructuredData](#deletestructureddata) | Delete a structured data object |
| [deleteSubscription](#deletesubscription) | Delete subscription |
| [deleteTDO](#deletetdo) | Delete a temporal data object |
| [deleteTrigger](#deletetrigger) | Delete a registed trigger by ID |
| [deleteUser](#deleteuser) | Delete a user |
| [deleteWatchlist](#deletewatchlist) | Delete watchlist |
| [emitEvent](#emitevent) | Emit an event |
| [emitSystemEvent](#emitsystemevent) | Emit a system-level emit |
| [engineWorkflow](#engineworkflow) | Apply an application workflow step, such as "submit" or "approve" |
| [fileTemporalDataObject](#filetemporaldataobject) | File a TemporalDataObject in a folder |
| [fileWatchlist](#filewatchlist) | File watchlist |
| [getCurrentUserPasswordToken](#getcurrentuserpasswordtoken) | Get password token info for current user |
| [getEngineJWT](#getenginejwt) | JWT tokens with a more limited scoped token to specific resources to the recording, task, and job and also has no organization association |
| [moveFolder](#movefolder) | Move a folder from one parent folder to another |
| [moveTemporalDataObject](#movetemporaldataobject) | Moves a TemporalDataObject from one parent folder to another |
| [pollTask](#polltask) | Poll a task |
| [publishLibrary](#publishlibrary) | Publish a new version of a library |
| [refreshToken](#refreshtoken) | Refresh a user token, returning a fresh token so that the client can continue to authenticate to the API |
| [replaceSavedSearch](#replacesavedsearch) | Mark existing saved search profile as deleted Create new saved search profile |
| [requestClone](#requestclone) | Start a clone job |
| [retryJob](#retryjob) | Retry a job |
| [sendEmail](#sendemail) | Send a basic email |
| [setWorkflowRuntimeStorageData](#setworkflowruntimestoragedata) | Create or Update Workflow data |
| [shareCollection](#sharecollection) | Share a collection, allowing other organizations to view the data it contains |
| [shareFolder](#sharefolder) | Share a folder with other organizations |
| [shareMention](#sharemention) | Share mention |
| [shareMentionFromCollection](#sharementionfromcollection) | Share a mention from a collection |
| [shareMentionInBulk](#sharementioninbulk) | Share mentions in bulk |
| [startWorkflowRuntime](#startworkflowruntime) | Start a Veritone Workflow instance |
| [stopWorkflowRuntime](#stopworkflowruntime) | Shutdown Veritone Workflow instance |
| [subscribeEvent](#subscribeevent) | Subscribe to an event |
| [unfileTemporalDataObject](#unfiletemporaldataobject) | Unfile a TemporalDataObject from a folder |
| [unfileWatchlist](#unfilewatchlist) | Unfile watchlist |
| [unsubscribeEvent](#unsubscribeevent) | Unsubscribe to an event |
| [updateApplication](#updateapplication) | Update a custom application |
| [updateAsset](#updateasset) | Update an asset |
| [updateCognitiveSearch](#updatecognitivesearch) | Update cognitive search |
| [updateCollection](#updatecollection) | Update a collection |
| [updateCreative](#updatecreative) | Update a creative |
| [updateCurrentUser](#updatecurrentuser) | Update the current authenticated user |
| [updateDataRegistry](#updatedataregistry) | Update a structured data registry schema metadata |
| [updateEngine](#updateengine) | Update an engine |
| [updateEngineBuild](#updateenginebuild) | Update an engine build |
| [updateEntity](#updateentity) | Update an entity |
| [updateEntityIdentifier](#updateentityidentifier) | Update entity identifier |
| [updateEntityIdentifierType](#updateentityidentifiertype) | Update an entity identifier type |
| [updateEvent](#updateevent) | Update an event |
| [updateExportRequest](#updateexportrequest) | Update an export request |
| [updateFolder](#updatefolder) | Update an existing folder |
| [updateFolderContentTempate](#updatefoldercontenttempate) | Update existing content template by folderContentTemplateId |
| [updateIngestionConfiguration](#updateingestionconfiguration) | Update an ingestion configuration |
| [updateJobs](#updatejobs) | Update jobs |
| [updateLibrary](#updatelibrary) | Update an existing library |
| [updateLibraryConfiguration](#updatelibraryconfiguration) | Update Dataset Library Configuration |
| [updateLibraryEngineModel](#updatelibraryenginemodel) | Update a library engine model |
| [updateLibraryType](#updatelibrarytype) | Update a library type |
| [updateMention](#updatemention) | Update a mention object |
| [updateMentionComment](#updatementioncomment) | Update a mention comment |
| [updateMentionExportRequest](#updatementionexportrequest) | Update status or assetURI of a mentionExportRequest Often use when the file export was completed or downloaded |
| [updateMentionRating](#updatementionrating) | Update a mention rating |
| [updateMentions](#updatementions) | Update a set of mentions |
| [updateOrganization](#updateorganization) | Update an organization |
| [updateProcessTemplate](#updateprocesstemplate) | Update a processTemplate by ID in CMS |
| [updateSchemaState](#updateschemastate) | Update schema state |
| [updateSharedCollectionHistory](#updatesharedcollectionhistory) | Update shared collection history |
| [updateSharedCollectionMentions](#updatesharedcollectionmentions) | Update shared collection mentions |
| [updateSubscription](#updatesubscription) | Update subscription |
| [updateTDO](#updatetdo) | Update a temporal data object |
| [updateTask](#updatetask) | Update a task |
| [updateUser](#updateuser) | Update an existing user |
| [updateWatchlist](#updatewatchlist) | Update watchlist |
| [updateWidget](#updatewidget) | Updates a widget |
| [uploadEngineResult](#uploadengineresult) | Upload and store an engine result |
| [upsertSchemaDraft](#upsertschemadraft) | Update a structured data registry schema |
| [userLogin](#userlogin) | Login as a user |
| [userLogout](#userlogout) | Logout user and invalidate user token |
| [validateEngineOutput](#validateengineoutput) | Validates if an engine output conforms to the engine output guidelines |
| [validateToken](#validatetoken) | Validate a user token |
| [verifyJWT](#verifyjwt) | Verify JWT token |

#### addLibraryDataset

Add recordings to a dataset library

_**Arguments**_<br/>

`input:`

```graphql
addLibraryDataset(input: AddLibraryDataset!): LibraryDataset
```

*See also:*<br/>[AddLibraryDataset](https://api.veritone.com/v3/graphqldocs/addlibrarydataset.doc.html), [LibraryDataset](https://api.veritone.com/v3/graphqldocs/librarydataset.doc.html)

---
#### addTasksToJobs

Arguments
input:

_**Arguments**_<br/>

```graphql
addTasksToJobs(input: AddTasksToJobs): AddTasksToJobsResponse
```

*See also:*<br/>[AddTasksToJobs](https://api.veritone.com/v3/graphqldocs/addtaskstojobs.doc.html), [AddTasksToJobsResponse](https://api.veritone.com/v3/graphqldocs/addtaskstojobsresponse.doc.html)

---
#### addToEngineBlacklist

Arguments
toAdd:

_**Arguments**_<br/>

```graphql
addToEngineBlacklist(toAdd: SetEngineBlacklist!): EngineBlacklist
```

*See also:*<br/>[SetEngineBlacklist](https://api.veritone.com/v3/graphqldocs/setengineblacklist.doc.html), [EngineBlacklist](https://api.veritone.com/v3/graphqldocs/engineblacklist.doc.html)

---
#### addToEngineWhitelist

Arguments
toAdd:

_**Arguments**_<br/>

```graphql
addToEngineWhitelist(toAdd: SetEngineWhitelist!): EngineWhitelist
```

*See also:*<br/>[SetEngineWhitelist](https://api.veritone.com/v3/graphqldocs/setenginewhitelist.doc.html), [EngineWhitelist](https://api.veritone.com/v3/graphqldocs/enginewhitelist.doc.html)

---
#### applicationWorkflow

Apply an application workflow step, such as "submit" or "approve"

_**Arguments**_<br/>

`input:` Fields required to apply a application workflow step

```graphql
applicationWorkflow(input: ApplicationWorkflow): Application
```

*See also:*<br/>[ApplicationWorkflow](https://api.veritone.com/v3/graphqldocs/applicationworkflow.doc.html), [Application](https://api.veritone.com/v3/graphqldocs/application.doc.html)

---
#### bulkDeleteContextMenuExtensions

Bulk delete context meu extensions.

_**Arguments**_<br/>

`input:`

```graphql
bulkDeleteContextMenuExtensions(
  input: BulkDeleteContextMenuExtensions
): ContextMenuExtensionList
```

*See also:*<br/>[BulkDeleteContextMenuExtensions](https://api.veritone.com/v3/graphqldocs/bulkdeletecontextmenuextensions.doc.html), [ContextMenuExtensionList](https://api.veritone.com/v3/graphqldocs/contextmenuextensionlist.doc.html)

---
#### bulkUpdateWatchlist

Apply bulk updates to watchlists.
This mutation is currently available only to Veritone operations.

_**Arguments**_<br/>

`filter:` A filter indicating which watchlists should be updated.

At least one filter condition must be provided.

Only watchlists for the user's organization will be updated.

`input:` Fields used to update a watchlist.

```graphql
bulkUpdateWatchlist(
  filter: BulkUpdateWatchlistFilter!,
  input: BulkUpdateWatchlist
): WatchlistList
```

*See also:*<br/>[BulkUpdateWatchlistFilter](https://api.veritone.com/v3/graphqldocs/bulkupdatewatchlistfilter.doc.html), [BulkUpdateWatchlist](https://api.veritone.com/v3/graphqldocs/bulkupdatewatchlist.doc.html), [WatchlistList](https://api.veritone.com/v3/graphqldocs/watchlistlist.doc.html)

---
#### cancelJob

Cancel a job. This action effectively deletes the job,
although a records of job and task execution remains in
Veritone's database.

_**Arguments**_<br/>

`id:` Supply the ID of the job to delete.

```graphql
cancelJob(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### changePassword

Change the current authenticated user's password

_**Arguments**_<br/>

`input:` Fields needed to change password

```graphql
changePassword(input: ChangePassword!): User
```

*See also:*<br/>[ChangePassword](https://api.veritone.com/v3/graphqldocs/changepassword.doc.html), [User](https://api.veritone.com/v3/graphqldocs/user.doc.html)

---
#### cleanupTDO

Delete partial information from a temporal data object.
Use the delete options to control exactly which data is deleted.
The default is to delete objects from storage and the search index,
while leaving TDO-level metadata and task engine results intact.
To permanently delete the TDO, use delete TDO.

_**Arguments**_<br/>

`id:` Supply the ID of the TDO to clean up.

`options:` Supply a list of cleanup options. See [TDOCleanupOption](https://api.veritone.com/v3/graphqldocs/tdocleanupoption.doc.html)
for details. If not provided, the server will use default settings.

```graphql
cleanupTDO(id: ID!, options: [TDOCleanupOption!]): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [TDOCleanupOption](https://api.veritone.com/v3/graphqldocs/tdocleanupoption.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### createApplication

Create a new application. An application must
go through a sequence of workflow steps before
it is available in production. See the VDA documentation
for details.

_**Arguments**_<br/>

`input:` Fields needed to create a new custom application.

```graphql
createApplication(input: CreateApplication): Application
```

*See also:*<br/>[CreateApplication](https://api.veritone.com/v3/graphqldocs/createapplication.doc.html), [Application](https://api.veritone.com/v3/graphqldocs/application.doc.html)

---
#### createAsset

Create a media asset. Optionally, upload content using
multipart form POST.

_**Arguments**_<br/>

`input:` Fields needed to create an asset.

```graphql
createAsset(input: CreateAsset!): Asset
```

*See also:*<br/>[CreateAsset](https://api.veritone.com/v3/graphqldocs/createasset.doc.html), [Asset](https://api.veritone.com/v3/graphqldocs/asset.doc.html)

---
#### createCognitiveSearch

_**Arguments**_<br/>

`input:`

```graphql
createCognitiveSearch(input: CreateCognitiveSearch): CognitiveSearch
```

*See also:*<br/>[CreateCognitiveSearch](https://api.veritone.com/v3/graphqldocs/createcognitivesearch.doc.html), [CognitiveSearch](https://api.veritone.com/v3/graphqldocs/cognitivesearch.doc.html)

---
#### createCollection

Create (ingest) a structured data object

_**Arguments**_<br/>

`input:` Fields required to create new collection

```graphql
createCollection(input: CreateCollection): Collection
```

*See also:*<br/>[CreateCollection](https://api.veritone.com/v3/graphqldocs/createcollection.doc.html), [Collection](https://api.veritone.com/v3/graphqldocs/collection.doc.html)

---
#### createCollectionMention

Add a mention to a collection

_**Arguments**_<br/>

`input:` Fields needed to add a mention to a collection

```graphql
createCollectionMention(input: CollectionMentionInput): CollectionMention
```

*See also:*<br/>[CollectionMentionInput](https://api.veritone.com/v3/graphqldocs/collectionmentioninput.doc.html), [CollectionMention](https://api.veritone.com/v3/graphqldocs/collectionmention.doc.html)

---
#### createCreative

Create a creative

_**Arguments**_<br/>

`input:`

```graphql
createCreative(input: CreateCreative!): Creative!
```

*See also:*<br/>[CreateCreative](https://api.veritone.com/v3/graphqldocs/createcreative.doc.html), [Creative](https://api.veritone.com/v3/graphqldocs/creative.doc.html)

---
#### createDataRegistry

Create a structured data registry schema metadata.

_**Arguments**_<br/>

`input:`

```graphql
createDataRegistry(input: CreateDataRegistry!): DataRegistry
```

*See also:*<br/>[CreateDataRegistry](https://api.veritone.com/v3/graphqldocs/createdataregistry.doc.html), [DataRegistry](https://api.veritone.com/v3/graphqldocs/dataregistry.doc.html)

---
#### createEngine

Create a new engine. The engine will need to go
through a sequence of workflow steps before
use in production. See VDA documentation for details.

_**Arguments**_<br/>

`input:` Fields needed to create a new engine

```graphql
createEngine(input: CreateEngine): Engine
```

*See also:*<br/>[CreateEngine](https://api.veritone.com/v3/graphqldocs/createengine.doc.html), [Engine](https://api.veritone.com/v3/graphqldocs/engine.doc.html)

---
#### createEngineBuild

Create an engine build.

_**Arguments**_<br/>

`input:` Fields needed to create an engine build.

```graphql
createEngineBuild(input: CreateBuild!): Build
```

*See also:*<br/>[CreateBuild](https://api.veritone.com/v3/graphqldocs/createbuild.doc.html), [Build](https://api.veritone.com/v3/graphqldocs/build.doc.html)

---
#### createEntity

Create a new entity.

_**Arguments**_<br/>

`input:` Fields required to create a new entity.

```graphql
createEntity(input: CreateEntity!): Entity
```

*See also:*<br/>[CreateEntity](https://api.veritone.com/v3/graphqldocs/createentity.doc.html), [Entity](https://api.veritone.com/v3/graphqldocs/entity.doc.html)

---
#### createEntityIdentifier

Create an entity identifier.
This mutation accepts file uploads. To use this mutation and upload a file,
send a multipart form POST containing two parameters: `query`, with the
GraphQL query, and `file` containing the file itself.
For more information see the documentation at
https://veritone-developer.atlassian.net/wiki/spaces/DOC/pages/13893791/GraphQL.

_**Arguments**_<br/>

`input:` Fields needed to create an entity identifier.

```graphql
createEntityIdentifier(input: CreateEntityIdentifier!): EntityIdentifier
```

*See also:*<br/>[CreateEntityIdentifier](https://api.veritone.com/v3/graphqldocs/createentityidentifier.doc.html), [EntityIdentifier](https://api.veritone.com/v3/graphqldocs/entityidentifier.doc.html)

---
#### createEntityIdentifierType

Create an entity identifier type, such as "face" or "image".
Entity identifier types are typically created or modified
only by Veritone engineering. Most libraries and
entities will use existing entity identifier types.

_**Arguments**_<br/>

`input:` Fields required to create an entity identifier type.

```graphql
createEntityIdentifierType(
  input: CreateEntityIdentifierType!
): EntityIdentifierType
```

*See also:*<br/>[CreateEntityIdentifierType](https://api.veritone.com/v3/graphqldocs/createentityidentifiertype.doc.html), [EntityIdentifierType](https://api.veritone.com/v3/graphqldocs/entityidentifiertype.doc.html)

---
#### createEvent

Create a new event

_**Arguments**_<br/>

`input:`

```graphql
createEvent(input: CreateEvent!): Event!
```

*See also:*<br/>[CreateEvent](https://api.veritone.com/v3/graphqldocs/createevent.doc.html), [Event](https://api.veritone.com/v3/graphqldocs/event.doc.html)

---
#### createExportRequest

Create an export request. The requested TDO data, possibly including
TDO media and engine results, will be exported offline. 

_**Arguments**_<br/>

`input:` Input data required to create the export request

```graphql
createExportRequest(input: CreateExportRequest!): ExportRequest!
```
*See also:*<br/>[CreateExportRequest](https://api.veritone.com/v3/graphqldocs/createexportrequest.doc.html), [ExportRequest](https://api.veritone.com/v3/graphqldocs/exportrequest.doc.html)

---
#### createFolder

Create a new folder

_**Arguments**_<br/>

`input:` Fields needed to create a new folder.

```graphql
createFolder(input: CreateFolder): Folder
```

*See also:*<br/>[CreateFolder](https://api.veritone.com/v3/graphqldocs/createfolder.doc.html), [Folder](https://api.veritone.com/v3/graphqldocs/folder.doc.html)

---
#### createFolderContentTempate

Create new content template into a folder

_**Arguments**_<br/>

`input:`

```graphql
createFolderContentTempate(
  input: CreateFolderContentTempate!
): FolderContentTemplate!
```

*See also:*<br/>[CreateFolderContentTempate](https://api.veritone.com/v3/graphqldocs/createfoldercontenttempate.doc.html), [FolderContentTemplate](https://api.veritone.com/v3/graphqldocs/foldercontenttemplate.doc.html)

---
#### createIngestionConfiguration

Create an ingestion configuration

_**Arguments**_<br/>

`input:`

```graphql
createIngestionConfiguration(
  input: CreateIngestionConfiguration
): IngestionConfiguration
```

*See also:*<br/>[CreateIngestionConfiguration](https://api.veritone.com/v3/graphqldocs/createingestionconfiguration.doc.html), [IngestionConfiguration](https://api.veritone.com/v3/graphqldocs/ingestionconfiguration.doc.html)

---
#### createJob

Create a job

_**Arguments**_<br/>

`input:` Fields required to create a job.

```graphql
createJob(input: CreateJob): Job
```

*See also:*<br/>[CreateJob](https://api.veritone.com/v3/graphqldocs/createjob.doc.html), [Job](https://api.veritone.com/v3/graphqldocs/job.doc.html)

---
#### createLibrary

Create a new library.
Once the library is created, the client can add
entities and entity identifiers. Note that the
library type determines what types of entity identifiers
can be used within the library.

_**Arguments**_<br/>

`input:` Fields needed to create a new library.

```graphql
createLibrary(input: CreateLibrary!): Library
```

*See also:*<br/>[CreateLibrary](https://api.veritone.com/v3/graphqldocs/createlibrary.doc.html), [Library](https://api.veritone.com/v3/graphqldocs/library.doc.html)

---
#### createLibraryConfiguration

Create Dataset Library Configuration

_**Arguments**_<br/>

`input:` Fields required to create library configuration

```graphql
createLibraryConfiguration(
  input: CreateLibraryConfiguration!
): LibraryConfiguration
```

*See also:*<br/>[CreateLibraryConfiguration](https://api.veritone.com/v3/graphqldocs/createlibraryconfiguration.doc.html), [LibraryConfiguration](https://api.veritone.com/v3/graphqldocs/libraryconfiguration.doc.html)

---
#### createLibraryEngineModel

Create a library engine model.

_**Arguments**_<br/>

`input:` Fields required to create a library engine model.

```graphql
createLibraryEngineModel(
  input: CreateLibraryEngineModel!
): LibraryEngineModel
```

*See also:*<br/>[CreateLibraryEngineModel](https://api.veritone.com/v3/graphqldocs/createlibraryenginemodel.doc.html), [LibraryEngineModel](https://api.veritone.com/v3/graphqldocs/libraryenginemodel.doc.html)

---
#### createLibraryType

Create a library type, such as "ad" or "people".
Entity identifier types are typically created or modified
only by Veritone engineering. Most libraries
will use existing entity identifier types.

_**Arguments**_<br/>

`input:` Fields needed to create a new library type.

```graphql
createLibraryType(input: CreateLibraryType!): LibraryType
```

*See also:*<br/>[CreateLibraryType](https://api.veritone.com/v3/graphqldocs/createlibrarytype.doc.html), [LibraryType](https://api.veritone.com/v3/graphqldocs/librarytype.doc.html)

---
#### createMediaShare

Create Media Share. Returning the url of the share

_**Arguments**_<br/>

`input:`

```graphql
createMediaShare(input: CreateMediaShare!): CreatedMediaShare!
```

*See also:*<br/>[CreateMediaShare](https://api.veritone.com/v3/graphqldocs/createmediashare.doc.html), [CreatedMediaShare](https://api.veritone.com/v3/graphqldocs/createdmediashare.doc.html)

---
#### createMention

Create a mention object

_**Arguments**_<br/>

`input:`

```graphql
createMention(input: CreateMention!): Mention
```

*See also:*<br/>[CreateMention](https://api.veritone.com/v3/graphqldocs/createmention.doc.html), [Mention](https://api.veritone.com/v3/graphqldocs/mention.doc.html)

---
#### createMentionComment

Create a mention comment

_**Arguments**_<br/>

`input:` Fields needed to create a mention comment

```graphql
createMentionComment(input: CreateMentionComment): MentionComment
```

*See also:*<br/>[CreateMentionComment](https://api.veritone.com/v3/graphqldocs/creatementioncomment.doc.html), [MentionComment](https://api.veritone.com/v3/graphqldocs/mentioncomment.doc.html)

---
#### createMentionExportRequest

Create a mention export request. The requested mentionFilters including
The mention export file csv will be exported offline.

_**Arguments**_<br/>

`input:` Input data required to create the export request

```graphql
createMentionExportRequest(
  input: CreateMentionExportRequest!
): ExportRequest!
```

*See also:*<br/>[CreateMentionExportRequest](https://api.veritone.com/v3/graphqldocs/creatementionexportrequest.doc.html), [ExportRequest](https://api.veritone.com/v3/graphqldocs/exportrequest.doc.html)

---
#### createMentionRating

Create a mention rating

_**Arguments**_<br/>

`input:` Fields needed to create a mention rating

```graphql
createMentionRating(input: CreateMentionRating): MentionRating
```

*See also:*<br/>[CreateMentionRating](https://api.veritone.com/v3/graphqldocs/creatementionrating.doc.html), [MentionRating](https://api.veritone.com/v3/graphqldocs/mentionrating.doc.html)

---
#### createMentions

Create Mention in bulk. The input should be an array of createMentions

_**Arguments**_<br/>

`input:`

```graphql
createMentions(input: CreateMentions!): MentionList
```

*See also:*<br/>[CreateMentions](https://api.veritone.com/v3/graphqldocs/creatementions.doc.html), [MentionList](https://api.veritone.com/v3/graphqldocs/mentionlist.doc.html)

---
#### createOrganization

Create a new organization.

_**Arguments**_<br/>

`input:` Fields needed to create an organization.

```graphql
createOrganization(input: CreateOrganization!): Organization
```

*See also:*<br/>[CreateOrganization](https://api.veritone.com/v3/graphqldocs/createorganization.doc.html), [Organization](https://api.veritone.com/v3/graphqldocs/organization.doc.html)

---
#### createPasswordResetRequest

Create a password reset request. This mutation is used on behalf
of a user who needs to reset their password. It operates only on
the currently authenicated user (based on the authentication token provided).

_**Arguments**_<br/>

`input:`

```graphql
createPasswordResetRequest(
  input: CreatePasswordResetRequest
): CreatePasswordResetRequestPayload
```

*See also:*<br/>[CreatePasswordResetRequest](https://api.veritone.com/v3/graphqldocs/createpasswordresetrequest.doc.html), [CreatePasswordResetRequestPayload](https://api.veritone.com/v3/graphqldocs/createpasswordresetrequestpayload.doc.html)

---
#### createPasswordUpdateRequest

Force a user to update password on next login.
This mutation is used by administrators.

_**Arguments**_<br/>

`input:` Fields needed to create a password update request

```graphql
createPasswordUpdateRequest(
  input: CreatePasswordUpdateRequest
): User
```

*See also:*<br/>[CreatePasswordUpdateRequest](https://api.veritone.com/v3/graphqldocs/createpasswordupdaterequest.doc.html), [User](https://api.veritone.com/v3/graphqldocs/user.doc.html)

---
#### createProcessTemplate

Create a processTemplate in CMS

_**Arguments**_<br/>

`input:`

```graphql
createProcessTemplate(input: CreateProcessTemplate!): ProcessTemplate!
```

*See also:*<br/>[CreateProcessTemplate](https://api.veritone.com/v3/graphqldocs/createprocesstemplate.doc.html), [ProcessTemplate](https://api.veritone.com/v3/graphqldocs/processtemplate.doc.html)

---
#### createRootFolders

Create root folder for an organization

_**Arguments**_<br/>

`rootFolderType:` The type of root folder to create

```graphql
createRootFolders(rootFolderType: RootFolderType): [Folder]
```

*See also:*<br/>[RootFolderType](https://api.veritone.com/v3/graphqldocs/rootfoldertype.doc.html), [Folder](https://api.veritone.com/v3/graphqldocs/folder.doc.html)

---
#### createSavedSearch

Create a new Saved Search

_**Arguments**_<br/>

`input:`

```graphql
createSavedSearch(input: CreateSavedSearch!): SavedSearch!
```

*See also:*<br/>[CreateSavedSearch](https://api.veritone.com/v3/graphqldocs/createsavedsearch.doc.html), [SavedSearch](https://api.veritone.com/v3/graphqldocs/savedsearch.doc.html)

---
#### createStructuredData

Create (ingest) a structured data object

_**Arguments**_<br/>

`input:`

```graphql
createStructuredData(input: CreateStructuredData!): StructuredData
```

*See also:*<br/>[CreateStructuredData](https://api.veritone.com/v3/graphqldocs/createstructureddata.doc.html), [StructuredData](https://api.veritone.com/v3/graphqldocs/structureddata.doc.html)

---
#### createSubscription

_**Arguments**_<br/>

`input:`

```graphql
createSubscription(input: CreateSubscription!): Subscription
```

*See also:*<br/>[CreateSubscription](https://api.veritone.com/v3/graphqldocs/createsubscription.doc.html), [Subscription](https://api.veritone.com/v3/graphqldocs/subscription.doc.html)

---
#### createTDO

Create a new temporal data object

_**Arguments**_<br/>

`input:` Fields required to create a TDO

```graphql
createTDO(input: CreateTDO): TemporalDataObject
```

*See also:*<br/>[CreateTDO](https://api.veritone.com/v3/graphqldocs/createtdo.doc.html), [TemporalDataObject](https://api.veritone.com/v3/graphqldocs/temporaldataobject.doc.html)

---
#### createTDOWithAsset

Create a TDO and an asset with a single call

_**Arguments**_<br/>

`input:` Input fields necessary to create the TDO and asset

```graphql
createTDOWithAsset(input: CreateTDOWithAsset): TemporalDataObject
```

*See also:*<br/>[CreateTDOWithAsset](https://api.veritone.com/v3/graphqldocs/createtdowithasset.doc.html), [TemporalDataObject](https://api.veritone.com/v3/graphqldocs/temporaldataobject.doc.html)

---
#### createTaskLog

Create a task log by using
multipart form POST.

_**Arguments**_<br/>

`input:` Fields needed to create a task log.

```graphql
createTaskLog(input: CreateTaskLog!): TaskLog
```

*See also:*<br/>[CreateTaskLog](https://api.veritone.com/v3/graphqldocs/createtasklog.doc.html), [TaskLog](https://api.veritone.com/v3/graphqldocs/tasklog.doc.html)

---
#### createTriggers

Create trigger for events or types.

_**Arguments**_<br/>

`input:`

```graphql
createTriggers(input: CreateTriggers!): [Trigger]
```

*See also:*<br/>[CreateTriggers](https://api.veritone.com/v3/graphqldocs/createtriggers.doc.html), [Trigger](https://api.veritone.com/v3/graphqldocs/trigger.doc.html)

---
#### createUser

Create a new user within an organization.

_**Arguments**_<br/>

`input:` Fields needed to create a user.

```graphql
createUser(input: CreateUser): User
```

*See also:*<br/>[CreateUser](https://api.veritone.com/v3/graphqldocs/createuser.doc.html), [User](https://api.veritone.com/v3/graphqldocs/user.doc.html)

---
#### createWatchlist

_**Arguments**_<br/>

`input:`

```graphql
createWatchlist(input: CreateWatchlist!): Watchlist
```

*See also:*<br/>[CreateWatchlist](https://api.veritone.com/v3/graphqldocs/createwatchlist.doc.html), [Watchlist](https://api.veritone.com/v3/graphqldocs/watchlist.doc.html)

---
#### createWidget

Creates a widget associated with a collection

_**Arguments**_<br/>

`input:` Fields needed to create a new widget

```graphql
createWidget(input: CreateWidget): Widget
```

*See also:*<br/>[CreateWidget](https://api.veritone.com/v3/graphqldocs/createwidget.doc.html), [Widget](https://api.veritone.com/v3/graphqldocs/widget.doc.html)

---
#### deleteApplication

Delete an application

_**Arguments**_<br/>

`id:` Supply the ID of the application to delete.

```graphql
deleteApplication(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteAsset

Delete an asset

_**Arguments**_<br/>

`id:` Provide the ID of the asset to delete.

```graphql
deleteAsset(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteCognitiveSearch

_**Arguments**_<br/>

`id:`

```graphql
deleteCognitiveSearch(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteCollection

Delete Collection

_**Arguments**_<br/>

`folderId:` @deprecated(`reason:` "folderId has been renamed to id.
Use id.")

`id:` Supply the ID of the folder or collection to delete

```graphql
deleteCollection(folderId: ID, id: ID): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteCollectionMention

Remove a mention from a collection

_**Arguments**_<br/>

`input:` Fields needed to delete a mention from a collection

```graphql
deleteCollectionMention(input: CollectionMentionInput): CollectionMention
```

*See also:*<br/>[CollectionMentionInput](https://api.veritone.com/v3/graphqldocs/collectionmentioninput.doc.html), [CollectionMention](https://api.veritone.com/v3/graphqldocs/collectionmention.doc.html)

---
#### deleteCreative

Delete a creative

_**Arguments**_<br/>

`id:`

```graphql
deleteCreative(id: ID!): DeletePayload!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteEngine

Delete an engine

_**Arguments**_<br/>

`id:` Provide the ID of the engine to delete

```graphql
deleteEngine(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteEngineBuild

Delete an engine build

_**Arguments**_<br/>

`input:` Fields needed to delete an engine build.

```graphql
deleteEngineBuild(input: DeleteBuild!): DeletePayload
```

*See also:*<br/>[DeleteBuild](https://api.veritone.com/v3/graphqldocs/deletebuild.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteEntity

Delete an entity. This mutation will also delete all associated
entity identifiers and associated objects.

_**Arguments**_<br/>

`id:` Supply the ID of the entity to delete.

```graphql
deleteEntity(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteEntityIdentifier

Delete an entity identifier

_**Arguments**_<br/>

`id:` Supply the ID of the entity identifier to delete.

```graphql
deleteEntityIdentifier(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteFolder

Delete a folder

_**Arguments**_<br/>

`input:` Fields needed to delete a folder

```graphql
deleteFolder(input: DeleteFolder): DeletePayload
```

*See also:*<br/>[DeleteFolder](https://api.veritone.com/v3/graphqldocs/deletefolder.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteFolderContentTempate

Delete existing folder content template by folderContentTemplateId

_**Arguments**_<br/>

`id:` Folder Content Template Id

```graphql
deleteFolderContentTempate(id: ID!): DeletePayload!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteFromEngineBlacklist

_**Arguments**_<br/>

`toDelete:`

```graphql
deleteFromEngineBlacklist(
  toDelete: SetEngineBlacklist!
): EngineBlacklist
```

*See also:*<br/>[SetEngineBlacklist](https://api.veritone.com/v3/graphqldocs/setengineblacklist.doc.html), [EngineBlacklist](https://api.veritone.com/v3/graphqldocs/engineblacklist.doc.html)

---
#### deleteFromEngineWhitelist

_**Arguments**_<br/>

`toDelete:`

```graphql
deleteFromEngineWhitelist(
  toDelete: SetEngineBlacklist!
): EngineWhitelist
```

*See also:*<br/>[SetEngineBlacklist](https://api.veritone.com/v3/graphqldocs/setengineblacklist.doc.html), [EngineWhitelist](https://api.veritone.com/v3/graphqldocs/enginewhitelist.doc.html)

---
#### deleteIngestionConfiguration

Delete an ingestion configuration

_**Arguments**_<br/>

`id:` ID of the ingestion configuration to delete

```graphql
deleteIngestionConfiguration(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteLibrary

Delete a library. This mutation will also delete all entities,
entity identifiers, library engine models, and associated objects.

_**Arguments**_<br/>

`id:` Provide the ID of the library to delete.

```graphql
deleteLibrary(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteLibraryConfiguration

Delete Dataset Library Configuration

_**Arguments**_<br/>

`id:` Supply configuration ID to delete.

```graphql
deleteLibraryConfiguration(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteLibraryDataset

Remove recordings from a dataset library

_**Arguments**_<br/>

`input:`

```graphql
deleteLibraryDataset(input: DeleteLibraryDataset!): DeleteLibraryDatasetPayload
```

*See also:*<br/>[DeleteLibraryDataset](https://api.veritone.com/v3/graphqldocs/deletelibrarydataset.doc.html), [DeleteLibraryDatasetPayload](https://api.veritone.com/v3/graphqldocs/deletelibrarydatasetpayload.doc.html)

---
#### deleteLibraryEngineModel

Delete a library engine model

_**Arguments**_<br/>

`id:` Supply the ID of the library engine model to delete.

```graphql
deleteLibraryEngineModel(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteMentionComment

Delete a mention comment

_**Arguments**_<br/>

`input:` Fields needed to delete a mention comment

```graphql
deleteMentionComment(input: DeleteMentionComment): DeletePayload
```

*See also:*<br/>[DeleteMentionComment](https://api.veritone.com/v3/graphqldocs/deletementioncomment.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteMentionRating

Delete a mention rating

_**Arguments**_<br/>

`input:` Fields needed to delete a mention rating.

```graphql
deleteMentionRating(input: DeleteMentionRating): DeletePayload
```

*See also:*<br/>[DeleteMentionRating](https://api.veritone.com/v3/graphqldocs/deletementionrating.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteSavedSearch

Delete a saved search

_**Arguments**_<br/>

`id:`

```graphql
deleteSavedSearch(id: ID!): DeletePayload!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteStructuredData

Delete a structured data object

_**Arguments**_<br/>

`input:`

```graphql
deleteStructuredData(input: DeleteStructuredData!): DeletePayload
```

*See also:*<br/>[DeleteStructuredData](https://api.veritone.com/v3/graphqldocs/deletestructureddata.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteSubscription

_**Arguments**_<br/>

`id:`

```graphql
deleteSubscription(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteTDO

Delete a temporal data object. The TDO metadata, its assets and
all storage objects, and search index data are deleted.
Engine results stored in related task objects are not.
cleanupTDO can be used to selectively delete certain data on the TDO.

_**Arguments**_<br/>

`id:` Supply the ID of the TDO to delete

```graphql
deleteTDO(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteTrigger

Delete a registed trigger by ID.

_**Arguments**_<br/>

`id:`

```graphql
deleteTrigger(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteUser

Delete a user

_**Arguments**_<br/>

`id:` Supply the ID of the user to delete.

```graphql
deleteUser(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### deleteWatchlist

_**Arguments**_<br/>

`id:`

```graphql
deleteWatchlist(id: ID!): DeletePayload
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DeletePayload](https://api.veritone.com/v3/graphqldocs/deletepayload.doc.html)

---
#### emitEvent

Emit an event

_**Arguments**_<br/>

`input:`

```graphql
emitEvent(input: EmitEvent!): EmitEventResponse!
```

*See also:*<br/>[EmitEvent](https://api.veritone.com/v3/graphqldocs/emitevent.doc.html), [EmitEventResponse](https://api.veritone.com/v3/graphqldocs/emiteventresponse.doc.html)

---
#### emitSystemEvent

Emit a system-level emit. This mutation is used only by
Veritone platform components.

_**Arguments**_<br/>

`input:` Data required to create the event

```graphql
emitSystemEvent(input: EmitSystemEvent!): SystemEventInfo!
}
```

*See also:*<br/>[EmitSystemEvent](https://api.veritone.com/v3/graphqldocs/emitsystemevent.doc.html), [SystemEventInfo](https://api.veritone.com/v3/graphqldocs/systemeventinfo.doc.html)

---
#### engineWorkflow

Apply an application workflow step, such as "submit" or "approve"

_**Arguments**_<br/>

`input:` Fields required to apply a engine workflow step

```graphql
engineWorkflow(input: EngineWorkflow): Engine
```

*See also:*<br/>[EngineWorkflow](https://api.veritone.com/v3/graphqldocs/engineworkflow.doc.html), [Engine](https://api.veritone.com/v3/graphqldocs/engine.doc.html)

---
#### fileTemporalDataObject

File a TemporalDataObject in a folder. A given TemporalDataObject can
be filed in any number of folders, or none. Filing causes the TemporalDataObject
and its assets to be visible within the folder.

_**Arguments**_<br/>

`input:` The fields needed to file a TemporalDataObject in a
folder

```graphql
fileTemporalDataObject(input: FileTemporalDataObject!): TemporalDataObject
```

*See also:*<br/>[FileTemporalDataObject](https://api.veritone.com/v3/graphqldocs/filetemporaldataobject.doc.html), [TemporalDataObject](https://api.veritone.com/v3/graphqldocs/temporaldataobject.doc.html)

---
#### fileWatchlist

_**Arguments**_<br/>

`input:`

```graphql
fileWatchlist(input: FileWatchlist!): Watchlist
```

*See also:*<br/>[FileWatchlist](https://api.veritone.com/v3/graphqldocs/filewatchlist.doc.html), [Watchlist](https://api.veritone.com/v3/graphqldocs/watchlist.doc.html)

---
#### getCurrentUserPasswordToken

Get password token info for current user

_**Arguments**_<br/>

`input:`

```graphql
getCurrentUserPasswordToken(
  input: GetCurrentUserPasswordToken!
): PasswordTokenInfo!
```

*See also:*<br/>[GetCurrentUserPasswordToken](https://api.veritone.com/v3/graphqldocs/getcurrentuserpasswordtoken.doc.html), [PasswordTokenInfo](https://api.veritone.com/v3/graphqldocs/passwordtokeninfo.doc.html)

---
#### getEngineJWT

JWT tokens with a more limited scoped token to specific
resources to the recording, task, and job
and also has no organization association.

_**Arguments**_<br/>

`input:`

```graphql
getEngineJWT(input: getEngineJWT!): JWTTokenInfo!
```

*See also:*<br/>[getEngineJWT](https://api.veritone.com/v3/graphqldocs/getenginejwt.doc.html), [JWTTokenInfo](https://api.veritone.com/v3/graphqldocs/jwttokeninfo.doc.html)

---
#### moveFolder

Move a folder from one parent folder to another.

_**Arguments**_<br/>

`input:` Fields needed to move a folder

```graphql
moveFolder(input: MoveFolder): Folder
```

*See also:*<br/>[MoveFolder](https://api.veritone.com/v3/graphqldocs/movefolder.doc.html), [Folder](https://api.veritone.com/v3/graphqldocs/folder.doc.html)

---
#### moveTemporalDataObject

Moves a TemporalDataObject from one parent folder to another.
Any other folders the TemporalDataObject is filed in are unaffected.

_**Arguments**_<br/>

`input:` Fields need to move a TemporalDataObject

```graphql
moveTemporalDataObject(input: MoveTemporalDataObject!): TemporalDataObject
```

*See also:*<br/>[MoveTemporalDataObject](https://api.veritone.com/v3/graphqldocs/movetemporaldataobject.doc.html), [TemporalDataObject](https://api.veritone.com/v3/graphqldocs/temporaldataobject.doc.html)

---
#### pollTask

Poll a task

_**Arguments**_<br/>

`input:` Fields required to poll a task.

```graphql
pollTask(input: PollTask): Task
```

*See also:*<br/>[PollTask](https://api.veritone.com/v3/graphqldocs/polltask.doc.html), [Task](https://api.veritone.com/v3/graphqldocs/task.doc.html)

---
#### publishLibrary

Publish a new version of a library.
Increments library version by one and trains compatible engines.

_**Arguments**_<br/>

`id:` ID of the library to publish

```graphql
publishLibrary(id: ID!): Library
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Library](https://api.veritone.com/v3/graphqldocs/library.doc.html)

---
#### refreshToken

Refresh a user token, returning a fresh token so that the client
can continue to authenticate to the API.

_**Arguments**_<br/>

`token:`

```graphql
refreshToken(token: String!): LoginInfo
```

*See also:*<br/>[String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [LoginInfo](https://api.veritone.com/v3/graphqldocs/logininfo.doc.html)

---
#### replaceSavedSearch

Mark existing saved search profile as deleted
Create new saved search profile

_**Arguments**_<br/>

`input:`

```graphql
replaceSavedSearch(input: ReplaceSavedSearch!): SavedSearch!
```

*See also:*<br/>[ReplaceSavedSearch](https://api.veritone.com/v3/graphqldocs/replacesavedsearch.doc.html), [SavedSearch](https://api.veritone.com/v3/graphqldocs/savedsearch.doc.html)

---
#### requestClone

Start a clone job. A clone creates a new TDO
that links back to an existing TDO's assets
instead of creating new ones and is used
primarily to handle sample media.

_**Arguments**_<br/>

`input:` Fields needed to request a new clone job.

```graphql
requestClone(input: RequestClone): CloneRequest
```

*See also:*<br/>[RequestClone](https://api.veritone.com/v3/graphqldocs/requestclone.doc.html), [CloneRequest](https://api.veritone.com/v3/graphqldocs/clonerequest.doc.html)

---
#### retryJob

Retry a job. This action applies only to jobs
that are in a failure state. The task sequence
for the job will be restarted in its original
configuration.

_**Arguments**_<br/>

`id:` Supply the ID of the job to retry.

```graphql
retryJob(id: ID!): Job
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Job](https://api.veritone.com/v3/graphqldocs/job.doc.html)

---
#### sendEmail

Send a basic email. Mutation returns true for a success message.

_**Arguments**_<br/>

`input:`

```graphql
sendEmail(input: SendEmail!): Boolean!
```

*See also:*<br/>[SendEmail](https://api.veritone.com/v3/graphqldocs/sendemail.doc.html), [Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html)

---
#### setWorkflowRuntimeStorageData

Create or Update Workflow data.

_**Arguments**_<br/>

`workflowRuntimeId:`

`input:`

```graphql
setWorkflowRuntimeStorageData(
  workflowRuntimeId: ID!,
  input: CreateWorkflowRuntimeStorageData!
): WorkflowRuntimeStorageData!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [CreateWorkflowRuntimeStorageData](https://api.veritone.com/v3/graphqldocs/createworkflowruntimestoragedata.doc.html), [WorkflowRuntimeStorageData](https://api.veritone.com/v3/graphqldocs/workflowruntimestoragedata.doc.html)

---
#### shareCollection

Share a collection, allowing other organizations to view the data
it contains.

_**Arguments**_<br/>

`input:` Fields needed to share a collection

```graphql
shareCollection(input: ShareCollection): Share
```

*See also:*<br/>[ShareCollection](https://api.veritone.com/v3/graphqldocs/sharecollection.doc.html), [Share](https://api.veritone.com/v3/graphqldocs/share.doc.html)

---
#### shareFolder

Share a folder with other organizations

_**Arguments**_<br/>

`input:`

```graphql
shareFolder(input: ShareFolderInput): Folder
```

*See also:*<br/>[ShareFolderInput](https://api.veritone.com/v3/graphqldocs/sharefolderinput.doc.html), [Folder](https://api.veritone.com/v3/graphqldocs/folder.doc.html)

---
#### shareMention

Share mention

_**Arguments**_<br/>

`input:`

```graphql
shareMention(input: ShareMention): Share
```

*See also:*<br/>[ShareMention](https://api.veritone.com/v3/graphqldocs/sharemention.doc.html), [Share](https://api.veritone.com/v3/graphqldocs/share.doc.html)

---
#### shareMentionFromCollection

Share a mention from a collection

_**Arguments**_<br/>

`input:` Fields needed to share a mention

```graphql
shareMentionFromCollection(
  input: ShareMentionFromCollection
): Share
```

*See also:*<br/>[ShareMentionFromCollection](https://api.veritone.com/v3/graphqldocs/sharementionfromcollection.doc.html), [Share](https://api.veritone.com/v3/graphqldocs/share.doc.html)

---
#### shareMentionInBulk

Share mentions in bulk

_**Arguments**_<br/>

`input:`

```graphql
shareMentionInBulk(input: ShareMentionInBulk): [Share]
```

*See also:*<br/>[ShareMentionInBulk](https://api.veritone.com/v3/graphqldocs/sharementioninbulk.doc.html), [Share](https://api.veritone.com/v3/graphqldocs/share.doc.html)

---
#### startWorkflowRuntime

Start a Veritone Workflow instance

_**Arguments**_<br/>

`workflowRuntimeId:`

`orgId:`

`generateAuthToken:`

```graphql
startWorkflowRuntime(
  workflowRuntimeId: ID!,
  orgId: ID!,
  generateAuthToken: Boolean
): WorkflowRuntimeResponse!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html), [WorkflowRuntimeResponse](https://api.veritone.com/v3/graphqldocs/workflowruntimeresponse.doc.html)

---
#### stopWorkflowRuntime

Shut down Veritone Workflow instance

_**Arguments**_<br/>

`workflowRuntimeId:`

```graphql
stopWorkflowRuntime(workflowRuntimeId: ID!): WorkflowRuntimeResponse!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [WorkflowRuntimeResponse](https://api.veritone.com/v3/graphqldocs/workflowruntimeresponse.doc.html)

---
#### subscribeEvent

Subscribe to an event

_**Arguments**_<br/>

`input:`

```graphql
subscribeEvent(input: SubscribeEvent!): ID!
```

*See also:*<br/>[SubscribeEvent](https://api.veritone.com/v3/graphqldocs/subscribeevent.doc.html), [ID](https://api.veritone.com/v3/graphqldocs/id.doc.html)

---
#### unfileTemporalDataObject

Unfile a TemporalDataObject from a folder. This causes the TemporalDataObject
and its assets to disappear from the folder, but does not otherwise affect
either the TDO or the folder and does not change access controls.

_**Arguments**_<br/>

`input:` The fields needed to file a TemporalDataObject in a
folder

```graphql
unfileTemporalDataObject(
  input: UnfileTemporalDataObject!
): TemporalDataObject
```

*See also:*<br/>[UnfileTemporalDataObject](https://api.veritone.com/v3/graphqldocs/unfiletemporaldataobject.doc.html), [TemporalDataObject](https://api.veritone.com/v3/graphqldocs/temporaldataobject.doc.html)

---
#### unfileWatchlist

_**Arguments**_<br/>

`input:`

```graphql
unfileWatchlist(input: UnfileWatchlist!): Watchlist
```

*See also:*<br/>[UnfileWatchlist](https://api.veritone.com/v3/graphqldocs/unfilewatchlist.doc.html), [Watchlist](https://api.veritone.com/v3/graphqldocs/watchlist.doc.html)

---
#### unsubscribeEvent

Unsubscribe to an event

_**Arguments**_<br/>

`id:`

```graphql
unsubscribeEvent(id: ID!): UnsubscribeEvent!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [UnsubscribeEvent](https://api.veritone.com/v3/graphqldocs/unsubscribeevent.doc.html)

---
#### updateApplication

Update a custom application. Applications are subject to
specific workflows. The current application state determines
what updates can be made to it. See VDA documentation for details.

_**Arguments**_<br/>

`input:` Fields required to update a custom application.

```graphql
updateApplication(input: UpdateApplication): Application
```

*See also:*<br/>[UpdateApplication](https://api.veritone.com/v3/graphqldocs/updateapplication.doc.html), [Application](https://api.veritone.com/v3/graphqldocs/application.doc.html)

---
#### updateAsset

Update an asset

_**Arguments**_<br/>

`input:` Fields needed to update an asset.

```graphql
updateAsset(input: UpdateAsset!): Asset
```

*See also:*<br/>[UpdateAsset](https://api.veritone.com/v3/graphqldocs/updateasset.doc.html), [Asset](https://api.veritone.com/v3/graphqldocs/asset.doc.html)

---
#### updateCognitiveSearch

_**Arguments**_<br/>

`input:'`

```graphql
updateCognitiveSearch(input: UpdateCognitiveSearch): CognitiveSearch
```

*See also:*<br/>[UpdateCognitiveSearch](https://api.veritone.com/v3/graphqldocs/updatecognitivesearch.doc.html), [CognitiveSearch](https://api.veritone.com/v3/graphqldocs/cognitivesearch.doc.html)

---
#### updateCollection

Update a collection

_**Arguments**_<br/>

`input:` Fields needed to update a collection

```graphql
updateCollection(input: UpdateCollection): Collection
```

*See also:*<br/>[UpdateCollection](https://api.veritone.com/v3/graphqldocs/updatecollection.doc.html), [Collection](https://api.veritone.com/v3/graphqldocs/collection.doc.html)

---
#### updateCreative

Update a creative

_**Arguments**_<br/>

`input:`

```graphql
updateCreative(input: UpdateCreative!): Creative!
```

*See also:*<br/>[UpdateCreative](https://api.veritone.com/v3/graphqldocs/updatecreative.doc.html), [Creative](https://api.veritone.com/v3/graphqldocs/creative.doc.html)

---
#### updateCurrentUser

Update the current authenticated user

_**Arguments**_<br/>

`input:`

```graphql
updateCurrentUser(input: UpdateCurrentUser!): User!
```

*See also:*<br/>[UpdateCurrentUser](https://api.veritone.com/v3/graphqldocs/updatecurrentuser.doc.html), [User](https://api.veritone.com/v3/graphqldocs/user.doc.html)

---
#### updateDataRegistry

Update a structured data registry schema metadata.

_**Arguments**_<br/>

`input:`

```graphql
updateDataRegistry(input: UpdateDataRegistry!): DataRegistry
```

*See also:*<br/>[UpdateDataRegistry](https://api.veritone.com/v3/graphqldocs/updatedataregistry.doc.html), [DataRegistry](https://api.veritone.com/v3/graphqldocs/dataregistry.doc.html)

---
#### updateEngine

Update an engine. Engines are subject to specific
workflow steps. An engine's state determines what
updates can be made to it. See VDA documentation for
details.

_**Arguments**_<br/>

`input:` Fields needed to update an engine

```graphql
updateEngine(input: UpdateEngine): Engine
```

*See also:*<br/>[UpdateEngine](https://api.veritone.com/v3/graphqldocs/updateengine.doc.html), [Engine](https://api.veritone.com/v3/graphqldocs/engine.doc.html)

---
#### updateEngineBuild

Update an engine build. Engine builds are subject to
specific workflow steps. A build's state determines what
updates can be made to it. See VDA documentation for details.

_**Arguments**_<br/>

`input:` Fields needed to update an engine build.

```graphql
updateEngineBuild(input: UpdateBuild!): Build
```

*See also:*<br/>[UpdateBuild](https://api.veritone.com/v3/graphqldocs/updatebuild.doc.html), [Build](https://api.veritone.com/v3/graphqldocs/build.doc.html)

---
#### updateEntity

Update an entity.

_**Arguments**_<br/>

`input:` Fields required to update an entity.

```graphql
updateEntity(input: UpdateEntity!): Entity
```

*See also:*<br/>[UpdateEntity](https://api.veritone.com/v3/graphqldocs/updateentity.doc.html), [Entity](https://api.veritone.com/v3/graphqldocs/entity.doc.html)

---
#### updateEntityIdentifier

_**Arguments**_<br/>

`input:` Fields required to update an entity identifier.`

```graphql
updateEntityIdentifier(input: UpdateEntityIdentifier!): EntityIdentifier
```

*See also:*<br/>[UpdateEntityIdentifier](https://api.veritone.com/v3/graphqldocs/updateentityidentifier.doc.html), [EntityIdentifier](https://api.veritone.com/v3/graphqldocs/entityidentifier.doc.html)

---
#### updateEntityIdentifierType

Update an entity identifier type.

_**Arguments**_<br/>

`input:` Fields required to update an entity identifier type.

```graphql
updateEntityIdentifierType(
  input: UpdateEntityIdentifierType!
): EntityIdentifierType
```

*See also:*<br/>[UpdateEntityIdentifierType](https://api.veritone.com/v3/graphqldocs/updateentityidentifiertype.doc.html), [EntityIdentifierType](https://api.veritone.com/v3/graphqldocs/entityidentifiertype.doc.html)

---
#### updateEvent

Update an event

_**Arguments**_<br/>

`input:`

```graphql
updateEvent(input: UpdateEvent!): Event!
```

*See also:*<br/>[UpdateEvent](https://api.veritone.com/v3/graphqldocs/updateevent.doc.html), [Event](https://api.veritone.com/v3/graphqldocs/event.doc.html)

---
#### updateExportRequest

Update an export request

_**Arguments**_<br/>

`input:` Input data required to update an export request

```graphql
updateExportRequest(input: UpdateExportRequest!): ExportRequest!
```

*See also:*<br/>[UpdateExportRequest](https://api.veritone.com/v3/graphqldocs/updateexportrequest.doc.html), [ExportRequest](https://api.veritone.com/v3/graphqldocs/exportrequest.doc.html)

---
#### updateFolder

Update an existing folder

_**Arguments**_<br/>

`input:` Fields needed to update a folder.

```graphql
updateFolder(input: UpdateFolder): Folder
```

*See also:*<br/>[UpdateFolder](https://api.veritone.com/v3/graphqldocs/updatefolder.doc.html), [Folder](https://api.veritone.com/v3/graphqldocs/folder.doc.html)

---
#### updateFolderContentTempate

Update existing content template by folderContentTemplateId

_**Arguments**_<br/>

`input:`

```graphql
updateFolderContentTempate(
  input: UpdateFolderContentTempate!
): FolderContentTemplate!
```

*See also:*<br/>[UpdateFolderContentTempate](https://api.veritone.com/v3/graphqldocs/updatefoldercontenttempate.doc.html), [FolderContentTemplate](https://api.veritone.com/v3/graphqldocs/foldercontenttemplate.doc.html)

---
#### updateIngestionConfiguration

Update an ingestion configuration

_**Arguments**_<br/>

`input:`

```graphql
updateIngestionConfiguration(
  input: UpdateIngestionConfiguration
): IngestionConfiguration
```

*See also:*<br/>[UpdateIngestionConfiguration](https://api.veritone.com/v3/graphqldocs/updateingestionconfiguration.doc.html), [IngestionConfiguration](https://api.veritone.com/v3/graphqldocs/ingestionconfiguration.doc.html)

---
#### updateJobs

_**Arguments**_<br/>

`input:`

```graphql
updateJobs(input: UpdateJobs!): JobList
```

*See also:*<br/>[UpdateJobs](https://api.veritone.com/v3/graphqldocs/updatejobs.doc.html), [JobList](https://api.veritone.com/v3/graphqldocs/joblist.doc.html)

---
#### updateLibrary

Update an existing library.

_**Arguments**_<br/>

`input:` Fields needed to update a library

```graphql
updateLibrary(input: UpdateLibrary!): Library
```

*See also:*<br/>[UpdateLibrary](https://api.veritone.com/v3/graphqldocs/updatelibrary.doc.html), [Library](https://api.veritone.com/v3/graphqldocs/library.doc.html)

---
#### updateLibraryConfiguration

Update Dataset Library Configuration

_**Arguments**_<br/>

`input:` Fields required to create library configuration

```graphql
updateLibraryConfiguration(
  input: UpdateLibraryConfiguration!
): LibraryConfiguration
```

*See also:*<br/>[UpdateLibraryConfiguration](https://api.veritone.com/v3/graphqldocs/updatelibraryconfiguration.doc.html), [LibraryConfiguration](https://api.veritone.com/v3/graphqldocs/libraryconfiguration.doc.html)

---
#### updateLibraryEngineModel

Update a library engine model

_**Arguments**_<br/>

`input:` Fields required to update a library engine model

```graphql
updateLibraryEngineModel(
  input: UpdateLibraryEngineModel!
): LibraryEngineModel
```

*See also:*<br/>[UpdateLibraryEngineModel](https://api.veritone.com/v3/graphqldocs/updatelibraryenginemodel.doc.html), [LibraryEngineModel](https://api.veritone.com/v3/graphqldocs/libraryenginemodel.doc.html)

---
#### updateLibraryType

Update a library type.

_**Arguments**_<br/>

`input:` Fields needed to update a library type.

```graphql
updateLibraryType(input: UpdateLibraryType!): LibraryType
```

*See also:*<br/>[UpdateLibraryType](https://api.veritone.com/v3/graphqldocs/updatelibrarytype.doc.html), [LibraryType](https://api.veritone.com/v3/graphqldocs/librarytype.doc.html)

---
#### updateMention

Update a mention object

_**Arguments**_<br/>

`input:`

```graphql
updateMention(input: UpdateMention!): Mention
```

*See also:*<br/>[UpdateMention](https://api.veritone.com/v3/graphqldocs/updatemention.doc.html), [Mention](https://api.veritone.com/v3/graphqldocs/mention.doc.html)

---
#### updateMentionComment

Update a mention comment

_**Arguments**_<br/>

`input:` Fields needed to update a mention comment

```graphql
updateMentionComment(input: UpdateMentionComment): MentionComment
```

*See also:*<br/>[UpdateMentionComment](https://api.veritone.com/v3/graphqldocs/updatementioncomment.doc.html), [MentionComment](https://api.veritone.com/v3/graphqldocs/mentioncomment.doc.html)

---
#### updateMentionExportRequest

Update status or assetURI of a mentionExportRequest
Often use when the file export was completed or downloaded

_**Arguments**_<br/>

`input:`

```graphql
updateMentionExportRequest(
  input: UpdateMentionExportRequest!
): ExportRequest!
```

*See also:*<br/>[UpdateMentionExportRequest](https://api.veritone.com/v3/graphqldocs/updatementionexportrequest.doc.html), [ExportRequest](https://api.veritone.com/v3/graphqldocs/exportrequest.doc.html)

---
#### updateMentionRating

Update a mention rating

_**Arguments**_<br/>

`input:` Fields needed to update a mention rating

```graphql
updateMentionRating(input: UpdateMentionRating): MentionRating
```

*See also:*<br/>[UpdateMentionRating](https://api.veritone.com/v3/graphqldocs/updatementionrating.doc.html), [MentionRating](https://api.veritone.com/v3/graphqldocs/mentionrating.doc.html)

---
#### updateMentions

Update a set of mentions

_**Arguments**_<br/>

`input:`

```graphql
updateMentions(input: UpdateMentions!): [Mention]
```

*See also:*<br/>[UpdateMentions](https://api.veritone.com/v3/graphqldocs/updatementions.doc.html), [Mention](https://api.veritone.com/v3/graphqldocs/mention.doc.html)

---
#### updateOrganization

Update an organization

_**Arguments**_<br/>

`input:` Fields required to update an organization.

```graphql
updateOrganization(input: UpdateOrganization!): Organization
```

*See also:*<br/>[UpdateOrganization](https://api.veritone.com/v3/graphqldocs/updateorganization.doc.html), [Organization](https://api.veritone.com/v3/graphqldocs/organization.doc.html)

---
#### updateProcessTemplate

Update a processTemplate by ID in CMS

_**Arguments**_<br/>

`input:`

```graphql
updateProcessTemplate(input: UpdateProcessTemplate!): ProcessTemplate!
```

*See also:*<br/>[UpdateProcessTemplate](https://api.veritone.com/v3/graphqldocs/updateprocesstemplate.doc.html), [ProcessTemplate](https://api.veritone.com/v3/graphqldocs/processtemplate.doc.html)

---
#### updateSchemaState

_**Arguments**_<br/>

`input:`

```graphql
updateSchemaState(input: UpdateSchemaState!): Schema
```

*See also:*<br/>[UpdateSchemaState](https://api.veritone.com/v3/graphqldocs/updateschemastate.doc.html), [Schema](https://api.veritone.com/v3/graphqldocs/schema.doc.html)

---
#### updateSubscription

_**Arguments**_<br/>

`input:`

```graphql
updateSubscription(input: UpdateSubscription!): Subscription
```

*See also:*<br/>[UpdateSubscription](https://api.veritone.com/v3/graphqldocs/updatesubscription.doc.html), [Subscription](https://api.veritone.com/v3/graphqldocs/subscription.doc.html)

---
#### updateTDO

Update a temporal data object

_**Arguments**_<br/>

`input:` Fields required to update a TDO

```graphql
updateTDO(input: UpdateTDO): TemporalDataObject
```

*See also:*<br/>[UpdateTDO](https://api.veritone.com/v3/graphqldocs/updatetdo.doc.html), [TemporalDataObject](https://api.veritone.com/v3/graphqldocs/temporaldataobject.doc.html)

---
#### updateTask

Update a task

_**Arguments**_<br/>

`input:` Fields required to update a task.

```graphql
updateTask(input: UpdateTask): Task
```

*See also:*<br/>[UpdateTask](https://api.veritone.com/v3/graphqldocs/updatetask.doc.html), [Task](https://api.veritone.com/v3/graphqldocs/task.doc.html)

---
#### updateUser

Update an existing user

_**Arguments**_<br/>

`input:` Fields needed to update a user

```graphql
updateUser(input: UpdateUser): User
```

*See also:*<br/>[UpdateUser](https://api.veritone.com/v3/graphqldocs/updateuser.doc.html), [User](https://api.veritone.com/v3/graphqldocs/user.doc.html)

---
#### updateWatchlist

_**Arguments**_<br/>

`input:`

```graphql
updateWatchlist(input: UpdateWatchlist!): Watchlist
```

*See also:*<br/>[UpdateWatchlist](https://api.veritone.com/v3/graphqldocs/updatewatchlist.doc.html), [Watchlist](https://api.veritone.com/v3/graphqldocs/watchlist.doc.html)

---
#### updateWidget

Updates a widget

_**Arguments**_<br/>

`input:` Fields needed to update a widget

```graphql
updateWidget(input: UpdateWidget): Widget
```

*See also:*<br/>[UpdateWidget](https://api.veritone.com/v3/graphqldocs/updatewidget.doc.html), [Widget](https://api.veritone.com/v3/graphqldocs/widget.doc.html)

---
#### uploadEngineResult

Upload and store an engine result. The result will be stored as an
asset associated with the target TemporalDataObject and the
task will be updated accordingly.
Use a multipart form POST to all this mutation.

_**Arguments**_<br/>

`input:` Fields needed to upload and store an engine result

```graphql
uploadEngineResult(input: UploadEngineResult!): Asset
```

*See also:*<br/>[UploadEngineResult](https://api.veritone.com/v3/graphqldocs/uploadengineresult.doc.html), [Asset](https://api.veritone.com/v3/graphqldocs/asset.doc.html)

---
#### upsertSchemaDraft

Update a structured data registry schema.

_**Arguments**_<br/>

`input:`

```graphql
upsertSchemaDraft(input: UpsertSchemaDraft!): Schema
```

*See also:*<br/>[UpsertSchemaDraft](https://api.veritone.com/v3/graphqldocs/upsertschemadraft.doc.html), [Schema](https://api.veritone.com/v3/graphqldocs/schema.doc.html)

---
#### userLogin

Login as a user. This mutation does not require an existing authentication
context (via `Authorization` header with bearer token, cookie, etc.).
Instead, the client supplies credentials to this mutation, which then
authenticates the user and sets up the authentication context.
The returned tokens can be used to authenticate future requests.

_**Arguments**_<br/>

`input:` Fields needed to log in

```graphql
userLogin(input: UserLogin): LoginInfo
```

*See also:*<br/>[UserLogin](https://api.veritone.com/v3/graphqldocs/userlogin.doc.html), [LoginInfo](https://api.veritone.com/v3/graphqldocs/logininfo.doc.html)

---
#### userLogout

Logout user and invalidate user token

_**Arguments**_<br/>

`token:` User token that should be invalidated

```graphql
userLogout(token: String!): Boolean
```

*See also:*<br/>[String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html)

---
#### validateEngineOutput

Validates if an engine output conforms to the engine output guidelines

_**Arguments**_<br/>

`input:`

```graphql
validateEngineOutput(input: JSONData!): Boolean!
```

*See also:*<br/>[JSONData](https://api.veritone.com/v3/graphqldocs/jsondata.doc.html), [Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html)

---
#### validateToken

Validate a user token. This mutation is used by services to determine
if the token provided by a given client is valid.

_**Arguments**_<br/>

`token:`

```graphql
validateToken(token: String!): LoginInfo
```

*See also:*<br/>[String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [LoginInfo](https://api.veritone.com/v3/graphqldocs/logininfo.doc.html)

---
#### verifyJWT

Verify JWT token

_**Arguments**_<br/>

`jwtToken:`

```graphql
verifyJWT(jwtToken: String!): VerifyJWTPayload
```

*See also:*<br/>[String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [VerifyJWTPayload](https://api.veritone.com/v3/graphqldocs/verifyjwtpayload.doc.html)
