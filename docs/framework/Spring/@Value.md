# Spring @Value快速指南，这50种注入形式肯定有用到的时候

Spring boot 允许我们把配置信息外部化。由此，我们就可以在不同的环境中使用同一套程序代码。可以使用属性文件，yaml文件，环境变量，命令行参数来实现配置信息的外部化。

可以使用 `@Value` 注解来将属性值直接注入到bean里边。也可以使用 `@ConfigurationProperties` 注解将属性值注入到结构化的对象里边。



这篇我们主要整理下 @Value 的各种用法。

`@Value` 通常用于注入外部属性，Spring Boot 会自动加载的配置文件 `application.properties` 中的属性；

如果是自定义的其他命名配置文件，需要先通过 `@PropertySource` 加载自定义属性文件。



## 使用

application.properties

```properties
catalog.name=MovieCatalog
value.from.file=Value got from the file
priority=high
listOfValues=A,B,C
ip=192.168.0.1
port=8080
url=www.baidu.com
valuesMap={key1: '1', key2: '2', key3: '3'}
```

## 用法实例

```java
/**
 * 注入普通字符串，相当于直接给属性默认值
 */
@Value("normal")
private String normal;

/**
 * 默认获取位于application.properties中配置的属性，也可以注入基本数据类型
 *  如果系统属性中有该值，也会获取到
 */
@Value("${value.from.file}")
private String valueFromFile;

/**
 * 注入数组（自动根据","分割）
 */
@Value("${listOfValues}")
private String[] valuesArray;

/**
 * 注入列表形式（自动根据","分割）
 */
@Value("${listOfValues}")
private List<String> valuesList;

/**
 *  注入文件资源
 */
@Value("classpath:application.properties")
private Resource resourceFile;
    
/**
 * 注入URL资源，不可以通过配置文件注入，会：
 * Failed to convert value of type 'java.lang.String' to required type 'java.net.URL';
 */
@Value("http://www.google.com")
private URL testUrl;
```



## SpEL 表达式

SpEL 表达式是很强大的，可以获取系统属性、调用静态方法、计算、注入bean、调用bean的方法等等

```java
/**
 * 注入List,可以根据设定分隔符截取
 */
@Value("#{'${listOfValues}'.split(',')}")
private List<String> values;

/**
 *  注入操作系统属性，如果有自定义的系统属性，也可以通过该方式注入
 */
@Value("#{systemProperties['os.name']}")
private String systemPropertiesName;

/**
 * 我们还可以使用@Value注释注入所有当前系统属性
 */
@Value("#{systemProperties}")
private Map<String, String> systemPropertiesMap;

/**
 * 注入表达式结果
 */
@Value("#{ T(java.lang.Math).random() * 100.0 }")
private double randomNumber;

/**
 * 注入其他Bean属性：注入movieRecommender对象的属性catalog，对象属性要有get set方法
 */
@Value("#{movieRecommender.catalog}")
private String fromAnotherBean;
```



## 注入 Map

```java
/**
 * 注入Map, 需要注意的是map中的value 必须用单引号引起来
 */
@Value("#{${valuesMap}}")
private Map<String, Integer> valuesMap;

/**
 * 获取 map 中的某个key值
 */
@Value("#{${valuesMap}.key1}")
private Integer valuesMapKey1;

/**
 * 如果我们不确定Map是否包含某个键，则应选择一个更安全的表达式，该表达式不会引发异常，但在找不到该键时将其值设置为null：
 */
@Value("#{${valuesMap}['key4']}")
private Integer unknownMapKey;

/**
 * 我们还可以为可能不存在的属性或键设置默认值：
 */
@Value("#{${unknownMap : {key1: '1', key2: '2'}}}")
private Map<String, Integer> unknownMap;

@Value("#{${valuesMap}['unknownKey'] ?: 5}")
private Integer unknownMapKeyWithDefaultValue;

/**
 * map 也可以在注入前过滤。假设我们只需要获取值大于一的键值对
 */
@Value("#{${valuesMap}.?[value>'1']}")
private Map<String, Integer> valuesMapFiltered;
```



## 指定默认值

```java
/**
 * 如果属性中未配置ip，则使用默认值
 */
@Value("${ip:127.0.0.1}")
private String ip;

/**
 * 如果系统属性中未获取到port的值，则使用9090
 * 其中${}中直接使用“:”对未定义或为空的值进行默认值设置，
 * 而#{}则需要使用“?:”对未设置的属性进行默认值设置
 */
@Value("#{systemProperties['port']?:'9090'}")
private String port;

@Value("#{systemProperties['unknown'] ?: 'some default'}")
private String spelSomeDefault;
```



## 在构造器注入中使用*@Value*

@Value不仅仅限于字段注入，我们也可以将其与构造函数注入一起使用

```java
@Component
@PropertySource("classpath:values.properties")
public class PriorityProvider {

    private String priority;

    @Autowired
    public PriorityProvider(@Value("${priority:normal}") String priority) {
        this.priority = priority;
    }

    // standard getter


    public String getPriority() {
        return priority;
    }
}
```



## 在Setter注入中使用@Value

```java
@Component
@PropertySource("classpath:values.properties")
public class CollectionProvider {
 
    private List<String> values = new ArrayList<>();
 
    @Autowired
    public void setValues(@Value("#{'${listOfValues}'.split(',')}") List<String> values){
        this.values.addAll(values);
    }
 
    // standard getter
}
```



## 原理







参考：

https://www.baeldung.com/spring-value-annotation