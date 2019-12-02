count(column) 和 count(*) 是一样的吗

这个误区甚至在很多的资深工程师或者是 DBA 中都普遍存在，很多人都会认为这是理所当然的。实际上，count(column) 和 count(*) 是一个完全不一样的操作，所代表的意义也完全不一样。

count(column) 是表示结果集中有多少个column字段不为空的记录

count(*) 是表示整个结果集有多少条记录

