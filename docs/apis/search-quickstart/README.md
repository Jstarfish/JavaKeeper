# Search Quickstart Guide

## Getting Started

Veritone Search API includes rich, full-text search features to query against an organization’s public and private media indexes. The search function is highly customizable includes core functions that support parsing, aggregation, and auto-completion. Searches are performed using a variety of supported query types, expressed in JSON. Most search operations make use of optional query configurations that allow you to control the search behavior and narrow results by defining aspects of the content and values.

Veritone API is built around the GraphQL paradigm to provide a more efficient way to deliver data with greater flexibility than a traditional REST approach. GraphQL is a query language that operates over a single endpoint using conventional HTTP requests and returning JSON responses. The structure not only lets you call multiple nested resources in a single query, it also allows you to define requests so that the query you send matches the data you receive.

To make effective use of the Search API, you’ll need to know a few things about how data is stored in Veritone, the various options for structuring queries, and requirements for performing successful requests. This quickstart guide provides everything you need to help get your integration up and running as quickly as possible. We designed this quickstart to be user-friendly and example-filled, but if you have any questions, please don’t hesitate to reach out to our [Developer Support Team](mailto:devsupport@veritone.com) for help.

### **Base URL**

Veritone uses a single endpoint for accessing the API. All calls to the API are *POST* requests and are served over *http* with *application/json* encoded bodies. The base URL varies based on the geographic region where the services will run. When configuring your integration, choose the base URL that supports your geographic location from the list below.

<table>
  <tr>
    <td><b>Region</b></td>
    <td><b>Base URL</b></td>
  </tr>
  <tr>
    <td>United States</td>
    <td>[https://api.veritone.com/v3/graphql](https://api.veritone.com/v3/graphql)</td>
  </tr>
  <tr>
    <td>Europe</td>
    <td>[https://api.uk.veritone.com/v3/graphql](https://api.uk.veritone.com/v3/graphql)</td>
  </tr>
</table>

*Note:* The above base URLs are provided for use within SaaS environments. On-prem deployments access the API using an endpoint that's custom configured to the environment.

### **Making Sample Requests**

To make it easier to explore, write, and test the API, we set up [GraphiQL](https://api.veritone.com/v3/graphiql) — an interactive playground that gives you a code editor with autocomplete, validation, and syntax error highlighting features. Use the GraphiQL interface to construct and execute queries, experiment with different schema modifications, and browse documentation. In addition, GraphiQL bakes authorization right into the schema and automatically passes the *Authentication* header with a valid token when you’re logged into the Veritone system.

Veritone’s GraphiQL interface is the recommended method for ad hoc API requests, but calls can be made using any HTTP client. All requests must be HTTP POST to the base URL for your geographic region with the *query* parameter and *application/json* encoded bodies. In addition, requests must be authenticated using an API Token. Pass the token in your request using the *Authorization* header with a value *Bearer token*. If you’re using a raw HTTP client, the query body contents must be sent in a string with all quotes escaped.

### **Authentication**

Veritone Job API uses bearer token authentication for requests. To authenticate your calls, provide a valid API Token in the *Authentication* header of the request with the value *Bearer token*. Requests made without this header or with an invalid token will return an error code.

An API Token can be generated in the Veritone Admin App by your organization administrator. If your organization does not use the Admin App, please contact your Veritone Account Manager for assistance.

**To generate an API Token:**
1. Log into the Veritone Platform and select **Admin** from the *App Picker* drop-down. The *Admin App* opens.
2. Click the **API Keys** tile. The *API Key* page opens.

![Get API Token](Get-API-Token-1.png)

3. Click **New API** Key. The *New API Key* window opens.

![Get API Token](Get-API-Token-2.png)

4. Enter a token name and select the permissions needed for the token to perform the required API tasks. Click **Generate Token** to save. The *Token Generated* window opens.
5. Copy your token and click **Close** when finished.

*Note:* Once the *Token Generated* window closes, the token code no longer displays and it cannot be viewed again.

### Relevance

Search operations return results in order of relevance — the result that’s most relevant to the search query is the first item in the result set, and the least relevant is last. Relevance scoring is based on three primary factors:

*  **Term Frequency:** How often does the term appear in the field? The more often, the more relevant. A field containing five instances of the same term is more likely to be relevant than a field containing just one mention.
*  **Inverse Index Frequency:** How often does each term appear in the index? The more often, the less relevant. Terms that appear in many records have a lower weight than more-uncommon terms.
*  **Field Length:** How long is the field? The longer it is, the less likely it is that words in the field will be relevant. A term appearing in a field with a short title carries more weight than the same term appearing in a long content field.

## Query Basics & Syntax

Veritone Search API gives you the flexibility to build a variety of query types to search and retrieve indexed media and mentions content. The Search API allows you to combine a series of simple elements together to construct queries as simple or as complex as you’d like in JSON format. Although queries are customizable, there is a common structure and set of core parameters that each must use. In addition, there are a number of optional filters, components, and syntax options that can be specified to modify a query.

### Content Type

Searches in Veritone are performed against two types of content: media and mentions. Each request must specify one of the following search content types as the root operation of the request.
*  **Search Media:** The *Search Media* operation searches media files and assets for matching records.
*  **Search Mentions:** The *Search Mentions* operation searches for matching records in mentions and watchlists.

#### **Required Query Parameters**

Regardless of the level of complexity, each search query in Veritone operates on four core elements: an *index*, a *field*, an *operator*, and an operator value or variable(s).

##### **Index**

All search functionality runs against Veritone’s public and private index databases. The *index* field defines whether to search the organization’s public or private index (or both) for matching documents. There are two possible *index* values: "global," which refers to the public media index, and "mine", which refers to private media uploaded to an account. Each request must specify at least one *index* value enclosed in brackets.

##### **Field**

Content in Veritone is made searchable by mapping to specific document and data types. The *field* parameter defines the type of data/document to be searched, and each query must specify a value for the *field* property to be successful. If a *field* value is not provided, an empty result set will be returned. The *field* parameter uses a definitive set of values. See *Appendix 1: Fields* for more information.

##### **Operator**

Operators are the heart of the query — they describe the type of search that will be performed. Each *operator* uses one or more additional properties that add greater definition to the query criteria. All queries must specify at least one *operator*.

The table below provides an overview of the different operators that can be used. Additional information about each of the operators is provided in the section on *Query Schema and Types*.

<table>
  <tr>
    <td><h5>Operator Name</h5></td>
    <td><h5>Description</h5></td>
  </tr>
  <tr>
    <td><b>range</b></td>
    <td>Finds matching items within a specified date/time range.</td>
  </tr>
  <tr>
    <td><b>term</b></td>
    <td>Finds an exact match for a word or phrase.</td>
  </tr>
  <tr>
    <td><b>terms</b></td>
    <td>Finds exact matches for multiple words or phrases.</td>
  </tr>
  <tr>
    <td><b>query_string</b></td>
    <td>Searches plain text strings composed of terms, phrases, and Boolean logic.</td>
  </tr>
  <tr>
    <td><b>word_proximity</b></td>
    <td>Finds exact matches for words that are not located next to one another.</td>
  </tr>
  <tr>
    <td><b>exists</b></td>
    <td>Checks for the presence of a specified engine output data type.</td>
  </tr>
  <tr>
    <td><b>and</b></td>
    <td>Finds records for matching values when all of the conditions are true.</td>
  </tr>
  <tr>
    <td><b>or</b></td>
    <td>Finds matching records when at least one of the conditions is true.</td>
  </tr>
  <tr>
    <td><b>query_object</b></td>
    <td>Searches for an array of objects with a common field.</td>
  </tr>
</table>

#### **Grouping**

To apply two or more Booleans to a single field, group multiple terms or clauses together with parenthesis.

Below is an example of a search for Kobe or Bryant and basketball or Lakers.

```
value: "(kobe OR bryant) AND (basketball OR lakers)"
```

#### **Escaping Special Characters**

Veritone Search API supports escaping special characters in a query string to ensure they aren’t interpreted by the query parser. If any of the following special characters have been enabled, use a double backslash before the character to search for it.

Special characters: + - ! ( ) { } [ ] ^ " ~ * ? : \

In the example below, the ! is escaped since it’s part of the company name "ideaDes!gns".
```
value: "ideaDes\\!gns"
```

Use a single backslash to escape quotes around a phrase in a query string. The example below escapes the double quotes around "Kobe Bryant" to ensure they’re interpreted literally and not as string closers.
```
value: "\"kobe bryant\" AND (basketball OR lakers)"
```

## Query Schema and Types

Veritone Search API accepts a variety of query types, features, and options that make it easy to build queries as simple or complex as you’d like.

Queries can be constructed in multiple ways to search terms, phrases, ranges of time, and more. In addition, the Search API supports query modifiers (such as Wildcards and Select Statements) to provide an even broader range of searching options.

### **Schema**

A schema is created by supplying a *Search Media* or *Search Mentions* content type as the root operation and then providing a query object with an *operator*, *index*, *field*, and a list of other properties that describe the data you want to retrieve. All search requests specify JSON data as the response field.

#### **Sample Search Query Schema**

```graphql
 query{                 => The base query parameter used to set up the GraphQL query object. (required)
 -------request fields-----------
  searchMedia(search:{  => The content type to be searched and search variable. (required)
    index: array        => Specifies whether to search the public ("global") or private (“mine) index. (required)
    query: object       => The query object that defines the pipeline for the data to be returned. (required)
      field: string     => The data or document type to be searched. (required)
      operator: string  => The type of search to be performed. Common types include term, range, and query_string. (required)
      value: string     => The exact data to be searched for in a field. (required)
    offset: integer     => The zero-based index of the first record to show in the response. (optional)
    limit: integer      => The maximum number of results to return. (optional)
  }){
 -------return fields------------
    jsondata:       	=> A JSON object with response data. Each search request must specify jsondata as the return field. (required)
  }
}
```

### **Query Types**

Veritone supports several types of queries, which are identified by the *operator* field. Queries are organized in a hierarchical structure and use nested fields in curvy brackets. The schema uses the *query* parameter as a wrapper around a subquery that contains an *operator*, *field*, and a *value* or *variables*. The various query types allow you to customize the search — available options are described below.

#### **Term/Terms**

The *term/terms* operators are used to find exact matches of keywords or phrases. A *term/terms* query can match text, numbers, and dates. Searches produce a list of records that contain the keywords or phrases, no matter where they appear in the text.

*Important Notes:*
-       Enclose single keywords and phrases in quotation marks (e.g., "basketball", “Mike Jones”).
-       A phrase includes two or more words together, separated by a space (e.g., "free throw line"). The order of the terms in a phrase is respected. Only instances where the words appear in the same order as the input value are returned.

**Search by Term**<br>
The *term* operator is used to find an exact match for a single keyword or phrase.

The following example shows a *term* search against the global index to find media files where the word "Mike" appears in the program name.

```
query: {
  	operator: "term"
  	field: "programName"
  	value:  "mike"
  }
}
```

**Search by Terms**<br>
The *terms* operator allows you to search for multiple keywords or phrases. Search terms can include any string of words or phrases separated by commas. When submitting multiple search terms, search uses a default *OR* behavior and will return results that contain an exact match of any of the words/phrases.

*Important Note:* When building a *terms* query, note that the *terms* operator and the *values* property are written in plural form.

The example below is a *terms* search query for the words "football" and “touchdown” found in transcript text in the user’s private media index.
```
query: {
  	operator: "terms"
  	field: "transcript.transcript"
  	values: ["football", "touchdown"]
  }
```

#### **Date/Time Range Search**

The *range* operator can be used to find content that falls into a specified time frame. This query supports the following types of ranges:
-       **Inclusive Range:** Uses a combination of comparison property filters to find matching content between a specific starting and ending date.
-       **Open-Ended Range:** Uses a single comparison property filter to search before or after a specific point in time.

A *range* query must include at least one comparison property and specify the date as the value (using[ Unix/Epoch Timestamp](https://www.epochconverter.com/) format in milliseconds and UTC time zone).

**Comparison Properties**

<table>
  <tr>
    <td><h5>Name</h5></td>
    <td><h5>Description</h5></td>
  </tr>
  <tr>
    <td><b>gt</b></td>
    <td>greater than: Searches for documents created after the specified date/time.</td>
  </tr>
  <tr>
    <td><b>lt</b></td>
    <td>less than: Searches for documents created before the specified date/time.</td>
  </tr>
  <tr>
    <td><b>gte</b></td>
    <td>greater than or equal to: Searches for documents created on or after the specified date/time.</td>
  </tr>
  <tr>
    <td><b>lte</b></td>
    <td>less than or equal to: Searches for documents created on or before the specified date/time.</td>
  </tr>
</table>

**Inclusive Date Range**

To search for records created between specified dates, use two of the comparison property options to define the *to* and *from* dates.

The following example is a search against the public index for the 10 most recent media files timestamped on or after 1/26/2017, 5&#058;54:00 AM, and before 6/23/2017, 6&#058;30:00 AM.
```
query: {
  	operator: "range"
  	field: "absoluteStartTimeMs"
  	gte: 1485417954000
  	lt:  1498199400000
  }
}
```

**Open-Ended Date Range**

To search with an open-ended range (e.g., find files before a specified date), use just one of the comparison property options.

The example below shows a search for the 30 most recent media files in the public index timestamped after 3/15/2017 at 6&#058;30:00 AM.
```
query: {
  	operator: "range"
  	field: "absoluteStartTimeMs"
  	lt:  1485417954000
  }
```
#### **Query String**

The *query_string* operator performs full-text searches and constructs queries as text strings using terms, phrases, and Boolean logic. The biggest advantage of the query string is its syntax that parses multiple structured queries into simpler ones.

*Important Notes:*
-       The query string supports more complex query constructs, such as wildcard searches.
-       Multiple query statements that are not joined by the *and* operator will return results that match any of the conditions.
-       Date and time values are not supported in a query string.

The below example will return results transcripts where "Kobe Bryant" or “Lakers” was found.
```
  query: {
  	operator: "query_string"
  	field: "transcript.transcript"
  	value: "\"kobe bryant\" lakers"
	}
```

**Using AND/OR in a Query String**

You can specify a broader or more narrow search by using the *AND* and *OR* operators between values in a query string. When using *AND/OR* within a quoted string, they are treated as part of the field value (not the main query operator) and must be written in all uppercase. In addition, multiple terms in a query string can be grouped together using parenthesis to make the logic clear. Note that terms in parentheses are processed first.

The following example is a search for transcripts where "Kobe Bryant" was found with either the word “basketball” or the word “Lakers.”
```
query: {
  	operator: "query_string"
  	field: "transcript.transcript"
  	value: "\"kobe bryant\" AND (basketball OR lakers)"
	}
```

#### **Word Proximity**

While the *terms* query searches for specified terms in the exact order as the input value, a *word proximity* search allows the words to be separated or to appear in a different order. The *word proximity* operator uses the *inOrder* property as a Boolean to find terms where they do not appear together, and the *distance* property to specify the maximum number of words that can separate them.

**Word Proximity Properties**

<table>
  <tr>
    <td><h5>Name</h5></td>
    <td><h5>Required</h5></td>
    <td><h5>Type</h5></td>
    <td><h5>Description</h5></td>
    <td><h5>Example</h5></td>
  </tr>
  <tr>
    <td><b>inOrder</b></td>
    <td>yes</td>
    <td>Boolean</td>
    <td>A Boolean that when set to false searches for all of the words in an order different than the input value. Note that if the distance property has a value of 0, inOrder will be set to true.</td>
    <td>inOrder: false</td>
  </tr>
  <tr>
    <td><b>distance</b></td>
    <td>yes</td>
    <td>integer</td>
    <td>The number of non-search words that can separate the specified terms to be found. To match words in the same order as the input value, use a distance value of 0. (Note that a 0 value sets inOrder to true.) To transpose two words, enter a value of 1.</td>
    <td>distance: 10</td>
  </tr>
</table>

The following query finds the terms "NFL," “football,” and “game” in transcript text when they appear within 10 words of one another in any order.
```
 query: {
 	operator: "word_proximity"
	 field: "transcript.transcript"
     values: ["nfl football game"]
 	inOrder: false
     distance: 10
   }
```

#### **Exists**

The *exists* operator is used to check for the presence of a specific field. This query is useful for retrieving matching media files of a specific data type. If the specified *field* is not found, the operator will consider it non-existent and it will return no results.

The example below is a search for media files with the field "veritone-file.mimetype".
```
query: {
  	operator: "exists"
  	name: "veritone-file.mimetype"
  }
```

#### **And / Or (as Query Operators)**

The *and* and *or* operators allow you to combine two or more query clauses with Boolean logic to create broader or more narrow search results. These operators chain conditional statements together and always evaluate to true or false. As main query operators, *and/or* are case insensitive and can be written as uppercase or lowercase. It’s important to note that when using these operators in compound queries, *and* takes precedence over *or*.

**and Operator**

The *and* operator matches documents where both terms exist anywhere in the text of a single record.

The search below returns results for "Morning Show AM" mentions found on November 11, 2017.
```
  query: {
  	operator: "and",
  	conditions: [
  	    	{
  	            	operator: "term"
  	            	field: "trackingUnitName"
	              	value: "Morning Show AM"
  	    	},
  	    	{
  	            	operator: "term"
  	            	field: "mentionDate"
  	            	value: "2017-11-09"
  	    	}
  	 ]
  }
```

**or Operator**

The *or* operator connects two conditions and returns results if either condition is true.

The example below shows a search for the name "Bob" or “Joe” or “Sue” in a transcript or records that created on or after November 17, 2017 at 9:00 AM.
```
  query: {
  	operator: "or",
  	conditions: [
  	    	{
  	            	operator: "terms",
  	            	field: "transcript.transcript"
	              	values: ["bob", "joe", "sue"]
  	    	},
  	    	{
  	            	operator: "range",
  	            	field: "absoluteStartTimeMs"
  	            	gte: 1510909200000
  	    	}
  	 ]
  }
```

**Combining and & or**

The *and* and *or* (and *not*) operators can be combined as multi-level subqueries to create a compound condition. When these operators are used together, it’s important to note that *not* is evaluated first, then *and*, and finally *or*.

The example below is a search for records found between November 17, 2017 at 9:00 AM and December 1, 2017 at noon where the word "basketball" or “Lakers” was found in a transcript, or the NBA logo was detected.
```
   	operator: "and",
   	conditions: [
   	   	{
                  	operator: "range"
                  	field: "absoluteStartTimeMs,
                  	gte: 1510909200000
                  	lte: 1512129600000
          	},
          	{
                  	operator: "or"
                  	conditions: [
                         	{
                                	operator: "query_string"
                                	field: "transcript.transcript"
                                	value: ["basketball", "lakers"]
                         	}
                                	operator: "term"
                                	field: "logo-recognition.series.found"
                                	value: "NBA"
                         	}
                  	]
          	}
   	]
}
```

#### **Query Object**

The *query_object* operator allows an array of objects to be queried independently of one another. Each *query_object* uses a Boolean operator (e.g., *and*, *or*, *not*) to combine a list of nested subqueries. Nested subqueries can use any operator type.

The below example is a search for an ESPN logo or the words "touchdown" and “ruled” or “college” in a transcript on or before December 11, 2017 at 9:11 PM.
```
	operator: "query_object"
	query:{
    	operator: "or"
    	conditions: [{
        	operator: "range"
        	field: "absoluteStartTimeMs"
        	lte: 1513026660000
      	},
      	{
        	operator: "term"
        	field: "logo-recognition.series.found"
        	value: "ESPN"
      	},
      	{
        	operator: "query_string"
        	field: "transcript.transcript"
        	value: "touchdown AND (ruled OR college)"
      	}
     	]
  	}
```

### **Query Modifiers**

#### **Not**

A *not* modifier returns search results that do not include the specified values. Any of the query operators can be negated by adding the property *not* with a value of *true*. Note that negation is currently unsupported at the compound operator level.

The below example is a search that excludes the terms "NFL," “football,” and “game.”
```
  query: {
  	operator: "terms"
  	field: "transcript.transcript"
  	values: ["nfl", "football", "game"]
  	not: true
      distance: 10
}
```

#### **Wildcard Searches**

The *wildcard* modifier is useful when you want to search various forms of a word. Wildcard searches can be run on individual terms, using ? to replace a single character, and * to replace zero or more characters. For example, he* returns results that would include her, help, hello, helicopter and any other words that begin with "he". Searching he? will only match three-letter words that start with “he”, such as hem, hen, and her.

*Important Notes:*
-       There can be more than one wildcard in a single search term or phrase, and the two wildcard characters can be used in combination. (e.g., j*?? will match words with three or more characters that start with the letter j.)
-       Wildcard matching is only supported within single terms and not within phrase queries. (e.g., m*th* will match "method" but not “meet there”.)
-       A wildcard symbol cannot be used as the first character of a search.

#### **Select Statements**

A *select* query modifier lets you retrieve only the data that you want. It also allows you to combine data from multiple *field* property sources. Submitting a request with the *select* parameter returns full record matches for all of the specified values. To use the *select* filter, enter a comma-separated list of *field* names to return.

The example below is a search for records where "Kobe Bryant" along with either the word “basketball” or the word “Lakers” is found in either a transcript or a file uploaded to Veritone CMS.
```
  query: {
  	operator: "query_string"
  	field: "transcript.transcript"
  	value: "\"kobe bryant\" AND (basketball OR lakers)"
	},
  select: ["transcript.transcript", "veritone-file"]
}
```

## Sample Requests and Responses

Veritone’s GraphiQL interface is a service you can use to easily interact with the Search API. We recommend using GraphiQL ([https://api.veritone.com/v3/graphiql](https://api.veritone.com/v3/graphiql)) for making test API requests, but calls can also be made using a different HTTP client. All requests must be HTTP POST to the Veritone GraphQL endpoint with the *query* parameter and *application/json* encoded bodies. In addition, requests must be authenticated with an API Token. Pass the token in your request using the *Authorization* header with a value *Bearer <token>*. If you’re using a raw HTTP client, the query body contents must be sent in a string (not an object) with all quotes escaped.

Following are a variety of example queries that demonstrate how to put everything together. The sample requests provided are structured for use in our GraphiQL interface, but we’ve also included the basic cURL structure for your reference below. Please note that the examples shown do not use client information and are not language specific. For fields that require account-specific data (such as a Recording ID), replace the value with your own.

### **Basic cURL Structure**

```bash
curl -X POST \
  https://api.veritone.com/v3/graphql \
  -H 'authorization: Bearer 2079b07c-1a6f-4c2e-b534-a1aaa7f7fe42' \
  -H 'content-type: application/json' \
  -d '{
	"query": " query { searchMedia(search: { offset: 0, limit: 2, index: [\"global\"], query: { operator: \"term\", field: \"programName\", value: \"basketball\"   }}) { jsondata } }"
}'
```

### **Sample Request 1: Query Object Search**

The following example is a media search of both indexes where NBA was recognized as text and the words "Kobe Bryant" and “basketball” or “Lakers” was found in a transcript. This request also includes a select statement that limits the search to transcripts and Veritone files.
```graphql
query{
  searchMedia(search:{
    offset: 0
	limit: 1
	index: ["mine"]
	operator: "query_object"
	query:{
    	operator: "or"
    	conditions: [{
        	operator: "range"
        	field: "absoluteStartTimeMs"
        	lt: 1485417954000
      	},
      	{
        	operator: "term"
        	field: "text-recognition.series.ocrtext"
        	value: "nba"
      	},
      	{
        	operator: "query_string"
        	field: "transcript.transcript"
        	value: "\"kobe bryant\" AND (basketball OR lakers)"
      	}
     	]
  	}
}) {
	jsondata
  }
}
```

#### **Sample Response 1: Query Object Search**

```json
{
  "data": {
	"searchMedia": {
  	"jsondata": {
    	"results": [
      	{
            "recording": {
              "recordingId": "16322767",
              "fileLocation": "https://inspirent.s3.amazonaws.com/assets/16322767/b8936c78-2186-72e5-93af-5c5aa13dd982.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAI7L6G7PCOOOLA7MQ%2F20171215%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20171215T155327Z&X-Amz-Expires=604800&X-Amz-Signature=49a0bec006693905a66cfb0972167170b14947e05c66dbcf98ed705f31726a03&X-Amz-SignedHeaders=host",
              "fileType": "video/mp4",
              "programId": "-1",
 	         "programName": "Private Media",
              "mediaSourceId": "-1",
              "mediaSourceTypeId": "5",
              "tags": [
            	{
                  "value": "TEDx",
                  "displayName": "TEDx"
            	},
                {
          	    "value": "Tolo West",
    	          "displayName": "Tolo West"
            	}
          	],
              "sliceTime": 1484780795,
              "mediaStartTime": 1484780045,
              "aibDuration": 810,
              "isOwn": true,
              "hitStartTime": 1484780795,
              "hitEndTime": 1484780855
        	},
            "startDateTime": 1484780795,
            "stopDateTime": 1484780855,
        	"hits": []
      	}
    	],
        "totalResults": 728274,
    	"limit": 1,
    	"from": 0,
    	"to": 0,
  	  "searchToken": "171a1b10-e9c0-11e7-bae7-61a10650068b",
        "timestamp": 1513353207
  	}
	}
  }
}
```

### **Sample Request 2: Exists Query**

The example below is a media search against the private index for records with a filename.
```graphql
query{
  searchMedia(search:{
	offset: 0
	limit: 1
	index: ["mine"]
	query:{
    	operator: "exists"
    	name: "veritone-file.filename"
	}
  }) {
	jsondata
  }
}
```

#### **Sample Response 2: Exists Query**

```json
{
  "data": {
	"searchMedia": {
  	"jsondata": {
    	"results": [
      	{
            "recording": {
          	"recordingId": "43033727",
              "fileLocation": "https://inspirent.s3.amazonaws.com/assets/43033727/ea9d9845-775b-48cd-aada-16fa56894ba0.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAI7L6G7PCOOOLA7MQ%2F20171215%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20171215T181255Z&X-Amz-Expires=604800&X-Amz-Signature=2fd918d5ac20979bd27d365bfa455904cf1726307fddbd362a28a8bd9a0a81a8&X-Amz-SignedHeaders=host",
              "fileType": "video/mp4",
              "programId": "-1",
              "programName": "Weekly Talkshow",
              "programLiveImage": "https://inspirent.s3.amazonaws.com/assets/43033727/fe693b30-18ae-47c7-984f-530eab61d7.jpeg",
              "mediaSourceId": "-1",
              "mediaSourceTypeId": "5",
              "sliceTime": 1512682022,
              "mediaStartTime": 1512681992,
              "aibDuration": 90,
              "isOwn": true,
              "hitStartTime": 1512682022,
              "hitEndTime": 1512682082
        	},
            "startDateTime": 1512682022,
        	"stopDateTime": 1512682082,
        	"hits": [
          	{
                "veritone-file": {
              	"filename": "Veritone_v06.mp4",
                  "mimetype": "video/mp4",
                  "size": 162533502
            	}
          	}
        	]
      	}
    	],
        "totalResults": 733275,
    	"limit": 1,
    	"from": 0,
    	"to": 0,
        "searchToken": "930f0960-e1c3-11e7-9e94-eba5f6b5faf7",
        "timestamp": 1513361576
  	}
	}
  }
}
```

### **Sample Request 3: "or" Query with Negation**

The example below is a media search of the public index for Coke or Pepsi logos but not Redbull.
```graphql
query{
  searchMedia(search:{
	offset: 0
	limit: 1
	index: ["global"]
	query:{
    	operator: "or"
    	conditions: [{
        	operator: "term"
        	field: "logo-recognition.series.found"
        	value: "Coke"
        	},
        	{
        	operator: "term"
        	field: "logo-recognition.series.found"
        	value: "Pepsi"
        	},
        	{
        	operator: "term"
        	field: "logo-recognition.series.found"
        	value: "Redbull"
        	not: true
    	}]
	}
  }) {
	jsondata
  }
}
```

#### **Sample Response 3: "or" Query with Negation**

```json
{
  "data": {
	"searchMedia": {
  	"jsondata": {
    	"results": [
      	{
            "recording": {
              "recordingId": "43842334",
              "fileLocation": "https://inspirent.s3.amazonaws.com/tv-recordings/vv-stream/39898/2017/12/14/processed/39898_20171214_0720_263a786f-3d59-4572-9752-984ded917573.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAI7L6G7PCOOOLA7MQ%2F20171214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20171214T211125Z&X-Amz-Expires=604800&X-Amz-Signature=af6b9acc5b113949fb3d01ec3464c14e10449bd0bd51d250bdd906504588caa2&X-Amz-SignedHeaders=host",
              "fileType": "video/mp4",
          	  "programId": "27405",
              "programName": "Prime Time",
              "programImage": "https://s3.amazonaws.com/prod-veritone-ugc/programs/27405/3tWiUgZNS42vWB55dED3_GRftjRV6_400x400.jpg",
              "mediaSourceId": "37802",
              "mediaSourceTypeId": "2",
              "isPublic": true,
              "sliceTime": 1513236060,
              "mediaStartTime": 1513236000,
              "aibDuration": 120,
              "isOwn": false,
              "hitStartTime": 1513236064,
              "hitEndTime": 1513236067
        	},
            "startDateTime": 1513236060,
            "stopDateTime": 1513236120,
        	"hits": [
          	{
                "logo-recognition": {
	              "source": "bf50297a-55f1-5a27-17a1-d213ae0c7f55",
                  "series": [
                	{
                      "end": 67000,
                      "found": "Pepsi",
                      "salience": 0.300785630941391,
                      "start": 64000
                	}
              	]
            	}
          	}
        	]
      	}
    	],
        "totalResults": 808,
    	"limit": 1,
    	"from": 0,
    	"to": 0,
        "searchToken": "57d785e0-9213-11e7-9a71-df8e48a9af47",
        "timestamp": 1513285885
  	}
	}
  }
}
```

### **Sample Request 4: Word Proximity Search**

The example below is a media search of the public index for instances where the words emergency, broadcast, and fire are found in any order within 10 words of one another.
```graphql
query{
  searchMedia(search:{
	offset: 0
	limit: 1
	index: ["global"]
	query:{
    	operator: "word_proximity"
    	field: "transcript.transcript"
    	inOrder: false
    	distance: 10
    	values: ["emergency", "broadcast", "fire"]
    	}
  }) {
	jsondata
  }
}
```

#### **Sample Response 4: Word Proximity Search**

```json
{
  "data": {
	"searchMedia": {
  	"jsondata": {
    	"results": [
      	{
            "recording": {
         	 "recordingId": "36744245",
              "fileLocation": "https://inspirent.s3.amazonaws.com/recordings/1832ec2e-7342-41e5-4396-b0d681009e21_original.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAI7L6G7PCOOOLA7MQ%2F20171214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20171214T211646Z&X-Amz-Expires=604800&X-Amz-Signature=6865eb270e11e9cae746230ed2247a2f336edbe3e7cde199af487319facf1c43&X-Amz-SignedHeaders=host",
              "fileType": "audio/mpeg",
              "programId": "26372",
      	      "programName": "Morning Drive",
              "programImage": "https://s3.amazonaws.com/prod-veritone-ugc/programs/26972/y3wVqN69SreXR6FREBqQ_WINS-AM.jpg",
              "programLiveImage": "https://s3.amazonaws.com/prod-veritone-ugc/programs/25072/WpH0ipIYSzKA2Brvl0DX_BczwZNdTzmfmRbA3nTJA_MwvD0M4bRr2ELAcK8uQD_wins%2525201010.JPG",
              "mediaSourceId": "32063",
              "mediaSourceTypeId": "1",
              "isPublic": true,
              "sliceTime": 1503398731,
              "mediaStartTime": 1503398701,
              "aibDuration": 90,
              "isOwn": false,
              "hitStartTime": 1503398752,
              "hitEndTime": 1503398754
        	},
            "startDateTime": 1503398731,
        	"stopDateTime": 1503398791,
        	"hits": [
          	{
                "transcript": {
                  "source": "temporal",
                  "transcript": [
                	{
                      "hits": [
                    	{
                          "queryTerm": "broadcast",
                          "startTime": 51.829,
                          "endTime": 52.51
                    	},
                    	{
                          "queryTerm": "fire",
          	            "startTime": 52.579,
                          "endTime": 52.949
                    	},
                    	{
                          "queryTerm": "emergency",
                          "startTime": 53.44,
                          "endTime": 53.989
                    	}
                  	],
                      "startTime": 43.01,
                      "endTime": 72.479,
                      "text": "seriously in a train crash in suburban Philadelphia early today a SEPTA commuter train struck an unoccupied parked train at a terminal in Upper Darby broadcast a fire recorded the emergency call Act of one market Acura one market town on her you know . Her and want to honor him by the N.T.S.B. is trying to determine the cause we have mostly clear skies but some low clouds a little bit a haze around seventy five degrees heading for ninety"
                	}
              	]
            	}
          	}
        	]
      	}
    	],
        "totalResults": 95,
    	"limit": 1,
    	"from": 0,
    	"to": 0,
    	"searchToken": "17334140-e374-11e7-b0e6-a586c4474dec",
        "timestamp": 1513286206
  	}
	}
  }
}
```

### **Sample Request 5: Query String with Negation**

The example below is a media search of the private index for the word Paris when it does not appear with Las Vegas.
```graphql
query{
  searchMedia(search:{
	offset: 0
	limit: 1
	index: ["mine"]
	query:{
    	operator: "query_string"
    	field: "transcript.transcript"
    	value: "paris NOT \"las vegas\""
    	}
  }) {
	jsondata
  }
}
```

#### **Sample Response 5: Query String with Negation**

```json
{
  "data": {
	"searchMedia": {
  	"jsondata": {
    	"results": [
      	{
        	"recording": {
              "recordingId": "36397022",
              "fileLocation": "https://inspirent.s3.amazonaws.com/assets/36397022/17996ce6-1d2e-43c7-9398-d6f359f56d96.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAI7L6G7PCOOOLA7MQ%2F20171214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20171214T212013Z&X-Amz-Expires=604800&X-Amz-Signature=b7459f5c243c4c6a28a803b083c27265a605fd2d3426ba47f945a423fef6839c&X-Amz-SignedHeaders=host",
              "fileType": "audio/mp3",
              "programId": "-1",
              "programName": "Morning Chat",
              "programLiveImage": "https://s3.amazonaws.com/veritone-ugc/temp%2FprogramLiveImageURL%2F74DgqpH2RMyu2i5MtSb5_Test(1).png",
              "mediaSourceId": "-1",
              "mediaSourceTypeId": "5",
              "sliceTime": 1501005830,
              "mediaStartTime": 1501005380,
              "aibDuration": 510,
              "isOwn": true,
              "hitStartTime": 1501005841,
              "hitEndTime": 1501005842
        	},
            "startDateTime": 1501005830,
            "stopDateTime": 1501005890,
        	"hits": [
          	{
                "transcript": {
                  "source": "temporal",
                  "transcript": [
 	               {
                      "hits": [
                    	{
                          "queryTerm": "Paris",
                          "startTime": 461.869,
                          "endTime": 462.159
                    	}
          	        ],
                      "startTime": 461.869,
                      "endTime": 491.61,
                      "text": "Paris Jackson is in the upside Wow Wow That's great Naomi star airs Tuesdays on Fox and you can follow her on Twitter at Naomi Campbell thank you so much for calling in Naomi thank you SO MUCH THANK YOU HAVE A GREAT DAY AND . The first say fifty percent . At Macy's It feels good to give back together with the help generosity of our customers and employees we gave back fifty two million dollars to charities nationwide last year"
                	}
              	]
            	}
          	}
        	]
      	}
    	],
        "totalResults": 18071,
    	"limit": 1,
    	"from": 0,
    	"to": 0,
        "searchToken": "92ab8800-7a14-11e7-8c04-bd019caca41d",
        "timestamp": 1513286413
  	}
	}
  }
}
```

### **Sample Request 6: Compound Query**

The following example is a media search of both indexes for either of two faces and a 20th Century Fox logo or an occurrence of Fox Sports found in text.
```graphql
query{
  searchMedia(search:{
	offset: 0
	limit: 1
	index: ["global", "mine"]
	query:{
    	operator: "or"
    	conditions: [{
        	operator: "terms"
        	field: "face-recognition.series.entityId"
        	values: ["3513c7da-3cde-4444-888e-ddd73e6d0cd9", "f34245b0-096b-4c3d-9646-6271d7d260d1"]
        	}
        	{
        	operator: "or"
        	    conditions: [{
        	    operator: "term"
        	    field: "logo-recognition.series.found"
        	    value: "20th Century Fox"
        	    },
        	    {
        	    operator: "term"
        	    field: "text-recognition.series.ocrtext"
        	    value: "fox sports"
        	    }
     	    ]
  	    }
	   ]
    }
}) {
	jsondata
  }
}
```

#### **Sample Response 6: Compound Query**

```json
{
  "data": {
	"searchMedia": {
  	"jsondata": {
    	"results": [
      	{
            "recording": {
              "recordingId": "43592937",
              "fileLocation": "https://inspirent.s3.amazonaws.com/tv-recordings/17/12/14/6f0026ec-70a6-4ded-4a01-4c4d0ad4df75.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAI7L6G7PCOOOLA7MQ%2F20171214%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20171214T212939Z&X-Amz-Expires=604800&X-Amz-Signature=059b209149eaf2e4111d56d2b33d0c804f40ca3789b26736db787ca9981d8f45&X-Amz-SignedHeaders=host",
              "fileType": "video/mp4",
              "programId": "29684",
              "programName": "Weekday Afternoons",
              "programImage": "https://s3.amazonaws.com/veritone-ugc/programs/25084/XbZ1Aj4JSHmrBNIuWUaW_200px-BBC_World_News_red.svg.png",
              "programLiveImage": "https://s3.amazonaws.com/prod-veritone-ugc/programs/25084/qOyniPW3SrmTjVw7B1ow_4de7730beea8e20ba24de2be5ac03cb6.jpg",
	          "mediaSourceId": "39546",
              "mediaSourceTypeId": "2",
              "isPublic": true,
          	  "sliceTime": 1513286310,
              "mediaStartTime": 1513286100,
              "aibDuration": 270,
              "isOwn": false,
              "hitStartTime": 1513286316,
              "hitEndTime": 1513286317
        	},
            "startDateTime": 1513286310,
            "stopDateTime": 1513286370,
        	"hits": [
          	{
                "logo-recognition": {
                  "source": "bf5a703a-55f1-5a27-17a1-d213ae0c7f55",
                  "series": [
                	{
        	          "end": 217000,
                      "found": "20th Century Fox",
                      "salience": 0.5717288255691528,
                      "start": 216000
                	}
              	]
            	}
          	}
        	]
      	}
    	],
        "totalResults": 4886,
    	"limit": 1,
    	"from": 0,
    	"to": 0,
    	"searchToken": "e3cc7680-e115-36e7-9e94-eba5f6b5faf7",
        "timestamp": 1513286979
  	}
	}
  }
}
```

### **Sample Request 7: Mentions Search Using the "and" Operator**

The example below is a search for mentions with the name "Dallas Cowboys Super Bowl" and have a verification status of “Pending”.
```graphql
query{
  searchMentions(search:{
	offset: 0
	limit: 1
	index: ["mine"]
	query:{
    	operator: "and"
    	conditions: [{
        	operator: "term"
        	field: "trackingUnitName"
        	value: "Dallas Cowboys Super Bowl"
        	},
        	{
        	operator: "term"
        	field: "mentionStatusId"
        	value: "1"
    	}]
	}
  }) {
	jsondata
  }
}
```

#### **Sample Response 7: Mentions Search Using "and" Operator**

```json
{
  "data": {
    "searchMentions": {
  	"jsondata": {
    	"results": [
      	{
        	"id": 47569938,
            "programFormatName": "Information and News",
            "mentionDate": "2017-01-31T07:59:18.000Z",
            "mediaStartTime": "2017-01-31T07:45:01.000Z",
            "mediaId": 20017455,
            "metadata": {
              "filename": "AM-RADIO",
              "veritone-file": {
                "size": 0,
                "filename": "AM-RADIO",
                "mimetype": "audio/mpeg"
          	},
              "veritone-media-source": {
 	            "mediaSourceId": "14326",
                "mediaSourceTypeId": "1"
          	},
              "veritone-program": {
                "programId": "3828",
                "programName": "AM-RADIO Morning Talk",
                "programImage": "https://s3.amazonaws.com/veritone-ugc/cb5e59d4-a986-4e2b-b525-482319df3350%2FbrdProgram%2F2uGsLVKsQeiKN3UuHufC_941478_10151455644772706_951533539_n.jpg",
                "programLiveImage": "https://s3.amazonaws.com/prod-veritone-ugc/cb5e59d4-a986-4e2b-b525-482319df3350%2FbrdProgram%2FwwEn3Ya9RgmMQwUEGoD1_LUkKlgZQS36ncUbY8Iz7_2520to%2520live2.JPG"
          	}
        	},
            "fileLocation": "https://inspirent.s3.amazonaws.com/recordings/9605ea97-87df-428e-6740-720df8b8691c_original.mp3?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAI7L6G7PCOOOLA7MQ%2F20171215%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20171215T205111Z&X-Amz-Expires=604800&X-Amz-Signature=00f62a6e2367c109320c98b9aea190cd28d82ac347eeeca030f42810b7ab75e3&X-Amz-SignedHeaders=host",
            "fileType": "audio/mpeg",
            "snippets": [
          	{
                "startTime": 857.62,
                "endTime": 887.33,
                "text": "eighty first women's Australian Open final Monica Seles beat Steffi Graf four six six three six two in one thousand nine hundred twenty eight the Dallas Cowboys beat the Buffalo Bills thirty to thirteen in Atlanta running back Emmitt Smith wins the M.V.P. and fourth consecutive Super Bowl game loss to the Cowboys twenty sixteen at the one hundred fourth women's Australian Open final six three six six four that time capsule your",
                "hits": [
              	{
                    "startTime": 865.7,
                    "endTime": 865.929,
                    "queryTerm": "Dallas"
              	},
              	{
                    "startTime": 865.93,
                    "endTime": 866.07,
                    "queryTerm": "Cowboys"
              	},
              	{
                    "startTime": 872.74,
      	            "endTime": 873.31,
                    "queryTerm": "Super"
              	},
              	{
                    "startTime": 873.31,
                    "endTime": 873.43,
                    "queryTerm": "Bowl"
              	}
 	           ]
          	}
        	],
            "userSnippets": null,
            "advertiserId": 0,
            "advertiserName": "",
            "brandId": 0,
            "brandImage": "",
            "brandName": "",
            "campaignId": 0,
            "campaignName": "",
        	"organizationId": 7295,
   	        "organizationName": "Demo Organization",
            "trackingUnitId": 10032,
            "trackingUnitName": "Dallas Cowboys Super Bowl",
            "mentionStatusId": 1,
            "mediaSourceTypeId": 1,
            "mediaSourceTypeName": "Audio",
            "mediaSourceId": 14326,
	        "mediaSourceName": "AM-RADIO Morning Talk",
            "isNational": true,
            "spotTypeId": null,
        	"spotTypeName": null,
            "programId": 3828,
            "programName": "AM-RADIO",
            "programImage": "https://s3.amazonaws.com/prod-veritone-ugc/cb5e59d4-a986-4e2b-b525-482319df3350%2FbrdProgram%2F2uGsLVKsQeiKN3UuHufC_941478_10151455644772706_951533539_n.jpg",
            "programLiveImage": "https://s3.amazonaws.com/veritone-ugc/cb5e52b4-a986-4e2b-b525-482319df3350%2FbrdProgram%2FwwEn3Ya9RgmMQwUEGoD1_LUkKlgZQS36ncUbY8Iz7_2520to%2520live2.JPG",
            "impressions": 1894,
        	"audience": [
          	{
                "gender": "men",
                "age_group": "35-44",
                "audience": 11,
                "isTargetMatch": true
          	},
          	{
                "gender": "men",
                "age_group": "45-49",
                "audience": 121,
                "isTargetMatch": true
          	},
          	{
                "gender": "men",
                "age_group": "50-54",
                "audience": 474,
                "isTargetMatch": true
          	},
          	{
                "gender": "men",
                "age_group": "65+",
                "audience": 95,
                "isTargetMatch": true
          	},
          	{
         	   "gender": "women",
                "age_group": "50-54",
                "audience": 19,
                "isTargetMatch": false
          	},
          	{
                "gender": "women",
                "age_group": "65+",
            	"audience": 693,
                "isTargetMatch": false
          	},
          	{
                "gender": "men",
                "age_group": "55-64",
                "audience": 481,
                "isTargetMatch": true
          	}
        	],
            "targetAudience": {
              "gender": 1,
              "genderName": "M",
              "ageGroup": [
            	0,
            	5
          	],
              "ageGroupMin": 18,
              "ageGroupMax": 0,
          	  "impressions": 1182
        	},
            "audienceMarketCount": 3,
            "audienceAffiliateCount": 1,
            "rating": null,
            "ratings": null,
            "comments": null,
            "markets": [
          	{
            	"marketId": 54,
                "marketName": "Des Moines-Ames, IA"
          	}
        	],
            "marketId": null,
            "marketName": null,
            "hourOfDay": 7,
            "dayOfWeek": 2,
            "dayOfMonth": 31,
            "month": 1,
        	"year": 2017,
            "isMatch": true,
            "mentionStatusName": "Pending Verification",
            "complianceStatusId": null,
            "cognitiveEngineResults": null,
        	"hits": 4
      	}
        ],
        "totalResults": 579,
    	"limit": 1,
    	"from": 0,
    	"to": 0,
        "searchToken": "ae882400-e1d9-11e7-947b-339cddca931e",
        "timestamp": 1513371071
  	}
	}
  }
}
```
## Appendix 1: Fields

The table below defines the possible values currently available for the *field* property. Fields are grouped by category and include a name, a type, and one or more possible values.

<table>
<tr>
  <td><h4><b>Field Name</h4></b></td>
  <td><h4><b>Type</b></h4></td>
  <td><h4><b>Description</b></h4></td>
  <td><h4><b>Example</b></h4></td>
</tr>
<tr>
  <td colspan="4"><h5><b>Recording</b></h5>
Searches for various aspects of recordings in public and private indexes.</td>
</tr>
<tr>
  <td>absoluteStartTimeMs</td>
  <td>integer</td>
  <td>Absolute start date and time in Unix/Epoch timestamp format.<br><br>
* Must use range operator.</td>
  <td>operator: "range"<br>
field: "absoluteStartTimeMs"<br>
gte: "1497808410"</td>
</tr>
<tr>
  <td>absoluteStopTimeMs</td>
  <td>integer</td>
  <td>Absolute stop date and time in Unix/Epoch timestamp format.<br><br>
·  Must use range operator.</td>
  <td>operator: "range"<br>
field: "absoluteStopTimeMs"<br>
gte: "1497808410"</td>
</tr>
<tr>
  <td>recordingId</td>
  <td>string</td>
  <td>The unique ID associated with the recording container.</td>
  <td>operator: "term"<br>
field: "recordingId"<br>
value: "39590300"</td>
</tr>
<tr>
  <td>fileLocation</td>
  <td>string</td>
  <td>The URL of the file.</td>
  <td>operator: "term"<br>
field: "fileLocation"<br>
value: "https://inspirent.s3.amazonaws.com/assets/39070300/789eb7b2-6c4d-4ec4-8a79-f4600b7e31c1.mp4"</td>
</tr>
<tr>
  <td>fileType</td>
  <td>string</td>
  <td>The recording file MIME type.<br><br>
·  Value must be entered as lowercase.</td>
  <td>operator: "term"<br>
field: "fileType"<br>
value: "video/mp4"</td>
</tr>
<tr>
  <td>relativeStartTimeMs</td>
  <td>integer</td>
  <td>The starting time of the recording in milliseconds.<br><br>
·  Must use range operator.</td>
  <td>operator: "range"<br>
field: "relativeStartTimeMs"<br>
lte: "1497808410"</td>
</tr>
<tr>
  <td>relativeStopTimeMs</td>
  <td>integer</td>
  <td>The ending time of the recording in milliseconds.<br><br>
·  Must use range operator.</td>
  <td>operator: "range"<br>
field: "relativeStopTimeMs"<br>
lte: "1497808410"</td>
</tr>
<tr>
  <td>isPublic</td>
  <td>Boolean</td>
  <td>A Boolean that searches the public index when set to true.</td>
  <td>operator: "term"<br>
field: "isPublic"<br>
value: true</td>
</tr>
<tr>
  <td>programName</td>
  <td>string</td>
  <td>The user-entered name of the program.<br><br>
·  Must use query_string operator and the value must be entered as lowercase.</td>
  <td>operator: "query_string"<br>
field: "programName"<br>
value: "this week in tech"</td>
</tr>
<tr>
  <td>mediaSourceId</td>
  <td>string</td>
  <td>A UUID assigned by the system that identifies the media ingestion source.</td>
  <td>operator: "term"<br>
field: "mediaSourceId"<br>
value: "39262"</td>
</tr>
<tr>
  <td>mediaSourceTypeId</td>
  <td>string</td>
  <td>The ID associated with the media source type.</td>
  <td>operator: "term"<br>
field: "mediaSourceTypeId"<br>
value: "4"</td>
</tr>
<tr>
  <td colspan="4"><h5><b>Mention</b></h5>
Searches for various aspects of mentions and watchlists in an organization’s private media index.</td>
</tr>
<tr>
  <td>id</td>
  <td>string</td>
  <td>The unique ID associated with the mention.</td>
  <td>operator: "term"<br>
field: "id"<br>
value: "40392711"</td>
</tr>
<tr>
  <td>programFormatName</td>
  <td>string</td>
  <td>The radio format name as defined by Wikipedia/Radio\_Format.</td>
  <td>operator: "term"<br>
field: "programFormatName"<br>
value: "Sport"</td>
</tr>
<tr>
  <td>mentionDate</td>
  <td>type: date
format: date_ optional\_time</td>
  <td>The date and time the mention was created.<br><br>
· The date is mandatory and the time is optional.<br>
· UTC time zone.<br>
· Date format: "yyyy-mm-dd"<br>
· The time element "T" must follow the date.<br>
· Time format: hh/mm/ss/ms</td>
  <td>operator: "range"<br>
field: "mentionDate"<br>
gte: "2017-04-13T20&#058;09:09.000"</td>
</tr>
<tr>
  <td>mediaStartTime</td>
  <td>type: date
format: date_ optional_time</td>
  <td>The radio/TV broadcast time of the media.<br><br>
· The date is mandatory and the time is optional.<br>
· UTC time zone.<br>
· Date format: "yyyy-mm-dd"<br>
· The time element "T" must follow the date when adding a time to the value.<br>
· Time format: hh/mm/ss/ms<br>
· Uses the term or range operator.</td>
  <td>operator: "range"<br>
field: "mediaStartTime"<br>
gte: "2017-04-13T20&#058;09:09.000"<br><br>
operator: "term"<br>
field: "mediaStartTime"<br>
value: "2017-04-13T20&#058;09:09.000"</td>
</tr>
<tr>
  <td>mediaSourceId</td>
  <td>string</td>
  <td>The ID of the media source.</td>
  <td>operator: "term"<br>
field: "mediaSourceId"<br>
value: "12734"</td>
</tr>
<tr>
  <td>mediaSourceName</td>
  <td>string</td>
  <td>The name of the media source.</td>
  <td>operator: "term"<br>
field: "mediaSourceName"<br>
value: "WPDH-FM"</td>
</tr>
<tr>
  <td>mediaSourceTypeId</td>
  <td>integer</td>
  <td>The ID of the media source type.<br><br>
Possible values:<br>
"1" (Broadcast Radio)<br>
"2" (Broadcast TV)<br>
"3" (YouTube)<br>
"4" (Podcast)<br>
"5" (Private Media)</td>
  <td>operator: "term"<br>
field: "mediaSourceTypeId"<br>
value: "2"</td>
</tr>
<tr>
  <td>metadata.veritone-program.primaryMediaSourceId</td>
  <td>string</td>
  <td>The primary media source ID metadata. Uses the term or range operator.</td>
  <td>operator: "term"<br>
field: "metadata.veritone-program.primaryMediaSourceId"<br>
value: "21296"</td>
</tr>
<tr>
  <td>metadata.veritone-program.programId</td>
  <td>string</td>
  <td>The program ID metadata.</td>
  <td>operator: "term"<br>
field: "metadata.veritone-program.programId"<br>
value: "28224"</td>
</tr>
<tr>
  <td>metadata.veritone-program.programName</td>
  <td>string</td>
  <td>The program name metadata.</td>
  <td>operator: "term"<br>
field: "metadata.veritone-program.programName"<br>
value: "AM Afternoon News 4p6p"</td>
</tr>
<tr>
  <td>veritone-cognitive-profile-params</td>
  <td>object</td>
  <td>The search query parameters used to generate the mention.</td>
  <td>operator: "term"<br>
field: "veritone-cognitive-profile-params"<br>
value: "hello"</td>
</tr>
<tr>
  <td>isNational</td>
  <td>Boolean</td>
  <td>A Boolean that when set to true searches for programs that are national.</td>
  <td>operator: "term"<br>
field: "isNational"<br>
value: false</td>
</tr>
<tr>
  <td>audience.gender</td>
  <td>string</td>
  <td>The gender of the segment.<br><br>
Possible values:<br>
"men"<br>
"women"</td>
  <td>operator: "term"<br>
field: "audience.gender"<br>
value: "men"</td>
</tr>
<tr>
  <td>audience.age_group</td>
  <td>string</td>
  <td>The age group string for the segment.<br><br>
Possible values:<br>
"6-11"<br>
"12-17"<br>
"18-24"<br>
"25-34"<br>
"35-44"<br>
"45-49"<br>
"50-54"<br>
"55-64"<br>
"65+"</td>
  <td>operator: "term"<br>
field: "audience.age_group"<br>
value: "45-49"</td>
</tr>
<tr>
  <td>audience.audience</td>
  <td>integer</td>
  <td>The number of impressions for the segment.</td>
  <td>operator: "range"<br>
field: "audience.audience"<br>
gt: "1100"</td>
</tr>
<tr>
  <td>audience.isTargetMatch</td>
  <td>Boolean</td>
  <td>Specifies whether the audience segment matches (true) or doesn’t match (false) the target audience.</td>
  <td>operator: "term"<br>
field: "audience.isTargetMatch"<br>
value: true</td>
</tr>
<tr>
  <td>targetAudience.gender</td>
  <td>integer</td>
  <td>The target audience gender.<br><br>
Possible values:<br>
"1" (men)<br>
"2" (women)<br>
"3" (people)</td>
  <td>operator: "term"<br>
field: "targetAudience.gender"<br>
value: "3"</td>
</tr>
<tr>
  <td>targetAudience.genderName</td>
  <td>string</td>
  <td>The gender code of the target audience.<br><br>
Possible values are as follows and must be capitalized:<br>
"M" (male)<br>
"F" (female)<br>
"P" (people)</td>
  <td>operator: "term"<br>
field: "targetAudience.genderName"<br>
value: "F"</td>
</tr>
<tr>
  <td>targetAudience.ageGroup</td>
  <td>integer</td>
  <td>The target audience age group range. Enter one or more of the possible values to search a target audience age group.<br><br>
Possible values:<br>
"0" (18-24)<br>
"1" (25-34)<br>
"2" (35-44)<br>
"3" (45-54)<br>
"4" (55-64)<br>
"5" (65+)</td>
  <td>operator: "terms"<br>
field: "targetAudience.ageGroup"<br>
values: ["2", "4"]</td>
</tr>
<tr>
  <td>targetAudience.ageGroupMin</td>
  <td>integer</td>
  <td>The lower bound of the target age group.</td>
  <td>operator: "term"<br>
field: "targetAudience.ageGroupMin"<br>
value: "25"</td>
</tr>
<tr>
  <td>targetAudience.ageGroupMax</td>
  <td>integer</td>
  <td>The upper bound of the target age group.</td>
  <td>operator: "term"<br>
field: "targetAudience.ageGroupMax"<br>
value: "54"</td>
</tr>
<tr>
  <td>targetAudience.impressions</td>
  <td>integer</td>
  <td>The total number of impressions in the target audience.</td>
  <td>operator: "range"<br>
field: "targetAudience.impressions"<br>
gt: "15000"</td>
</tr>
<tr>
  <td>metadata.veritone-file.filename</td>
  <td>string</td>
  <td>The name associated with the media file.</td>
  <td>operator: "term"<br>
field: "metadata.veritone-file.filename"<br>
value: "AM Afternoon News18"</td>
</tr>
<tr>
  <td>metadata.veritone-file.mimetype</td>
  <td>string</td>
  <td>The file type metadata.</td>
  <td>operator: "term"<br>
field: "metadata.veritone-file.mimetype"<br>
value: "audio/mpeg"</td>
</tr>
<tr>
  <td>metadata.veritone-file.size  </td>
  <td>integer</td>
  <td>The file size metadata. Uses term or range operator.</td>
  <td>operator: "range"<br>
field: "metadata.veritone-file.size"<br>
gte: "2000"</td>
</tr>
<tr>
  <td>metadata.veritone-media-source.mediaSourceId</td>
  <td>string</td>
  <td>The media source ID metadata.</td>
  <td>operator: "term"<br>
field: "metadata.veritone-media-source.mediaSourceId"<br>
value: "16390"</td>
</tr>
<tr>
  <td>metadata.veritone-media-source.mediaSourceName</td>
  <td>string</td>
  <td>The media source name.</td>
  <td>operator: "term"<br>
field: "metadata.veritone-media-source.mediaSourceName"<br>
value: "Morning Drive"</td>
</tr>
<tr>
  <td>metadata.veritone-media-source.mediaSourceTypeId</td>
  <td>integer</td>
  <td>The identifier of the media source type.<br><br>
Possible values:<br>
"1" (Broadcast Radio)<br>
"2" (Broadcast TV)<br>
"3" (YouTube)<br>
"4" (Podcast)<br>
"5" (Private Media)</td>
  <td>operator: "term"<br>
field: "metadata.veritone-media-source.mediaSourceTypeId"<br>
value: "1"</td>
</tr>
<tr>
  <td>fileType</td>
  <td>string</td>
  <td>The file type of the mention.</td>
  <td>operator: "term"<br>
field: "fileType"<br>
value: "audio/mpeg"</td>
</tr>
<tr>
  <td>snippets.hits.startTime</td>
  <td>integer</td>
  <td>The start time of the snippet hit.<br><br>
·  Uses term or range operator.</td>
  <td>operator: "term"<br>
field: "snippets.hits.startTime"<br>
value: "824.73"</td>
</tr>
<tr>
  <td>snippets.hits.endTime</td>
  <td>integer</td>
  <td>The ending time of the snippet hit.<br><br>
·  Uses term or range operator.</td>
  <td>operator: "term"<br>
field: "snippets.hits.endTime"<br>
value: "869.95"</td>
</tr>
<tr>
  <td>snippets.hits.queryTerm</td>
  <td>string</td>
  <td>A word to search for in the text of the mention hit.<br><br>
·  Value must be all lowercase.</td>
  <td>operator: "term"<br>
field: "snippets.hits.queryTerm"<br>
value: "nfl"</td>
</tr>
<tr>
  <td>snippets.startTime</td>
  <td>integer</td>
  <td>The starting time of the snippet.<br><br>
·  Uses term or range operator.</td>
  <td>operator: "term"<br>
field: "snippets.startTime"<br>
value: "819.839"</td>
</tr>
<tr>
  <td>snippets endTime</td>
  <td>integer</td>
  <td>The ending time of the snippet.<br><br>
·  Uses term or range operator.</td>
  <td>operator: "term"<br>
field: "snippets.endTime"<br>
value: "840.16"</td>
</tr>
<tr>
  <td>snippets.text</td>
  <td>string</td>
  <td>One or more words from the snippet text.<br><br>
·  Value must be all lowercase.<br>
·  Uses query_string or term operator.</td>
  <td>operator: "query_string"<br>
field: "snippets.text"<br>
value: "team will go on to victory"<br><br>
operator: "term"<br>
field: "snippets.text"<br>
value: "team"</td>
</tr>
<tr>
  <td>userSnippets.startTime</td>
  <td>integer</td>
  <td>The start time of the user-edited mention text.<br><br>
·  Uses term or range operator.</td>
  <td>operator: "term"<br>
field: " userSnippets startTime"<br>
value: "78"<br><br>
operator: "range"<br>
field: " userSnippets startTime"<br>
gte: "78"</td>
</tr>
<tr>
  <td>userSnippets.endTime</td>
  <td>integer</td>
  <td>The end time of the user-edited mention text.<br><br>
·  Uses term or range operator.</td>
  <td>operator: "term"<br>
field: "userSnippets endTime"<br>
value: "78"<br><br>
operator: "range"<br>
field: "userSnippets endTime"<br>
lte: "179"</td>
</tr>
<tr>
  <td>userSnippets.snippets.text</td>
  <td>string</td>
  <td>The user-edited mention text.<br><br>
·  Value must be all lowercase.</td>
  <td>operator: "query_string"<br>
field: "userSnippets.snippets.text"<br>
value: "team will"<br><br>
operator: "term"<br>
field: " userSnippets.snippets.text"<br>
value: "team"</td>
</tr>
<tr>
  <td>organizationId</td>
  <td>string</td>
  <td>The unique ID associated with the organization.</td>
  <td>operator: "term"<br>
field: "organizationId"<br>
value: "7685"</td>
</tr>
<tr>
  <td>organizationName</td>
  <td>string</td>
  <td>The name of the organization.</td>
  <td>operator: "term"<br>
field: "organizationName"<br>
value: "ABC Organization"</td>
</tr>
<tr>
  <td>trackingUnitId</td>
  <td>string</td>
  <td>The unique ID of the mention.<br><br>
·  Uses term or range operator.</td>
  <td>operator: "term"<br>
field: "trackingUnitId"<br>
value: "20068"</td>
</tr>
<tr>
  <td>trackingUnitName</td>
  <td>string</td>
  <td>The user-entered name of the mention. Values for this field are case sensitive and must be entered as they are saved in the index.
</td>
  <td>operator: "term"<br>
field: "trackingUnitName"<br>
value: "Dallas Cowboys Super Bowl"</td>
</tr>
<tr>
  <td>mentionStatusId</td>
  <td>integer</td>
  <td>The status of the mention’s verification.<br><br>
Possible values:<br>
"1" (Pending Verification)<br>
"2" (Verified)<br>
"3" (Needs Review)<br>
"4" (Request Bonus)<br>
"5" (Invalid)<br>
"6" (Processing Verification)<br>
"7" (Auto Verified)</td>
  <td>operator: "term"<br>
field: "mentionStatusId"<br>
value: "2"</td>
</tr>
<tr>
  <td>mediaSourceTypeId</td>
  <td>integer</td>
  <td>The media source type identifier.<br><br>
Possible values:<br>
"1" (Broadcast Radio)<br>
"2" (Broadcast TV)<br>
"3" (YouTube)<br>
"4" (Podcast)<br>
"5" (Private Media)</td>
  <td>operator: "term"<br>
field: "mediaSourceTypeId"<br>
value: "2"</td>
</tr>
<tr>
  <td>mediaSourceTypeName</td>
  <td>string</td>
  <td>The media source name.<br><br>
Possible values:<br>
"Audio"<br>
"Broadcast TV"<br>
"Podcast"<br>
"YouTube"<br>
"Private Media"</td>
  <td>operator: "term"<br>
field: "mediaSourceTypeName"<br>
value: "Audio"</td>
</tr>
<tr>
  <td>mediaSourceId</td>
  <td>string</td>
  <td>The ID of the media source.<br><br>
·  Uses term or range operator.</td>
  <td>operator: "term"<br>
field: "mediaSourceId"<br>
value: "38674"</td>
</tr>
<tr>
  <td>mediaSourceName</td>
  <td>string</td>
  <td>The user-defined program name.</td>
  <td>operator: "term"<br>
field: "mediaSourceName"<br>
value: "The Weekly Podcast"</td>
</tr>
<tr>
  <td>spotTypeId</td>
  <td>integer</td>
  <td>The ID of the spot type:<br><br>
Possible values:<br>
"17" (Bonus)<br>
"15" (Live :05)<br>
"16" (Live :10)<br>
"1" (Live :15)<br>
"2" (Live :30)<br>
"3" (Live :60)<br>
"14" (MicroMention)<br>
"9" (Non Voiced :05)<br>
"10" (Non Voiced :10)<br>
"11" (Non Voiced :15)<br>
"12" (Non Voiced :30)<br>
"13" (Non Voiced :60)<br>
"4" (Voiced :05)<br>
"5" (Voiced :10)<br>
"6" (Voiced :15)<br>
"7" (Voiced :30)<br>
"8" (Voiced :60)</td>
  <td>operator: "term"<br>
field: "spotTypeId"<br>
value: "17"</td>
</tr>
<tr>
  <td>spotTypeName</td>
  <td>string</td>
  <td>The name of the spot type.<br><br>
Possible values:<br>
"Bonus"<br>
"Live :05"<br>
"Live :10"<br>
"Live :15"<br>
"Live :30"<br>
"Live :60"<br>
"MicroMention"<br>
"Non Voiced :05"<br>
"Non Voiced :10"<br>
"Non Voiced :15"<br>
"Non Voiced :30"<br>
"Non Voiced :60"<br>
"Voiced :05"<br>
"Voiced :10"<br>
"Voiced :15"<br>
"Voiced :30"<br>
"Voiced :60"</td>
  <td>operator: "term"<br>
field: "spotTypeName"<br>
value: "Bonus"</td>
</tr>
<tr>
  <td>programId</td>
  <td>string</td>
  <td>The unique ID associated with the program.</td>
  <td>operator: "term"<br>
field: "programId"<br>
value: "22979"</td>
</tr>
<tr>
  <td>programName.raw</td>
  <td>string</td>
  <td>The user-defined name of the program.</td>
  <td>operator: "term"<br>
field: "programName.raw"<br>
value: "Morning Drive - MF 10a1p"</td>
</tr>
<tr>
  <td>impressions</td>
  <td>integer</td>
  <td>The audience count.</td>
  <td>operator: "term"<br>
field: "impressions"<br>
value: "8"</td>
</tr>
<tr>
  <td>audienceMarketCount</td>
  <td>integer</td>
  <td>The number of markets where the media was broadcast.</td>
  <td>operator: "term"<br>
field: "audienceMarketCount"<br>
value: "2"</td>
</tr>
<tr>
  <td>audienceAffiliateCount</td>
  <td>integer</td>
  <td>The number of affiliates for the primary media source.</td>
  <td>operator: "term"<br>
field: "audienceAffiliateCount"<br>
value: "1"</td>
</tr>
<tr>
  <td>rating</td>
  <td>float</td>
  <td>The number of user-given stars to a watchlist mention.<br><br>
Possible values:<br>
"1"<br>
"2"<br>
"3"<br>
"4"<br>
"5"</td>
  <td>operator: "term"<br>
field: "rating"<br>
value: "5"</td>
</tr>
<tr>
  <td>ratings.rating_id</td>
  <td>string</td>
  <td>The unique ID of the mention rating.</td>
  <td>operator: "term"<br>
field: "ratings.rating_id"<br>
value: "38387"</td>
</tr>
<tr>
  <td>ratings.rating_value</td>
  <td>integer</td>
  <td>The number user-given stars to a watchlist mention.<br><br>
Possible values:<br>
"1"<br>
"2"<br>
"3"<br>
"4"<br>
"5"</td>
  <td>operator: "term"<br>
field: "ratings.rating_value"<br>
value: "5"</td>
</tr>
<tr>
  <td>ratings.date\_created</td>
  <td>type: date
format: date_ optional_time</td>
  <td>The date and time that the mention rating was created.<br><br>
·  The date is mandatory and the time is optional.<br>
·  UTC time zone<br>
·  Date format: "yyyy-mm-dd"<br>
·  The time element "T" must follow the date when adding a time to the value.<br>
·  Time format: hh/mm/ss/ms<br>
·  Uses the term, query_string or range operators.</td>
  <td>operator: "range"<br>
field: "ratings.date_created"<br>
lte: "2017-10-13T00&#058;12:34.44948"</td>
</tr>
<tr>
  <td>comments.id</td>
  <td>string</td>
  <td>The unique ID of the comment.</td>
  <td>operator: "term"<br>
field: "comments.id"<br>
value: "43770"</td>
</tr>
<tr>
  <td>comments.text</td>
  <td>string</td>
  <td>Text entered as the mention comment.<br><br>
·  Value must be entered as all lowercase.<br>
·  Uses both the term and query_string operators.</td>
  <td>operator: "query_string"<br>
field: "comments.text"<br>
value: "provides information"</td>
</tr>
<tr>
  <td>comments.date\_modified</td>
  <td>type: date
format: date_ optional_time</td>
  <td>The date and time that the comment was created.<br><br>
·  The date is mandatory and the time is optional.<br>
·  UTC time zone.<br>
·  Date format: "yyyy-mm-dd"<br>
·  The time element "T" must follow the date when adding a time to the value.<br>
·  Time format: hh/mm/ss/ms<br>
·  Uses the term, query_string or range operators.</td>
  <td>operator: "range"<br>
field: "comments.date_modified"<br>
lte: "2017-10-20T01&#058;43:35.0909"</td>
</tr>
<tr>
  <td>markets.marketId</td>
  <td>integer</td>
  <td>The market ID to use as a filter when searching for mentions. (See "Appendix 2: Markets" for a list of all market name values.)<br><br>
·  Uses term and range operators.</td>
  <td>operator: "term"<br>
field: "markets.marketId"<br>
value: "112"</td>
</tr>
<tr>
  <td>markets.marketName</td>
  <td>string</td>
  <td>The market name to use as a filter when searching for mentions. (See "Appendix 2: Markets" for a list of all market name values.)</td>
  <td>operator: "term"<br>
field: "markets.marketName"<br>
value: "Los Angeles, CA"</td>
</tr>
<tr>
  <td>marketId</td>
  <td>integer</td>
  <td>The market ID to use as a filter when searching for mentions. (See "Appendix 2: Markets" for a list of all market name values.)<br><br>
·  Uses term and range operators.</td>
  <td>operator: "term"<br>
field: "marketId"<br>
value: "112"</td>
</tr>
<tr>
  <td>marketName</td>
  <td>string</td>
  <td>The market name to use as a filter when searching for mentions. (See "Appendix 2: Markets" for a list of all market name values.)</td>
  <td>operator: "term"<br>
field: "marketName"<br>
value: "Los Angeles, CA"</td>
</tr>
<tr>
  <td>hourOfDay</td>
  <td>integer</td>
  <td>The hour of day (24-hour format) to use as a filter when searching for mentions.</td>
  <td>operator: "term"<br>
field: "hourOfDay"<br>
value: "8"</td>
</tr>
<tr>
  <td>dayOfWeek</td>
  <td>integer</td>
  <td>The numeric value assigned to a day of the week to use as a filter when searching for mentions.<br><br>
·  Uses the range and term operators.<br><br>
Possible values:<br>
"1" (Monday)<br>
"2" (Tuesday)<br>
"3" (Wednesday)<br>
"4" (Thursday)<br>
"5" (Friday)<br>
"6" (Saturday)<br>
"7" (Sunday)</td>
  <td>operator: "term"<br>
field: "dayOfWeek"<br>
value: "4"</td>
</tr>
<tr>
  <td>dayOfMonth</td>
  <td>integer</td>
  <td>The numeric value assigned to a day of the month to use as a filter when searching for mentions.<br><br>
·  Uses the range and term operators.</td>
  <td>operator: "term"<br>
field: "dayOfMonth"<br>
value: "13"</td>
</tr>
<tr>
  <td>month</td>
  <td>integer</td>
  <td>The numeric value assigned to a calendar month to use as a filter when searching for mentions.<br><br>
·  Uses the range and term operators.</td>
  <td>operator: "term"<br>
field: "month"<br>
value: "4"</td>
</tr>
<tr>
  <td>year</td>
  <td>integer</td>
  <td>A four-digit year to use as a filter when searching for mentions.<br><br>
·  Uses the range and term operators.</td>
  <td>operator: "range"<br>
field: "month"<br>
gte: "2015"</td>
</tr>
<tr>
  <td>mentionStatusName</td>
  <td>string</td>
  <td>A mention status to use as a filter when searching for mentions.<br><br>
·  Values are case sensitive and must use initial caps.<br><br>
Possible values:<br>
"Pending Verification"<br>
"Auto Verified"<br>
"Invalid"<br>
"Needs Review"<br>
"Processing Verification"<br>
"Request Bonus"<br>
"Verified"</td>
  <td>operator: "term"<br>
field: "mentionStatusName"<br>
value: "Verified"
</td>
</tr>
<tr>
  <td colspan="4"><h5><b>Face Recognition</b></h5>
Searches for records generated by a facial engine and other detected face attributes.</td>
</tr>
<tr>
  <td>face-recognition.source</td>
  <td>string</td>
  <td>The ID of the face recognition engine to use as a filter when searching.
For a list of possible values, make a request to the Engines query. Pass "category" as an argument with "facial" as the value, and specify "id" and "name" as return fields.</td>
  <td>operator: "term"<br>
field: "face-recognition.source"<br>
value: "84b513bd-d64d-3a35-9d42-579c8611fdbf"</td>
</tr>
<tr>
  <td>face-recognition.series.entityId</td>
  <td>string</td>
  <td>The unique ID associated with the library entity (such as a person or an organization).
</td>
  <td>operator: "term"<br>
field: "face-recognition.series.entityId"<br>
value: "423aa55e-6135-4f10-9585-f65a1f3d909e"</td>
</tr>
<tr>
  <td>face-recognition.series.start</td>
  <td>string</td>
  <td>The time in milliseconds from the beginning of the file where the fingerprint began.<br><br>
·  Uses range and term operators.</td>
  <td>operator: "value"<br>
field: "face-recognition.series.start"<br>
lte: "54000"</td>
</tr>
<tr>
  <td>face-recognition.series.end</td>
  <td>string</td>
  <td>The time in milliseconds from the beginning of the file where the fingerprint ended.<br><br>
·  Uses range and term operators.</td>
  <td>operator: "value"<br>
field: "face-recognition.series.end"<br>
gte: "55000"</td>
</tr>
<tr>
  <td>face-recognition.series.libraryId</td>
  <td>string</td>
  <td>The unique ID associated with the library.</td>
  <td>operator: "term"<br>
field: "face-recognition.series.libraryId"<br>
value: "0fb02432-dcb1-40b0-bb6a-3f7e481aae3e"</td>
</tr>
<tr>
  <td>face-recognition.series.originalImage</td>
  <td>string</td>
  <td>The URL of the library cover image.</td>
  <td>operator: "term"<br>
field: "face-recognition.series.originalImage"<br>
value: "https://s3-us-west-1.amazonaws.com/prod-veritone-face/aed3ce42-97d0-46f1-89f9-48df4ba0ace2/35914952/318af5mf.983887/setId-0_frame-792.png"</td>
</tr>
<tr>
  <td colspan="4"><h5><b>Fingerprint</b></h5>
Searches for records generated by a fingerprint engine and other detected fingerprint attributes.</td>
</tr>
<tr>
  <td>fingerprint.source</td>
  <td>string</td>
  <td>The ID of the fingerprint engine to use as a filter when searching.<br><br>
For a list of possible values, make a request to the Engines query. Pass "category" as an argument with "fingerprint" as the value, and specify "id" and "name" as return fields.</td>
  <td>operator: "term"<br>
field: "fingerprint.source"<br>
value: "c5eff1ad-d53e-8bb9-fb1f-1866da84d0b3"</td>
</tr>
<tr>
  <td>fingerprint.series.start</td>
  <td>integer</td>
  <td>The time in milliseconds from the beginning of the file where the fingerprint began.<br><br>
·  Uses range and term operators.</td>
  <td>operator: "range"<br>
field: "fingerprint.series.start"<br>
lte: "22000"</td>
</tr>
<tr>
  <td>fingerprint.series.end</td>
  <td>integer</td>
  <td>The time in milliseconds from the beginning of the file where the fingerprint ended.<br><br>
·  Uses range and term operators.</td>
  <td>operator: "range"<br>
field: "fingerprint.series.end"<br>
gte: "21000"</td>
</tr>
<tr>
  <td>fingerprint.series.entityId</td>
  <td>string</td>
  <td>The unique Entity ID associated with the fingerprint.</td>
  <td>operator: "term"<br>
field: "fingerprint.series.entityId"<br>
value: "e49c5344-622b-42bb-8e82-514d96d2df88"</td>
</tr>
<tr>
  <td>fingerprint.series.entityIdentifierId</td>
  <td>string</td>
  <td>The unique Entity Identifier ID associated with the fingerprint.</td>
  <td>operator: "term"<br>
field: "fingerprint.series.entityIdentifierId"<br>
value: "e4f95339-622b-42bb-8e82-514d96d2df88"</td>
</tr>
<tr>
  <td>fingerprint.series.libraryId</td>
  <td>string</td>
  <td>The Library ID associated with the fingerprint.</td>
  <td>operator: "term"<br>
field: "fingerprint.series.libraryId"<br>
value: "c034a463-2a82-4be5-b263-61f3b61e5282"</td>
</tr>
<tr>
  <td>fingerprint.series.score</td>
  <td>float</td>
  <td>A probability score that indicates the similarity between features in a fingerprint sample and a stored entity. This score can be used as a filter to prioritize more salient fingerprints when searching. Scores closer to 0.0 are less similar, while scores closer to 1.0 are high in similarity.<br><br>
·  Uses range and term operators.</td>
  <td>operator: "range"<br>
field: "fingerprint.series.score"<br>
gte: ".055"</td>
</tr>
<tr>
  <td colspan="4"><h5><b>Logo Recognition</b></h5>
Searches for records generated by a logo engine and other detected logo attributes.</td>
</tr>
<tr>
  <td>logo-recognition.source</td>
  <td>string</td>
  <td>The ID of the logo recognition engine to use as a filter when searching.<br><br>
For a list of possible values, make a request to the Engines query. Pass "category" as an argument with "logo recognition" as the value, and specify "id" and "name" as return fields.</td>
  <td>operator: "term"<br>
field: "logo-recognition.source"<br>
value: "bf50303a-55f1-5a27-17a1-d213ae0c7f55"</td>
</tr>
<tr>
  <td>logo-recognition.series.found</td>
  <td>string</td>
  <td>The name of the detected logo.
·  Case-sensitive – value must match indexed logo name.</td>
  <td>operator: "query_string"<br>
field: "logo-recognition.series.found"<br>
value: "ESPN"</td>
</tr>
<tr>
  <td>logo-recognition.series.start</td>
  <td>integer</td>
  <td>The time that the logo was first identified in milliseconds from the beginning of the recording.<br><br>
·  Uses range operator only.</td>
  <td>operator: "range"<br>
field: "logo-recognition.series.start"<br>
gte: "20700"</td>
</tr>
<tr>
  <td>logo-recognition.series.end</td>
  <td>integer</td>
  <td>The time that the logo was last identified in milliseconds from the beginning of the recording.<br><br>
·  Uses range operator only.</td>
  <td>operator: "range"<br>
field: "logo-recognition.series.end"<br>
lte: "20800"</td>
</tr>
<tr>
  <td colspan="4"><h5><b>Object Recognition</b></h5>
Searches for records generated by an object recognition engine and various attributes of detected objects.</td>
</tr>
<tr>
  <td>object-recognition.source</td>
  <td>string</td>
  <td>The ID of the object recognition engine to use as a filter when searching.<br><br>
For a list of possible values, make a request to the Engines query. Pass "category" as an argument with "object detection" as the value, and specify "id" and "name" as return fields.</td>
  <td>operator: "term"<br>
field: "object-recognition.source"<br>
value: "070148f0-3fd0-1bdc-b412-1e79b8aa36a2"</td>
</tr>
<tr>
  <td>object-recognition.series.boundingPoly.x</td>
  <td>string</td>
  <td>The "x" coordinate of the object found on the screen.<br><br>
·  Uses range operator.</td>
  <td>operator: "range"<br>
field: "object-recognition.series.boundingPoly.x"<br>
lte: "418"</td>
</tr>
<tr>
  <td>object-recognition.series.boundingPoly.y</td>
  <td>string</td>
  <td>The "y" coordinate of the object found on the screen.<br><br>
·  Uses range operator.</td>
  <td>operator: "range"<br>
field: "object-recognition.series.boundingPoly.y"<br>
gte: "269"</td>
</tr>
<tr>
  <td>object-recognition.series.found</td>
  <td>string</td>
  <td>A label for the detected object. (e.g., person, laptop)</td>
  <td>operator: "term"<br>
field: "object-recognition.series.found"<br>
value: "girl"</td>
</tr>
<tr>
  <td>object-recognition.series.start</td>
  <td>string</td>
  <td>The time in milliseconds from the beginning of the file where the object was first identified.<br><br>
·  Uses range and term operators.</td>
  <td>operator: "range"<br>
field: "object-recognition.series.start"<br>
gte: "59000"</td>
</tr>
<tr>
  <td>object-recognition.series.end</td>
  <td>string</td>
  <td>The time in milliseconds from the beginning of the file where the object was last identified.<br><br>
·  Uses range and term operators.</td>
  <td>operator: "range"<br>
field: "object-recognition.series.end"<br>
lte: "60000"</td>
</tr>
<tr>
  <td>object-recognition.series.saliency</td>
  <td>float</td>
  <td>A probability score that measures the similarity of a recognized object to a reference model. This score can be used as a filter to prioritize more salient objects when searching. Scores closer to 0.0 are less similar, while scores closer to 1.0 are high in similarity.<br><br>
·  Uses range and term operators.</td>
  <td>operator: "range"<br>
field: "object-recognition.series.saliency"<br>
gte: "80"</td>
</tr>
<tr>
  <td colspan="4"><h5><b>OCR (Text Recognition)</b></h5>
Searches for records generated by an OCR engine and performs full-text search for various attributes of recognized text. All queries should use the query_string operator.</td>
</tr>
<tr>
  <td>text-recognition.source</td>
  <td>string</td>
  <td>The ID of the text recognition engine to use as a filter when searching.<br><br>
For a list of possible values, make a request to the Engines query. Pass "category" as an argument with "text recognition" as the value, and specify "id" and "name" as return fields.</td>
  <td>operator: "term"<br>
field: "text-recognition.source"<br>
value: "9a6ac62d-a881-8884-6ee0-f15ab84fcbe2"</td>
</tr>
<tr>
  <td>text-recognition.series.start</td>
  <td>integer</td>
  <td>The time in milliseconds from the beginning of the file where the text was first recognized.<br><br>
·  Uses range and term operators.</td>
  <td>operator: "range"<br>
field: "text-recognition.series.start"<br>
gte: "544000"</td>
</tr>
<tr>
  <td>text-recognition.series.end</td>
  <td>integer</td>
  <td>The time in milliseconds from the beginning of the file where the text was last recognized.<br><br>
·  Uses range and term operators.</td>
  <td>operator: "range"<br>
field: "text-recognition.series.end"<br>
lte: "545000"</td>
</tr>
<tr>
  <td>text-recognition.series.ocrtext</td>
  <td>string</td>
  <td>One or more identified words displayed as text.<br><br>
·  Value must be all lowercase.<br>
·  Uses term and query_string operators.</td>
  <td>operator: "term"<br>
field: "text-recognition.series.ocrtext"<br>
value: "diego"</td>
</tr>
<tr>
  <td colspan="4"><h5><b>Sentiment</b></h5>
Searches for records generated by a sentiment engine and other attributes for detected sentiment.</td>
</tr>
<tr>
  <td>sentiment-veritone.source</td>
  <td>string</td>
  <td>The ID of the sentiment engine to use as a filter when searching.<br><br>
For a list of possible values, make a request to the Engines query. Pass "category" as an argument with "sentiment" as the value, and specify "id" and "name" as return fields.</td>
  <td>operator: "term"<br>
field: "sentiment-veritone.source"<br>
value: "104a6b61-5d7d-8a1c-fa32-d37b4c931e7c"</td>
</tr>
<tr>
  <td>sentiment-veritone.series.start</td>
  <td>string</td>
  <td>The time in milliseconds from the beginning of the file where the sentiment was first detected.<br><br>
·  Uses range and term operators.</td>
  <td>operator: "range"<br>
field: "sentiment-veritone.series.start"<br>
lte: "84000"</td>
</tr>
<tr>
  <td>sentiment-veritone.series.end</td>
  <td>string</td>
  <td>The time in milliseconds from the beginning of the file where the sentiment was last detected.<br><br>
·  Uses range and term operators.</td>
  <td>operator: "range"<br>
field: "sentiment-veritone.series.start"<br>
gte: "844690"</td>
</tr>
<tr>
  <td>sentiment-veritone.series.score</td>
  <td>float</td>
  <td>A probability score that measures the similarity of a person’s sentiment to a reference model. This score can be used as a filter to prioritize more salient instances when searching. Scores closer to 0.0 are less similar, while scores closer to 1.0 are high in similarity. The value must include 0 before the decimal.<br><br>
·  Uses range and term operators.</td>
  <td>operator: "range"<br>
field: "sentiment-veritone.series.start"<br>
gte: 0.81</td>
</tr>
<tr>
  <td colspan="4"><h5><b>Transcript</b></h5>
Searches for records generated by a transcription engine and words/phrases in a transcript.</td>
</tr>
<tr>
  <td>transcript.source</td>
  <td>string</td>
  <td>The ID of the transcription engine to use as a filter when searching.<br><br>
For a list of possible values, make a request to the Engines query. Pass "category" as an argument with "transcription" as the value, and specify "id" and "name" as return fields.</td>
  <td>operator: "term"<br>
field: "transcript.source"<br>
value: "818aa3da-0123-33a4-8c5b-2bc3e569c52a"</td>
</tr>
<tr>
  <td>transcript.transcript</td>
  <td>string</td>
  <td>This field is used to find keywords or phrases in transcription text.<br><br>
·  Value must be entered as lowercase.
</td>
  <td>operator: "query_string"<br>
field: "transcript.transcript"<br>
value: "so you know atom"</td>
</tr>
<tr>
  <td colspan="4"><h5><b>Tags</b></h5>
Searches for user-created tags. This field’s values are case-sensitive and must be entered exactly as they appear in Veritone to return a match.</td>
</tr>
<tr>
  <td>tags.key
</td>
  <td>string</td>
  <td>This field is part of a key value pair (using the query object type and value field below) in a complex query.</td>
  <td>operator: "term"<br>
field: "tags.key"<br>
value: "host"</td>
</tr>
<tr>
  <td>tags.value</td>
  <td>string</td>
  <td>This field can be used in a complex query as part of a key value pair (using the query object type and key field above) or as a stand-alone in a simple query.</td>
  <td>operator: "term"<br>
field: "tags.value"<br>
value: "Ellen"</td>
</tr>
<tr>
  <td>tags.displayName</td>
  <td>string</td>
  <td>This field is used in simple queries to find a tag by name.</td>
  <td>operator: "term"<br>
field: "tags.displayName"<br>
value: "Adam Levine"</td>
</tr>
<tr>
  <td colspan="4"><h5><b>Veritone Job</b></h5>
Search options for various aspects of tasks run on a recording.</td>
</tr>
<tr>
  <td>veritone-job.insert-into-index</td>
  <td>boolean</td>
  <td>Searches for tasks that were indexed when set to true.</td>
  <td>operator: "term"<br>
field: "veritone-job.insert-into-index"<br>
value: true</td>
</tr>
<tr>
  <td>veritone-job.mention-generate</td>
  <td>boolean</td>
  <td>Searches for tasks that generated a mention when set to true.</td>
  <td>operator: "term"<br>
field: "veritone-job.mention-generate"<br>
value: true</td>
</tr>
<tr>
  <td>veritone-job.status</td>
  <td>string</td>
  <td>The status of the job as a whole.<br><br>
Possible values are:<br>
·  accepted: The job is valid and has been accepted for processing.<br>
·  running: The job is running.<br>
·  failed: At least one task failed and execution was terminated.<br>
·  complete: All tasks in the job finished normally.</td>
  <td>operator: "term"<br>
field: "veritone-job.status"<br>
value: "complete"</td>
</tr>
<tr>
  <td>veritone-job.{engineId}</td>
  <td>boolean</td>
  <td>Returns jobs for the stated engine ID when set to true.<br><br>
For a list of possible engine ID values, call the Engines query. Pass "records" as a request parameter and "id" and "name" as return fields.</td>
  <td>operator: "term"<br>
field: "veritone-job.imagedetection-facerecognition-veritone"<br>
value: true</td>
</tr>
<tr>
  <td colspan="4"><h5><b>Veritone File</b></h5>
Full text search for various attributes of files imported to CMS.</td>
</tr>
<tr>
  <td>veritone-file.filename</td>
  <td>string</td>
  <td>The name of the file. Value must be input as all lowercase.</td>
  <td>operator: "term"<br>
field: "veritone-file.filename"<br>
value: "morning drive 15"</td>
</tr>
<tr>
  <td>veritone-file.mimetype</td>
  <td>string</td>
  <td>The file type. Value must be input as all lowercase.</td>
  <td>operator: "term"<br>
field: "veritone-file.mimetype"<br>
value: "video/mp4"</td>
</tr>
<tr>
  <td>veritone-file.size</td>
  <td>long</td>
  <td>The size of the file.</td>
  <td>operator: "term"<br>
field: "veritone-file.size"<br>
value: 0</td>
</tr>
<tr>
  <td colspan="4"><h5><b>Veritone Public</b></h5>
Searches various aspects of nationally broadcasted programs.</td>
</tr>
<tr>
  <td>veritone-public.isNational</td>
  <td>boolean</td>
  <td>Specifies whether a program is national when set to true.</td>
  <td>operator: "term"<br>
field: "veritone-public.isNational"<br>
value: true</td>
</tr>
<tr>
  <td>veritone-public.marketCount</td>
  <td>integer</td>
  <td>Searches for a specific number of markets.</td>
  <td>operator: "term"<br>
field: "veritone-public.marketCount"<br>
value: "3"</td>
</tr>
<tr>
  <td>veritone-public.markets</td>
  <td>string</td>
  <td>Searches for recordings in specified markets. Refer to "Appendix 2: Markets" for a list of possible values.</td>
  <td>operator: "terms"<br>
field: "veritone-public.markets"<br>
values: ["88", "50", "167"]</td>
</tr>
<tr>
  <td>veritone-public.primaryMarket</td>
  <td>string</td>
  <td>Searches for recordings in the specified primary market. Refer to "Appendix 2: Markets" for a list of possible values</td>
  <td>operator: "term"<br>
field: "veritone-public.primaryMarket"<br>
value: "167"</td>
</tr>
<tr>
  <td>veritone-public.primaryState</td>
  <td>string</td>
  <td>Searches for recordings in the specified primary US state. Enter values using the two-letter state abbreviation.</td>
  <td>operator: "term"<br>
field: "veritone-public.primaryState"<br>
value: "CA"</td>
</tr>
<tr>
  <td>veritone-public.stateCount</td>
  <td>integer</td>
  <td>Searches for a specific number of states.</td>
  <td>operator: "term"<br>
field: "veritone-public.stateCount"<br>
value: "3"</td>
</tr>
<tr>
  <td>veritone-public.states</td>
  <td>string</td>
  <td>Searches for recordings in the specified US states. Enter values using the two-letter state abbreviation.</td>
  <td>operator: "terms"<br>
field: "veritone-public.states"<br>
values: ["CA", "NY", "WA"]</td>
</tr>
</table>

## Appendix 2: Markets

The following list provides the possible market ID values for the *veritone-public.markets* and *veritone-public.primaryMarket* fields in Appendix 1.

<table>
<tr>
  <td><b>Market ID/Market Name</b></td>
  <td><b>Market ID/Market Name</b></td>
</tr>
<tr>
  <td>"1" "Abilene-Sweetwater, TX"<br>
"2" "Albany-Schenectady-Troy, NY"<br>
"3" "Albany, GA"<br>
"4" "Albuquerque-Santa Fe, NM"<br>
"5" "Alexandria, LA"<br>
"6" "Alpena, MI"<br>
"7" "Amarillo, TX"<br>
"8" "Anchorage, AK"<br>
"9" "Atlanta, GA"<br>
"10" "Augusta, GA"<br>
"11" "Austin, TX"<br>
"12" "Bakersfield, CA"<br>
"13" "Baltimore, MD"<br>
"14" "Bangor, ME"<br>
"15" "Baton Rouge, LA"<br>
"16" "Beaumont-Port Arthur, TX"<br>
"17" "Bend, OR"<br>
"18" "Billings, MT"<br>
"19" "Biloxi-Gulfport, MS"<br>
"20" "Binghamton, NY"<br>
"21" "Birmingham, AL"<br>
"22" "Bluefield-Beckley-Oak Hill, WV"<br>
"23" "Boise, ID"<br>
"24" "Boston, MA"<br>
"25" "Bowling Green, KY"<br>
"26" "Buffalo, NY"<br>
"27" "Burlington, VT-Plattsburgh, NY"<br>
"28" "Butte-Bozeman, MT"<br>
"29" "Casper-Riverton, WY"<br>
"30" "Cedar Rapids-Waterloo-Iowa City-Dubuque, IA"<br>
"31" "Champagne-Springfield-Decatur, IL"<br>
"32" "Charleston-Huntington, WV"<br>
"33" "Charleston, SC"<br>
"34" "Charlotte, NC"<br>
"35" "Charlottesville, VA"<br>
"36" "Chattanooga, TN"<br>
"37" "Cheyenne, WY-Scottsbluff, NE"<br>
"38" "Chicago, IL"<br>
"39" "Chico-Redding, CA"<br>
"40" "Cincinnati, OH"<br>
"41" "Clarksburg-Weston, WV"<br>
"42" "Cleveland-Akron, OH"<br>
"43" "Colorado Springs-Pueblo, CO"<br>
"44" "Columbia-Jefferson City, MO"<br>
"45" "Columbia, SC"<br>
"46" "Columbus-Tupelo-West Point, MS"<br>
"47" "Columbus, GA"<br>
"48" "Columbus, OH"<br>
"49" "Corpus Christi, TX"<br>
"50" "Dallas-Ft. Worth, TX"<br>
"51" "Davenport, IA-Rock Island-Moline, IL"<br>
"52" "Dayton, OH"<br>
"53" "Denver, CO"<br>
"54" "Des Moines-Ames, IA"<br>
"55" "Detroit, MI"<br>
"56" "Dothan, AL"<br>
"57" "Duluth, MN-Superior, WI"<br>
"58" "El Paso, TX"<br>
"59" "Elmira, NY"<br>
"60" "Erie, PA"<br>
"61" "Eugene, OR"<br>
"62" "Eureka, CA"<br>
"63" "Evansville, IN"<br>
"64" "Fairbanks, AK"<br>
"65" "Fargo-Valley City, ND"<br>
"66" "Flint-Saginaw-Bay City, MI"<br>
"67" "Fresno-Visalia, CA"<br>
"68" "Ft. Myers-Naples, FL"<br>
"69" "Ft. Smith-Fayetteville-Springdale-Rogers, AR"<br>
"70" "Ft. Wayne, IN"<br>
"71" "Gainesville, FL"<br>
"72" "Glendive, MT"<br>
"73" "Grand Junction-Montrose, CO"<br>
"74" "Grand Rapids-Kalamazoo-Battle Creek, MI"<br>
"75" "Great Falls, MT"<br>
"76" "Green Bay-Appleton, WI"<br>
"77" 8Greensboro-High Point-Winston Salem, NC"<br>
"78" "Greenville-New Bern-Washington, NC"<br>
"79" "Greenville-Spartanburg, SC-Asheville, NC"<br>
"80" "Greenwood-Greenville, MS"<br>
"81" "Harlingen-Weslaco-Brownsville-McAllen, TX"<br>
"82" "Harrisburg-Lancaster-Lebanon-York, PA"<br>
"83" "Harrisonburg, VA"<br>
"84" "Hartford-New Haven, CT"<br>
"85" "Hattiesburg-Laurel, MS"<br>
"86" "Helena, MT"<br>
"87" "Honolulu, HI"<br>
"88" "Houston, TX"<br>
"89" "Huntsville-Decatur-Florence, AL"<br>
"90" "Idaho Falls-Pocatello, ID"<br>
"91" "Indianapolis, IN"<br>
"92" "Jackson, MS"<br>
"93" "Jackson, TN"<br>
"94" "Jacksonville, FL"<br>
"95" "Johnstown-Altoona, PA"<br>
"96" "Jonesboro, AR"<br>
"97" "Joplin, MO-Pittsburg, KS"<br>
"98" "Juneau, AK"<br>
"99" "Kansas City, KS-MO"<br>
"100" "Knoxville, TN"<br>
"101" "La Crosse-Eau Claire, WI"<br>
"102" "Lafayette, IN"<br>
"103" "Lafayette, LA"<br>
"104" "Lake Charles, LA"<br>
"105" "Lansing, MI"<br>
"106" "Laredo, TX"<br>
"107" "Las Vegas, NV"</td>
 <td>"108" "Lexington, KY"<br>
"109" "Lima, OH"<br>
"110" "Lincoln-Hastings-Kearney, NE"<br>
"111" "Little Rock-Pine Bluff, AR"<br>
"112" "Los Angeles, CA"<br>
"113" "Louisville, KY"<br>
"114" "Lubbock, TX"<br>
"115" "Macon, GA"<br>
"116" "Madison, WI"<br>
"117" "Mankato, MN"<br>
"118" "Marquette, MI"<br>
"119" "Medford-Klamath Falls, OR"<br>
"120" "Memphis, TN"<br>
"121" "Meridian, MS"<br>
"122" "Miami – Ft. Lauderdale, FL"<br>
"123" "Milwaukee, WI"<br>
"124" "Minneapolis – St. Paul, MN"<br>
"125" "Minot-Bismarck-Dickinson, ND"<br>
"126" "Missoula, MT"<br>
"127" "Mobile, AL-Pensacola, FL"<br>
"128" "Monroe, LA-El Dorado, AR"<br>
"129" "Monterey-Salinas, CA"<br>
"130" "Montgomery, AL"<br>
"131" "Myrtle Beach-Florence, SC"<br>
"132" "Nashville, TN"<br>
"133" "New Orleans, LA"<br>
"134" "New York, NY"<br>
"135" "Norfolk-Portsmouth-Newport News, VA"<br>
"136" "North Platte, NE"<br>
"137" "Odessa-Midland, TX"<br>
"138" "Oklahoma City, OK"<br>
"139" "Omaha, NE"<br>
"140" "Orlando-Daytona Beach-Melbourne, FL"<br>
"141" "Ottumwa, IA-Kirksville, MO"<br>
"142" "Paducah-Cape Girardeau-Harrisburg-Mt Vernon"<br>
"143" "Palm Springs, CA"<br>
"144" "Panama City, FL"<br>
"145" "Parkersburg, WV"<br>
"146" "Peoria-Bloomington, IL"<br>
"147" "Philadelphia, PA"<br>
"148" "Phoenix, AZ"<br>
"149" "Pittsburgh, PA"<br>
"150" "Portland-Auburn, ME"<br>
"151" "Portland, OR"<br>
"152" "Presque Isle, ME"<br>
"153" "Providence, RI-New Bedford, MA"<br>
"154" "Quincy, IL-Hannibal, MO-Keokuk, IA"<br>
"155" "Raleigh-Durham, NC"<br>
"156" "Rapid City, SD"<br>
"157" "Reno, NV"<br>
"158" "Richmond-Petersburg, VA"<br>
"159" "Roanoke-Lynchburg, VA"<br>
"160" "Rochester, MN-Mason City, IA-Austin, MN"<br>
"161" "Rochester, NY"<br>
"162" "Rockford, IL"<br>
"163" "Sacramento-Stockton-Modesto, CA"<br>
"164" "Salisbury, MD"<br>
"165" "Salt Lake City, UT"<br>
"166" "San Angelo, TX"<br>
"167" "San Antonio, TX"<br>
"168" "San Diego, CA"<br>
"169" "San Francisco-Oakland-San Jose, CA"<br>
"170" "Santa Barbara-Santa Maria-San Luis Obispo,"<br>
"171" "Savannah, GA"<br>
"172" "Seattle-Tacoma, WA"<br>
"173" "Sherman, TX – Ada, OK"<br>
"174" "Shreveport, LA"<br>
"175" "Sioux City, IA"<br>
"176" "Sioux Falls-Mitchell, SD"<br>
"177" "South Bend-Elkhart, IN"<br>
"178" "Spokane, WA"<br>
"179" "Springfield-Holyoke, MA"<br>
"180" "Springfield, MO"<br>
"181" "St. Joseph, MO"<br>
"182" "St. Louis, MO"<br>
"183" "Syracuse, NY"<br>
"184" "Tallahassee, FL-Thomasville, GA"<br>
"185" "Tampa-St Petersburg-Sarasota, FL"<br>
"186" "Terre Haute, IN"<br>
"187" "Toledo, OH"<br>
"188" "Topeka, KS"<br>
"189" "Traverse City-Cadillac, MI"<br>
"190" "Tri-Cities, TN-VA"<br>
"191" "Tucson, AZ"<br>
"192" "Tulsa, OK"<br>
"193" "Twin Falls, ID"<br>
"194" "Tyler-Longview, TX"<br>
"195" "Utica, NY"<br>
"196" "Victoria, TX"<br>
"197" "Waco-Temple-Bryan, TX"<br>
"198" "Washington, DC"<br>
"199" "Watertown, NY"<br>
"200" "Wausau-Rhinelander, WI"<br>
"201" "West Palm Beach-Ft. Pierce, FL"<br>
"202" "Wheeling, WV- Steubenville, OH"<br>
"203" "Wichita – Hutchinson, KS"<br>
"204" "Wichita Falls, TX –Lawton, OK"<br>
"205" "Wilkes Barre-Scranton, PA"<br>
"206" "Wilmington, NC"<br>
"207" "Yakima-Pasco-Richland-Kennewick, WA"<br>
"208" "Youngstown, OH"<br>
"209" "Yuma, AZ-El Centro, CA"<br>
"210" "Zanesville, OH"<br>
"211" "Adelaide, SA"<br>
"212" "Melbourne, VIC"<br>
"213" "Brisbane, QLD"</td>
</tr>
</table>
