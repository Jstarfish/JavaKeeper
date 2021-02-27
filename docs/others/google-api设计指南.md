# API 设计指南

## 简介

这是联网 API 的通用设计指南。它自 2014 年起在 Google 内部使用，是 Google 在设计 [Cloud API](https://cloud.google.com/apis/docs/overview?hl=zh-cn) 和其他 [Google API](https://github.com/googleapis/googleapis) 时遵循的指南。我们在此公开此设计指南，目的是为外部开发者提供信息，使我们所有人都能更轻松地协同工作。

[Cloud Endpoints](https://cloud.google.com/endpoints/docs/grpc?hl=zh-cn) 开发者可能会发现本指南在设计 gRPC API 时特别有用，我们强烈建议此类开发者遵循这些设计原则。不过，我们并不强制要求使用本指南。您可以使用 Cloud Endpoints 和 gRPC，而无需遵循本指南。

本指南同时适用于 REST API 和 RPC API，尤其适用于 gRPC API。gRPC API 使用 [Protocol Buffers](https://cloud.google.com/apis/design/proto3?hl=zh-cn) 定义其 API 表面 (surface) 和 [API 服务配置](https://github.com/googleapis/googleapis)，以配置其 API 服务，包括 HTTP 映射、日志记录和监控。 Google API 和 Cloud Endpoints gRPC API 使用 HTTP 映射功能进行 JSON/HTTP 到 Protocol Buffers/RPC 的[转码](https://cloud.google.com/endpoints/docs/transcoding?hl=zh-cn)。

本指南是一份活文档，随着时间的推移，我们会采纳和批准新的风格和设计模式，为本指南增加相关内容。本着这种精神，我们会不断完善本指南，并为 API 设计的艺术和技巧提供充足的空间。

## 本文档中使用的惯例 

本文档中使用的要求级别关键字（“必须”、“不得”、“必需”，“应”、“不应”、“应该”、“不应该”、“建议”、“可以”和“可选”）将按 [RFC 2119 ](https://www.ietf.org/rfc/rfc2119.txt)中的描述进行解释。

在本文档中，这些关键字使用**粗体**突出显示。



# 基于资源的设计

本设计指南的目标是帮助开发者设计**简单、一致且易用**的网络 API。同时，它还有助于将 RPC API（基于套接字）与 REST API（基于 HTTP）的设计融合起来。

RPC API 通常根据接口和方法设计。随着时间的推移，接口和方法越来越多，最终结果可能是形成一个庞大而混乱的 API 接口，因为开发者必须单独学习每种方法。显然，这既耗时又容易出错。

引入 [REST](http://en.wikipedia.org/wiki/Representational_state_transfer) 架构风格主要是为了与 HTTP/1.1 配合使用，但也有助于解决这个问题。其核心原则是定义可以用少量方法控制的命名资源。这些资源和方法被称为 API 的“名词”和“动词”。使用 HTTP 协议时，资源名称自然映射到网址，方法自然映射到 HTTP 的 `POST`、`GET`、`PUT`、`PATCH` 和 `DELETE`。这使得要学习的内容减少了很多，因为开发人员可以专注于资源及其关系，并假定它们拥有的标准方法同样很少。

近来，HTTP REST API 在互联网上取得了巨大成功。2010 年，大约 74％ 的公共网络 API 是 HTTP REST API。

虽然 HTTP REST API 在互联网上非常流行，但它们承载的流量比传统的 RPC API 要小。例如，美国高峰时段大约一半的互联网流量是视频内容，显然出于性能考虑，很少有人会使用 REST API 来传送此类内容。在数据中心内，许多公司使用基于套接字的 RPC API 来承载大多数网络流量，这可能涉及比公共 REST API 高几个数量级的数据（以字节为单位）。

在实际使用中，人们会出于不同目的选择 RPC API 和 HTTP REST API，理想情况下，API 平台应该为所有类型的 API 提供最佳支持。本设计指南可帮助您设计和构建符合此原则的 API。它将面向资源的设计原则应用于通用 API 设计并定义了许多常见的设计模式，从而提高可用性并降低复杂性。

**注意**：本设计指南介绍了如何将 REST 原则应用于 API 设计，与编程语言、操作系统或网络协议无关。这不仅仅是一个创建 REST API 的指南。

## 什么是 REST API？

REST API 是可单独寻址的“资源”（API 中的“名词”）的“集合”。资源通过[资源名称](https://cloud.google.com/apis/design/resource_names?hl=zh-cn)被引用，并通过一组“方法”（也称为“动词”或“操作”）进行控制。

REST Google API 的标准方法（也称为“REST 方法”）包括 `List`、`Get`、`Create`、`Update` 和 `Delete`。API 设计者还可以使用“自定义方法”（也称为“自定义动词”或“自定义操作”）来实现无法轻易映射到标准方法的功能（例如数据库事务）。

**注意**：自定义动词并不意味着创建自定义 HTTP 动词来支持自定义方法。对基于 HTTP 的 API 而言，它们只是映射到最合适的 HTTP 动词。

## 设计流程

设计指南建议在设计面向资源的 API 时采取以下步骤（更多细节将在下面的特定部分中介绍）：

- 确定 API 提供的资源类型。
- 确定资源之间的关系。
- 根据类型和关系确定资源名称方案。
- 确定资源架构。
- 将最小的方法集附加到资源。

## 资源

面向资源的 API 通常被构建为资源层次结构，其中每个节点是一个“简单资源”或“集合资源”。 为方便起见，它们通常被分别称为资源和集合。

- 一个集合包含**相同类型**的资源列表。 例如，一个用户拥有一组联系人。
- 资源具有一些状态和零个或多个子资源。 每个子资源可以是一个简单资源或一个集合资源。

例如，Gmail API 有一组用户，每个用户都有一组消息、一组线程、一组标签、一个个人资料资源和若干设置资源。

虽然存储系统和 REST API 之间存在一些概念上的对应，但具有面向资源 API 的服务不一定是数据库，并且在解释资源和方法方面具有极大的灵活性。例如，创建日历事件（资源）可以为参与者创建附加事件、向参与者发送电子邮件邀请、预约会议室以及更新视频会议时间安排。

## 方法

面向资源的 API 的关键特性是，强调资源（数据模型）甚于资源上执行的方法（功能）。典型的面向资源的 API 使用少量方法公开大量资源。方法可以是标准方法或自定义方法。对于本指南，标准方法有：`List`、`Get`、`Create`、`Update` 和 `Delete`。

如果 API 功能能够自然映射到标准方法，则**应该**在 API 设计中使用该方法。对于不会自然映射到某一标准方法的功能，**可以**使用自定义方法。[自定义方法](https://cloud.google.com/apis/design/custom_methods?hl=zh-cn)提供与传统 RPC API 相同的设计自由度，可用于实现常见的编程模式，例如数据库事务或数据分析。

## 示例

以下部分介绍了如何将面向资源的 API 设计应用于大规模服务的一些实际示例。您可以在 [Google API](https://github.com/googleapis/googleapis) 代码库中找到更多示例。

在这些示例中，星号表示列表中的一个特定资源。

### Gmail API

Gmail API 服务实现了 Gmail API 并公开了大多数 Gmail 功能。它具有以下资源模型：

- API 服务：

  ```
  gmail.googleapis.com
  ```

  - 用户集合：

    ```
    users/*
    ```

    。每个用户都拥有以下资源。

    - 消息集合：`users/*/messages/*`。
    - 线程集合：`users/*/threads/*`。
    - 标签集合：`users/*/labels/*`。
    - 变更历史记录集合：`users/*/history/*`。
    - 表示用户个人资料的资源：`users/*/profile`。
    - 表示用户设置的资源：`users/*/settings`。

### Cloud Pub/Sub API

`pubsub.googleapis.com` 服务实现了 [Cloud Pub/Sub AP](https://cloud.google.com/pubsub?hl=zh-cn)，后者定义以下资源模型：

- API 服务：

  ```
  pubsub.googleapis.com
  ```

  - 主题集合：`projects/*/topics/*`。
  - 订阅集合：`projects/*/subscriptions/*`。

**注意**：Pub/Sub API 的其他实现可以选择不同的资源命名方案。

### Cloud Spanner API

`spanner.googleapis.com` 服务实现了 [Cloud Spanner API](https://cloud.google.com/spanner?hl=zh-cn)，后者定义了以下资源模型：

- API 服务：

  ```
  spanner.googleapis.com
  ```

  - 实例集合：

    ```
    projects/*/instances/*
    ```

    。

    - 实例操作的集合：`projects/*/instances/*/operations/*`。
    - 数据库的集合：`projects/*/instances/*/databases/*`。
    - 数据库操作的集合：`projects/*/instances/*/databases/*/operations/*`。
    - 数据库会话的集合：`projects/*/instances/*/databases/*/sessions/*`。





# 资源名称

在面向资源的 API 中，“资源”是被命名的实体，“资源名称”是它们的标识符。每个资源都**必须**具有自己唯一的资源名称。 资源名称由资源自身的 ID、任何父资源的 ID 及其 API 服务名称组成。在下文中，我们将查看资源 ID 以及如何构建资源名称。

gRPC API 应使用无传输协议的 [URI](http://tools.ietf.org/html/rfc3986) 作为资源名称。它们通常遵循 REST 网址规则，其行为与网络文件路径非常相似。它们可以轻松映射到 REST 网址：如需了解详情，请参阅[标准方法](https://cloud.google.com/apis/design/standard_methods?hl=zh-cn)部分。

“集合”是一种特殊的资源，包含相同类型的子资源列表。例如，目录是文件资源的集合。集合的资源 ID 称为集合 ID。

资源名称由集合 ID 和资源 ID 构成，按分层方式组织并以正斜杠分隔。如果资源包含子资源，则子资源的名称由父资源名称后跟子资源的 ID 组成，也以正斜杠分隔。

示例 1：存储服务具有一组 `buckets`，其中每个存储分区都有一组 `objects`：

| API 服务名称             | 集合 ID  | 资源 ID    | 集合 ID  | 资源 ID    |
| :----------------------- | :------- | :--------- | :------- | :--------- |
| //storage.googleapis.com | /buckets | /bucket-id | /objects | /object-id |

示例 2：电子邮件服务具有一组 `users`。每个用户都有一个 `settings` 子资源，而 `settings` 子资源拥有包括 `customFrom` 在内的许多其他子资源：

| API 服务名称          | 集合 ID | 资源 ID           | 资源 ID   | 资源 ID     |
| :-------------------- | :------ | :---------------- | :-------- | :---------- |
| //mail.googleapis.com | /users  | /name@example.com | /settings | /customFrom |

API 生产者可以为资源和集合 ID 选择任何可接受的值，只要它们在资源层次结构中是唯一的。您可以在下文中找到有关选择适当的资源和集合 ID 的更多准则。

通过拆分资源名称（例如 `name.split("/")[n]`），可以获得单个集合 ID 和资源 ID（假设任何段都不包含正斜杠）。

## 完整资源名称

无传输协议的 [URI](http://tools.ietf.org/html/rfc3986) 由 [DNS 兼容的](http://tools.ietf.org/html/rfc1035) API 服务名称和资源路径组成。资源路径也称为“相对资源名称”。 例如：

```
"//library.googleapis.com/shelves/shelf1/books/book2"
```

API 服务名称供客户端定位 API 服务端点；它**可以**是仅限内部服务的虚构 DNS 名称。如果 API 服务名称在上下文中很明显，则通常使用相对资源名称。

## 相对资源名称

开头没有“/”的 URI 路径 ([path-noscheme](http://tools.ietf.org/html/rfc3986#appendix-A)）。它标识 API 服务中的资源。例如：

```
"shelves/shelf1/books/book2"
```

## 资源 ID

标识其父资源中资源的非空 URI 段 ([segment-nz-nc](http://tools.ietf.org/html/rfc3986#appendix-A))，请参见上文的示例。

资源名称末尾的资源 ID **可以**具有多个 URI 段。例如：

| 集合 ID | 资源 ID              |
| :------ | :------------------- |
| files   | /source/py/parser.py |

API 服务**应该**尽可能使用网址友好的资源 ID。 资源 ID **必须**被清楚地记录，无论它们是由客户端、服务器还是其中一个分配的。例如，文件名通常由客户端分配，而电子邮件消息 ID 通常由服务器分配。

## 集合 ID

标识其父资源中集合资源的非空 URI 段 ([segment-nz-nc](http://tools.ietf.org/html/rfc3986#appendix-A))，请参见上文的示例。

由于集合 ID 通常出现在生成的客户端库中，因此它们**必须**符合以下要求：

- **必须**是有效的 C/C++ 标识符。

- **必须**是复数形式的首字母小写驼峰体。如果该词语没有合适的复数形式，例如“evidence（证据）”和“weather（天气）”，则**应该**使用单数形式。

- **必须**使用简明扼要的英文词语。

- 应该

  避免过于笼统的词语，或对其进行限定后再使用。例如，

  ```
  rowValues
  ```

   

  优先于

   

  ```
  values
  ```

  。

  应该

  避免在不加以限定的情况下使用以下词语：

  - elements
  - entries
  - instances
  - items
  - objects
  - resources
  - types
  - values

## 资源名称和网址

虽然完整的资源名称类似于普通网址，但两者并不相同。单个资源可以由不同的 API 版本、API 协议或 API 网络端点公开。完整资源名称未指明此类信息，因此在实际使用中必须将其映射到特定的 API 版本和 API 协议。

要通过 REST API 使用完整资源名称，**必须**将其转换为 REST 网址，实现方法为在服务名称之前添加 HTTPS 传输协议、在资源路径之前添加 API 主要版本以及对资源路径进行网址转义。例如：

```
// This is a calendar event resource name.
"//calendar.googleapis.com/users/john smith/events/123"

// This is the corresponding HTTP URL.
"https://calendar.googleapis.com/v3/users/john%20smith/events/123"
```

## 资源名称为字符串

除非存在向后兼容问题，否则 Google API **必须**使用纯字符串来表示资源名称。资源名称**应该**像普通文件路径一样处理，并且它们不支持 % 编码。

对于资源定义，第一个字段**应该**是资源名称的字符串字段，并且**应该**称为 `name`。

**注意**：以下代码示例使用 [gRPC 转码](https://github.com/googleapis/googleapis/blob/master/google/api/http.proto)语法。请点击链接以查看详细信息。

例如：

```proto
service LibraryService {
  rpc GetBook(GetBookRequest) returns (Book) {
    option (google.api.http) = {
      get: "/v1/{name=shelves/*/books/*}"
    };
  };
  rpc CreateBook(CreateBookRequest) returns (Book) {
    option (google.api.http) = {
      post: "/v1/{parent=shelves/*}/books"
      body: "book"
    };
  };
}

message Book {
  // Resource name of the book. It must have the format of "shelves/*/books/*".
  // For example: "shelves/shelf1/books/book2".
  string name = 1;

  // ... other properties
}

message GetBookRequest {
  // Resource name of a book. For example: "shelves/shelf1/books/book2".
  string name = 1;
}

message CreateBookRequest {
  // Resource name of the parent resource where to create the book.
  // For example: "shelves/shelf1".
  string parent = 1;
  // The Book resource to be created. Client must not set the `Book.name` field.
  Book book = 2;
}
```

**注意**：为了保证资源名称的一致性，前导正斜杠**不得**被任何网址模板变量捕获。例如，**必须**使用网址模板 `"/v1/{name=shelves/*/books/*}"`，而非 `"/v1{name=/shelves/*/books/*}"`。

## 问题

### 问：为什么不使用资源 ID 来标识资源？

答：任何大型系统都有很多种资源。在使用资源 ID 来标识资源的时候，我们实际上是使用特定于资源的元组来标识资源，例如 `(bucket, object)` 或 `(user, album, photo)`。这会带来几个主要问题：

- 开发者必须了解并记住这些匿名元组。
- 传递元组通常比传递字符串更难。
- 集中式基础架构（例如日志记录和访问控制系统）不理解专用元组。
- 专用元组限制了 API 设计的灵活性，例如提供可重复使用的 API 接口。例如，[长时间运行的操作](https://github.com/googleapis/googleapis/tree/master/google/longrunning)可以与许多其他 API 接口一起使用，因为它们使用灵活的资源名称。

### 问：为什么特殊字段名为 name 而不是 id？

答：特殊字段以资源“名称”的概念命名。一般来说，我们发现 `name` 的概念让开发者感到困惑。例如，文件名实际上只是名称还是完整路径？通过预留标准字段 `name`，开发者不得不选择更合适的词语，例如 `display_name` 或 `title` 或 `full_name`。



# 标准方法

本章定义了标准方法（即 `List`、`Get`、`Create`、`Update` 和 `Delete` 的概念。标准方法可降低复杂性并提高一致性。[Google API](https://github.com/googleapis/googleapis) 代码库中超过 70％ 的 API 方法都是标准方法，这使得它们更易于学习和使用。

下表描述了如何将标准方法映射到 HTTP 方法：

| 标准方法                                                     | HTTP 映射                     | HTTP 请求正文 | HTTP 响应正文             |
| :----------------------------------------------------------- | :---------------------------- | :------------ | :------------------------ |
| [`List`](https://cloud.google.com/apis/design/standard_methods?hl=zh-cn#list) | `GET <collection URL>`        | 无            | 资源*列表                 |
| [`Get`](https://cloud.google.com/apis/design/standard_methods?hl=zh-cn#get) | `GET <resource URL>`          | 无            | 资源*                     |
| [`Create`](https://cloud.google.com/apis/design/standard_methods?hl=zh-cn#create) | `POST <collection URL>`       | 资源          | 资源*                     |
| [`Update`](https://cloud.google.com/apis/design/standard_methods?hl=zh-cn#update) | `PUT or PATCH <resource URL>` | 资源          | 资源*                     |
| [`Delete`](https://cloud.google.com/apis/design/standard_methods?hl=zh-cn#delete) | `DELETE <resource URL>`       | 不适用        | `google.protobuf.Empty`** |

*如果方法支持响应字段掩码以指定要返回的字段子集，则 `List`、`Get`、`Create` 和 `Update` 方法返回的资源**可能**包含部分数据。在某些情况下，API 平台对所有方法的字段掩码提供原生支持。

**从不立即移除资源的 `Delete` 方法（例如更新标志或创建长时间运行的删除操作）返回的响应**应该**包含长时间运行的操作或修改后的资源。

对于在单个 API 调用的时间跨度内未完成的请求，标准方法还**可以**返回[长时间运行的操作](https://github.com/googleapis/googleapis/blob/master/google/longrunning/operations.proto)。

以下部分详细描述了每种标准方法。 这些示例显示了.proto 文件中定义的方法和 HTTP 映射的特殊注释。您可以在 [Google API](https://github.com/googleapis/googleapis) 代码库中找到许多使用标准方法的示例。

## 列出

`List` 方法将一个集合名称和零个或多个参数作为输入，并返回与输入匹配的资源列表。

`List` 通常用于搜索资源。`List` 适用于来自单个集合的数据，该集合的大小有限且不进行缓存。对于更广泛的情况，**应该**使用[自定义方法](https://cloud.google.com/apis/design/custom_methods?hl=zh-cn) `Search`。

批量 get（例如，获取多个资源 ID 并为每个 ID 返回对象的方法）**应该**被实现为自定义 `BatchGet` 方法，而不是 `List` 方法。但是，如果您有一个已经存在的可提供相同功能的 `List` 方法，**可以**出于此目的重复使用 `List` 方法。如果您使用的是自定义 `BatchGet` 方法，则**应该**将其映射到 `HTTP GET`。

适用的常见模式：[分页](https://cloud.google.com/apis/design/design_patterns?hl=zh-cn#list_pagination)、[结果排序](https://cloud.google.com/apis/design/design_patterns?hl=zh-cn#sorting_order)。

适用的命名规则：[过滤字段](https://cloud.google.com/apis/design/naming_convention?hl=zh-cn#list_filter_field)、[结果字段](https://cloud.google.com/apis/design/naming_convention?hl=zh-cn#list_response)。

HTTP 映射：

- `List` 方法 **必须**使用 HTTP `GET` 动词。
- 接收其资源正在列出的集合名称的请求消息字段**应该**映射到网址路径。如果集合名称映射到网址路径，则网址模板的最后一段（[集合 ID](https://cloud.google.com/apis/design/resource_names?hl=zh-cn#CollectionId)）**必须**是字面量。
- 所有剩余的请求消息字段**应该**映射到网址查询参数。
- 没有请求正文，API 配置**不得**声明 `body` 子句。
- 响应正文**应该**包含资源列表以及可选元数据。

示例：

```proto
// Lists books in a shelf.
rpc ListBooks(ListBooksRequest) returns (ListBooksResponse) {
  // List method maps to HTTP GET.
  option (google.api.http) = {
    // The `parent` captures the parent resource name, such as "shelves/shelf1".
    get: "/v1/{parent=shelves/*}/books"
  };
}

message ListBooksRequest {
  // The parent resource name, for example, "shelves/shelf1".
  string parent = 1;

  // The maximum number of items to return.
  int32 page_size = 2;

  // The next_page_token value returned from a previous List request, if any.
  string page_token = 3;
}

message ListBooksResponse {
  // The field name should match the noun "books" in the method name.  There
  // will be a maximum number of items returned based on the page_size field
  // in the request.
  repeated Book books = 1;

  // Token to retrieve the next page of results, or empty if there are no
  // more results in the list.
  string next_page_token = 2;
}
```

## 获取

`Get` 方法需要一个资源名称和零个或多个参数作为输入，并返回指定的资源。

HTTP 映射：

- `Get` 方法 **必须**使用 HTTP `GET` 动词。
- 接收资源名称的请求消息字段**应该**映射到网址路径。
- 所有剩余的请求消息字段**应该**映射到网址查询参数。
- 没有请求正文，API 配置**不得**声明 `body` 子句。
- 返回的资源**应该**映射到整个响应正文。

示例：

```proto
// Gets a book.
rpc GetBook(GetBookRequest) returns (Book) {
  // Get maps to HTTP GET. Resource name is mapped to the URL. No body.
  option (google.api.http) = {
    // Note the URL template variable which captures the multi-segment resource
    // name of the requested book, such as "shelves/shelf1/books/book2"
    get: "/v1/{name=shelves/*/books/*}"
  };
}

message GetBookRequest {
  // The field will contain name of the resource requested, for example:
  // "shelves/shelf1/books/book2"
  string name = 1;
}
```

## 创建

`Create` 方法需要一个父资源名称、一个资源以及零个或多个参数作为输入。它在指定的父资源下创建新资源，并返回新建的资源。

如果 API 支持创建资源，则**应该**为每一个可以创建的资源类型设置 `Create` 方法。

HTTP 映射：

- `Create` 方法 **必须**使用 HTTP `POST` 动词。
- 请求消息**应该**具有字段 `parent`，以指定要在其中创建资源的父资源名称。
- 包含资源的请求消息字段**必须**映射到请求正文。如果将 `google.api.http` 注释用于 `Create` 方法，则**必须**使用 `body: "<resource_field>"` 表单。
- 该请求**可以**包含名为 `<resource>_id` 的字段，以允许调用者选择客户端分配的 ID。该字段**可以**在资源内。
- 所有剩余的请求消息字段**应该**映射到网址查询参数。
- 返回的资源**应该**映射到整个 HTTP 响应正文。

如果 `Create` 方法支持客户端分配的资源名称并且资源已存在，则请求**应该**失败并显示错误代码 `ALREADY_EXISTS` 或使用服务器分配的不同的资源名称，并且文档应该清楚地记录创建的资源名称可能与传入的不同。

`Create` 方法**必须**使用输入资源，以便在资源架构更改时，无需同时更新请求架构和资源架构。对于客户端无法设置的资源字段，**必须**将它们记录为“仅限输出”字段。

示例：

```proto
// Creates a book in a shelf.
rpc CreateBook(CreateBookRequest) returns (Book) {
  // Create maps to HTTP POST. URL path as the collection name.
  // HTTP request body contains the resource.
  option (google.api.http) = {
    // The `parent` captures the parent resource name, such as "shelves/1".
    post: "/v1/{parent=shelves/*}/books"
    body: "book"
  };
}

message CreateBookRequest {
  // The parent resource name where the book is to be created.
  string parent = 1;

  // The book id to use for this book.
  string book_id = 3;

  // The book resource to create.
  // The field name should match the Noun in the method name.
  Book book = 2;
}

rpc CreateShelf(CreateShelfRequest) returns (Shelf) {
  option (google.api.http) = {
    post: "/v1/shelves"
    body: "shelf"
  };
}

message CreateShelfRequest {
  Shelf shelf = 1;
}
```

## 更新

`Update` 方法需要一条包含一个资源的请求消息和零个或多个参数作为输入。它更新指定的资源及其属性，并返回更新后的资源。

除了包含资源[名称或父资源](https://cloud.google.com/apis/design/resource_names?hl=zh-cn#Definitions)的属性之外，`Update` 方法**应该**可以改变可变资源的属性。`Update` 方法 **不得**包含任何“重命名”或“移动”资源的功能，这些功能**应该**由自定义方法来处理。

HTTP 映射：

- 标准 `Update` 方法**应该**支持部分资源更新，并将 HTTP 动词 `PATCH` 与名为 `update_mask` 的 `FieldMask`字段一起使用。应忽略客户端提供的作为输入的[输出字段](https://cloud.google.com/apis/design/design_patterns?hl=zh-cn#output_fields)。
- 需要更高级修补语义的 `Update` 方法（例如附加到重复字段）**应该**由[自定义方法](https://cloud.google.com/apis/design/custom_methods?hl=zh-cn)提供。
- 如果 `Update` 方法仅支持完整资源更新，则**必须**使用 HTTP 动词 `PUT`。但是，强烈建议不要进行完整更新，因为在添加新资源字段时会出现向后兼容性问题。
- 接收资源名称的消息字段**必须**映射到网址路径。该字段**可以**位于资源消息本身中。
- 包含资源的请求消息字段**必须**映射到请求正文。
- 所有剩余的请求消息字段**必须**映射到网址查询参数。
- 响应消息**必须**是更新的资源本身。

如果 API 接受客户端分配的资源名称，则服务器**可以**允许客户端指定不存在的资源名称并创建新资源。 否则，使用不存在的资源名称的 `Update` 方法**应该**失败。 如果这是唯一的错误条件，则**应该**使用错误代码 `NOT_FOUND`。

具有支持资源创建的 `Update` 方法的 API 还**应该**提供 `Create` 方法。原因是，如果 `Update` 方法是唯一的方法，则它将不知道如何创建资源。

例如：

```proto
// Updates a book.
rpc UpdateBook(UpdateBookRequest) returns (Book) {
  // Update maps to HTTP PATCH. Resource name is mapped to a URL path.
  // Resource is contained in the HTTP request body.
  option (google.api.http) = {
    // Note the URL template variable which captures the resource name of the
    // book to update.
    patch: "/v1/{book.name=shelves/*/books/*}"
    body: "book"
  };
}

message UpdateBookRequest {
  // The book resource which replaces the resource on the server.
  Book book = 1;

  // The update mask applies to the resource. For the `FieldMask` definition,
  // see https://developers.google.com/protocol-buffers/docs/reference/google.protobuf#fieldmask
  FieldMask update_mask = 2;
}
```

## 删除

`Delete` 方法需要一个资源名称和零个或多个参数作为输入，并删除或计划删除指定的资源。`Delete` 方法 **应该**返回 `google.protobuf.Empty`。

API **不应该**依赖于 `Delete` 方法返回的任何信息，因为它**不能**重复调用。

HTTP 映射：

- `Delete` 方法 **必须**使用 HTTP `DELETE` 动词。
- 接收资源名称的请求消息字段**应该**映射到网址路径。
- 所有剩余的请求消息字段**应该**映射到网址查询参数。
- 没有请求正文，API 配置**不得**声明 `body` 子句。
- 如果 `Delete` 方法立即移除资源，则**应该**返回空响应。
- 如果 `Delete` 方法启动长时间运行的操作，则**应该**返回长时间运行的操作。
- 如果 `Delete` 方法仅将资源标记为已删除，则**应该**返回更新后的资源。

对 `Delete` 方法的调用在效果上应该是[幂等](http://tools.ietf.org/html/rfc2616#section-9.1.2)的，但不需要产生相同的响应。任意数量的 `Delete` 请求都**应该**导致资源（最终）被删除，但只有第一个请求会产生成功代码。后续请求应生成 `google.rpc.Code.NOT_FOUND`。

例如：

```proto
// Deletes a book.
rpc DeleteBook(DeleteBookRequest) returns (google.protobuf.Empty) {
  // Delete maps to HTTP DELETE. Resource name maps to the URL path.
  // There is no request body.
  option (google.api.http) = {
    // Note the URL template variable capturing the multi-segment name of the
    // book resource to be deleted, such as "shelves/shelf1/books/book2"
    delete: "/v1/{name=shelves/*/books/*}"
  };
}

message DeleteBookRequest {
  // The resource name of the book to be deleted, for example:
  // "shelves/shelf1/books/book2"
  string name = 1;
}
```



# 自定义方法

本章将讨论如何在 API 设计中使用自定义方法。

自定义方法是指 5 个标准方法之外的 API 方法。这些方法**应该**仅用于标准方法不易表达的功能。通常情况下，API 设计者**应该**尽可能优先考虑使用标准方法，而不是自定义方法。标准方法具有大多数开发者熟悉的更简单且定义明确的语义，因此更易于使用且不易出错。另一项优势是 API 平台更加了解和支持标准方法，例如计费、错误处理、日志记录、监控。

自定义方法可以与资源、集合或服务关联。 它**可以**接受任意请求和返回任意响应，并且还支持流式请求和响应。

自定义方法名称**必须**遵循[方法命名惯例](https://cloud.google.com/apis/design/naming_convention?hl=zh-cn#method_names)。

## HTTP 映射

对于自定义方法，它们**应该**使用以下通用 HTTP 映射：

```
https://service.name/v1/some/resource/name:customVerb
```

使用 `:` 而不是 `/` 将自定义动词与资源名称分开以便支持任意路径。例如，恢复删除文件可以映射到 `POST /files/a/long/file/name:undelete`

选择 HTTP 映射时，**应**遵循以下准则：

- 自定义方法**应该**使用 HTTP `POST` 动词，因为该动词具有最灵活的语义，但作为替代 get 或 list 的方法（如有可能，**可以**使用 `GET`）除外。（详情请参阅第三条。）
- 自定义方法**不应该**使用 HTTP `PATCH`，但**可以**使用其他 HTTP 动词。在这种情况下，方法**必须**遵循该动词的标准 [HTTP 语义](https://tools.ietf.org/html/rfc2616#section-9)。
- 请注意，使用 HTTP `GET` 的自定义方法**必须**具有幂等性并且无负面影响。例如，在资源上实现特殊视图的自定义方法**应该**使用 HTTP `GET`。
- 接收与自定义方法关联的资源或集合的资源名称的请求消息字段**应该**映射到网址路径。
- 网址路径**必须**以包含冒号（后跟自定义动词）的后缀结尾。
- 如果用于自定义方法的 HTTP 动词允许 HTTP 请求正文（其适用于 `POST`、`PUT`、`PATCH` 或自定义 HTTP 动词），则此自定义方法的 HTTP 配置**必须**使用 `body: "*"` 子句，所有其他请求消息字段都**应**映射到 HTTP 请求正文。
- 如果用于自定义方法的 HTTP 动词不接受 HTTP 请求正文（`GET`、`DELETE`），则此方法的 HTTP 配置**不得**使用 `body` 子句，并且所有其他请求消息字段都**应**映射到网址查询参数。

**警告**：如果一个服务会实现多个 API，API 生产者**必须**仔细创建服务配置，以避免 API 之间的自定义动词发生冲突。

```proto
// This is a service level custom method.
rpc Watch(WatchRequest) returns (WatchResponse) {
  // Custom method maps to HTTP POST. All request parameters go into body.
  option (google.api.http) = {
    post: "/v1:watch"
    body: "*"
  };
}

// This is a collection level custom method.
rpc ClearEvents(ClearEventsRequest) returns (ClearEventsResponse) {
  option (google.api.http) = {
    post: "/v3/events:clear"
    body: "*"
  };
}

// This is a resource level custom method.
rpc CancelEvent(CancelEventRequest) returns (CancelEventResponse) {
  option (google.api.http) = {
    post: "/v3/{name=events/*}:cancel"
    body: "*"
  };
}

// This is a batch get custom method.
rpc BatchGetEvents(BatchGetEventsRequest) returns (BatchGetEventsResponse) {
  // The batch get method maps to HTTP GET verb.
  option (google.api.http) = {
    get: "/v3/events:batchGet"
  };
}
```

## 用例

自定义方法适用于以下场景：

- **重启虚拟机。** 设计备选方案可能是“在重启集合中创建一个重启资源”，这会让人感觉过于复杂，或者“虚拟机具有可变状态，客户端可以将状态从 RUNNING 更新到 RESTARTING”，这会产生可能存在哪些其他状态转换的问题。 此外，重启是一个常见概念，可以合理转化为一个自定义方法，从直观上来说符合开发者的预期。
- **发送邮件。** 创建一个电子邮件消息不一定意味着要发送它（草稿）。与设计备选方案（将消息移动到“发件箱”集合）相比，自定义方法更容易被 API 用户发现，并且可以更直接地对概念进行建模。
- **提拔员工。** 如果作为标准 `update` 方法实现，客户端需要复制企业提拔流程管理政策，以确保提拔发生在正确的级别，并属于同一职业阶梯等等。
- **批处理方法。** 对于对性能要求苛刻的方法，提供自定义批处理方法**可以**有助于减少每个请求的开销。例如，[accounts.locations.batchGet](https://developers.google.com/my-business/reference/rest/v4/accounts.locations/batchGet?hl=zh-cn)。

以下是标准方法比自定义方法更适用的示例：

- 使用不同查询参数的查询资源（使用带有标准列表过滤的标准 `list` 方法）。
- 简单的资源属性更改（使用带有字段掩码的标准 `update` 方法）。
- 关闭一个通知（使用标准 `delete` 方法）。

## 常用自定义方法

以下是常用或有用的自定义方法名称的精选列表。API 设计者在引入自己的名称之前**应该**考虑使用这些名称，以提高 API 之间的一致性。

| 方法名称 | 自定义动词  | HTTP 动词 | 备注                                                         |
| :------- | :---------- | :-------- | :----------------------------------------------------------- |
| 取消     | `:cancel`   | `POST`    | 取消一个未完成的操作，例如 [`operations.cancel`](https://github.com/googleapis/googleapis/blob/master/google/longrunning/operations.proto#L100)。 |
| batchGet | `:batchGet` | `GET`     | 批量获取多个资源。如需了解详情，请参阅[列表描述](https://cloud.google.com/apis/design/standard_methods?hl=zh-cn#list)。 |
| 移动     | `:move`     | `POST`    | 将资源从一个父级移动到另一个父级，例如 [`folders.move`](https://cloud.google.com/resource-manager/reference/rest/v2/folders/move?hl=zh-cn)。 |
| 搜索     | `:search`   | `GET`     | List 的替代方法，用于获取不符合 List 语义的数据，例如 [`services.search`](https://cloud.google.com/service-infrastructure/docs/service-consumer-management/reference/rest/v1/services/search?hl=zh-cn)。 |
| 恢复删除 | `:undelete` | `POST`    | 恢复之前删除的资源，例如 [`services.undelete`](https://cloud.google.com/service-infrastructure/docs/service-management/reference/rest/v1/services/undelete?hl=zh-cn)。建议的保留期限为 30 天。 |



# 标准字段

本节介绍了需要类似概念时应使用的一组标准消息字段定义。这将确保相同的概念在不同 API 中具有相同的名称和语义。

| 名称              | 类型                                                         | 说明                                                         |
| :---------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| `name`            | `string`                                                     | `name` 字段应包含[相对资源名称](https://cloud.google.com/apis/design/resource_names?hl=zh-cn#relative_resource_name)。 |
| `parent`          | `string`                                                     | 对于资源定义和 List/Create 请求，`parent` 字段应包含父级[相对资源名称](https://cloud.google.com/apis/design/resource_names?hl=zh-cn#relative_resource_name)。 |
| `create_time`     | [`Timestamp`](https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto) | 创建实体的时间戳。                                           |
| `update_time`     | [`Timestamp`](https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto) | 最后更新实体的时间戳。注意：执行 create/patch/delete 操作时会更新 update_time。 |
| `delete_time`     | [`Timestamp`](https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto) | 删除实体的时间戳，仅当它支持保留时才适用。                   |
| `expire_time`     | [`Timestamp`](https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto) | 实体到期时的到期时间戳。                                     |
| `start_time`      | [`Timestamp`](https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto) | 标记某个时间段开始的时间戳。                                 |
| `end_time`        | [`Timestamp`](https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto) | 标记某个时间段或操作结束的时间戳（无论其成功与否）。         |
| `read_time`       | [`Timestamp`](https://github.com/google/protobuf/blob/master/src/google/protobuf/timestamp.proto) | 应读取（如果在请求中使用）或已读取（如果在响应中使用）特定实体的时间戳。 |
| `time_zone`       | `string`                                                     | 时区名称。它应该是 [IANA TZ](http://www.iana.org/time-zones) 名称，例如“America/Los_Angeles”。如需了解详情，请参阅 https://en.wikipedia.org/wiki/List_of_tz_database_time_zones。 |
| `region_code`     | `string`                                                     | 位置的 Unicode 国家/地区代码 (CLDR)，例如“US”和“419”。如需了解详情，请访问 http://www.unicode.org/reports/tr35/#unicode_region_subtag。 |
| `language_code`   | `string`                                                     | BCP-47 语言代码，例如“en-US”或“sr-Latn”。如需了解详情，请参阅 http://www.unicode.org/reports/tr35/#Unicode_locale_identifier。 |
| `mime_type`       | `string`                                                     | IANA 发布的 MIME 类型（也称为媒体类型）。如需了解详情，请参阅 https://www.iana.org/assignments/media-types/media-types.xhtml。 |
| `display_name`    | `string`                                                     | 实体的显示名称。                                             |
| `title`           | `string`                                                     | 实体的官方名称，例如公司名称。它应被视为 `display_name` 的正式版本。 |
| `description`     | `string`                                                     | 实体的一个或多个文本描述段落。                               |
| `filter`          | `string`                                                     | List 方法的标准过滤器参数。                                  |
| `query`           | `string`                                                     | 如果应用于搜索方法（即 [`:search`](https://cloud.google.com/apis/design/custom_methods?hl=zh-cn#common_custom_methods)），则与 `filter` 相同。 |
| `page_token`      | `string`                                                     | List 请求中的分页令牌。                                      |
| `page_size`       | `int32`                                                      | List 请求中的分页大小。                                      |
| `total_size`      | `int32`                                                      | 列表中与分页无关的项目总数。                                 |
| `next_page_token` | `string`                                                     | List 响应中的下一个分页令牌。它应该用作后续请求的 `page_token`。空值表示不再有结果。 |
| `order_by`        | `string`                                                     | 指定 List 请求的结果排序。                                   |
| `request_id`      | `string`                                                     | 用于检测重复请求的唯一字符串 ID。                            |
| `resume_token`    | `string`                                                     | 用于恢复流式传输请求的不透明令牌。                           |
| `labels`          | `map<string, string>`                                        | 表示 Cloud 资源标签。                                        |
| `show_deleted`    | `bool`                                                       | 如果资源允许恢复删除行为，相应的 List 方法必须具有 `show_deleted` 字段，以便客户端可以发现已删除的资源。 |
| `update_mask`     | [`FieldMask`](https://github.com/google/protobuf/blob/master/src/google/protobuf/field_mask.proto) | 它用于 `Update` 请求消息，该消息用于对资源执行部分更新。此掩码与资源相关，而不是与请求消息相关。 |
| `validate_only`   | `bool`                                                       | 如果为 true，则表示仅应验证给定请求，而不执行该请求。        |

### 系统参数

除标准字段外，Google API 还支持可以在所有 API 方法中使用的一组共同请求参数，这些参数称为“系统参数”。如需了解详情，请参阅[系统参数](https://cloud.google.com/apis/docs/system-parameters?hl=zh-cn)。



# 错误

本章简要介绍了 Google API 的错误模型。它还为开发者提供了正确生成和处理错误的通用指南。

Google API 使用简单的协议无关错误模型，以便我们在不同的 API、不同的 API 协议（如 gRPC 或 HTTP）和不同的错误上下文（例如异步、批处理或工作流错误）中能够有一致的体验。

## 错误模型

Google API 的错误模型由 [`google.rpc.Status`](https://github.com/googleapis/googleapis/blob/master/google/rpc/status.proto) 逻辑定义，该实例在发生 API 错误时返回给客户端。以下代码段显示了错误模型的总体设计：

```proto
package google.rpc;

// The `Status` type defines a logical error model that is suitable for
// different programming environments, including REST APIs and RPC APIs.
message Status {
  // A simple error code that can be easily handled by the client. The
  // actual error code is defined by `google.rpc.Code`.
  int32 code = 1;

  // A developer-facing human-readable error message in English. It should
  // both explain the error and offer an actionable resolution to it.
  string message = 2;

  // Additional error information that the client code can use to handle
  // the error, such as retry info or a help link.
  repeated google.protobuf.Any details = 3;
}
```

由于大多数 Google API 采用面向资源的 API 设计，因此错误处理遵循相同的设计原则，使用一小组标准错误配合大量资源。例如，服务器没有定义不同类型的“找不到”错误，而是使用一个标准 `google.rpc.Code.NOT_FOUND` 错误代码并告诉客户端找不到哪个特定资源。错误空间变小降低了文档的复杂性，在客户端库中提供了更好的惯用映射，并降低了客户端的逻辑复杂性，同时不限制是否包含可操作信息。

### 错误代码

Google API **必须**使用 [`google.rpc.Code`](https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto) 定义的规范错误代码。单个 API **应**避免定义其他错误代码，因为开发人员不太可能编写用于处理大量错误代码的逻辑。作为参考，每个 API 调用平均处理 3 个错误代码意味着大多数应用的逻辑只是用于错误处理，这对开发人员而言并非好体验。

### 错误消息

错误消息应该可以帮助用户轻松快捷地**理解和解决** API 错误。通常，在编写错误消息时请考虑以下准则：

- 不要假设用户是您 API 的专家用户。用户可能是客户端开发人员、操作人员、IT 人员或应用的最终用户。
- 不要假设用户了解有关服务实现的任何信息，或者熟悉错误的上下文（例如日志分析）。
- 如果可能，应构建错误消息，以便技术用户（但不一定是 API 开发人员）可以响应错误并改正。
- 确保错误消息内容简洁。如果需要，请提供一个链接，便于有疑问的读者提问、提供反馈或详细了解错误消息中不方便说明的信息。此外，可使用详细信息字段来提供更多信息。

**警告**：错误消息不属于 API 表面。它们随时都会更改，恕不另行通知。应用代码**不得**严重依赖于错误消息。

### 错误详情

Google API 为错误详细信息定义了一组标准错误负载，您可在 [google/rpc/error_details.proto](https://github.com/googleapis/googleapis/blob/master/google/rpc/error_details.proto) 中找到这些错误负载。 它们涵盖了对于 API 错误的最常见需求，例如配额失败和无效参数。与错误代码一样，开发者应尽可能使用这些标准载荷。

只有在可以帮助应用代码处理错误的情况下，才应引入其他错误详细信息类型。如果错误信息只能由人工处理，则应根据错误消息内容，让开发人员手动处理，而不是引入其他错误详细信息类型。

下面是一些示例 `error_details` 载荷：

- `ErrorInfo` 提供既**稳定**又**可扩展**的结构化错误信息。
- `RetryInfo`：描述客户端何时可以重试失败的请求，这些内容可能在以下方法中返回：`Code.UNAVAILABLE` 或 `Code.ABORTED`
- `QuotaFailure`：描述配额检查失败的方式，这些内容可能在以下方法中返回：`Code.RESOURCE_EXHAUSTED`
- `BadRequest`：描述客户端请求中的违规行为，这些内容可能在以下方法中返回：`Code.INVALID_ARGUMENT`

### 错误信息

[`ErrorInfo`](https://github.com/googleapis/googleapis/blob/master/google/rpc/error_details.proto#L110) 是一种特殊种类的错误负载。它提供人类和应用可使用的**稳定且可扩展**错误信息。每个 `ErrorInfo` 包含 3 条信息：错误网域、错误原因和一组错误元数据，如[示例](https://translate.googleapis.com/language/translate/v2?key=invalid&q=hello&source=en&target=es&format=text&$.xgafv=2)。如需了解详情，请参阅 [`ErrorInfo`](https://github.com/googleapis/googleapis/blob/master/google/rpc/error_details.proto#L110) 定义。

对于 Google API，主要错误网域是 `googleapis.com`，相应的错误原因由 `google.api.ErrorReason` 枚举定义。如需了解详情，请参阅 [`google.api.ErrorReason`](https://github.com/googleapis/googleapis/blob/master/google/api/error_reason.proto) 定义。

### 错误本地化

[`google.rpc.Status`](https://github.com/googleapis/googleapis/blob/master/google/rpc/status.proto) 中的 `message` 字段面向开发人员，**必须**使用英语。

如果需要面向用户的错误消息，请使用 [`google.rpc.LocalizedMessage`](https://github.com/googleapis/googleapis/blob/master/google/rpc/error_details.proto) 作为您的详细信息字段。虽然 [`google.rpc.LocalizedMessage`](https://github.com/googleapis/googleapis/blob/master/google/rpc/error_details.proto) 中的消息字段可以进行本地化，请确保 [`google.rpc.Status`](https://github.com/googleapis/googleapis/blob/master/google/rpc/status.proto) 中的消息字段使用英语。

默认情况下，API 服务应使用经过身份验证的用户的语言区域设置或 HTTP `Accept-Language` 标头或请求中的 `language_code` 参数来确定本地化的语言。

## 错误映射

可以在不同的编程环境中访问 Google API。每种环境通常都有自己的错误处理方法。以下部分介绍了错误模型在常用环境中的映射方式。

### HTTP 映射

虽然 proto3 消息具有原生 JSON 编码，但 Google 的 API 平台对 Google 的 JSON HTTP API 使用了不同的错误架构，以实现向后兼容性。

架构：

```proto
// The error format v2 for Google JSON REST APIs.
//
// NOTE: This schema is not used for other wire protocols.
message Error {
  // This message has the same semantics as `google.rpc.Status`. It uses HTTP
  // status code instead of gRPC status code. It has an extra field `status`
  // for backward compatibility with Google API Client Libraries.
  message Status {
    // The HTTP status code that corresponds to `google.rpc.Status.code`.
    int32 code = 1;
    // This corresponds to `google.rpc.Status.message`.
    string message = 2;
    // This is the enum version for `google.rpc.Status.code`.
    google.rpc.Code status = 4;
    // This corresponds to `google.rpc.Status.details`.
    repeated google.protobuf.Any details = 5;
  }
  // The actual error payload. The nested message structure is for backward
  // compatibility with Google API client libraries. It also makes the error
  // more readable to developers.
  Status error = 1;
}
```

例如：

```shell
$ curl 'https://translate.googleapis.com/language/translate/v2?key=invalid&q=hello&source=en&target=es&format=text&$.xgafv=2'
{
  "error": {
    "code": 400,
    "message": "API key not valid. Please pass a valid API key.",
    "status": "INVALID_ARGUMENT",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "API_KEY_INVALID",
        "domain": "googleapis.com",
        "metadata": {
          "service": "translate.googleapis.com"
        }
      }
    ]
  }
}
```

### gRPC 映射

不同的 RPC 协议采用不同方式映射错误模型。对于 [gRPC](http://grpc.io/)，生成的代码和每种支持语言的运行时库为错误模型提供原生支持。您可在 gRPC 的 API 文档中了解更多信息。例如，请参阅 gRPC Java 的 [`io.grpc.Status`](https://grpc.github.io/grpc-java/javadoc/io/grpc/Status.html)。

### 客户端库映射

Google 客户端库可能会根据语言选择采用不同方式表达错误，以与既定习语保持一致。例如，[google-cloud-go](https://github.com/GoogleCloudPlatform/google-cloud-go) 库将返回一个错误，该错误实现与 [`google.rpc.Status`](https://github.com/googleapis/googleapis/blob/master/google/rpc/status.proto) 相同的接口，而 [google-cloud-java](https://github.com/googleapis/google-cloud-java) 将引发异常。

## 处理错误

下面的表格包含在 [`google.rpc.Code`](https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto) 中定义的所有 gRPC 错误代码及其原因的简短描述。要处理错误，您可以检查返回状态代码的说明并相应地修改您的调用。

| HTTP | gRPC                  | 说明                                                         |
| :--- | :-------------------- | :----------------------------------------------------------- |
| 200  | `OK`                  | 无错误。                                                     |
| 400  | `INVALID_ARGUMENT`    | 客户端指定了无效参数。如需了解详情，请查看错误消息和错误详细信息。 |
| 400  | `FAILED_PRECONDITION` | 请求无法在当前系统状态下执行，例如删除非空目录。             |
| 400  | `OUT_OF_RANGE`        | 客户端指定了无效范围。                                       |
| 401  | `UNAUTHENTICATED`     | 由于 OAuth 令牌丢失、无效或过期，请求未通过身份验证。        |
| 403  | `PERMISSION_DENIED`   | 客户端权限不足。这可能是因为 OAuth 令牌没有正确的范围、客户端没有权限或者 API 尚未启用。 |
| 404  | `NOT_FOUND`           | 未找到指定的资源。                                           |
| 409  | `ABORTED`             | 并发冲突，例如读取/修改/写入冲突。                           |
| 409  | `ALREADY_EXISTS`      | 客户端尝试创建的资源已存在。                                 |
| 429  | `RESOURCE_EXHAUSTED`  | 资源配额不足或达到速率限制。如需了解详情，客户端应该查找 google.rpc.QuotaFailure 错误详细信息。 |
| 499  | `CANCELLED`           | 请求被客户端取消。                                           |
| 500  | `DATA_LOSS`           | 出现不可恢复的数据丢失或数据损坏。客户端应该向用户报告错误。 |
| 500  | `UNKNOWN`             | 出现未知的服务器错误。通常是服务器错误。                     |
| 500  | `INTERNAL`            | 出现内部服务器错误。通常是服务器错误。                       |
| 501  | `NOT_IMPLEMENTED`     | API 方法未通过服务器实现。                                   |
| 502  | 不适用                | 到达服务器前发生网络错误。通常是网络中断或配置错误。         |
| 503  | `UNAVAILABLE`         | 服务不可用。通常是服务器已关闭。                             |
| 504  | `DEADLINE_EXCEEDED`   | 超出请求时限。仅当调用者设置的时限比方法的默认时限短（即请求的时限不足以让服务器处理请求）并且请求未在时限范围内完成时，才会发生这种情况。 |

**警告**：Google API 可以并发检查 API 请求的多个前提条件。返回某个错误代码并不满足其他前提条件。应用代码**不得**依赖前提条件检查的排序。

### 重试错误

客户端**可能**使用指数退避算法重试 503 UNAVAILABLE 错误。 除非另有说明，否则最小延迟应为 1 秒。 除非另有说明，否则默认重试重复应当仅一次。

对于 429 RESOURCE_EXHAUSTED 错误，客户端可能会在更高层级以最少 30 秒的延迟重试。此类重试仅对长时间运行的后台作业有用。

对于所有其他错误，重试请求可能并不适用。首先确保您的请求具有幂等性，并查看 [`google.rpc.RetryInfo`](https://github.com/googleapis/googleapis/blob/master/google/rpc/error_details.proto#L40) 以获取指导。

### 传播错误

如果您的 API 服务依赖于其他服务，则不应盲目地将这些服务的错误传播到您的客户端。在翻译错误时，我们建议执行以下操作：

- 隐藏实现详细信息和机密信息。
- 调整负责该错误的一方。例如，从另一个服务接收 `INVALID_ARGUMENT` 错误的服务器应该将 `INTERNAL` 传播给它自己的调用者。

### 重现错误

如果您通过分析日志和监控功能无法解决错误，则应该尝试通过简单且可重复的测试来重现错误。您可以使用该测试来收集问题排查的相关信息，您可以在联系技术支持团队时提供这些信息。

我们建议您使用 [`oauth2l`](https://github.com/google/oauth2l)、[`curl -v`](https://curl.se/docs/manpage.html) 和[系统参数](https://cloud.google.com/apis/docs/system-parameters?hl=zh-cn)重现 Google API 中的错误。它们可以共同重现几乎所有 Google API 请求，并为您提供详细的调试信息。如需了解详情，请参阅您要调用的 API 的相应文档页面。

**注意**：如需进行问题排查，您应该在请求网址中添加 `&$.xgafv=2` 以选择错误格式 v2。出于兼容性方面的考虑，某些 Google API 默认使用错误格式 v1。

## 生成错误

如果您是服务器开发者，则应该生成包含足够信息的错误，以帮助客户端开发者理解并解决问题。同时，您必须重视用户数据的安全性和隐私性，避免在错误消息和错误详细信息中披露敏感信息，因为错误通常会被记录下来并且可能被其他人访问。例如，诸如“客户端 IP 地址不在 allowlist 12.0.0.0/8 上”之类的错误消息会披露服务器端政策的相关信息，用户可能无法访问日志。

要生成正确的错误，首先需要熟悉 [`google.rpc.Code`](https://github.com/googleapis/googleapis/blob/master/google/rpc/code.proto)，然后才能为每个错误条件选择最合适的错误代码。服务器应用可以并行检查多个错误条件，并返回第一个错误条件。

下表列出了每个错误代码和恰当的错误消息示例。

| HTTP | gRPC                  | 错误消息示例                                        |
| :--- | :-------------------- | :-------------------------------------------------- |
| 400  | `INVALID_ARGUMENT`    | 请求字段 x.y.z 是 xxx，预期为 [yyy, zzz] 内的一个。 |
| 400  | `FAILED_PRECONDITION` | 资源 xxx 是非空目录，因此无法删除。                 |
| 400  | `OUT_OF_RANGE`        | 参数“age”超出范围 [0,125]。                         |
| 401  | `UNAUTHENTICATED`     | 身份验证凭据无效。                                  |
| 403  | `PERMISSION_DENIED`   | 使用权限“xxx”处理资源“yyy”被拒绝。                  |
| 404  | `NOT_FOUND`           | 找不到资源“xxx”。                                   |
| 409  | `ABORTED`             | 无法锁定资源“xxx”。                                 |
| 409  | `ALREADY_EXISTS`      | 资源“xxx”已经存在。                                 |
| 429  | `RESOURCE_EXHAUSTED`  | 超出配额限制“xxx”。                                 |
| 499  | `CANCELLED`           | 请求被客户端取消。                                  |
| 500  | `DATA_LOSS`           | 请参阅注释。                                        |
| 500  | `UNKNOWN`             | 请参阅注释。                                        |
| 500  | `INTERNAL`            | 请参阅注释。                                        |
| 501  | `NOT_IMPLEMENTED`     | 方法“xxx”未实现。                                   |
| 503  | `UNAVAILABLE`         | 请参阅注释。                                        |
| 504  | `DEADLINE_EXCEEDED`   | 请参阅备注。                                        |

**注意**：由于客户端无法修复服务器错误，因此生成其他错误详细信息没有任何用处。为避免在错误条件下泄露敏感信息，建议不要生成任何错误消息，而仅生成 `google.rpc.DebugInfo` 错误详细信息。`DebugInfo` 专为服务器端的日志记录而设计，**不得**发送到客户端。

### 错误负载

`google.rpc` 软件包定义了一组标准错误载荷，它们优先于自定义错误载荷。下表列出了每个错误代码及其匹配的标准错误负载（如果适用）。 我们建议高级应用在处理错误时在 `google.rpc.Status` 中查找这些错误负载。

| HTTP | gRPC                  | 建议的错误详细信息               |
| :--- | :-------------------- | :------------------------------- |
| 400  | `INVALID_ARGUMENT`    | `google.rpc.BadRequest`          |
| 400  | `FAILED_PRECONDITION` | `google.rpc.PreconditionFailure` |
| 400  | `OUT_OF_RANGE`        | `google.rpc.BadRequest`          |
| 401  | `UNAUTHENTICATED`     | `google.rpc.ErrorInfo`           |
| 403  | `PERMISSION_DENIED`   | `google.rpc.ErrorInfo`           |
| 404  | `NOT_FOUND`           | `google.rpc.ResourceInfo`        |
| 409  | `ABORTED`             |                                  |
| 409  | `ALREADY_EXISTS`      | `google.rpc.ResourceInfo`        |
| 429  | `RESOURCE_EXHAUSTED`  | `google.rpc.QuotaFailure`        |
| 499  | `CANCELLED`           |                                  |
| 500  | `DATA_LOSS`           |                                  |
| 500  | `UNKNOWN`             |                                  |
| 500  | `INTERNAL`            |                                  |
| 501  | `NOT_IMPLEMENTED`     |                                  |
| 503  | `UNAVAILABLE`         |                                  |
| 504  | `DEADLINE_EXCEEDED`   |                                  |



# 命名规则

为了跨众多 API 长期为开发者提供一致的体验，API 使用的名称都**应**具有以下特点：

- 简单
- 直观
- 一致

这包括接口、资源、集合、方法和消息的名称。

由于很多开发者不是以英语为母语，所以这些命名惯例的目标之一是确保大多数开发者可以轻松理解 API。对于方法和资源，我们鼓励使用简单、一致和少量的词汇来命名。

- API 中使用的名称**应**采用正确的美式英语。例如，使用美式英语的 license、color，而非英式英语的 licence、colour。
- 为了简化命名，**可以**使用已被广泛接受的简写形式或缩写。例如，API 优于 Application Programming Interface。
- 尽量使用直观、熟悉的术语。例如，如果描述移除（和销毁）一个资源，则删除优于擦除。
- 使用相同的名称或术语命名同样的概念，包括跨 API 共享的概念。
- 避免名称过载。使用不同的名称命名不同的概念。
- 避免在 API 的上下文以及范围更大的 Google API 生态系统中使用含糊不清、过于笼统的名称。这些名称可能导致对 API 概念的误解。相反，应选择能准确描述 API 概念的名称。这对定义一阶 API 元素（例如资源）的名称尤其重要。没有需避免名称的明确列表，因为每个名称都必须放在其他名称的上下文中进行评估。实例、信息和服务的名称都曾出现过这类问题。所选择的名称应清楚地描述 API 概念（例如：什么的实例？），并将其与其他相关概念区分开（例如：“alert”是指规则、信号还是通知？）。
- 仔细考虑使用的名称是否可能与常用编程语言中的关键字存在冲突。您**可以**使用这些名称，但在 API 审核期间可能会触发额外的审查。因此应明智而审慎地使用。

## 产品名称

产品名称是指 API 的产品营销名称，例如 Google Calendar API。API、界面、文档、服务条款、对帐单和商业合同等信息中使用的产品名称**必须**一致。Google API **必须**使用产品团队和营销团队批准的产品名称。

下表显示了所有相关 API 名称及其一致性的示例。如需详细了解各自名称及其命名惯例，请参阅本页面下方的详细信息。

| API 名称       | 示例                                 |
| :------------- | :----------------------------------- |
| **产品名称**   | `Google Calendar API`                |
| **服务名称**   | `calendar.googleapis.com`            |
| **软件包名称** | `google.calendar.v3`                 |
| **接口名称**   | `google.calendar.v3.CalendarService` |
| **来源目录**   | `//google/calendar/v3`               |
| **API 名称**   | `calendar`                           |

## 服务名称

服务名称**应该**是语法上有效的 DNS 名称（遵循 [RFC 1035](http://www.ietf.org/rfc/rfc1035.txt)），可以解析为一个或多个网络地址。公开的 Google API 的服务名称采用 `xxx.googleapis.com` 格式。例如，Google 日历的服务名称是 `calendar.googleapis.com`。

如果一个 API 是由多项服务组成，则**应**采用更容易发现的命名方式。要做到这点，一种方法是使服务名称共享一个通用前缀。例如，`build.googleapis.com` 和 `buildresults.googleapis.com` 服务都属于 Google Build API。

## 软件包名称

API .proto 文件中声明的软件包名称**应该**与产品名称和服务名称保持一致。软件包名称**应该**使用单数组件名称，以避免混合使用单数和复数组件名称。软件包名称**不能**使用下划线。进行版本控制的 API 的软件包名称**必须**以此版本结尾。例如：

```proto
// Google Calendar API
package google.calendar.v3;
```

与服务无直接关联的抽象 API（例如 Google Watcher API）**应该**使用与产品名称一致的 proto 软件包名称：

```proto
// Google Watcher API
package google.watcher.v1;
```

API .proto 文件中指定的 Java 软件包名称**必须**与带有标准 Java 软件包名称前缀（`com.`、`edu.`、`net.` 等）的 proto 软件包名称相匹配。例如：

```proto
package google.calendar.v3;

// Specifies Java package name, using the standard prefix "com."
option java_package = "com.google.calendar.v3";
```

## 集合 ID

[集合 ID](https://cloud.google.com/apis/design/resource_names?hl=zh-cn#collection_id) **应**采用复数和 `lowerCamelCase`（小驼峰式命名法）格式，并遵循美式英语拼写和语义。例如：`events`、`children` 或 `deletedEvents`。

## 接口名称

为了避免与[服务名称](https://cloud.google.com/apis/design/naming_convention?hl=zh-cn#service_names)（例如 `pubsub.googleapis.com`）混淆，术语 *“接口名称”*是指在 .proto 文件中定义 `service` 时使用的名称：

```proto
// Library is the interface name.
service Library {
  rpc ListBooks(...) returns (...);
  rpc ...
}
```

您可以将服务名称视为对一组 API 实际实现的引用，而接口名称则是 API 的抽象定义。

接口名称**应该**使用直观的名词，例如 Calendar 或 Blob。该名称**不得**与编程语言及其运行时库（如 File）中的成熟概念相冲突。

在极少数情况下，接口名称会与 API 中的其他名称相冲突，此时**应该**使用后缀（例如 `Api` 或 `Service`）来消除歧义。

## 方法名称

服务**可以**在其 IDL 规范中定义一个或多个远程过程调用 (RPC) 方法，这些方法需与集合和资源上的方法对应。方法名称**应**采用大驼峰式命名格式并遵循 `VerbNoun` 的命名惯例，其中 Noun（名词）通常是资源类型。

| 动词     | 名词   | 方法名称     | 请求消息            | 响应消息                |
| :------- | :----- | :----------- | :------------------ | :---------------------- |
| `List`   | `Book` | `ListBooks`  | `ListBooksRequest`  | `ListBooksResponse`     |
| `Get`    | `Book` | `GetBook`    | `GetBookRequest`    | `Book`                  |
| `Create` | `Book` | `CreateBook` | `CreateBookRequest` | `Book`                  |
| `Update` | `Book` | `UpdateBook` | `UpdateBookRequest` | `Book`                  |
| `Rename` | `Book` | `RenameBook` | `RenameBookRequest` | `RenameBookResponse`    |
| `Delete` | `Book` | `DeleteBook` | `DeleteBookRequest` | `google.protobuf.Empty` |

方法名称的动词部分**应该**使用用于要求或命令的[祈使语气](https://en.wikipedia.org/wiki/Imperative_mood#English)，而不是用于提问的陈述语气。

如果关于 API 子资源的方法名称使用提问动词（经常使用陈述语气表示），则容易让人混淆。例如，要求 API 创建一本书，这显然是 `CreateBook`（祈使语气），但是询问 API 关于图书发行商的状态可能会使用陈述语气，例如 `IsBookPublisherApproved` 或 `NeedsPublisherApproval`。若要在此类情况下继续使用祈使语气，请使用“check”(`CheckBookPublisherApproved`) 和“validate”(`ValidateBookPublisher`) 等命令。

方法名称**不应**包含介词（例如“For”、“With”、“At”、“To”）。通常，带有介词的方法名称表示正在使用新方法，应将一个字段添加到现有方法中，或者该方法应使用不同的动词。

例如，如果 `CreateBook` 消息已存在且您正在考虑添加 `CreateBookFromDictation`，请考虑使用 `TranscribeBook` 方法。

## 消息名称

消息名称**应该**简洁明了。避免不必要或多余的字词。如果不存在无形容词的相应消息，则通常可以省略形容词。例如，如果没有非共享代理设置，则 `SharedProxySettings` 中的 `Shared` 是多余的。

消息名称**不应**包含介词（例如“With”、“For”）。通常，带有介词的消息名称可以通过消息上的可选字段来更好地表示。

### 请求和响应消息

RPC 方法的请求和响应消息**应该**分别以带有后缀 `Request` 和 `Response` 的方法名称命名，除非方法请求或响应类型为以下类型：

- 一条空消息（使用 `google.protobuf.Empty`）、
- 一个资源类型，或
- 一个表示操作的资源

这通常适用于在标准方法 `Get`、`Create`、`Update` 或 `Delete` 中使用的请求或响应。

## 枚举名称

枚举类型**必须**使用 UpperCamelCase 格式的名称。

枚举值**必须**使用 CAPITALIZED_NAMES_WITH_UNDERSCORES 格式。每个枚举值**必须**以分号（而不是逗号）结尾。第一个值**应该**命名为 ENUM_TYPE_UNSPECIFIED，因为在枚举值未明确指定时系统会返回此值。

```proto
enum FooBar {
  // The first value represents the default and must be == 0.
  FOO_BAR_UNSPECIFIED = 0;
  FIRST_VALUE = 1;
  SECOND_VALUE = 2;
}
```

### 封装容器

封装 proto2 枚举类型（其中 `0` 值具有非 `UNSPECIFIED` 的含义）的消息**应该**以后缀 `Value` 来命名，并具有名为 `value` 的单个字段。

```proto
enum OldEnum {
  VALID = 0;
  OTHER_VALID = 1;
}
message OldEnumValue {
  OldEnum value = 1;
}
```

## 字段名称

.proto 文件中的字段定义**必须**使用 lower_case_underscore_separated_names 格式。这些名称将映射到每种编程语言的生成代码中的原生命名惯例。

字段名称**不应**包含介词（例如“for”、“during”、“at”），例如：

- `reason_for_error` 应该改成 `error_reason`
- `cpu_usage_at_time_of_failure` 应该改成 `failure_time_cpu_usage`

字段名称**不应**使用后置形容词（名词后面的修饰符），例如：

- `items_collected` 应该改成 `collected_items`
- `objects_imported` 应该改成 `imported_objects`

### 重复字段名称

API 中的重复字段**必须**使用正确的复数形式。这符合现有 Google API 的命名惯例和外部开发者的共同预期。

### 时间和时间段

要表示一个与任何时区或日历无关的时间点，**应该**使用 `google.protobuf.Timestamp`，并且字段名称**应该**以 `time`（例如 `start_time` 和 `end_time`）结尾。

如果时间指向一个活动，则字段名称**应该**采用 `verb_time` 的形式，例如 `create_time` 和 `update_time`。请勿使用动词的过去时态，例如 `created_time` 或 `last_updated_time`。

要表示与任何日历和概念（如“天”或“月”）无关的两个时间点之间的时间跨度，**应该**使用 `google.protobuf.Duration`。

```proto
message FlightRecord {
  google.protobuf.Timestamp takeoff_time = 1;
  google.protobuf.Duration flight_duration = 2;
}
```

如果由于历史性或兼容性原因（包括系统时间、时长、推迟和延迟），您必须使用整数类型表示与时间相关的字段，那么字段名称**必须**采用以下格式：

```
xxx_{time|duration|delay|latency}_{seconds|millis|micros|nanos}
message Email {
  int64 send_time_millis = 1;
  int64 receive_time_millis = 2;
}
```

如果由于历史性或兼容性原因，您必须使用字符串类型表示时间戳，则字段名称**不应该**包含任何单位后缀。字符串表示形式**应该**使用 RFC 3339 格式，例如“2014-07-30T10:43:17Z”。

### 日期和时间

对于与时区和时段无关的日期，**应该**使用 `google.type.Date`，并且该名称应具有后缀 `_date`。如果日期必须表示为字符串，则应采用 ISO 8601 日期格式 YYYY-MM-DD，例如 2014-07-30。

对于与时区和日期无关的时间，**应该**使用 `google.type.TimeOfDay`，并且该名称应具有后缀 `_time`。如果时间必须表示为字符串，则应采用 ISO 8601 24 小时制格式 HH:MM:SS[.FFF]，例如 14:55:01.672。

```proto
message StoreOpening {
  google.type.Date opening_date = 1;
  google.type.TimeOfDay opening_time = 2;
}
```

### 数量

由整数类型表示的数量**必须**包含度量单位。

```
xxx_{bytes|width_pixels|meters}
```

如果数量是条目计数，则该字段**应该**具有后缀 `_count`，例如 `node_count`。

### 列表过滤器字段

如果 API 支持对 `List` 方法返回的资源进行过滤，则包含过滤器表达式的字段**应该**命名为 `filter`。例如：

```proto
message ListBooksRequest {
  // The parent resource name.
  string parent = 1;

  // The filter expression.
  string filter = 2;
}
```

### 列表响应

`List` 方法的响应消息（包含资源列表）中的字段名称**必须**是资源名称本身的复数形式。例如，`CalendarApi.ListEvents()` 方法**必须**为返回的资源列表定义一个响应消息`ListEventsResponse`，其中包含一个名为 `events` 的重复字段。

```proto
service CalendarApi {
  rpc ListEvents(ListEventsRequest) returns (ListEventsResponse) {
    option (google.api.http) = {
      get: "/v3/{parent=calendars/*}/events";
    };
  }
}

message ListEventsRequest {
  string parent = 1;
  int32 page_size = 2;
  string page_token = 3;
}

message ListEventsResponse {
  repeated Event events = 1;
  string next_page_token = 2;
}
```

## 驼峰式命名法

除字段名称和枚举值外，`.proto` 文件中的所有定义都**必须**使用由 [Google Java 样式](https://google.github.io/styleguide/javaguide.html#s5.3-camel-case)定义的 UpperCamelCase 格式的名称。

## 名称缩写

对于软件开发者熟知的名称缩写，例如 `config` 和 `spec`，**应该**在 API 定义中使用这些缩写，而非完整名称。这将使源代码易于读写。而在正式文档中，**应该**使用完整名称。示例：

- config (configuration)
- id (identifier)
- spec (specification)
- stats (statistics)



# 常见设计模式

## 空响应

标准的 `Delete` 方法**应该**返回 `google.protobuf.Empty`，除非它正在执行“软”删除，在这种情况下，该方法**应该**返回状态已更新的资源，以指示正在进行删除。

自定义方法**应该**有自己的 `XxxResponse` 消息（即使为空），因为它们的功能很可能会随着时间的推移而增长并需要返回其他数据。

## 表示范围

表示范围的字段**应该**使用半开区间和命名惯例 `[start_xxx, end_xxx)`，例如 `[start_key, end_key)` 或 `[start_time, end_time)`。通常 C ++ STL 库和 Java 标准库会使用半开区间语义。API **应该**避免使用其他表示范围的方式，例如 `(index, count)` 或 `[first, last]`。

## 资源标签

在面向资源的 API 中，资源架构由 API 定义。要让客户端将少量简单元数据附加到资源（例如，将虚拟机资源标记为数据库服务器），API **应该** 使用 `google.api.LabelDescriptor` 中描述的资源标签设计模式。

为此，API 设计**应该**将 `map<string, string> labels` 字段添加到资源定义中。

```proto
message Book {
  string name = 1;
  map<string, string> labels = 2;
}
```

## 长时间运行的操作

如果某个 API 方法通常需要很长时间才能完成，您可以通过适当设计，让其向客户端返回“长时间运行的操作”资源，客户端可以使用该资源来跟踪进度和接收结果。 [Operation](https://github.com/googleapis/googleapis/blob/master/google/longrunning/operations.proto) 定义了一个标准接口来使用长时间运行的操作。 各个 API **不得**为长时间运行的操作定义自己的接口，以避免不一致性。

操作资源**必须**作为响应消息直接返回，操作的任何直接后果都**应该**反映在 API 中。例如，在创建资源时，即便资源表明其尚未准备就绪，该资源也**应该**出现在 LIST 和 GET 方法中。操作完成后，如果方法并未长时间运行，则 `Operation.response` 字段应包含本应直接返回的消息。

操作可以使用 `Operation.metadata` 字段提供有关其进度的信息。即使初始实现没有填充 `metadata` 字段，API 也**应该**为此元数据定义消息。

## 列表分页

可列表集合**应该**支持分页，即使结果通常很小。

**说明**：如果某个 API 从一开始就不支持分页，稍后再支持它就比较麻烦，因为添加分页会破坏 API 的行为。 不知道 API 正在使用分页的客户端可能会错误地认为他们收到了完整的结果，而实际上只收到了第一页。

为了在 `List` 方法中支持分页（在多个页面中返回列表结果），API **应该**：

- 在 `List` 方法的请求消息中定义 `string` 字段 `page_token`。客户端使用此字段请求列表结果的特定页面。
- 在 `List` 方法的请求消息中定义 `int32` 字段 `page_size`。客户端使用此字段指定服务器返回的最大结果数。服务器**可以**进一步限制单个页面中返回的最大结果数。如果 `page_size` 为 `0`，则服务器将决定要返回的结果数。
- 在 `List` 方法的响应消息中定义 `string` 字段 `next_page_token`。此字段表示用于检索下一页结果的分页令牌。如果值为 `""`，则表示请求没有进一步的结果。

要检索下一页结果，客户端**应该**在后续的 `List` 方法调用中（在请求消息的 `page_token` 字段中）传递响应的 `next_page_token` 值：

```proto
rpc ListBooks(ListBooksRequest) returns (ListBooksResponse);

message ListBooksRequest {
  string parent = 1;
  int32 page_size = 2;
  string page_token = 3;
}

message ListBooksResponse {
  repeated Book books = 1;
  string next_page_token = 2;
}
```

当客户端传入除页面令牌之外的查询参数时，如果查询参数与页面令牌不一致，则服务**必须**使请求失败。

页面令牌内容**应该**是可在网址中安全使用的 base64 编码的协议缓冲区。 这使得内容可以在避免兼容性问题的情况下演变。如果页面令牌包含潜在的敏感信息，则**应该**对该信息进行加密。服务**必须**通过以下方法之一防止篡改页面令牌导致数据意外暴露：

- 要求在后续请求中重新指定查询参数。
- 仅在页面令牌中引用服务器端会话状态。
- 加密并签署页面令牌中的查询参数，并在每次调用时重新验证并重新授权这些参数。

分页的实现也**可以**提供名为 `total_size` 的 `int32` 字段中的项目总数。

## 列出子集合

有时，API 需要让客户跨子集执行 `List/Search` 操作。例如，“API 图书馆”有一组书架，每个书架都有一系列书籍，而客户希望在所有书架上搜索某一本书。在这种情况下，建议在子集合上使用标准 `List`，并为父集合指定通配符集合 ID `"-"`。对于“API 图书馆”示例，我们可以使用以下 REST API 请求：

```
GET https://library.googleapis.com/v1/shelves/-/books?filter=xxx
```

**注意**：选择 `"-"` 而不是 `"*"` 的原因是为了避免需要进行 URL 转义。

## 从子集合中获取唯一资源

有时子集合中的资源具有在其父集合中唯一的标识符。此时，在不知道哪个父集合包含它的情况下使用 `Get` 检索该资源可能很有用。在这种情况下，建议对资源使用标准 `Get`，并为资源在其中是唯一的所有父集合指定通配符集合 ID `"-"`。例如，在 API 图书馆中，如果书籍在所有书架上的所有书籍中都是唯一的，我们可以使用以下 REST API 请求：

```
GET https://library.googleapis.com/v1/shelves/-/books/{id}
```

响应此调用的资源名称**必须**使用资源的规范名称，并使用实际的父集合标识符而不是每个父集合都使用 `"-"`。例如，上面的请求应返回名称为 `shelves/shelf713/books/book8141`（而不是 `shelves/-/books/book8141`）的资源。

## 排序顺序

如果 API 方法允许客户端指定列表结果的排序顺序，则请求消息**应该**包含一个字段：

```proto
string order_by = ...;
```

字符串值**应该**遵循 SQL 语法：逗号分隔的字段列表。例如：`"foo,bar"`。默认排序顺序为升序。要将字段指定为降序，**应该**将后缀 `" desc"` 附加到字段名称中。例如：`"foo desc,bar"`。

语法中的冗余空格字符是无关紧要的。 `"foo,bar desc"` 和 `" foo , bar desc "` 是等效的。

## 提交验证请求

如果 API 方法有副作用，并且需要验证请求而不导致此类副作用，则请求消息**应该**包含一个字段：

```proto
bool validate_only = ...;
```

如果此字段设置为 `true`，则服务器**不得**执行任何副作用，仅执行与完整请求一致的特定于实现的验证。

如果验证成功，则**必须**返回 `google.rpc.Code.OK`，并且任何使用相同请求消息的完整请求**不得**返回 `google.rpc.Code.INVALID_ARGUMENT`。请注意，由于其他错误（例如 `google.rpc.Code.ALREADY_EXISTS` 或争用情况），请求可能仍然会失败。

## 请求重复

对于网络 API，幂等 API 方法是首选，因为它们可以在网络故障后安全地重试。但是，某些 API 方法不能轻易为幂等（例如创建资源），并且需要避免不必要的重复。对于此类用例，请求消息**应**包含唯一 ID（如 UUID），服务器将使用该 ID 检测重复并确保请求仅被处理一次。

```proto
// A unique request ID for server to detect duplicated requests.
// This field **should** be named as `request_id`.
string request_id = ...;
```

如果检测到重复请求，则服务器**应该**返回先前成功请求的响应，因为客户端很可能未收到先前的响应。

## 枚举默认值

每个枚举定义**必须**以 `0` 值条目开头，当未明确指定枚举值时，**应**使用该条目。API **必须**记录如何处理 `0` 值。

如果存在共同的默认行为，则**应该**使用枚举值 `0`，并且 API 应记录预期的行为。

如果没有共同的默认行为，则枚举值 `0` **应该**被命名为 `ENUM_TYPE_UNSPECIFIED` 并且在使用时**应该**使用错误 `INVALID_ARGUMENT` 拒绝。

```proto
enum Isolation {
  // Not specified.
  ISOLATION_UNSPECIFIED = 0;
  // Reads from a snapshot. Collisions occur if all reads and writes cannot be
  // logically serialized with concurrent transactions.
  SERIALIZABLE = 1;
  // Reads from a snapshot. Collisions occur if concurrent transactions write
  // to the same rows.
  SNAPSHOT = 2;
  ...
}

// When unspecified, the server will use an isolation level of SNAPSHOT or
// better.
Isolation level = 1;
```

惯用名称**可以**用于 `0` 值。例如，`google.rpc.Code.OK` 是指定缺少错误代码的惯用方法。在这种情况下，在枚举类型的上下文中，`OK` 在语义上等同于 `UNSPECIFIED`。

如果存在本质上合理且安全的默认值，则该值**可以**用于“0”值。例如，`BASIC` 是[资源视图](https://cloud.google.com/apis/design/design_patterns?hl=zh-cn#resource_view)枚举中的“0”值。

## 语法规则

在 API 设计中，通常需要为某些数据格式定义简单的语法，例如可接受的文本输入。为了在所有 API 中提供一致的开发者体验并减少学习曲线，API 设计人员**必须**使用以下扩展巴科斯范式（Extended Backus-Naur Form，简写为“EBNF”）语法的变体来定义这样的语法：

```
Production  = name "=" [ Expression ] ";" ;
Expression  = Alternative { "|" Alternative } ;
Alternative = Term { Term } ;
Term        = name | TOKEN | Group | Option | Repetition ;
Group       = "(" Expression ")" ;
Option      = "[" Expression "]" ;
Repetition  = "{" Expression "}" ;
```

**注意**：`TOKEN` 表示在语法之外定义的终端符号。

## 整数类型

在 API 设计中，**不应该**使用 `uint32` 和 `fixed32` 等无符号整数类型，因为某些重要的编程语言和系统（如 Java，JavaScript 和 OpenAPI）不太支持它们。并且它们更有可能导致溢出错误。另一个问题是，不同的 API 很可能会对同一事件使用不匹配的有符号和无符号类型。

当有符号整数类型用于负值无意义的事物（例如大小或超时）时，值 `-1` （且**仅有** `-1`）**可以**用于表示特殊含义，例如文件结尾 (EOF)、无限超时、无限制配额限制或未知年龄。**必须**明确记录此类用法以避免混淆。如果隐式默认值 `0` 的行为不是非常明显，API 提供方也应对其进行记录。

## 部分响应

有时，API 客户端只需要响应消息中的特定数据子集。为了支持此类用例，某些 API 平台为部分响应提供原生支持。Google API Platform 通过响应字段掩码来支持它。任何 REST API 调用都有一个隐式系统查询参数 `$fields`，它是 `google.protobuf.FieldMask` 值的 JSON 表示形式。在发送回客户端之前，响应消息将由 `$fields` 过滤。API 平台会自动为所有 API 方法处理此逻辑。

```
GET https://library.googleapis.com/v1/shelves?$fields=name
```

## 资源视图

为了减少网络流量，有时可允许客户端限制服务器应在其响应中返回的资源部分，即返回资源视图而不是完整的资源表示形式。API 中的资源视图支持是通过向方法请求添加一个参数来实现的，该参数允许客户端指定希望在响应中接收的资源视图。

该参数具有以下特点：

- **应该**是 `enum` 类型
- **必须**命名为 `view`。

枚举的每个值定义将在服务器的响应中返回资源的哪些部分（哪些字段）。为每个 `view` 值返回的具体内容是由实现定义的，**应该**在 API 文档中指定。

```proto
package google.example.library.v1;

service Library {
  rpc ListBooks(ListBooksRequest) returns (ListBooksResponse) {
    option (google.api.http) = {
      get: "/v1/{name=shelves/*}/books"
    }
  };
}

enum BookView {
  // Not specified, equivalent to BASIC.
  BOOK_VIEW_UNSPECIFIED = 0;

  // Server responses only include author, title, ISBN and unique book ID.
  // The default value.
  BASIC = 1;

  // Full representation of the book is returned in server responses,
  // including contents of the book.
  FULL = 2;
}

message ListBooksRequest {
  string name = 1;

  // Specifies which parts of the book resource should be returned
  // in the response.
  BookView view = 2;
}
```

此构造将映射到网址中，例如：

```
GET https://library.googleapis.com/v1/shelves/shelf1/books?view=BASIC
```

您可以在本设计指南的[标准方法](https://cloud.google.com/apis/design/standard_methods?hl=zh-cn)一章中找到有关定义方法、请求和响应的更多信息。

## ETag

ETag 是一个不透明标识符，允许客户端发出条件请求。 为了支持 ETag，API **应该**在资源定义中包含字符串字段 `etag`，并且其语义**必须**符合 ETag 的常见用法。通常，`etag` 包含服务器计算的资源的指纹。如需了解更多详情，请参阅 [Wikipedia](https://en.wikipedia.org/wiki/HTTP_ETag) 和 [RFC 7232](https://tools.ietf.org/html/rfc7232#section-2.3)。

ETag 可以被强验证或弱验证，其中弱验证的 ETag 以 `W/` 为前缀。在本上下文中，强验证意味着具有相同 ETag 的两个资源具有逐字节相同的内容和相同的额外字段（即，内容-类型）。这意味着强验证的 ETag 允许缓存部分响应并在稍后组合。

相反，具有相同的弱验证 ETag 值的资源意味着表示法在语义上是等效的，但不一定逐字节相同，因此不适合字节范围请求的响应缓存。

例如：

```
// This is a strong ETag, including the quotes.
"1a2f3e4d5b6c7c"
// This is a weak ETag, including the prefix and quotes.
W/"1a2b3c4d5ef"
```

请牢记，引号是 ETag 值的一部分并且必须存在，以符合 [RFC 7232](https://tools.ietf.org/html/rfc7232#section-2.3)。这意味着 ETag 的 JSON 表示法最终会对引号进行转义。例如，ETag 在 JSON 资源正文中表示为：

```
// Strong
{ "etag": "\"1a2f3e4d5b6c7c\"", "name": "...", ... }
// Weak
{ "etag": "W/\"1a2b3c4d5ef\"", "name": "...", ... }
```

ETag 中允许的字符摘要：

- 仅限可打印的 ASCII
  - RFC 2732 允许的非 ASCII 字符，但对开发者不太友好
- 不能有空格
- 除上述位置外，不能有双引号
- 遵从 RFC 7232 的推荐，避免使用反斜杠，以防止在转义时出现混淆

## 输出字段

API 可能希望区分客户端提供的作为输入的字段，以及由服务器返回的仅在特定资源上输出的字段。对于仅限输出的字段，**应该**记录字段属性。

请注意，如果在请求中设置了或在 `google.protobuf.FieldMask` 中包括了仅输出字段，则服务器**必须**接受请求并且不出现错误。服务器**必须**忽略仅限输出字段的存在及任何提示。此建议的原因是因为客户端经常将服务器返回的资源作为另一个请求的输入重新使用，例如，检索到的 `Book` 稍后将在 UPDATE 方法中被重新使用。如果对仅限输出字段进行验证，则会导致客户端需要额外清除仅限输出字段。

```proto
message Book {
  string name = 1;
  // Output only.
  Timestamp create_time = 2;
}
```

## 单例资源

当只有一个资源实例存在于其父资源中（如果没有父资源，则在 API 中）时，可以使用单例资源。

单例资源**必须**省略标准的 `Create` 和 `Delete` 方法；在创建或删除父资源时即隐式创建或删除了单例资源（如果没有父资源，则单例资源隐式存在）。**必须**使用标准的 `Get` 和 `Update` 方法，以及任意适合您的用例的自定义方法访问该资源。

例如，具有 `User` 资源的 API 可以将每个用户的设置公开为 `Settings` 单例。

```proto
rpc GetSettings(GetSettingsRequest) returns (Settings) {
  option (google.api.http) = {
    get: "/v1/{name=users/*/settings}"
  };
}

rpc UpdateSettings(UpdateSettingsRequest) returns (Settings) {
  option (google.api.http) = {
    patch: "/v1/{settings.name=users/*/settings}"
    body: "settings"
  };
}

[...]

message Settings {
  string name = 1;
  // Settings fields omitted.
}

message GetSettingsRequest {
  string name = 1;
}

message UpdateSettingsRequest {
  Settings settings = 1;
  // Field mask to support partial updates.
  FieldMask update_mask = 2;
}
```

## 流式半关闭

对于任何双向或客户端流传输 API，服务器**应该**依赖 RPC 系统提供的、客户端发起的半关闭来完成客户端流。无需定义显式完成消息。

客户端需要在半关闭之前发送的任何信息都**必须**定义为请求消息的一部分。

## 网域范围名称

网域范围名称是以 DNS 域名为前缀的实体名称，旨在防止名称发生冲突。当不同的组织以分散的方式定义其实体名称时，这种设计模式很有用。其语法类似于没有架构的 URI。

网域范围名称广泛用于 Google API 和 Kubernetes API，例如：

- Protobuf `Any` 类型的表示形式：`type.googleapis.com/google.protobuf.Any`
- Stackdriver 指标类型：`compute.googleapis.com/instance/cpu/utilization`
- 标签键：`cloud.googleapis.com/location`
- Kubernetes API 版本：`networking.k8s.io/v1`
- `x-kubernetes-group-version-kind` OpenAPI 扩展程序中的 `kind` 字段。

## 布尔值与枚举与字符串

在设计 API 方法时，您通常会为特定功能（例如启用跟踪或停用缓存）提供一组选择。实现此目的的常用方法是引入 `bool`、`enum` 或 `string` 类型的请求字段。对于给定用例，要使用哪种正确的类型通常不是很明显。推荐的选项如下：

- 如果我们希望获得固定的设计并且有意不想扩展该功能，请使用 `bool` 类型。例如 `bool enable_tracing` 或 `bool enable_pretty_print`。
- 如果我们希望获得灵活的设计，但不希望该设计频繁更改，请使用 `enum` 类型。一般的经验法则是枚举定义每年仅更改一次或更少。例如 `enum TlsVersion` 或 `enum HttpVersion`。
- 如果我们采用开放式设计或者可以根据外部标准频繁更改设计，请使用 `string` 类型。必须明确记录支持的值。例如：
  - 由 [Unicode 区域](http://www.unicode.org/reports/tr35/#unicode_region_subtag)定义的 `string region_code`。
  - 由 [Unicode 语言区域](http://www.unicode.org/reports/tr35/#Unicode_locale_identifier)定义的 `string language_code`。

## 数据保留

在设计 API 服务时，数据保留是服务可靠性相当重要的部分。通常，用户数据会被软件错误或人为错误误删。没有数据保留和相应的取消删除功能，一个简单的错误就可能对业务造成灾难性的影响。

通常，我们建议 API 服务采用以下数据保留政策：

- 对于用户元数据、用户设置和其他重要信息，应保留 30 天的数据。例如，监控指标、项目元数据和服务定义。
- 对于大量用户内容，应保留 7 天的数据。例如，二进制 blob 和数据库表。
- 对于暂时性状态或费用昂贵的存储服务，如果可行，应保留 1 天的数据。例如，Memcache 实例和 Redis 服务器。

在数据保留期限期间，可以删除数据而不会丢失数据。如果免费提供数据保留的成本很高，则服务可以提供付费的数据保留。

## 大型载荷

联网 API 通常依赖于多个网络层作为其数据路径。大多数网络层对请求和响应大小有硬性限制。32 MB 是很多系统中常用的限制。

在设计处理大于 10 MB 的载荷的 API 方法时，我们应该谨慎选择合适的策略，以确保易用性和满足未来增长的需求。对于 Google API，我们建议使用流式传输或媒体上传/下载来处理大型载荷。如使用流式传输，服务器会逐步地同步处理大量数据，例如 Cloud Spanner API。如使用媒体，大量数据会流经大型存储系统（如 Google Cloud Storage），服务器可以异步处理数据，例如 Google Drive API。



# 文档

本部分介绍了如何向 API 添加内嵌文档。大多数 API 还拥有概览、教程和简要参考文档，这些内容本设计指南并不涉及。如需了解 API、资源和方法命名，请参阅[命名惯例](https://cloud.google.com/apis/design/naming_convention?hl=zh-cn)。



## proto 文件中的注释格式

使用常用的 Protocol Buffers `//` 注释格式向 `.proto` 文件添加注释。

```proto
// Creates a shelf in the library, and returns the new Shelf.
rpc CreateShelf(CreateShelfRequest) returns (Shelf) {
  option (google.api.http) = { post: "/v1/shelves" body: "shelf" };
}
```

## 服务配置中的注释

另一种向 `.proto` 文件添加文档注释的方法是，您可以在其 YAML 服务配置文件中向 API 添加内嵌文档。如果两个文件中都记录了相同的元素，则 YAML 文件中的文档将优先于 `.proto` 中的文档。

```yaml
documentation:
  summary: Gets and lists social activities
  overview: A simple example service that lets you get and list possible social activities
  rules:
  - selector: google.social.Social.GetActivity
    description: Gets a social activity. If the activity does not exist, returns Code.NOT_FOUND.
...
```

如果您有多个服务使用相同的 `.proto` 文件，并且您希望提供服务专用文档，则可能需要使用此方法。YAML 文档规则还允许您向 API 说明添加更详细的 `overview`。但一般首选向 `.proto` 文件添加文档注释。

与向 `.proto` 添加注释一样，您可以使用 Markdown 在 YAML 文件注释中提供其他格式设置。

## API 说明

API 说明是说明 API 功能的短语（以行为动词开头）。在您的 `.proto` 文件中，API 说明作为注释添加到相应的 `service` 中，如以下示例所示：

```proto
// Manages books and shelves in a simple digital library.
service LibraryService {
...
}
```

以下是一些 API 说明示例：

- 与世界各地的朋友分享最新动态、照片、视频等。
- 访问云托管的机器学习服务，轻松构建响应数据流的智能应用。

## 资源说明

资源说明是描述资源表示的内容的句子。如果您需要添加更多细节，请使用更多句子。在您的 `.proto` 文件中，API 说明作为注释添加到相应的消息类型中，如以下示例所示：

```proto
// A book resource in the Library API.
message Book {
  ...
}
```

以下是一些资源说明示例：

- 用户待办事项列表中的一项任务。每项任务具有唯一的优先级。
- 用户日历上的一个事件。

## 字段和参数说明

描述字段或参数定义的名词短语，如以下示例所示：

- 本系列的主题数量。
- 经纬度坐标的精度，以米为单位。 必须是非负数。
- 标记是否为本系列的提交资源返回附件网址值。`series.insert` 的默认值为 `true`。
- 投票信息的容器。仅在记录投票信息时出现。
- 目前未使用或已弃用。

字段和参数说明**应该**描述哪些值有效和无效。请记住，工程师们会通过一切可能的途径导致服务失败，并且他们无法读取底层代码来澄清任何不清楚的信息。

对于字符串，说明**应该**描述语法和允许的字符以及任何所需的编码。例如：

- 集合 [A-a0-9] 中的 1-255 个字符
- 遵循 RFC 2332 惯例且以 / 开头的有效网址路径字符串。长度上限为 500 个字符。

说明**应该**指定任何默认值或行为，但**可以**省略描述实际为 null 的默认值。

如果字段值是**必需**、**仅限输入**、**仅限输出**，则**應該**在字段说明开头记录这些值。默认情况下，所有字段和参数都是可选的。例如：

```proto
message Table {
  // Required. The resource name of the table.
  string name = 1;

  // Input only. Whether to validate table creation without actually doing it.
  bool validate_only = 2;

  // Output only. The timestamp when the table was created. Assigned by
  // the server.
  google.protobuf.Timestamp create_time = 3;

  // The display name of the table.
  string display_name = 4;
}
```

**注意**：只要可行且有用，字段说明就**应该**提供示例值。

## 方法说明

方法说明是一个指明方法效果及其操作资源的句子。它通常以第三人称的现在时态动词（即以“s”结尾的动词）开头。如果需要添加详细信息，请使用更多句子。以下是一些示例：

- 列出已通过身份验证的用户的日历事件。
- 使用请求中包含的数据来更新日历事件。
- 从已通过身份验证的用户的位置历史记录中删除一个位置记录。
- 在已通过身份验证的用户的位置历史记录中，使用请求中包含的数据创建或更新一个位置记录。如果已存在具有相同时间戳值的位置资源，则所提供的数据会覆盖现有数据。

## 所有说明的核对清单

确保每个说明都是简短而完整的，能够让用户在没有其他关于该 API 的信息的情况下所理解。在大多数情况下，都有更多需要说明的内容，而不仅仅是重复显而易见的信息。例如，`series.insert` 方法的说明不应该只是说“插入一个序列”。虽然您的命名应该包含信息，但大多数读者还是会阅读说明，因为他们需要名称之外的更多信息。如果您不确定需要在说明中包括哪些其他内容，请尝试回答以下所有相关问题：

- 它是什么？
- 如果成功了它会执行什么操作？如果失败了它会执行什么操作？什么可能导致它失败及如何导致它失败？
- 它具有幂等性吗？
- 它的单位是什么？（例如：米、度、像素。）
- 它接受什么范围的值？此范围是否包含边界值？
- 它有什么副作用？
- 应该如何使用它？
- 可能会导致它失败的常见错误有哪些？
- 它总是存在吗？（例如：“用于投票信息的容器。仅在记录投票信息时存在。”）
- 它有默认设置吗？

## 惯例

本部分列出了文本说明和文档的一些使用惯例。例如，在说明标识符时，请使用“ID”（全部大写），而不是“Id”或“id”。在引用该数据格式时，请使用“JSON”而不是“Json”或“json”。以 `code font` 显示所有字段/参数名称。将文字字符串值以 `code font` 表示，并将其放入引号中。

- ID
- JSON
- RPC
- REST
- `property_name` 或 `"string_literal"`
- `true`/`false`

### 要求级别

要设置预期或陈述要求级别，请使用以下术语：必须、不得、必需、应、不应、应该、不应该、建议、可以和可选。

如需了解这些术语的含义，请参阅 [RFC 2119](https://www.ietf.org/rfc/rfc2119.txt) 中的定义。 建议您在 API 文档中包含 RFC 摘要中的语句。

确定哪些术语既符合您的要求，又能为开发者提供灵活性。如果从技术上来说，您的 API 还支持其他选项，则请勿使用绝对术语（如“必须”）。

## 语言风格

如[命名惯例](https://cloud.google.com/apis/design/naming_convention?hl=zh-cn)中所述，我们建议在编写文档注释时使用简单、一致的词汇和风格。注释应该易于母语非英语的读者理解，所以应避免行话、俚语、复杂的隐喻、引用流行文化，或包含任何其他不容易翻译的内容。使用友好、专业的风格直接与阅读注释的开发者交流，并尽可能简明扼要。请记住，大多数读者的目的是了解如何使用 API，而不是阅读您的文档！



