# @vuepress-reco/vuepress-plugin-pagation

![demo.png](./images/demo.png)

## Details

> Pagation plugin for vuepress-theme-reco or other vuepress theme.

|使用位置|值|
|-|-|
|plugin name|@vuepress-reco/vuepress-plugin-pagation|
|component name|Pagation（主题开发时使用）|

## Options

> 主题开发过程中作为组件使用，以下为组件的参数（不是插件注入时的参数）。

**Attributes**

|参数|说明|类型|默认值|可选值|
|-|-|-|-|-|
|total|数据总数量|number|10|-|
|perPage|每页多少条|number|10|-|
|currentPage|当前是第几页|number|1|-|

**Events**

|事件名称|说明|回调参数|
|-|-|-|
|getCurrentPage|获取当前是第几页|currentPage: 当前页码|

