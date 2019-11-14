# The Veritone GraphQL Schema Files

Some commonly available tooling for GraphQL, including code generators,
requires a schema reference.

Current V3 schema files are available at:

* [schema.graphql](/schemas/api/v3/schema.graphql ':ignore')
* [schema.json](/schemas/api/v3/schema.json ':ignore')

The GraphQL server provides introspection queries that can be used to
dynamically inspect the schema. These queries have complete access to
all schema metadata in the same way that the server itself does.

Access these queries with the special `__schema` and `__type` queries.

For example:

```graphql
query {
  __schema {
    types {
      name
      kind
      description
      fields {
        name
        type {
          name
          description
        }
        description
        args {
          name
          description
          type {
            name
            description
          }
          defaultValue
        }
      }
    }
  }
}
```

This query generates:

```json
{
  "data": {
    "__schema": {
      "types": [
        {
          "name": "Query",
          "kind": "OBJECT",
          "description": "Queries are used to retrieve data. If you're new to our API,\ntry the me query to explore the information you have access to.\nHit ctrl-space at any time to activate field completion hints, and\nmouse over a field or parameter to see its documentation.",
          "fields": [
            {
              "name": "temporalDataObjects",
              "type": {
                "name": "TDOList",
                "description": ""
              },
              "description": "Retrieve a list of temporal data objects.",
              "args": [
                {
                  "name": "applicationId",
                  "description": "Application ID to get TDOs for. Defaults to the user's own application.",
                  "type": {
                    "name": "ID",
                    "description": "The ID scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as \"4\") or integer (such as 4) input value will be accepted as an ID."
                  },
                  "defaultValue": null
                },
                {
                  "name": "id",
                  "description": "Provide an ID to retrieve a single specific TDO.",
                  "type": {
                    "name": "ID",
                    "description": "The ID scalar type represents a unique identifier, often used to refetch an object or as key for a cache. The ID type appears in a JSON response as a String; however, it is not intended to be human-readable. When expected as an input type, any string (such as \"4\") or integer (such as 4) input value will be accepted as an ID."
                  },
                  "defaultValue": null
                },
                {
                  "name": "offset",
                  "description": "Provide an offset to skip to a certain element in the result, for paging.",
                  "type": {
                    "name": "Int",
                    "description": "The Int scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. "
                  },
                  "defaultValue": "0"
                },
                {
                  "name": "limit",
                  "description": "Specify maximum number of results to retrieve in this result. Page size.",
                  "type": {
                    "name": "Int",
                    "description": "The Int scalar type represents non-fractional signed whole numeric values. Int can represent values between -(2^31) and 2^31 - 1. "
                  },
                  "defaultValue": "30"
                },
```

GraphQL schema files are auto-generated in `.graphql` and `.json` format.

To generate your own copies from Veritone's, or any other, GraphQL endpoint, try GraphCool's get-graphql-schema tool:  https://github.com/graphcool/get-graphql-schema.
