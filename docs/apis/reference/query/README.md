# Query Methods

The table below gives a quick summary of GraphQL [query](https://api.veritone.com/v3/graphqldocs/query.doc.html) methods, alphabetized by name. 

Click any name to see the complete method signature, and other info.

| Method name | Short Description  |
| -- | -- |
| [application](#application) | Retrieve a single application |
| [applications](#applications) | Retrieve applications |
| [asset](#asset) | Retrieve a single Asset |
| [auditLog](#auditlog) | Examine entries from the audit log |
| [cloneRequests](#clonerequests) | Retrieve clone job entries |
| [cognitiveSearch](#cognitivesearch) | Cognitive search |
| [collection](#collection) | Collection |
| [collections](#collections) | Collections |
| [creative](#creative) | Get creative by id with current organizationId |
| [dataRegistries](#dataregistries) | Data registries |
| [dataRegistry](#dataregistry) | Data registry |
| [engine](#engine) | Retrieve a single engine by ID |
| [engineBuild](#enginebuild) | Engine build |
| [engineCategories](#enginecategories) | Retrieve engine categories |
| [engineCategory](#enginecategory) | Retrieve a specific engine category |
| [engineResults](#engineresults) | Retrieves engine results by TDO and engine ID or by job ID |
| [engines](#engines) | Retrieve engines |
| [entities](#entities) | Retrieve a list of entities across libraries |
| [entity](#entity) | Retrieve a specific entity |
| [entityIdentifierType](#entityidentifiertype) | Entity identifier type |
| [entityIdentifierTypes](#entityidentifiertypes) | Retrieve entity identifier types |
| [event](#event) | Retrieve a event by id |
| [events](#events) | Retrieve a list of events by application |
| [exportRequest](#exportrequest) | Export request |
| [exportRequests](#exportrequests) | Retrieve a list of export requests |
| [folder](#folder) | Retrieve a single folder |
| [getSignedWritableUrl](#getsignedwritableurl) | Returns a signed writable S3 URL |
| [getSignedWritableUrls](#getsignedwritableurls) | Return writable storage URLs in bulk |
| [graphqlServiceInfo](#graphqlserviceinfo) | Returns information about the GraphQL server, useful for diagnostics |
| [groups](#groups) | Retrieve groups |
| [ingestionConfiguration](#ingestionconfiguration) | Retrieve a single ingestion configuration |
| [ingestionConfigurations](#ingestionconfigurations) | Retrieve ingestion configurations |
| [job](#job) | Retrieve a single job |
| [jobs](#jobs) | Retrieve jobs |
| [libraries](#libraries) | Retrieve libraries and entities |
| [library](#library) | Retrieve a specific library |
| [libraryConfiguration](#libraryconfiguration) | Retrieve library configuration |
| [libraryEngineModel](#libraryenginemodel) | Retrieve a specific library engine model |
| [libraryType](#librarytype) | Retrieve a single library type |
| [libraryTypes](#librarytypes) | Retrieve all library types |
| [me](#me) | Retrieve information for the current logged-in user |
| [mediaShare](#mediashare) | Get the media share by media shareId |
| [mention](#mention) | Retrieve a single mention |
| [mentionStatusOptions](#mentionstatusoptions) |   |
| [mentions](#mentions) | Mentions |
| [myRights](#myrights) |   |
| [organization](#organization) | Retrieve a single organization |
| [organizations](#organizations) | Retrieve organizations |
| [permissions](#permissions) | Retrieve permissions |
| [processTemplate](#processtemplate) | Get process templates by id |
| [processTemplates](#processtemplates) | Get list process templates by id or current organizationId |
| [rootFolders](#rootfolders) | Retrieve the root folders for an organization |
| [savedSearches](#savedsearches) | Fetch all saved searches that the current user has made 
| [schema](#schema) | Schema |
| [schemaProperties](#schemaproperties) | Schema properties |
| [schemas](#schemas) | Retrieve a list of schemas for structured data ingestions |
| [searchMedia](#searchmedia) | Search for media across an index |
| [searchMentions](#searchmentions) | Search for mentions across an index |
| [sharedCollection](#sharedcollection) | Retrieve a shared collection |
| [sharedCollectionHistory](#sharedcollectionhistory) | Retrieve shared collection history records |
| [sharedFolders](#sharedfolders) | Retrieve the shared folders for an organization |
| [sharedMention](#sharedmention) | Retrieve a shared mention |
| [structuredData](#structureddata) | Retrieve a structured data object |
| [structuredDataObject](#structureddataobject) | Retrieve a structured data object |
| [structuredDataObjects](#structureddataobjects) | Retrieve a paginated list of structured data object |
| [subscription](#subscription) | Subscription |
| [task](#task) | Retrieve a single task by ID |
| [temporalDataObject](#temporaldataobject) | Retrieve a single temporal data object |
| [temporalDataObjects](#temporaldataobjects) | Retrieve a list of temporal data objects |
| [timeZones](#timezones) | This query returns information about time zones recognized by this server |
| [tokens](#tokens) | Retrieve user's organization API tokens |
| [trigger](#trigger) | Trigger |
| [triggers](#triggers) |   |
| [user](#user) | Retrieve an individual user |
| [users](#users) | Retrieve users |
| [watchlist](#watchlist) | Watchlist |
| [watchlists](#watchlists) | Watchlists |
| [widget](#widget) | Retrieve a single Widget |
| [workflowRuntime](#workflowruntime) | Retrieve Veritone Workflow instance status by ID |
| [workflowRuntimeStorageData](#workflowruntimestoragedata) | Get a specific workflowRuntimeData based on dataKey |

#### application

Retrieve a single application

_**Arguments**_<br/>

`id:` The application ID

```graphql
application(id: ID!): Application
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Application](https://api.veritone.com/v3/graphqldocs/application.doc.html)

---
#### applications

Retrieve applications. These are custom applications integrated into
the Veritone platform using the VDA framework.

_**Arguments**_<br/>

`id:` Provide an ID to retrieve a single specific application.

`status:` Provide a status, such as "draft" or "active"

`owned:` If true, return only applications owned by the user's organization.

`offset:` Provide an offset to skip to a certain element in the result, for paging.

`limit:` Specify maximum number of results to retrieve in this result. Page size.


```graphql
applications(
  id: ID,
  status: ApplicationStatus,
  owned: Boolean,
  offset: Int,
  limit: Int
): ApplicationList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [ApplicationStatus](https://api.veritone.com/v3/graphqldocs/applicationstatus.doc.html), [Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [ApplicationList](https://api.veritone.com/v3/graphqldocs/applicationlist.doc.html)

---
#### asset

Retrieve a single Asset

_**Arguments**_<br/>

`id:` The asset ID

```graphql
asset(id: ID!): Asset
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Asset](https://api.veritone.com/v3/graphqldocs/asset.doc.html)

---
#### auditLog

Examine entries from the audit log. All operations that modify data are
written to the audit log. Only entries for the user's own organization
can be queried.
All queries are bracketed by a time window. A default time window is applied
if the `toDateTime` and/or `fromDateTime` parameters are not provided.
The maximum time window length is 30 days.
Only Veritone and organization administrators can use this query.

_**Arguments**_<br/>

`toDateTime:` Date/time up to which entries will be returned. In other words, the end of the query time window. Defaults to the current time.

`fromDateTime:` Date/time from which entries will be returned. In other words, the start of the query time window. Defaults to the `toDateTime` minus 7 days.

`organizationId:` Organization ID to query records for. This value can only be used by Veritone administrators. Any value provided by user administrators will be ignored.

`userName:` User name on audit entry. Must be exact match.

`clientIpAddress:` IP address of the client that generated the audit action. Must be exact match.

`clientUserAgent:` HTTP user agent of the client that generated the audit action. Must be exact match.

`eventType:` The event type, such as `Create`,
`Update`, or Delete`. Must be exact match.

`objectId:` The ID of the object involved in the audit action. The format of this ID varies by object type. Must be exact match.

`objectType:` The type of the object involved in the audit action, such as 
`Watchlist` or
`TemporalDataObject`. Must be exact match.

`success:` Whether or not the action was successful.

`id:` The unique ID of an audit log entry. Multiple values can be provided.

`offset:` Offset into result set, for paging.

`limit:` Limit on result size, for paging (page size). Audit queries are lightweight so the default of 100 is higher than the default offset used elsewhere in the API.

`orderBy:` Order information. Default is order by createdDateTime` descending.


```graphql
auditLog(
  toDateTime: DateTime,
  fromDateTime: DateTime,
  organizationId: ID,
  userName: String,
  clientIpAddress: String,
  clientUserAgent: String,
  eventType: String,
  objectId: ID,
  objectType: String,
  success: Boolean,
  id: [ID!],
  offset: Int,
  limit: Int,
  orderBy: [AuditLogOrderBy!]
): AuditLogEntryList!
```

*See also:*<br/>[DateTime](https://api.veritone.com/v3/graphqldocs/datetime.doc.html), [ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [AuditLogOrderBy](https://api.veritone.com/v3/graphqldocs/auditlogorderby.doc.html), [AuditLogEntryList](https://api.veritone.com/v3/graphqldocs/auditlogentrylist.doc.html)

---
#### cloneRequests

Retrieve clone job entries

_**Arguments**_<br/>

`id:` Provide an ID to retrieve a single specific clone request.

`applicationId:` Application ID to get clone requests for. Defaults to the user's own application.

`offset:`

`limit:`

```graphql
cloneRequests(id: ID, applicationId: ID, offset: Int, limit: Int): CloneRequestList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [CloneRequestList](https://api.veritone.com/v3/graphqldocs/clonerequestlist.doc.html)

---
#### cognitiveSearch

_**Arguments**_<br/>

```graphql
cognitiveSearch(id: ID!): CognitiveSearch!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [CognitiveSearch](https://api.veritone.com/v3/graphqldocs/cognitivesearch.doc.html)

---
#### collection

_**Arguments**_<br/>

`id:`

```graphql
collection(id: ID!): Collection!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Collection](https://api.veritone.com/v3/graphqldocs/collection.doc.html)

---
#### collections

_**Arguments**_<br/>

  id:
  name:
  mentionId:
  offset:
  limit:

```graphql
collections(id: ID, name: String, mentionId: ID, offset: Int, limit: Int): CollectionList!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [CollectionList](https://api.veritone.com/v3/graphqldocs/collectionlist.doc.html)

---
#### creative

Get creative by id with current organizationId

_**Arguments**_<br/>

`id:`


```graphql
creative(id: ID!): Creative!
}
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Creative](https://api.veritone.com/v3/graphqldocs/creative.doc.html)

---
#### dataRegistries

_**Arguments**_<br/>

  id:
  name:
  nameMatch:
  offset:
  limit:
  orderBy:
  orderDirection:
  filterByOwnership:

```graphql
dataRegistries(
  id: ID,
  name: String,
  nameMatch: StringMatch,
  offset: Int,
  limit: Int,
  orderBy: DataRegistryOrderBy,
  orderDirection: OrderDirection,
  filterByOwnership: SchemaOwnership
): DataRegistryList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [StringMatch](https://api.veritone.com/v3/graphqldocs/stringmatch.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [DataRegistryOrderBy](https://api.veritone.com/v3/graphqldocs/dataregistryorderby.doc.html), [OrderDirection](https://api.veritone.com/v3/graphqldocs/orderdirection.doc.html), [SchemaOwnership](https://api.veritone.com/v3/graphqldocs/schemaownership.doc.html), [DataRegistryList](https://api.veritone.com/v3/graphqldocs/dataregistrylist.doc.html)

---
#### dataRegistry

_**Arguments**_<br/>

`id:`

```graphql
dataRegistry(id: ID!): DataRegistry
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DataRegistry](https://api.veritone.com/v3/graphqldocs/dataregistry.doc.html)

---
#### engine

Retrieve a single engine by ID

_**Arguments**_<br/>

`id:` Provide the engine ID


```graphql
engine(id: ID!): Engine
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Engine](https://api.veritone.com/v3/graphqldocs/engine.doc.html)

---
#### engineBuild

_**Arguments**_<br/>

  id: Provide the build ID

```graphql
engineBuild(id: ID!): Build
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Build](https://api.veritone.com/v3/graphqldocs/build.doc.html)

---
#### engineCategories

Retrieve engine categories

_**Arguments**_<br/>

`id:` Provide an ID to retrieve a single specific engine category.

`name:` Provide a name, or part of one, to search by category name

`type:` Return all categories of an engine type

`offset:` Specify maximum number of results to retrieve in this result. Page size.

`limit:` Specify maximum number of results to retrieve in this result.


```graphql
engineCategories(
  id: ID,
  name: String,
  type: String,
  offset: Int,
  limit: Int
): EngineCategoryList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [EngineCategoryList](https://api.veritone.com/v3/graphqldocs/enginecategorylist.doc.html)

---
#### engineCategory

Retrieve a specific engine category

_**Arguments**_<br/>

`id:` Supply the ID of the engine category to retrieve


```graphql
engineCategory(id: ID!): EngineCategory
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [EngineCategory](https://api.veritone.com/v3/graphqldocs/enginecategory.doc.html)

---
#### engineResults

Retrieves engine results by TDO and engine ID or by job ID.

_**Arguments**_<br/>

`tdoId:` Provide the ID of the TDO containing engine results to retrieve. If this parameter is used, engineIds or engineCategoryIds must also be set. Results for _only_ the specified TDO will be returned.

`sourceId:` Provide the ID of the Source containing engine results to retrieve. If this parameter is used, engineIds or engineCategoryIds must also be set. This takes priority over tdoId.

`engineIds:` Provide one or more engine IDs to retrieve engine results by ID. This parameter is mandatory if tdoId is used, but optional if jobId or engineCategory is used.

`engineCategoryIds:` Provide one or more category IDs to get all results from that categroy.

`jobId:` Provide a job ID to retrieve engine results for the job.

`mentionId:` Provide a mention ID to retrieve engine results for the mention.

`startOffsetMs:` Start offset ms for the results.

`stopOffsetMs:` End offset ms for the results.

`startDate:` Start date for the results. Takes priority over startOffsetMs.

`stopDate:` End date for the results. Takes priority over stopOffsetMs.

`ignoreUserEdited:` Whether or not to exclude user edited engine results. Defaults to false.

`fallbackTdoId:` A TDO ID can be provided for use if the provided sourceId` and/or mentionId` parameters do not resolve to a logical set of TDOs. Depending on parameter settings and available data, results from other TDOs can be included in the response.


```graphql
engineResults(
  tdoId: ID,
  sourceId: ID,
  engineIds: [ID!],
  engineCategoryIds: [ID!],
  jobId: ID,
  mentionId: ID,
  startOffsetMs: Int,
  stopOffsetMs: Int,
  startDate: DateTime,
  stopDate: DateTime,
  ignoreUserEdited: Boolean,
  fallbackTdoId: ID
): EngineResultList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [DateTime](https://api.veritone.com/v3/graphqldocs/datetime.doc.html), [Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html), [EngineResultList](https://api.veritone.com/v3/graphqldocs/engineresultlist.doc.html)

---
#### engines

Retrieve engines

_**Arguments**_<br/>

`id:` Provide an ID to retrieve a single specific engine.

`ids:`

`categoryId:` Provide a category ID to filter by engine category.

`category:` provide a category name or ID to filter by engine category

`state:` Provide a list of states to filter by engine state.

`owned:` If true, return only engines owned by the user's organization.

`libraryRequired:` If true, return only engines that require a library.

`createsTDO:` If true, return only engines that create their own TDO. If false, return only engines that do not create a TDO. If not set, return either.

`name:` Provide a name, or part of a name, to search by engine name

`offset:` Specify maximum number of results to retrieve in this result. Page size.

`limit:` Specify maximum number of results to retrieve in this result.

`filter:` Filters for engine attributes

`orderBy:` Provide a list of EngineSortField to sort by.


```graphql
engines(
  id: ID,
  ids: [ID!],
  categoryId: String,
  category: String,
  state: [EngineState],
  owned: Boolean,
  libraryRequired: Boolean,
  createsTDO: Boolean,
  name: String,
  offset: Int,
  limit: Int,
  filter: EngineFilter,
  orderBy: [EngineSortField]
): EngineList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [EngineState](https://api.veritone.com/v3/graphqldocs/enginestate.doc.html), [Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [EngineFilter](https://api.veritone.com/v3/graphqldocs/enginefilter.doc.html), [EngineSortField](https://api.veritone.com/v3/graphqldocs/enginesortfield.doc.html), [EngineList](https://api.veritone.com/v3/graphqldocs/enginelist.doc.html)

---
#### entities

Retrieve a list of entities across libraries

_**Arguments**_<br/>

`ids:` Provide a list of entity IDs to retrieve those entities

`libraryIds:` Provide a list of library IDs to retrieve entities across multiple libraries.

`isPublished:`

`identifierTypeId:`

`name:`

`offset:`

`limit:`

`orderBy:`

`orderDirection:`


```graphql
entities(
  ids: [ID!],
  libraryIds: [ID!],
  isPublished: Boolean,
  identifierTypeId: ID,
  name: String,
  offset: Int,
  limit: Int,
  orderBy: LibraryEntityOrderBy,
  orderDirection: OrderDirection
): EntityList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [LibraryEntityOrderBy](https://api.veritone.com/v3/graphqldocs/libraryentityorderby.doc.html), [OrderDirection](https://api.veritone.com/v3/graphqldocs/orderdirection.doc.html), [EntityList](https://api.veritone.com/v3/graphqldocs/entitylist.doc.html)

---
#### entity

Retrieve a specific entity

_**Arguments**_<br/>

`id:` Provide an entity ID.


```graphql
entity(id: ID!): Entity
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Entity](https://api.veritone.com/v3/graphqldocs/entity.doc.html)

---
#### entityIdentifierType

_**Arguments**_<br/>

`  id:` Provide the entity identifier type ID

```graphql
entityIdentifierType(id: ID!): EntityIdentifierType
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [EntityIdentifierType](https://api.veritone.com/v3/graphqldocs/entityidentifiertype.doc.html)

---
#### entityIdentifierTypes

Retrieve entity identifier types

_**Arguments**_<br/>

`id:` Provide an ID to retrieve a single specific entity identifier type.

`offset:` Provide an offset to skip to a certain element in the result, for paging.

`limit:` Specify maximum number of results to retrieve in this result. Page size.


```graphql
entityIdentifierTypes(id: ID, offset: Int, limit: Int): EntityIdentifierTypeList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [EntityIdentifierTypeList](https://api.veritone.com/v3/graphqldocs/entityidentifiertypelist.doc.html)

---
#### event

Retrieve a event by id

_**Arguments**_<br/>

`id:`


```graphql
event(id: ID!): Event!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Event](https://api.veritone.com/v3/graphqldocs/event.doc.html)

---
#### events

Retrieve a list of events by application

_**Arguments**_<br/>

`application:` Provide an application to retrieve all its events. Use 'system' to list all public system events.

`offset:` Provide an offset to skip to a certain element in the result, for paging.

`limit:` Specify maximum number of results to retrieve in this result. Page size.


```graphql
events(application: String!, offset: Int, limit: Int): EventList!
```

*See also:*<br/>[String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [EventList](https://api.veritone.com/v3/graphqldocs/eventlist.doc.html)

---
#### exportRequest
  
_**Arguments**_<br/>

`id:`

`event:` Provide an event to retrieve export request. Should be
`exportRequest` or `mentionExportRequest`.
Default value is 'exportRequest'

```graphql
exportRequest(id: ID!, event: ExportRequestEvent): ExportRequest!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [ExportRequestEvent](https://api.veritone.com/v3/graphqldocs/exportrequestevent.doc.html), [ExportRequest](https://api.veritone.com/v3/graphqldocs/exportrequest.doc.html)

---
#### exportRequests

Retrieve a list of export requests

_**Arguments**_<br/>

`id:` Provide an ID to retrieve a single export request

`offset:` Provide an offset to skip to a certain element in the result, for paging.

`limit:` Specify maximum number of results to retrieve in this result. Page size.

`status:` Provide a list of status options to filter by status

`event:` Provide an event to retrieve export request. Should be exportRequest' or 'mentionExportRequest' Default value is 'exportRequest'

```graphql
exportRequests(
  id: ID,
  offset: Int,
  limit: Int,
  status: [ExportRequestStatus!],
  event: ExportRequestEvent
): ExportRequestList!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [ExportRequestStatus](https://api.veritone.com/v3/graphqldocs/exportrequeststatus.doc.html), [ExportRequestEvent](https://api.veritone.com/v3/graphqldocs/exportrequestevent.doc.html), [ExportRequestList](https://api.veritone.com/v3/graphqldocs/exportrequestlist.doc.html)

---
#### folder

Retrieve a single folder. Used to navigate the folder tree structure.

_**Arguments**_<br/>

`id:` Provide an ID to retrieve a single specific user.

```graphql
folder(id: ID!): Folder
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Folder](https://api.veritone.com/v3/graphqldocs/folder.doc.html)

---
#### getSignedWritableUrl

Returns a signed writable S3 URL. A client can then
upload to this URL with an HTTP PUT without providing
any additional authorization (_Note_: The push must be a PUT.
A POST will fail.)

_**Arguments**_<br/>

`key:` Optional key of the object to generate a writable URL for. If not provided, a new, unique key will be generated. If a key is provided and resembles a file name with extension delimited by .), a UUID will be inserted into the file name, leaving the extension intact. If a key is provided and does not resemble a file name, a UUID will be appended.

`type:` Optional type of resource, such as

`asset`,

`thumbnail`, or

`preview`

`path:` Optional extended path information. If the uploaded content will be contained within a container such as a
`TemporalDataObject` (for
`asset`) or
`Library` for
`entityIdentifier`), the ID of the object should be provided here.

`organizationId:` Optional organization ID. Normally this value is computed by the server based on the authorization token used for the request. Is is used only by Veritone platform components.

```graphql
getSignedWritableUrl(
  key: String,
  type: String,
  path: String,
  organizationId: ID
): WritableUrlInfo
```

*See also:*<br/>[String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [WritableUrlInfo](https://api.veritone.com/v3/graphqldocs/writableurlinfo.doc.html)

---
#### getSignedWritableUrls

Return writable storage URLs in bulk.
A maximum of 1000 can be created in one call.
See `getSignedWritableUrl` for details on usage of the
response contents.

_**Arguments**_<br/>

`number:` Number of signed URLs to return

`type:` Optional type of resource, such as
`asset`,
`thumbnail`, or
`preview`

`path:` Optional extended path information. If the uploaded content will be contained within a container such as a

`TemporalDataObject` (for
`asset`) or
`Library` for
`entityIdentifier`), the ID of the object should be provided here.

`organizationId:` Optional organization ID. Normally this value is computed by the server based on the authorization token used for the request. Is is used only by Veritone platform components.


```graphql
getSignedWritableUrls(
  number: Int!,
  type: String,
  path: String,
  organizationId: ID
): [WritableUrlInfo!]!
```

*See also:*<br/>[Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [WritableUrlInfo](https://api.veritone.com/v3/graphqldocs/writableurlinfo.doc.html)

---
#### graphqlServiceInfo

Returns information about the GraphQL server, useful
for diagnostics. This data is primarily used by Veritone
development, and some fields may be restricted to Veritone administrators.

_**Arguments**_<br/>

```graphql
graphqlServiceInfo: GraphQLServiceInfo
```

*See also:*<br/>[GraphQLServiceInfo](https://api.veritone.com/v3/graphqldocs/graphqlserviceinfo.doc.html)

---
#### groups

Retrieve groups

_**Arguments**_<br/>

`id:` Provide an ID to retrieve a specific group by ID

`ids:` Provide IDs to retrieve multiple groups by ID

`name:` Provide a name, or part of one, to search for groups by name

`organizationIds:` Provide a list of organization IDs to retrieve groups defined within certain organizations.

`offset:` Provide an offset to skip to a certain element in the result, for paging.

`limit:` Specify maximum number of results to retrieve in this result. Page size.


```graphql
groups(id: ID, ids: [ID], name: String, organizationIds: [ID], offset: Int, limit: Int): GroupList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [GroupList](https://api.veritone.com/v3/graphqldocs/grouplist.doc.html)

---
#### ingestionConfiguration

Retrieve a single ingestion configuration

_**Arguments**_<br/>

`id:` The configuration ID


```graphql
ingestionConfiguration(id: ID!): IngestionConfiguration
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [IngestionConfiguration](https://api.veritone.com/v3/graphqldocs/ingestionconfiguration.doc.html)

---
#### ingestionConfigurations

Retrieve ingestion configurations

_**Arguments**_<br/>

`id:` Supply an ingestion configuration ID to retrieve a single Ingestion

`offset:` Offset

`limit:` Limit

`name:`

`startDate:`

`endDate:`

`sources:` Specify one or more sources to filter by source type

`applicationId:` Supply an application ID to retrieve configurations only for that application.

`emailAddress:` Email address configured for ingestion

```graphql
ingestionConfigurations(
  id: ID,
  offset: Int,
  limit: Int,
  name: String,
  startDate: DateTime,
  endDate: DateTime,
  sources: [String!],
  applicationId: ID,
  emailAddress: String
): IngestionConfigurationList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [DateTime](https://api.veritone.com/v3/graphqldocs/datetime.doc.html), [IngestionConfigurationList](https://api.veritone.com/v3/graphqldocs/ingestionconfigurationlist.doc.html)

---
#### job

Retrieve a single job

_**Arguments**_<br/>

`id:` the job ID

```graphql
job(id: ID!): Job
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Job](https://api.veritone.com/v3/graphqldocs/job.doc.html)

---
#### jobs

Retrieve jobs

_**Arguments**_<br/>

`hasTargetTDO:`

`id:` Provide an ID to retrieve a single specific job.

`status:` Provide a list of status strings to filter by status

`applicationStatus:`

`offset:` Provide an offset to skip to a certain element in the result, for paging.

`limit:` Specify the maximum number of results to included in this response, or page size.

`applicationId:` Provide an application ID to filter jobs for a given application. Defaults to the user's own application.

`targetId:` Provide a target ID to get the set of jobs running against a particular TDO.

`clusterId:` Provide a cluster ID to get the jobs running on a specific cluster

`scheduledJobIds:` Provide a list of scheduled job IDs to get jobs associated with the scheduled jobs

`hasScheduledJobId:` Return only jobs that are (true) or are not false) associated with a scheduled job

`orderBy:` Provide sort information. The default is to sort by createdDateTime descending.

`dateTimeFilter:` Filter by date/time field.

`applicationIds:` Provide list of application IDs to filter jobs. Defaults to the user's own application.

`engineIds:` Provide a list of engine IDs to filter for jobs that contain tasks for the specified engines.

`engineCategoryIds:` Provide a list of engine category IDs to filter for jobs that contain tasks for engines in the specific categories.


```graphql
jobs(
  hasTargetTDO: Boolean,
  id: ID,
  status: [JobStatusFilter!],
  applicationStatus: String,
  offset: Int,
  limit: Int,
  applicationId: ID,
  targetId: ID,
  clusterId: ID,
  scheduledJobIds: [ID!],
  hasScheduledJobId: Boolean,
  orderBy: [JobSortField!],
  dateTimeFilter: [JobDateTimeFilter!],
  applicationIds: [ID],
  engineIds: [ID!],
  engineCategoryIds: [ID!]
): JobList
```

*See also:*<br/>[Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html), [ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [JobStatusFilter](https://api.veritone.com/v3/graphqldocs/jobstatusfilter.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [JobSortField](https://api.veritone.com/v3/graphqldocs/jobsortfield.doc.html), [JobDateTimeFilter](https://api.veritone.com/v3/graphqldocs/jobdatetimefilter.doc.html), [JobList](https://api.veritone.com/v3/graphqldocs/joblist.doc.html)

---
#### libraries

Retrieve libraries and entities

_**Arguments**_<br/>

`id:` Provide an ID to retrieve a single specific library.

`name:` Provide a name string to search by name.

`type:` Provide the name or ID of a library to search for libraries that contain that type.

`entityIdentifierTypeIds:` Provide the id of an entity identifier type to search for libraries that correlate to that type.

`includeOwnedOnly:` Specify true if only libraries owned by the user's organization should be returned. Otherwise, shared libraries will be included.

`offset:` Provide an offset to skip to a certain element in the result, for paging.

`limit:` Specify maximum number of results to retrieve in this result. Page size.

`orderBy:` Specify a field to order by

`orderDirection:` Specify the direction to order by


```graphql
libraries(
  id: ID,
  name: String,
  type: String,
  entityIdentifierTypeIds: [String!],
  includeOwnedOnly: Boolean,
  offset: Int,
  limit: Int,
  orderBy: LibraryOrderBy,
  orderDirection: OrderDirection
): LibraryList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [LibraryOrderBy](https://api.veritone.com/v3/graphqldocs/libraryorderby.doc.html), [OrderDirection](https://api.veritone.com/v3/graphqldocs/orderdirection.doc.html), [LibraryList](https://api.veritone.com/v3/graphqldocs/librarylist.doc.html)

---
#### library

Retrieve a specific library

_**Arguments**_<br/>

`id:` Provide a library ID.

```graphql
library(id: ID!): Library
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Library](https://api.veritone.com/v3/graphqldocs/library.doc.html)

---
#### libraryConfiguration

Retrieve library configuration

_**Arguments**_<br/>

`id:` Provide configuration id


```graphql
libraryConfiguration(id: ID!): LibraryConfiguration
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [LibraryConfiguration](https://api.veritone.com/v3/graphqldocs/libraryconfiguration.doc.html)

---
#### libraryEngineModel

Retrieve a specific library engine model

_**Arguments**_<br/>

`id:` Provide the library engine model ID

```graphql
libraryEngineModel(id: ID!): LibraryEngineModel
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [LibraryEngineModel](https://api.veritone.com/v3/graphqldocs/libraryenginemodel.doc.html)

---
#### libraryType

Retrieve a single library type

_**Arguments**_<br/>

`id:` Provide an ID to retrieve a single specific library type.

```graphql
libraryType(id: ID): LibraryType
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [LibraryType](https://api.veritone.com/v3/graphqldocs/librarytype.doc.html)

---
#### libraryTypes

Retrieve all library types

_**Arguments**_<br/>

`id:` Provide an ID to retrieve a single specific library type.

`offset:` Provide an offset to skip to a certain element in the result, for paging.

`limit:` Specify maximum number of results to retrieve in this result. Page size.

```graphql
libraryTypes(id: ID, offset: Int, limit: Int): LibraryTypeList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [LibraryTypeList](https://api.veritone.com/v3/graphqldocs/librarytypelist.doc.html)

---
#### me

Retrieve information for the current logged-in user

_**Arguments**_<br/>

```graphql
me: User
```

*See also:*<br/>[User](https://api.veritone.com/v3/graphqldocs/user.doc.html)

---
#### mediaShare

Get the media share by media shareId

_**Arguments**_<br/>

`id:`

```graphql
mediaShare(id: ID!): MediaShare!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [MediaShare](https://api.veritone.com/v3/graphqldocs/mediashare.doc.html)

---
#### mention

Retrieve a single mention

_**Arguments**_<br/>

`mentionId:` The mention ID

`limit:` Comments pagination - limit

`offset:` Comments pagination - limit

`userId:` The user who owns the mention.

```graphql
mention(mentionId: ID!, limit: Int, offset: Int, userId: String): Mention
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Mention](https://api.veritone.com/v3/graphqldocs/mention.doc.html)

---
#### mentionStatusOptions

_**Arguments**_<br/>

```graphql
mentionStatusOptions: [MentionStatus!]!
```

*See also:*<br/>[MentionStatus](https://api.veritone.com/v3/graphqldocs/mentionstatus.doc.html)

---
#### mentions

  _**Arguments**_<br/>

`id:`

`watchlistId:` Get mentions created from the specified watchlist

`sourceId:` Get mentions associated with the specified source

`sourceTypeId:` Get mentions associated with sources of the
specified source type

`tdoId:` Get mentions associated directly with the specific TDO
dateTimeFilter: Specify date/time filters against mention
fields.
Querying for mentions can be expensive. If the query does not
include a filter by `id`, `tdoId`, `sourceId`, `watchlistId`, or
a user-provided `dateTimeFilter`, a default filter of the
past 7 days is applied.

`orderBy:` Set order information on the query. Multiple fields
are supported.

`offset:`

`limit:`

```graphql
mentions(
  id: ID,
  watchlistId: ID,
  sourceId: ID,
  sourceTypeId: ID,
  tdoId: ID,
  dateTimeFilter: [MentionDateTimeFilter!],
  orderBy: [MentionOrderBy!],
  offset: Int,
  limit: Int
): MentionList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [MentionDateTimeFilter](https://api.veritone.com/v3/graphqldocs/mentiondatetimefilter.doc.html), [MentionOrderBy](https://api.veritone.com/v3/graphqldocs/mentionorderby.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [MentionList](https://api.veritone.com/v3/graphqldocs/mentionlist.doc.html)

---
#### myRights

_**Arguments**_<br/>

```graphql
myRights: RightsListing
```

*See also:*<br/>[RightsListing](https://api.veritone.com/v3/graphqldocs/rightslisting.doc.html)

---
#### organization

Retrieve a single organization

_**Arguments**_<br/>

`id:` The organization ID TODO take application ID as well as org ID

```graphql
organization(id: ID!): Organization
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Organization](https://api.veritone.com/v3/graphqldocs/organization.doc.html)

---
#### organizations

Retrieve organizations

_**Arguments**_<br/>

`id:` Provide an ID to retrieve a single specific organization.

`offset:` Provide an offset to skip to a certain element in the result, for paging.

`limit:` Specify maximum number of results to retrieve in this result. Page size.

`kvpProperty:` Provide a property from the organization kvp to filter the organizaion list.

`kvpValue:` Provide value to for the kvpFeature filter. If not present the filter becomes `kvpProperty` existence filter.

```graphql
organizations(
  id: ID,
  offset: Int,
  limit: Int,
  kvpProperty: String,
  kvpValue: String
): OrganizationList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [OrganizationList](https://api.veritone.com/v3/graphqldocs/organizationlist.doc.html)

---
#### permissions

Retrieve permissions

_**Arguments**_<br/>

`id:` Provide an ID to retrieve a single specific permission.

`name:`

`offset:` Provide an offset to skip to a certain element in the result, for paging.

`limit:` Specify maximum number of results to retrieve in this result. Page size.

```graphql
permissions(id: ID, name: String, offset: Int, limit: Int): PermissionList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [PermissionList](https://api.veritone.com/v3/graphqldocs/permissionlist.doc.html)

---
#### processTemplate

Get process templates by id

_**Arguments**_<br/>

`id:`

```graphql
processTemplate(id: ID!): ProcessTemplate!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [ProcessTemplate](https://api.veritone.com/v3/graphqldocs/processtemplate.doc.html)

---
#### processTemplates

Get list process templates by id or current organizationId

_**Arguments**_<br/>

`id:`

`offset:`

`limit:`

```graphql
processTemplates(id: ID, offset: Int, limit: Int): ProcessTemplateList!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [ProcessTemplateList](https://api.veritone.com/v3/graphqldocs/processtemplatelist.doc.html)

---
#### rootFolders

Retrieve the root folders for an organization

_**Arguments**_<br/>

`type:` The type of root folder to retrieve

```graphql
rootFolders(type: RootFolderType): [Folder]
```

*See also:*<br/>[RootFolderType](https://api.veritone.com/v3/graphqldocs/rootfoldertype.doc.html), [Folder](https://api.veritone.com/v3/graphqldocs/folder.doc.html)

---
#### savedSearches

Fetch all saved searches that the current user has made
Fetch all saved searches that have been shared with
the current users organization
Include any saved searches that the user has created

_**Arguments**_<br/>

`offset:`

`limit:`

`includeShared:`

`filterByName:`

`orderBy:`

`orderDirection:`


```graphql
savedSearches(
  offset: Int,
  limit: Int,
  includeShared: Boolean,
  filterByName: String,
  orderBy: SavedSearchOrderBy,
  orderDirection: OrderDirection
): SavedSearchList!
```

*See also:*<br/>[Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [SavedSearchOrderBy](https://api.veritone.com/v3/graphqldocs/savedsearchorderby.doc.html), [OrderDirection](https://api.veritone.com/v3/graphqldocs/orderdirection.doc.html), [SavedSearchList](https://api.veritone.com/v3/graphqldocs/savedsearchlist.doc.html)

---
#### schema

_**Arguments**_<br/>

`id:`

```graphql
schema(id: ID!): Schema
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Schema](https://api.veritone.com/v3/graphqldocs/schema.doc.html)

---
#### schemaProperties

 _**Arguments**_<br/>

`dataRegistryVersion:`

`search:`

`limit:` Limit

`offset:` Offset


```graphql
schemaProperties(
  dataRegistryVersion: [DataRegistryVersion!],
  search: String,
  limit: Int,
  offset: Int
): SchemaPropertyList
```

*See also:*<br/>[DataRegistryVersion](https://api.veritone.com/v3/graphqldocs/dataregistryversion.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [SchemaPropertyList](https://api.veritone.com/v3/graphqldocs/schemapropertylist.doc.html)

---
#### schemas

Retrieve a list of schemas for structured data ingestions

_**Arguments**_<br/>

`id:` Id of a schema to retrieve

`ids:` Ids of schemas to retrieve

`dataRegistryId:` Specify the id of the DataRegistry to get schemas

`status:` Specify one or more statuses to filter by schema status

`majorVersion:` Specify a major version to filter schemas

`name:` Specify a data registry name to filter schemas

`nameMatch:` The strategy used to find data registry name

`limit:` Limit

`offset:` Offset

`orderBy:` Specify one or more fields and direction to order results


```graphql
schemas(
  id: ID,
  ids: [ID!],
  dataRegistryId: ID,
  status: [SchemaStatus!],
  majorVersion: Int,
  name: String,
  nameMatch: StringMatch,
  limit: Int,
  offset: Int,
  orderBy: [SchemaOrder]
): SchemaList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [SchemaStatus](https://api.veritone.com/v3/graphqldocs/schemastatus.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [StringMatch](https://api.veritone.com/v3/graphqldocs/stringmatch.doc.html), [SchemaOrder](https://api.veritone.com/v3/graphqldocs/schemaorder.doc.html), [SchemaList](https://api.veritone.com/v3/graphqldocs/schemalist.doc.html)

---
#### searchMedia

Search for media across an index.
This query requires a user token.

_**Arguments**_<br/>

`search:` JSON structure containing the search query. TODO link to syntax documentation

```graphql
searchMedia(search: JSONData!): SearchResult
```

*See also:*<br/>[JSONData](https://api.veritone.com/v3/graphqldocs/jsondata.doc.html), [SearchResult](https://api.veritone.com/v3/graphqldocs/searchresult.doc.html)

---
#### searchMentions

Search for mentions across an index.
This query requires a user token.

_**Arguments**_<br/>

`search:` JSON structure containing the search query. TODO link to syntax documentation

```graphql
searchMentions(search: JSONData!): SearchResult
```

*See also:*<br/>[JSONData](https://api.veritone.com/v3/graphqldocs/jsondata.doc.html), [SearchResult](https://api.veritone.com/v3/graphqldocs/searchresult.doc.html)

---
#### sharedCollection

Retrieve a shared collection

_**Arguments**_<br/>

`shareId:` share token

```graphql
sharedCollection(shareId: ID!): SharedCollection
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [SharedCollection](https://api.veritone.com/v3/graphqldocs/sharedcollection.doc.html)

---
#### sharedCollectionHistory

Retrieve shared collection history records

_**Arguments**_<br/>

`ids:` Provide an ID to retrieve a single history record.

`folderId:` Provide a folder ID to filter by collection.

`shareId:` Provide a share ID to filter by share ID.

`offset:` Specify maximum number of results to retrieve in this result. Page size.

`limit:` Specify maximum number of results to retrieve in this result.


```graphql
sharedCollectionHistory(
  ids: [ID!],
  folderId: ID,
  shareId: String,
  offset: Int,
  limit: Int
): SharedCollectionHistoryList!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [SharedCollectionHistoryList](https://api.veritone.com/v3/graphqldocs/sharedcollectionhistorylist.doc.html)

---
#### sharedFolders

Retrieve the shared folders for an organization

_**Arguments**_<br/>

```graphql
sharedFolders: [Folder]
```

*See also:*<br/>[Folder](https://api.veritone.com/v3/graphqldocs/folder.doc.html)

---
#### sharedMention

Retrieve a shared mention

_**Arguments**_<br/>

`shareId:` share token

```graphql
sharedMention(shareId: ID!): SharedMention
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [SharedMention](https://api.veritone.com/v3/graphqldocs/sharedmention.doc.html)

---
#### structuredData

Retrieve a structured data object

_**Arguments**_<br/>

`id:` Supply the ID of the structured data object to retrieve. This will override filters.

`schemaId:` Schema Id for the structured data object to retrieve

```graphql
structuredData(id: ID!, schemaId: ID!): StructuredData
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [StructuredData](https://api.veritone.com/v3/graphqldocs/structureddata.doc.html)

---
#### structuredDataObject

Retrieve a structured data object

_**Arguments**_<br/>

`id:` Supply the ID of the structured data object to retrieve. This will override filters.

`schemaId:` Schema Id for the structured data object to retrieve

```graphql
structuredDataObject(id: ID!, schemaId: ID!): StructuredData
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [StructuredData](https://api.veritone.com/v3/graphqldocs/structureddata.doc.html)

---
#### structuredDataObjects

Retrieve a paginated list of structured data object

_**Arguments**_<br/>

`id:` Supply the ID of the structured data object to retrieve. This will override filters.

`ids:` List of Ids of the structured data objects to retrieve. This will override filters.

`schemaId:` Schema Id for the structured data object to retrieve

`orderBy:`

`limit:`

`offset:`

`owned:`

`filter:` Query to filter SDO. Supports operations such as and, or, eq, gt, lt, etc. TODO link to syntax documentation

```graphql
structuredDataObjects(
  id: ID,
  ids: [ID!],
  schemaId: ID!,
  orderBy: [StructuredDataOrderBy!],
  limit: Int,
  offset: Int,
  owned: Boolean,
  filter: JSONData
): StructuredDataList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [StructuredDataOrderBy](https://api.veritone.com/v3/graphqldocs/structureddataorderby.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html), [JSONData](https://api.veritone.com/v3/graphqldocs/jsondata.doc.html), [StructuredDataList](https://api.veritone.com/v3/graphqldocs/structureddatalist.doc.html)

---
#### subscription

_**Arguments**_<br/>

`id:`

```graphql
subscription(id: ID!): Subscription!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Subscription](https://api.veritone.com/v3/graphqldocs/subscription.doc.html)

---
#### task

Retrieve a single task by ID

_**Arguments**_<br/>

`id:` Provide the task ID.

```graphql
task(id: ID!): Task
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Task](https://api.veritone.com/v3/graphqldocs/task.doc.html)

---
#### temporalDataObject

Retrieve a single temporal data object

_**Arguments**_<br/>

`id:` the TDO ID

```graphql
temporalDataObject(id: ID!): TemporalDataObject
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [TemporalDataObject](https://api.veritone.com/v3/graphqldocs/temporaldataobject.doc.html)

---
#### temporalDataObjects

Retrieve a list of temporal data objects.

_**Arguments**_<br/>

`applicationId:` Application ID to get TDOs for. Defaults to the user's own application.

`id:` Provide an ID to retrieve a single specific TDO.

`offset:` Provide an offset to skip to a certain element in the result, for paging.

`limit:` Specify maximum number of results to retrieve in this result. Page size.

`sourceId:` Optionally, specify a source ID. TDOs ingested from this source will be returned.

`scheduledJobId:` Optionally, specify a scheduled job ID. TDOs ingested under this scheduled job will be returned.

`sampleMedia:` Whether to retrieve only tdos with the specified sampleMedia value

`includePublic:` Whether to retrieve public data that is not part of the user's organization. The default is false. Pass true to include public data in the result set.

`orderBy:`

`orderDirection:`

`dateTimeFilter:` Provide optional filters against any date/time field to filter objects within a given time window. Matching objects must meet all of the given conditions.

`mentionId:` Retrieve TDOs associated with the given mention

```graphql
temporalDataObjects(
  applicationId: ID,
  id: ID,
  offset: Int,
  limit: Int,
  sourceId: ID,
  scheduledJobId: ID,
  sampleMedia: Boolean,
  includePublic: Boolean,
  orderBy: TemporalDataObjectOrderBy,
  orderDirection: OrderDirection,
  dateTimeFilter: [TemporalDataObjectDateTimeFilter!],
  mentionId: ID
): TDOList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html), [TemporalDataObjectOrderBy](https://api.veritone.com/v3/graphqldocs/temporaldataobjectorderby.doc.html), [OrderDirection](https://api.veritone.com/v3/graphqldocs/orderdirection.doc.html), [TemporalDataObjectDateTimeFilter](https://api.veritone.com/v3/graphqldocs/temporaldataobjectdatetimefilter.doc.html), [TDOList](https://api.veritone.com/v3/graphqldocs/tdolist.doc.html)

---
#### timeZones

This query returns information about time zones recognized by this
server. The information is static and does not change.

_**Arguments**_<br/>

```graphql
timeZones: [TimeZone!]!
```

*See also:*<br/>[TimeZone](https://api.veritone.com/v3/graphqldocs/timezone.doc.html)

---
#### tokens

Retrieve user's organization API tokens

_**Arguments**_<br/>

```graphql
tokens: [Token]
```

*See also:*<br/>[Token](https://api.veritone.com/v3/graphqldocs/token.doc.html)

---
#### trigger

Arguments
id:

_**Arguments**_<br/>

```graphql
trigger(id: ID!): Trigger
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Trigger](https://api.veritone.com/v3/graphqldocs/trigger.doc.html)

---
#### triggers

_**Arguments**_<br/>

None.

```graphql
triggers: [Trigger]
```

*See also:*<br/>[Trigger](https://api.veritone.com/v3/graphqldocs/trigger.doc.html)

---
#### user

Retrieve an individual user

_**Arguments**_<br/>

`id:` The user ID. A user ID is a string in UUID format.

`organizationIds:`


```graphql
user(id: ID!, organizationIds: [ID]): User
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [User](https://api.veritone.com/v3/graphqldocs/user.doc.html)

---
#### users

Retrieve users

_**Arguments**_<br/>

`id:` Provide an ID to retrieve a single specific user. A user ID is a string in UUID format.

`ids:` Provide IDs to retrieve multiple users by ID.

`name:` Provide a name, or part of one, to search by name.

`organizationIds:` Provide a list of organization IDs to filter your search by organization.

`offset:` Provide an offset to skip to a certain element in the result, for paging.

`limit:` Specify maximum number of results to retrieve in this result. Page size.

`includeAllOrgUsers:` Include all organization users.


```graphql
users(
  id: ID,
  ids: [ID],
  name: String,
  organizationIds: [ID],
  offset: Int,
  limit: Int,
  includeAllOrgUsers: Boolean
): UserList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html), [UserList](https://api.veritone.com/v3/graphqldocs/userlist.doc.html)

---
#### watchlist

_**Arguments**_<br/>

`id:`

```graphql
watchlist(id: ID!): Watchlist
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Watchlist](https://api.veritone.com/v3/graphqldocs/watchlist.doc.html)

---
#### watchlists

_**Arguments**_<br/>

  id:
  
  maxStopDateTime:
  
  minStopDateTime:
  
  minStartDateTime:
  
  maxStartDateTime:
  
  name:
  
  offset:
  
  limit:
  
  orderBy:
  
  orderDirection:
  
  isDisabled: Set `true` to include only disabled watchlist or `false` to include only enabled watchlists. By default,
  both are included.

```graphql
watchlists(
  id: ID,
  maxStopDateTime: DateTime,
  minStopDateTime: DateTime,
  minStartDateTime: DateTime,
  maxStartDateTime: DateTime,
  name: String,
  offset: Int,
  limit: Int,
  orderBy: WatchlistOrderBy,
  orderDirection: OrderDirection,
  isDisabled: Boolean
): WatchlistList
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [DateTime](https://api.veritone.com/v3/graphqldocs/datetime.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [WatchlistOrderBy](https://api.veritone.com/v3/graphqldocs/watchlistorderby.doc.html), [OrderDirection](https://api.veritone.com/v3/graphqldocs/orderdirection.doc.html), [Boolean](https://api.veritone.com/v3/graphqldocs/boolean.doc.html), [WatchlistList](https://api.veritone.com/v3/graphqldocs/watchlistlist.doc.html)

---
#### widget

Retrieve a single Widget

_**Arguments**_<br/>

`id:` The widget ID

`collectionId:`

`organizationId:`

```graphql
widget(id: ID!, collectionId: ID!, organizationId: ID!): Widget
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [Widget](https://api.veritone.com/v3/graphqldocs/widget.doc.html)

---
#### workflowRuntime

Retrieve Veritone Workflow instance status by ID

_**Arguments**_<br/>

`workflowRuntimeId:` an ID

```graphql
workflowRuntime(workflowRuntimeId: ID!): WorkflowRuntimeResponse!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [WorkflowRuntimeResponse](https://api.veritone.com/v3/graphqldocs/workflowruntimeresponse.doc.html)

---
#### workflowRuntimeStorageData

Get a specific `WorkflowRuntimeStorageDataList based on workflow runtime ID

_**Arguments**_<br/>

`workflowRuntimeId:` Unique ID of the workflow instance

`storageKey:` The unique ID to retrieve a single workflow data object

`storageKeyPrefix:` A prefix filter used to return a set of workflow data items whose dataKey starts with dataKeyPrefix

`offset:` Offset for paging

`limit:` Limit on result size, for paging (page size). Note that workflow runtime data can be arbitrarily large, therefore smaller paging should be preferred.  

```graphql
workflowRuntimeStorageData(
  workflowRuntimeId: ID!,
  storageKey: String,
  storageKeyPrefix: String,
  offset: Int,
  limit: Int
): WorkflowRuntimeStorageDataList!
```

*See also:*<br/>[ID](https://api.veritone.com/v3/graphqldocs/id.doc.html), [String](https://api.veritone.com/v3/graphqldocs/string.doc.html), [Int](https://api.veritone.com/v3/graphqldocs/int.doc.html), [WorkflowRuntimeStorageDataList](https://api.veritone.com/v3/graphqldocs/workflowruntimestoragedatalist.doc.html)
