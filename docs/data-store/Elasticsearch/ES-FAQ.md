> elasticsearch 了解多少，说说你们公司 es 的集群架构，索引数据大小，分片有多少，以及一些调优手段 。

面试官：想了解应聘者之前公司接触的 ES 使用场景、规模，有没有做过比较大规模的索引设计、规划、调优。

解答：如实结合自己的实践场景回答即可。

比如：ES 集群架构 13 个节点，索引根据通道不同共 20+索引，根据日期，每日递增 20+，索引：10 分片，每日递增 1 亿+数据，每个通道每天索引大小控制：150GB 之内。

仅索引层面调优手段：

**1.1、设计阶段调优**

（1）根据业务增量需求，采取基于日期模板创建索引，通过 roll over API 滚动索引；

（2）使用别名进行索引管理；

（3）每天凌晨定时对索引做 force_merge 操作，以释放空间；

（4）采取冷热分离机制，热数据存储到 SSD，提高检索效率；冷数据定期进行 shrink操作，以缩减存储；

（5）采取 curator 进行索引的生命周期管理；

（6）仅针对需要分词的字段，合理的设置分词器；

（7）Mapping 阶段充分结合各个字段的属性，是否需要检索、是否需要存储等。……..

**1.2、写入调优**

（1）写入前副本数设置为 0；

（2）写入前关闭 refresh_interval 设置为-1，禁用刷新机制；

（3）写入过程中：采取 bulk 批量写入；

（4）写入后恢复副本数和刷新间隔；

（5）尽量使用自动生成的 id。

1.3、查询调优

（1）禁用 wildcard；

（2）禁用批量 terms（成百上千的场景）；

（3）充分利用倒排索引机制，能 keyword 类型尽量 keyword；

（4）数据量大时候，可以先基于时间敲定索引再检索；

（5）设置合理的路由机制。

1.4、其他调优

部署调优，业务调优等。

上面的提及一部分，面试者就基本对你之前的实践或者运维经验有所评估了。



## elasticsearch 的倒排索引是什么

面试官：想了解你对基础概念的认知。

解答：通俗解释一下就可以。

传统的我们的检索是通过文章，逐个遍历找到对应关键词的位置。

而倒排索引，是通过分词策略，形成了词和文章的映射关系表，这种词典+映射表即为倒排索引。有了倒排索引，就能实现 o（1）时间复杂度的效率检索文章了，极大的提高了检索效率。

![img](https://pic3.zhimg.com/80/v2-bf18227dc4554da0dcc7b970dbd582ae_720w.jpg)

学术的解答方式：

倒排索引，相反于一篇文章包含了哪些词，它从词出发，记载了这个词在哪些文档中出现过，由两部分组成——词典和倒排表。

加分项：倒排索引的底层实现是基于：FST（Finite State Transducer）数据结构。

lucene 从 4+版本后开始大量使用的数据结构是 FST。FST 有两个优点：

（1）空间占用小。通过对词典中单词前缀和后缀的重复利用，压缩了存储空间；

（2）查询速度快。O(len(str))的查询时间复杂度。











1.创建index,分词器post  设置mapping,指定分词器，自动补全

	put   /index_1_v2
{
		"settings": {
			"number_of_shards": 50,
			"number_of_replicas": 0,
			"refresh_interval": -1,
			"analysis": {
				"analyzer": {
					"optimizeIK": {
						"type": "custom",
						"tokenizer": "ik_max_word"
					}
				}
			}
		},
        "mappings": {
            "doc": {
                "dynamic": "true",
                "properties": {
					"audit": {
                        "type": "integer"
                    },
					"status": {
                        "type": "integer"
                    },
                    "address": {
                        "type": "text",
						"analyzer": "optimizeIK",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            }
                        }
                    },
                    "androidDplink": {
                        "type": "byte"
                    },
                    "availability": {
                        "type": "byte"
                    },
                    "bName": {
                        "type": "text",
						"analyzer": "optimizeIK",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            }
                        }
                    },
                    "bNameUrl": {
                        "type": "byte"
                    },
                    "bid": {
                        "type": "keyword"
                    },
                    "bought": {
                        "type": "integer"
                    },
                    "cPageMUrl": {
                        "type": "byte"
                    },
                    "cPageUrl": {
                        "type": "byte"
                    },
                    "category": {
                        "type": "text",
						"analyzer": "optimizeIK",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            }
                        }
                    },
                    "choiceFields": {
                        "type": "nested",
                        "dynamic": "true",
                        "properties": {
                            "fieldName": {
                                "type": "text",
								"analyzer": "optimizeIK",
                                "fields": {
                                    "raw": {
                                        "type": "keyword",
                                        "ignore_above": 256
                                    }
                                }
                            },
                            "fieldValue": {
                                "type": "text",
								"analyzer": "optimizeIK",
                                "fields": {
                                    "raw": {
                                        "type": "keyword",
                                        "ignore_above": 256
                                    }
                                }
                            }
                        }
                    },
                    "city": {
                        "type": "text",
						"analyzer": "optimizeIK",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            }
                        }
                    },
                    "clickUrl": {
                        "type": "byte"
                    },
                    "comments": {
                        "type": "integer"
                    },
                    "discountRate": {
                        "type": "double"
                    },
                    "disend": {
                        "type": "date",
                        "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||yyyyMMdd||yyyyMMdd HH:mm:ss||yyyy/MM/dd||yyyy/MM/dd HH:mm:ss||epoch_millis"
                    },
                    "disprice": {
                        "type": "double"
                    },
                    "disstart": {
                        "type": "date",
                        "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||yyyyMMdd||yyyyMMdd HH:mm:ss||yyyy/MM/dd||yyyy/MM/dd HH:mm:ss||epoch_millis"
                    },
                    "fourthCategory": {
                        "type": "text",
						"analyzer": "optimizeIK",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            }
                        }
                    },
                    "fourthcPageMUrl": {
                        "type": "byte"
                    },
                    "fourthcPageUrl": {
                        "type": "byte"
                    },
                    "hotCateg1Url": {
                        "type": "byte"
                    },
                    "hotCateg2Url": {
                        "type": "byte"
                    },
                    "hotCateg3Url": {
                        "type": "byte"
                    },
                    "hotUrl": {
                        "type": "byte"
                    },
                    "imgUrl": {
                        "type": "byte"
                    },
                    "imgUrl1": {
                        "type": "byte"
                    },
                    "imgUrl2": {
                        "type": "byte"
                    },
                    "imgUrl3": {
                        "type": "byte"
                    },
                    "imgUrl4": {
                        "type": "byte"
                    },
                    "imgUrl5": {
                        "type": "byte"
                    },
                    "invalidTime": {
                        "type": "date",
                        "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||yyyyMMdd||yyyyMMdd HH:mm:ss||yyyy/MM/dd||yyyy/MM/dd HH:mm:ss||epoch_millis"
                    },
                    "inventoryNum": {
                        "type": "integer"
                    },
                    "iosDplink": {
                        "type": "byte"
                    },
                    "iosH5": {
                        "type": "byte"
                    },
                    "label": {
                        "type": "text",
						"analyzer": "optimizeIK",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            }
                        }
                    },
                    "logo": {
                        "type": "byte"
                    },
                    "mBrandUrl": {
                        "type": "byte"
                    },
                    "mClickUrl": {
                        "type": "byte"
                    },
                    "mHotcateg1Url": {
                        "type": "byte"
                    },
                    "mHotcateg2Url": {
                        "type": "byte"
                    },
                    "mHotcateg3Url": {
                        "type": "byte"
                    },
                    "mTargetUrl": {
                        "type": "byte"
                    },
                    "major": {
                        "type": "integer"
                    },
                    "mhotUrl": {
                        "type": "byte"
                    },
                    "originalPrice": {
                        "type": "double"
                    },
                    "pName": {
                        "type": "text",
						"analyzer": "optimizeIK",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            }
                        }
                    },
                    "pid": {
                        "type": "keyword"
                    },
                    "preferredItem": {
                        "type": "text",
						"analyzer": "optimizeIK",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            }
                        }
                    },
                    "price": {
                        "type": "double"
                    },
                    "priceUnit": {
                        "type": "text",
						"analyzer": "optimizeIK",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            }
                        }
                    },
                    "qid": {
                        "type": "keyword"
                    },
                    "query": {
                        "properties": {
                            "match_all": {
                                "type": "object"
                            },
                            "range": {
                                "properties": {
                                    "timestamps": {
                                        "properties": {
                                            "lt": {
                                                "type": "long"
                                            },
                                            "lte": {
                                                "type": "long"
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "range": {
                        "type": "text",
						"analyzer": "optimizeIK",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            }
                        }
                    },
                    "saving": {
                        "type": "double"
                    },
                    "score": {
                        "type": "double"
                    },
                    "sellerName": {
                        "type": "text",
						"analyzer": "optimizeIK",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            }
                        }
                    },
                    "sellerSiteUrl": {
                        "type": "byte"
                    },
                    "services": {
                        "type": "text",
						"analyzer": "optimizeIK",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            }
                        }
                    },
                    "star": {
                        "type": "integer"
                    },
                    "startTime": {
                        "type": "date",
                        "format": "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||yyyyMMdd||yyyyMMdd HH:mm:ss||yyyy/MM/dd||yyyy/MM/dd HH:mm:ss||epoch_millis"
                    },
                    "subCategory": {
                        "type": "text",
						"analyzer": "optimizeIK",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            }
                        }
                    },
                    "subcPageMUrl": {
                        "type": "byte"
                    },
                    "subcPageUrl": {
                        "type": "byte"
                    },
                    "targetUrl": {
                        "type": "byte"
                    },
                    "thirdCategory": {
                        "type": "text",
						"analyzer": "optimizeIK",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            }
                        }
                    },
                    "thirdcPageMUrl": {
                        "type": "byte"
                    },
                    "thirdcPageUrl": {
                        "type": "byte"
                    },
                    "thumbImgUrl": {
                        "type": "byte"
                    },
                    "timestamps": {
                        "type": "date",
                        "format": "epoch_millis"
                    },
                    "title": {
                        "type": "text",
						"analyzer": "optimizeIK",
                        "fields": {
                            "raw": {
                                "type": "keyword"
                            }
                        }
                    },
                    "videoUrl": {
                        "type": "byte"
                    },
                    "weight": {
                        "type": "double"
                    }
                }
            }
        }		
			
}			