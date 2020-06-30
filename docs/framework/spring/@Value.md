# Spring @Value快速指南

**spring boot允许我们把配置信息外部化。由此，我们就可以在不同的环境中使用同一套程序代码。可以使用属性文件，yaml文件，环境变量，命令行参数来实现配置信息的外部化。可以使用@Value注解来将属性值直接注入到bean里边。也可以使用@ConfigurationProperties注解将属性值注入到结构化的对象里边。**

该注释可用于将值注入到Spring管理的Bean中的字段中，并可在字段或构造函数/方法参数级别应用

`@Value` 通常用于注入外部属性，Spring Boot 会自动加载的配置文件 `application.properties` 中的属性；

如果是自定义的其他命名配置文件，需要先通过 `@PropertySource` 加载。



## 使用

application.properties

```properties
catalog.name=MovieCatalog
value.from.file=Value got from the file
priority=high
listOfValues=A,B,C


port=8080
```

