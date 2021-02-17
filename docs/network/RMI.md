# RMI 远程调用

> 来源：[《廖雪峰RMI远程调用》](https://www.liaoxuefeng.com/wiki/1252599548343744/1323711850348577)

## RMI  概述

Java 的 RMI 远程调用是指，一个 JVM 中的代码可以通过网络实现远程调用另一个 JVM 的某个方法。RMI 是 Remote Method Invocation的缩写。

提供服务的一方我们称之为服务器，而实现远程调用的一方我们称之为客户端。



## 服务提供者

我们先来实现一个最简单的RMI：服务器会提供一个 `WorldClock` 服务，允许客户端获取指定时区的时间，即允许客户端调用下面的方法：

```java
LocalDateTime getLocalDateTime(String zoneId);
```

要实现RMI，服务器和客户端必须共享同一个接口。我们定义一个 `WorldClock` 接口，代码如下：

```java
public interface WorldClock extends Remote {

    /**
     * 获取指定区域时间
     * @param zoneId
     * @return
     * @throws RemoteException
     */
    LocalDateTime getLocalDateTime(String zoneId) throws RemoteException;
}
```

Java 的 RMI 规定此接口必须派生自 `java.rmi.Remote`，并在每个方法声明抛出 `RemoteException`。

下一步是编写服务器的实现类，因为客户端请求的调用方法 `getLocalDateTime()` 最终会通过这个实现类返回结果。实现类 `WorldClockService` 代码如下：

```java
public class WorldClockService implements WorldClock {
    @Override
    public LocalDateTime getLocalDateTime(String zoneId) throws RemoteException {
        return LocalDateTime.now(ZoneId.of(zoneId)).withNano(0);
    }
}
```

现在，服务器端的服务相关代码就编写完毕。我们需要通过 Java RMI 提供的一系列底层支持接口，把上面编写的服务以 RMI 的形式暴露在网络上，客户端才能调用：

```java
public class Server {
    public static void main(String[] args) throws RemoteException {
        System.out.println("create World clock remote service...");
        // 实例化一个WorldClock:
        WorldClock worldClock = new WorldClockService();
        // 将此服务转换为远程服务接口:
        WorldClock skeleton = (WorldClock) UnicastRemoteObject.exportObject(worldClock, 0);
        // 将RMI服务注册到1099端口:
        Registry registry = LocateRegistry.createRegistry(1099);
        // 注册此服务，服务名为"WorldClock":
        registry.rebind("WorldClock", skeleton);
    }
}
```

上述代码主要目的是通过 RMI 提供的相关类，将我们自己的 `WorldClock` 实例注册到 RMI 服务上。RMI 的默认端口是 `1099`，最后一步注册服务时通过 `rebind()` 指定服务名称为 `"WorldClock"`。

## 客户端调用

下一步我们就可以编写客户端代码。RMI 要求服务器和客户端共享同一个接口，因此我们要把 `WorldClock.java` 这个接口文件复制到客户端，然后在客户端实现RMI调用：

```java
public class Client {
    public static void main(String[] args) throws RemoteException, NotBoundException {
        // 连接到服务器localhost，端口1099:
        Registry registry = LocateRegistry.getRegistry("localhost", 1099);
        // 查找名称为"WorldClock"的服务并强制转型为WorldClock接口:
        WorldClock worldClock = (WorldClock) registry.lookup("WorldClock");
        // 正常调用接口方法:
        LocalDateTime now = worldClock.getLocalDateTime("Asia/Shanghai");
        // 打印调用结果:
        System.out.println(now);
    }
}
```



先运行服务器，再运行客户端。

![rmi-dmeo](https://cdn.jsdelivr.net/gh/Jstarfish/picBed/img/rmi-dmeo.png)

从运行结果可知，因为客户端只有接口，并没有实现类，因此，客户端获得的接口方法返回值实际上是通过网络从服务器端获取的。整个过程实际上非常简单，对客户端来说，客户端持有的 `WorldClock` 接口实际上对应了一个“实现类”，它是由 `Registry` 内部动态生成的，并负责把方法调用通过网络传递到服务器端。而服务器端接收网络调用的服务并不是我们自己编写的 `WorldClockService`，而是 `Registry` 自动生成的代码。我们把客户端的“实现类”称为 `stub`，而服务器端的网络服务类称为 `skeleton`，它会真正调用服务器端的 `WorldClockService`，获取结果，然后把结果通过网络传递给客户端。整个过程由RMI底层负责实现序列化和反序列化：

```ascii
┌ ─ ─ ─ ─ ─ ─ ─ ─ ┐         ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐
  ┌─────────────┐                                 ┌─────────────┐
│ │   Service   │ │         │                     │   Service   │ │
  └─────────────┘                                 └─────────────┘
│        ▲        │         │                            ▲        │
         │                                               │
│        │        │         │                            │        │
  ┌─────────────┐   Network   ┌───────────────┐   ┌─────────────┐
│ │ Client Stub ├─┼─────────┼>│Server Skeleton│──>│Service Impl │ │
  └─────────────┘             └───────────────┘   └─────────────┘
└ ─ ─ ─ ─ ─ ─ ─ ─ ┘         └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘
```

## 弊端

Java 的 RMI 严重依赖序列化和反序列化，而这种情况下可能会造成严重的安全漏洞，因为 Java 的序列化和反序列化不但涉及到数据，还涉及到二进制的字节码，即使使用白名单机制也很难保证 100% 排除恶意构造的字节码。因此，使用 RMI 时，双方必须是内网互相信任的机器，不要把 1099 端口暴露在公网上作为对外服务。

此外，Java 的 RMI 调用机制决定了双方必须是 Java 程序，其他语言很难调用 Java 的 RMI。如果要使用不同语言进行 RPC 调用，可以选择更通用的协议，例如 [gRPC](https://grpc.io/)。





https://www.jianshu.com/p/2c78554a3f36