HashMap在多线程环境下存在线程安全问题，那你一般都是怎么处理这种情况的？

一般在多线程的场景，我都会使用好几种不同的方式去代替：

- 使用Collections.synchronizedMap(Map)创建线程安全的map集合；
- Hashtable
- ConcurrentHashMap