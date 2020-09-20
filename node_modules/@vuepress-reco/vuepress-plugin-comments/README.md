# @vuepress-reco/vuepress-plugin-comments

## Introduce

Comments plugin for vuepress-theme-reco or other vuepress theme.

### Name

- **As plugin**: `@vuepress-reco/vuepress-plugin-comments`
- **As component**: `Comments (评论)` / `AccessNumber (使用 Valine 时的访问量)`（主题开发时使用）

## Option API

组件会在 `$themeConfig` 注入一个参数 `commentsSolution`，如果使用 `Valine`，其值为 `valine`，如果使用 `Vssue`，其值为 `vssue`，可以使用这个参数来主题中做差异化处理，比如是否显示阅读数量。

### Valine

---

```javscript
module.exports = {
  theme: 'reco',
  themeConfig: {
    valineConfig: {
      appId: '...',// your appId
      appKey: '...', // your appKey
    }
  }  
}
```

或者：

```javscript
module.exports = {
  theme: 'reco',
  plugins: [['@vuepress-reco/comments', {
    solution: 'valine',
    options: {
      appId: '...',// your appId
      appKey: '...', // your appKey
    }
  }]] 
}
```

### Vssue

---

```javscript
module.exports = {
  theme: 'reco',
  themeConfig: {
    vssueConfig: {
      platform: 'github',
      owner: 'OWNER_OF_REPO',
      repo: 'NAME_OF_REPO',
      clientId: 'YOUR_CLIENT_ID',
      clientSecret: 'YOUR_CLIENT_SECRET',
    }
  }  
}
```

或者：

```javscript
module.exports = {
  theme: 'reco',
  plugins: [['@vuepress-reco/comments', {
    solution: 'vuess',
    options: {
      platform: 'github',
      owner: 'OWNER_OF_REPO',
      repo: 'NAME_OF_REPO',
      clientId: 'YOUR_CLIENT_ID',
      clientSecret: 'YOUR_CLIENT_SECRET',
    }
  }]] 
}
```

**`options` 详解：**
- platform: 支持的代码托管平台
- owner: 对应 `repository` 的拥有者帐号或者团队
- repo: 用来存储评论的 repository
- clientId: `OAuth App` 的 `client id`
- clientSecret: `OAuth App` 的 `client secret`（只有在使用某些平台时需要）

**`platform` 详解（点击查看[支持的代码托管平台](https://vssue.js.org/zh/guide/supported-platforms.html)）：**
- github: `@vssue/api-github-v3`
- github-v4: `@vssue/api-github-v4`
- gitlab: `@vssue/api-gitlab-v4`
- bitbucket: `@vssue/api-bitbucket-v2`
- gitee: `@vssue/api-gitee-v5`
- 

### AccessNumber

> 仅在 使用 `Valine` 时才有效。


#### idVal

- description: valine 记录浏览数的 id 值
- type: `String`

#### numStyle

- description: 浏览量的数字样式（用于调整不同位置的显示风格）
- type: `Object`

#### flagTitle

- description: 文章标题
- type: `String`

