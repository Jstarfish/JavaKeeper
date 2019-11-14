# Authentication and Authorization Tokens

This tutorial covers some common questions Veritone API users might have, such as

* what is a token;
* where do I get one;
* what am I allowed to do with it?

First, as noted on the main [authentication page](/apis/authentication), the Veritone API
accepts authentication in the standard form of a bearer token in
the HTTP `Authorization` header:

```bash
curl https://api.veritone.com/v3/graphql -H 'Authorization: Bearer <token goes here> ' -H 'Content-Type: application/json' -d '{"query" : "query { me { id }}"}'
```

This is the _only_ authentication method accepted by the API.
Interactive user interfaces acquire and submit this token on behalf of the user.

A token is always an opaque string of letters, numbers, and the characters `-` and `:`.

The token serves to 1) identify the client to the Veritone platform and
2) describe the rights and privileges the client has over resources.

There are several types of tokens that a client developer may come across,
depending on whether they are developing an engine, developing an application,
or doing ad-hoc testing.

## User Tokens

A user, or session-based token, is scoped to an individual user within
an organization. User tokens are not persistent; they expire.

User tokens should be used within any interactive, end-user application,
whether it be web-based, mobile, or otherwise. The user must have an
account on the Veritone platform within the target environment (for example,
[http://https://www.veritone.com/login/#/]). A user account is created within
an organization by organization administrators or Veritone staff.

Each user is granted certain privileges, or roles, within the organization.
Each role carries with it certain functional rights enforced within the API.
For example, a user with the "Developer Editor" role within the "Developer"
platform application has rights required to list, create, and update
the organization's engines with `engines(...)`, `createEngine(...)`,
`updateEngine(...)`, and other related queries and mutation.

To provision a user account or modify roles, contact your organization
administrator or Veritone support. The organization administrator can
manage users with the main Veritone administration interface.

The roles that are available to assign to users depend on the applications
and features that are provisioned for the organization. For example,
and organization must be entitled to use the Veritone Developer Application (VDA)
in order for any of its users to have the "Developer" roles.

If you are _using_ an interactive user application, the application will
authenticate you, acquire a token, and send the token on your behalf.
You might need to have certain roles on your account in order for the
application's features to work, but you do not need to worry about
tokens or authentication.

If you are _developing_ an interactive user application, then the
application code will need to authenticate the user to acquire the session
token and then provide that token with every API request.

The preferred method to authenticate in this case is _OAuth flow_, as described
[here](/apis/authentication). OAuth is an industry standard and is
secure and flexible with a rich set of tooling and infrastructure to
support it.

In certain situations a client application might not be able to use OAuth.
Such clients can authenticate directly to the Veritone API using the
`userLogin` mutation.

```graphql
mutation {
  userLogin(input: {
    userName: "sampleuser@veritone.com"
    password: "sample password"
  }) {
    token
  }
}
```

If successful, a token is returned:

```json
{
  "data": {
    "userLogin": {
      "token": "c45360ca-5110-3cdb-1252-ae9dda1e29ce"
    }
  }
}
```

This user token can then be used to authenticate to the API.

_Important_:  An application should log in _once_ and use the resulting
token for the duration of the session. Do _not_ log in before every request!

## API Keys

Some ecosystem developers only build system integrations or engines
and may never have a cause to deal with user accounts or tokens.

Such developers will generally rely on specially provisioned, persistent tokens called
API keys.

API keys can be used for testing engine code and for
intended for long-running system components. For example, if you have a
service such as a webhook handler that needs to use the Veritone API,
you can acquire an API key with appropriate rights and configure your
service to send it when authenticating to the API.

To provision an API key, your organization administrator can use
the administration interface.

* Go to the Veritone Admin app
* Navigate to the organization overview page for your organization
* Click the "API Keys" tile
* Click "Add token"
* Give the token a distinct name that indicates its purpose (for eample, "webhook-handler")
* Select appropriate rights. Use caution and do not add more rights than are strictly necessary.
They can be updated later if necessary.
* When you click "Save", the entire token will be displayed.
Copy it to the clipboard and store it somewhere safe.
For security reasons, the UI does not display actual tokens in the listing.
* If necessary, come back to this tile later to edit the token and change its rights.
You can also revoke the token from this page.

_Warning_:  API keys are sensitive information. They are persistent,
lasting until revoked, and enable broad access to your organization's data.
Store them only in secure locations and give them out only to trusted
users with a true need for the access.

In some cases Veritone support may serve as organization administrator and
provide API key.

Like user tokens, API key are given functional rights. Within a given
operation, and API keys has implicit access to all of your organization's
data. For example, an API key with the 'read TDO' right can read
_all_ of your organization's TDOs.

## Engine Tokens

Engine processing poses a complex authorization problem.

As a cognitive processing consumer, you create or ingest content
and then run a variety of engines against that content. Whether you
do so using the Veritone CMS application or some other method,
you select content and select engines. You implicitly authorize
the engines to access _that specific content_.

The engines
can include core Veritone engines as well as third-party engines
produced by the Veritone developer ecosystem. You might, as a consumer,
not even know exactly which engines are being run.

For the engine to work and produce results, the engine code must
have access to the content you ran it on (typically a TDO and associated
assets). The engine must also be able to store its output and associate
it with your content (typically as a new asset on the target TDO).

However, the engine should _not_ be able to access any _other_ content
within your organization. Nor should it be able to modify your content
in unexpected ways. For example, say you have uploaded two media
files to CMS:

* `meetingRecording.mp4`
* `securityCameraStream-2018-05-08.mp4`

Each upload results in a new TDO with a single media asset.
You then use the CMS interface to run the default transcription engine
against `meetingRecording.mp4`. This creates a new job with several tasks:
one for transcoding, one for transcription, perhaps others.

The transcription engine will use the Veritone API to retrieve and process your content and store its results.
The engine should be able to:

* retrieve metadata about `meetingRecording.mp4`
* download `meetingRecording.mp4`
* update the status of its own task
* create and upload an asset containing the transcript and attach it to
the TDO for `meetingRecording.mp4`

The engine should _not_ be able to:

* retrieve metadata about `securityCameraStream-2018-05-08.mp4`
* delete the media asset for `meetingRecording.mp4`
* update the status of the transcoding engine's task _or_ any other task
* retrieve or modify other types of data in your organization, such as
user information, libraries, etc.

In other words, when processing a task, an engine should have permission
_only_ to access the data targeted in the task and write its own results
to the appropriate location.

To enforce these constraints, the platform generates a special,
single-use token for each task. The token comes with a built-in set
of rights that allow the engine to perform its intended function
on the target data _and nothing else_. Since the token is intended
for one-time use in a single engine task, it expires after an
appropriate time window.

When examining the rights associated with an engine token through the
API (see below for details), you will see something like this:

```json
{
  "myRights": {
    "operations": [
      "asset:uri",
      "asset:all",
      "recording:read",
      "recording:update",
      "task:update"
    ],
    "resources": {
      "Job": [
        "1923036a-abac-482a-9e68-d10d43f42849"
      ],
      "Task": [
        "1923036a-abac-482a-9e68-d10d43f42849-eaf8bc0c-a197-4691-9c24-f8d34b791acb"
      ],
      "TemporalDataObject": [
        "400000148"
      ]
    }
  }
}
```

Note that the rights include a limited set of functional permissions appropriate
for the engine (in this case, read a TDO and update its task) _and_
rights to a specific set of objects:  the job and task object under which
the engine was invoked, and the TDO that it will process.

Certain rights are also derived from the those rights declared in the token.
For example, an engine can access an asset it just created, as long as it
sets source data on that asset with the correct task ID.

Any attempt using this engine token (whether by the engine at runtime or
in manual testing) to perform any other type of operation or access
any other data will result in a `not_allowed` error. For example,
with the above sample token rights, an engine cannot invoke
`updateTDO` on _any_ TDO (including its target) or call `updateTask` on
any task other than the ID specified in `resources.Task`.

Engine tokens are generated by the platform system components during
engine execution and are intended for one-time use for a specific job.
Thus, they are not suitable for testing engine code during development.
For that purpose, use an API key as described above.

## Examining and Troubleshooting Tokens

The Veritone GraphQL API authorizes access by functional rights
at the level of individual fields within the top-level GraphQL query.
Error responses follow the general pattern described in
[Error Codes](/apis/error-codes.md) -- the HTTP request will return
with HTTP 200, the `errors` section of the payload will be non-empty
and contain the message and other information about the error,
and the affected field in the `data` element
will be `null`. The error type is listed in the `name` field.
Most authorization errors surface as `not_allowed`. You may occasionally
see `not_found`.

The API enforces authorization on _resources_ as well as operations.
For example, if you create a temporal data object (TDO) and do not make it
public, users from other organizations do not have any access to it.
If you do make the TDO public, then users from other organizations
can read the TDO and its data, but not modify it in any way.

The error messages and payloads that the API returns include
as much detail as is possible to share without potentially
compromising the confidentiality and integrity of your data.

### "not_allowed" Errors

A `not_allowed` error can occur under normal conditions when a client
attempts to access some field, query, or mutation that it is not
authorized to use. It does not indicate an error in the server or API.

Resolution steps may include:

* Switch tokens. For example, if you are using a user token to test
engine code, switch to an engine token or API token for a more realistic
test
* Remove the affected field, query, or mutation from your request. If
the field is not strictly necessary for your use case, simply do not use it.
* Get help from your organization admin to give your user or API token
additional rights. For example, if you are developing an engine, you should
probably have the "developer editor" role. If you are writing a system
integration that creates jobs using an API token, that token may need
"full job permission" rights.

To handle a `not_allowed` error, first examine the entire response payload
and the token itself.

Here's a sample `createEngine` attempt:

```graphql
mutation {
  createEngine(input: {
    name: "foo"
    categoryId: "bar"
    deploymentModel: HumanReview}
  ) {
    id
  }
}
```

And here's the response for a token that does not have sufficient rights
to create an engine:

```json
{
  "errors": [
    {
      "message": "The authenticated user or token is not authorized to perform the requested action.",
      "data": {
        "field": "createEngine",
        "type": "Mutation",
        "rights": [
          "asset:uri",
          "job:create",
          "job:read",
          "job:update",
          "job:delete",
          "task:update",
          "recording:create",
          "recording:read",
          "recording:update",
          "recording:delete",
          "report:create",
          "ingestion:read",
          "ingestion:create",
          "ingestion:update",
          "ingestion:delete"
        ]
      },
      "name": "not_allowed",
      "time_thrown": "2018-05-09T21:48:00.680Z"
    }
  ],
  "data": {
    "createEngine": null
  }
}
```

The Veritone API provides some queries that can be useful for understanding
what client information is associated with a given token and what rights are
associated with it.

For example, the following query will return some information about the
authenticated user, their organization, and the functional rights available.
This is just an example - additional fields can be added to the user and
organization fields as needed.

```graphql
query {
  me {
    id
    name
    organization {
      id
      name
    }
  }
  myRights {
    operations
    resources
  }
}
```

Since GraphiQL is an interactive, browser-based application that requires
the user be logged into the platform, it implicitly will only use the user-scoped
session token. It isn't ideal for testing with or troubleshooting the other
token types. For this purpose (only) we use a raw HTTP client such as `curl`.

```bash
curl https://api.veritone.com/v3/graphql \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token here>' \
  -d '{"query": "query { me { id name organization { id name }} myRights { operations resources }}"}'
```

The details of the response will depend on the token in question.
Just for example, for a user who has the developer editor role
we might see something like the following.

```json
{
  "data": {
    "me": {
      "id": "e92d0333-4ac2-69a0-4d95-dbc2eb5240c3",
      "name": "sampleuser@veritone.com",
      "organization": {
        "id": "1111111111",
        "name": "Sample Organization"
      }
    },
    "myRights": {
      "operations": [
        "job.create",
        "job.read",
        "job.update",
        "job.delete",
        "task.create",
        "task.read",
        "task.update",
        "task.delete",
        "recording.create",
        "recording.read",
        "recording.update",
        "recording.delete",
        "developer.access",
        "developer.docker.org.push",
        "developer.docker.org.pull",
        "developer.engine.read",
        "developer.engine.update",
        "developer.engine.create",
        "developer.engine.delete",
        "developer.engine.disable",
        "developer.engine.enable",
        "developer.build.read",
        "developer.build.update",
        "developer.build.delete",
        "developer.build.deploy",
        "developer.build.submit",
        "developer.build.pause",
        "developer.build.unpause",
        "developer.build.approve",
        "developer.build.disapprove",
        "developer.task.read"
      ],
      "resources": {}
    }
  }
}
```

The details of the `myRights` payload are used and managed internally
and subject to change. However, they may still suffice to give a general
idea of what rights a token has and why certain GraphQL queries or
mutations return a `not_allowed` error. For example, `job.create` is required
for `createJob`.

You may also encounter a `not_allowed` if you attempt an unauthorized
operation on a resource that you can read, but not edit.
For example, if you attempt to run `updateTDO` on a TDO that is owned
by another organization but is public (readable to you), you will
receive `not_allowed`. Similarly, if you run `updateTDO` on a TDO that
is owned by your organization _but_ your user or API key does not have
permission to update TDOs, you will receive `not_allowed`.

### "not_found" Errors

If you do not have read access to a given resource, for example if it is
owned by another organization and is private, the resource is effectively
invisible to you through the API. It will not be returned, even in partial
form, in any listing. For example, the following query returns only TDOs
to which the client has at least read access:

```graphql
query {
  temporalDataObjects(includePublic: true) {
    records {
      id
    }
  }
}
```

Inaccessible resources are simply not returned. There is no error.

However, this query attempts to access a specific resource by ID:

```graphql
query {
  temporalDataObject(id: 4000051912345) {
    id
  }
}
```

If the resource does not exist _or_ does exist but you do not have access
to it, you'll receive a `not_found`:

```json
{
  "data": {
    "temporalDataObject": null
  },
  "errors": [
    {
      "message": "The requested object was not found",
      "name": "not_found",
      "time_thrown": "2018-05-09T23:05:14.864Z",
      "data": {
        "objectId": "4000051912345",
        "objectType": "TemporalDataObject",
        "errorId": "062884db-f227-4bfe-ad44-370c30b855bf"
      }
    }
  ]
}
```

In the latter case, you must of course have got the ID from somewhere in
order to bootstrap the query. The object may have been made private,
or un-shared, at some point. Or it may have been passed through some side channel
(email, instant message, etc.) by a user who does have access to it.
In any case, unauthorized objects are effectively invisible; the caller is
not entitled to know if they exist or not.

An unexpected `not_found` can indicate that:

* the resource has been deleted
* the resource is owned by another organization and your access has been revoked
* you are inadvertently using a token for a different org (such as a personal
  free developer account, versus an organization for you company)
* you are using an engine token that was created for a different job (this is a common mis-step)

Resolutions may include:

* Just don't attempt to access the resource. Ignore the error and continue,
or, if you're testing, use a resource that you do have access to.
* Locate the owner of the resource (whoever gave you its ID) and ask them to
share it with your organization or make it public (they might, of course, decline to do so).
* If you're using an API token, ensure that it is for the correct organization.
* If you're using an engine token, generate a fresh engine payload and test task.
This payload will contain a new token with appropriate rights for the
resources referenced in the task.
