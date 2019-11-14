# aiWARE APIs

Veritone's full suite of APIs enables you to easily add cognitive functionality and intelligent features to your custom solution.

![Integration](../overview/architecture-overview/stack-integration.svg)

Our API is built around the GraphQL paradigm to provide a more efficient way to deliver data with greater flexibility than a traditional REST approach.
GraphQL is a powerful query language that operates via a single endpoint using conventional HTTP requests and returning JSON responses.
The JSON-based structure not only lets you call multiple nested resources in a single query, it also allows you to define requests so as to specify the exact data that you want sent back.
(No more sifting through a "kitchen sink" REST response.
*You* decide which fields to aggregate in the response.)

## Base URL {docsify-ignore}

Veritone API uses a single endpoint for making ad-hoc requests and to integrate API into third-party applications. All requests must be HTTP POST to [https://api.veritone.com/v3/graphql](https://api.veritone.com/v3/graphql) with *application/json* encoded bodies.

<!-- markdownlint-disable MD031 -->
> ### Base URL for Engine Development
>
> Engines in Veritone follow a different endpoint protocol for accessing the API.
> To ensure successful API execution across different environments, the API base URL is passed in the Task Payload at engine runtime.
> Once your engine receives the Task Payload, use the `veritoneApiBaseUrl` field value to construct the GraphQL endpoint for requests.
> For example:
>
> ```javascript
> const apiUrl = payload.veritoneApiBaseUrl + '/v3/graphql';
> ```
>
> It’s important that the standard API endpoint (referenced above) is not hard coded in your engine and that only the base URL provided in the Task Payload is used to make requests.
> For more information, see [Building Engines](/developer/engines/).
<!-- markdownlint-enable MD031 -->

### Authentication

All API requests must be authenticated using an API Token. To authenticate your calls, provide the token in the *Authentication* header of the request with a value *Bearer \<token\>*. Requests made without this header or with an invalid token will return an error code. For information about generating an API Token, see [Authentication](/apis/authentication).

### GraphiQL Playground

To make it easier to explore, write, and test the API, we set up [GraphiQL](https://api.veritone.com/v3/graphiql) — an interactive playground that gives you a code editor with autocomplete, validation, and syntax error highlighting features. Use the GraphiQL interface to construct and execute queries, experiment with different schema modifications, and browse documentation. In addition, GraphiQL bakes authorization right into the schema and automatically passes the *Authentication* header with a valid token when you’re logged into the Veritone system.

Veritone’s GraphiQL interface is the recommended method for ad-hoc API requests, but calls can be made using any HTTP client. All requests must be HTTP POST to the https://api.veritone.com/v3/graphql endpoint with the *query* parameter and *application/json* encoded bodies. If you’re using a raw HTTP client, the query body contents must be sent in a string with all quotes escaped (see [GraphQL Basics](/apis/tutorials/graphql-basics) for more information).

### API Documentation

For full Veritone API documentation, see our [GraphQL docs](https://api.veritone.com/v3/graphqldocs/).

### We’re here to help!

We’ve tried to pack our API section with detailed information and a variety of examples to assist you in your development. But if you have questions or need assistance, don’t hesitate to reach out to our Developer Support Team by [email](mailto:devsupport@veritone.com) or on [Slack](https://chat.veritone.com/) for help.

### In this section

<!--TODO: Remove these links and leverage the sidebar or some embeddable widget-->

* [The Veritone API Data Model](/apis/data-model)

* [Using GraphQL](/apis/using-graphql)

* [Authentication](/apis/authentication)

* [Error Codes](/apis/error-codes)

* [Tutorials](/apis/tutorials/)
