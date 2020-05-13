> 什么是ThreadLocal？ThreadLocal出现的背景是什么？解决了什么问题？
> ThreadLocal的使用方法是什么？使用的效果如何？
> ThreadLocal是如何实现它的功能的，即ThreadLocal的原理是什么？

## ThreadLocal

ThreadLocal是一个关于创建线程局部变量的类。是`java.lang` 包下的类

通常情况下，我们创建的变量是可以被任何一个线程访问并修改的。而使用ThreadLocal创建的变量只能被当前线程访问，其他线程则无法访问和修改。



## 使用

动态数据源选择，

```java
public class DynamicDataSource extends AbstractRoutingDataSource {

   private final static Logger log = Logger.getLogger(DynamicDataSource.class);

   public final static int WRITE_MODE = 0;

   public final static int READ_MODE = 1;

   public final static int RANDOM_MODE = 2;

   private final static Random random = new Random();

   private static final ThreadLocal<Integer> DB_MODE = new ThreadLocal<Integer>();

   /**
    * 数据源的key
    */
   private final List<Object> datasourceKeyList = new ArrayList<Object>();

   /**
    * 获得数据源的key
    */
   @Override
   protected Object determineCurrentLookupKey() {

      // 生成index
      int index = 0;
      int mode = getDBMode();

      if (datasourceKeyList.size() > 1) {
         switch (mode) {
            case WRITE_MODE:
               index = 0;
               break;

            case READ_MODE:
               index = random.nextInt(datasourceKeyList.size() - 1) + 1;
               break;

            default:
               index = random.nextInt(datasourceKeyList.size() - 1) + 1;
               break;
         }
      }

      if (log.isDebugEnabled()) {
         log.debug("determineCurrentLookupKey: " + datasourceKeyList.get(index) + " mode:" + mode);
      }

      return datasourceKeyList.get(index);
   }

   /**
    * 处理数据源的key
    */
   @Override
   protected Object resolveSpecifiedLookupKey(Object lookupKey) {

      datasourceKeyList.add(lookupKey);

      return lookupKey;
   }

   public static void setWriteMode() {
      DB_MODE.set(WRITE_MODE);
   }

   public static void setReadMode() {
      DB_MODE.set(READ_MODE);
   }

   public static int getDBMode() {
      return DB_MODE.get() == null ? RANDOM_MODE : DB_MODE.get();
   }

   public static void clearDBMode() {
      DB_MODE.remove();
   }
}
```



用户信息

```java
public class QUsercenterUtils {

   private final static Logger log = Logger.getLogger(QUsercenterUtils.class);

   public final static String COOKIE_Q = "Q";
   public final static String COOKIE_T = "T";

   private final static ThreadLocal<QUser> qUser = new ThreadLocal<QUser>();

   public static QUser getQUser() {

      QUser user = qUser.get();

      if (user == null) {
         log.warn("QUser is null");
         throw new UnionBusinessException(Status.UNAUTHORIZED);
      }

      return user;
   }

   public static boolean isQuserExists() {
      QUser user = qUser.get();

      return null != user;
   }

   public static void setQUser(QUser user) {

      qUser.set(user);
      log.debug("quser setted.");
   }

   public static void removeQUser() {

      qUser.remove();
      log.debug("quser removed.");
   }

   public static class QUser {

      public long getQid() {
         return qid;
      }

      public void setQid(long qid) {
         this.qid = qid;
      }

      public String getUserName() {
         return userName;
      }

      public void setUserName(String userName) {
         this.userName = userName;
      }

      public String getLoginEmail() {
         return loginEmail;
      }

      public void setLoginEmail(String loginEmail) {
         this.loginEmail = loginEmail;
      }

      public long qid;
      public String userName;
      public String loginEmail;

      public String cookieQ;
      public String cookieT;

      public Map<String, String> data;

      public int power;
      public int status;
      public Collection<Category> permissions = Collections.emptyList();
   }
}
```





# ThreadLocal解决什么问题

由于 ThreadLocal 支持范型，如 ThreadLocal< StringBuilder >，为表述方便，后文用 **变量** 代表 ThreadLocal 本身，而用 **实例** 代表具体类型（如 StringBuidler ）的实例。

## 不恰当的理解

写这篇文章的一个原因在于，网上很多博客关于 ThreadLocal 的适用场景以及解决的问题，描述的并不清楚，甚至是错的。下面是常见的对于 ThreadLocal的介绍

> ThreadLocal为解决多线程程序的并发问题提供了一种新的思路
> ThreadLocal的目的是为了解决多线程访问资源时的共享问题

还有很多文章在对比 ThreadLocal 与 synchronize 的异同。既然是作比较，那应该是认为这两者解决相同或类似的问题。

上面的描述，问题在于，ThreadLocal 并不解决多线程 **共享** 变量的问题。既然变量不共享，那就更谈不上同步的问题。

## 合理的理解

ThreadLoal 变量，它的基本原理是，同一个 ThreadLocal 所包含的对象（对ThreadLocal< String >而言即为 String 类型变量），在不同的 Thread 中有不同的副本（实际是不同的实例，后文会详细阐述）。这里有几点需要注意

- 因为每个 Thread 内有自己的实例副本，且该副本只能由当前 Thread 使用。这是也是 ThreadLocal 命名的由来
- 既然每个 Thread 有自己的实例副本，且其它 Thread 不可访问，那就不存在多线程间共享的问题
- 既无共享，何来同步问题，又何来解决同步问题一说？



那 ThreadLocal 到底解决了什么问题，又适用于什么样的场景？

ThreadLocal 提供了线程本地的实例。它与普通变量的区别在于，每个使用该变量的线程都会初始化一个完全独立的实例副本。ThreadLocal 变量通常被`private static`修饰。当一个线程结束时，它所使用的所有 ThreadLocal 相对的实例副本都可被回收。



总的来说，**ThreadLocal 适用于每个线程需要自己独立的实例且该实例需要在多个方法中被使用，也即变量在线程间隔离而在方法或类间共享的场景。**后文会通过实例详细阐述该观点。另外，该场景下，并非必须使用 ThreadLocal ，其它方式完全可以实现同样的效果，只是 ThreadLocal 使得实现更简洁。





# ThreadLocal原理







## 参考

http://www.jasongj.com/java/threadlocal/