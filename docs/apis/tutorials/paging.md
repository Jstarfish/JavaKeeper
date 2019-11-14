# Paging

Many queries can return a large number of results. Consider
a simple query over jobs -- a typical organization will have
thousands, if not millions, of jobs in the system.
Similarly, an organization may have many thousands of temporal data objects.

It isn't realistic for any client, or for the server, to attempt to
process or display the entire result set at once. Therefore, the API
support paging in a fairly typical way.

Some client developers may have implemented paging in a REST API.
Paging in our GraphQL is very similar, but GraphQL poses a potential
complexity. We'll take the simple case first.

## Array Types in GraphQL

In the GraphQL schema, each field (recall that a query is simply a
field on the special type `Query`) declares its return type.
For example, `name: String` indicates that the field is a string.
Brackets indicate that the field is an _array_ of the type.
For example, `names: [String]` would be an array of strings.

Some fields on the Veritone schema use simple arrays.
For example, the `User` type has a list of user settings.
Here's the schema definition:

```graphql
# Settings for the user
userSettings: [UserSetting!]
```

And here's a sample query:

```graphql
query {
  me {
    userSettings {
       key
       value
    }
  }
}
```

The values within the field are returned as a JSON array:

```json
{
  "data": {
    "me": {
      "userSettings": [
        {
          "key":"favoriteAnimal",
          "value":"hedgehog"
        }, {
          "key":"favoriteFood",
          "value":"deep-fried turtle"
        }
      ]
    }
  }
}
```

This method works well for fields where the list size is known to be small.
In this case, we know that the number of user preferences will not be large;
even the pickiest user would have less than 100. Any server or client
implementation can easily hold and process such a list in memory, and
a client UI could support it with at most simple scrolling.

However, this does not work for cases such as those described above,
where the number of results can be in the hundreds, thousands, or millions.
Such fields support paging.

## Paged Fields

A common paradigm for paged fields is implemented across the API.

Every paged field returns a _list_ type.
For example, the `jobs` query returns `JobList`.
Each object type has its own list type, but they all comply with the
same schema. The only difference is in the field type of the `records`
array, which contains the actual objects.

Further, each paged field takes a standard pair of parameters that control
paging.
For example, here is the definition for `jobs`:

```graphql
type Query {
  jobs(
    # Provide an offset to skip to a certain element in the result, for paging.
    offset: Int = 0
    # Specify the maximum number of results to included in this response, or page size.
    limit: Int = 30
  ): JobList!
}

type JobList implements Page {
  # Jobs retrieved
  records: [Job!]
  # The starting index for records that were returned in this query.
  offset: Int!
  # Maximum number of results that were retrieved in this query; page size
  limit: Int!
  # Number of records returned in this response
  count: Int
}
```

Here we'll ask for the first page of three:

```graphql
query {
  jobs (offset: 0 limit: 3){
    count
    offset
    limit
    records {
      id
    }
  }
}
```

`JobList` represents a single page of results. The actual `Job` objects
are contained in the `records` field.

```json
{
  "data": {
    "jobs": {
      "offset": 0,
      "limit": 3,
      "count": 3,
      "records": [
        {
          "id": "bf133402-4945-4b0c-950f-f46c9b935139"
        },
        {
          "id": "fa254e47-0b0d-41d5-9671-2006581a3606"
        },
        {
          "id": "cc7f95bb-e5a0-4a1e-9a11-04e6b58dc1be"
        }
      ]
    }
  }
}
```

As you can see, `records` is an array of objects, each of which contains
the fields we requested under `records` in our query. `offset` and `limit`
reflect the values passed by the client. `count` is the actual number of
results returned.

A _total_ count of all possible results that can be returned by the query
across all pages cannot be reliably computed by the server in a performant
way for all queries. Thus, this value is not included in the schema.
The client cannot know ahead of time how many results there are; it must
iterate over the pages until it reaches the end.

The API follows the following contract across all paged fields:

* the default offset is 0 (first page)
* there is a default page size, almost always 30 (documented per field)
* the number of objects returned in `records` will be less than or equal
to the value set for `limit`
* `count` will equal the size of the `records` array
* if `count` is less than `limit`, there are no more results available; the client
has reached the last page
* a request for a nonexistent page (`offset` greater than total possible results)
returns an empty page, not an error

Therefore, the client can iterate over pages until it reaches a page with
less than the requested number of results. That is the last page. If the
total number of results divides evenly by the page size, the last page will
have size zero.

## Paging and Nested Fields

Let's take a more complex query that retrieves nested fields:

```graphql
query {
  jobs (offset: 0 limit: 3){
    count
    offset
    limit
    records {
      id
      tasks (offset: 0 limit: 3){
        count
        offset
        limit
        records {
          id
        }
      }
    }
  }
}
```

Note that:

* the nested `tasks` field _also_ is paged
* the page parameters for `jobs` and its nested `tasks` are independent

It returns:

```json
{
  "data": {
    "jobs": {
      "count": 3,
      "offset": 0,
      "limit": 3,
      "records": [
        {
          "id": "fb32d786-b5c8-4982-b7b1-cb25e4e5c03f",
          "tasks": {
            "count": 3,
            "offset": 0,
            "limit": 3,
            "records": [
              {
                "id": "fb32d786-b5c8-4982-b7b1-cb25e4e5c03f-c7fb88d8-8cbb-43b1-ae20-3d8c737308c5"
              },
              {
                "id": "fb32d786-b5c8-4982-b7b1-cb25e4e5c03f-7971dc08-04c3-4b94-a7d2-6082fe9e1950"
              },
              {
                "id": "fb32d786-b5c8-4982-b7b1-cb25e4e5c03f-b17c3776-24bc-4cb4-9513-b1724db85e34"
              }
            ]
          }
        },
        {
          "id": "56e352e8-6c63-4d9f-9995-03c96f6e6ec5",
          "tasks": {
            "count": 1,
            "offset": 0,
            "limit": 3,
            "records": [
              {
                "id": "56e352e8-6c63-4d9f-9995-03c96f6e6ec5-4e133ed8-08b0-493d-8c6a-44a1daf98e3b"
              }
            ]
          }
        },
        {
          "id": "cc7f95bb-e5a0-4a1e-9a11-04e6b58dc1be",
          "tasks": {
            "count": 1,
            "offset": 0,
            "limit": 3,
            "records": [
              {
                "id": "cc7f95bb-e5a0-4a1e-9a11-04e6b58dc1be-fa8e969d-0e8b-45b7-ba79-857d1efdb656"
              }
            ]
          }
        }
      ]
    }
  }
}
```

As we examine the response, some important facts become apparent.

* the `tasks` field involves retrieving and populating a separate set of
objects _per job_ in top-level job page. Thus, this query can be considerably
more expensive than the original `jobs` query even though the page size is
the same.
* both `jobs` and the `tasks` field within a given `Job` are paged.
Therefore, to get the full list of all tasks for all jobs a client would need
to implemented nested or recursive paging:  for each page of `Job` results,
iterate over the jobs, and for each one iterate over its `tasks` results.

The implications of nested paging for the client depend entirely on what
that client needs to do. Should it iterate recursively over all results?
This might be appropriate for, for instance, a script that exports a
library full of entities and entity identifiers (three nested levels of paging).
Or should it get only the top level (jobs, in our example) and drill into
pages sub-fields on demand? For most interactive user interfaces, that is the
most effective model.

In all cases it is important to choose an appropriate page size that
will allow each HTTP request to complete in an acceptable amount of time.

## Choosing an Appropriate Page Size

The default page size is suitable for most almost all cases.
A smaller page size can always be used without ill effect.

### Large Page Sizes

In some cases you may want to make query that returns minimal information
about each object but an entire result set. For example, you might want
to get the entire list of engine names and IDs within a given category.
Simply set a very large page size:

```graphql
query {
  engines(categoryId: "6faad6b7-0837-45f9-b161-2f6bf31b7a07", limit: 500) {
    records {
      id
      name
    }
  }
}
```

Note that this is a good practice _only_ for queries that include a small
selection of scalar fields.

Some queries may enforce a maximum page size. This varies per query.
If you make a query with a `limit` value that exceeds the maximum allowed
value you will receive a `invalid_input` error with message and payload
describing the problem.
