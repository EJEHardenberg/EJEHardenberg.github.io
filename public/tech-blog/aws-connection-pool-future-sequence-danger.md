### Future.sequence starving AWS's connection pool

#### The exception:

Today I got to troubleshoot this fun exception from one of our systems that was downloading files from AWS's S3:

```
com.amazonaws.SdkClientException: Unable to execute HTTP request: Timeout waiting for connection from pool
[info] 	at com.amazonaws.http.AmazonHttpClient$RequestExecutor.handleRetryableException(AmazonHttpClient.java:1069)
[info] 	at com.amazonaws.http.AmazonHttpClient$RequestExecutor.executeHelper(AmazonHttpClient.java:1035)
[info] 	at com.amazonaws.http.AmazonHttpClient$RequestExecutor.doExecute(AmazonHttpClient.java:742)
[info] 	at com.amazonaws.http.AmazonHttpClient$RequestExecutor.executeWithTimer(AmazonHttpClient.java:716)
[info] 	at com.amazonaws.http.AmazonHttpClient$RequestExecutor.execute(AmazonHttpClient.java:699)
[info] 	at com.amazonaws.http.AmazonHttpClient$RequestExecutor.access$500(AmazonHttpClient.java:667)
[info] 	at com.amazonaws.http.AmazonHttpClient$RequestExecutionBuilderImpl.execute(AmazonHttpClient.java:649)
[info] 	at com.amazonaws.http.AmazonHttpClient.execute(AmazonHttpClient.java:513)
[info] 	at com.amazonaws.services.s3.AmazonS3Client.invoke(AmazonS3Client.java:4169)
[info] 	at com.amazonaws.services.s3.AmazonS3Client.invoke(AmazonS3Client.java:4116)
[info] 	at com.amazonaws.services.s3.AmazonS3Client.headBucket(AmazonS3Client.java:1294)
[info] 	at com.amazonaws.services.s3.AmazonS3Client.doesBucketExist(AmazonS3Client.java:1251)
[info] 	at com.github.dwhjames.awswrap.s3.AmazonS3ScalaClient$$anonfun$doesBucketExist$1.apply(s3.scala:849)
[info] 	at com.github.dwhjames.awswrap.s3.AmazonS3ScalaClient$$anonfun$doesBucketExist$1.apply(s3.scala:849)
[info] 	at com.github.dwhjames.awswrap.s3.AmazonS3ScalaClient$$anon$1$$anonfun$run$1.apply(s3.scala:700)
[info] 	at scala.util.Try$.apply(Try.scala:192)
[info] 	at com.github.dwhjames.awswrap.s3.AmazonS3ScalaClient$$anon$1.run(s3.scala:699)
[info] 	at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1142)
[info] 	at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:617)
[info] 	at java.lang.Thread.run(Thread.java:745)
[info] Caused by: org.apache.http.conn.ConnectionPoolTimeoutException: Timeout waiting for connection from pool
[info] 	at org.apache.http.impl.conn.PoolingHttpClientConnectionManager.leaseConnection(PoolingHttpClientConnectionManager.java:286)
[info] 	at org.apache.http.impl.conn.PoolingHttpClientConnectionManager$1.get(PoolingHttpClientConnectionManager.java:263)
[info] 	at sun.reflect.GeneratedMethodAccessor10.invoke(Unknown Source)
[info] 	at sun.reflect.DelegatingMethodAccessorImpl.invoke(DelegatingMethodAccessorImpl.java:43)
[info] 	at java.lang.reflect.Method.invoke(Method.java:498)
[info] 	at com.amazonaws.http.conn.ClientConnectionRequestFactory$Handler.invoke(ClientConnectionRequestFactory.java:70)
[info] 	at com.amazonaws.http.conn.$Proxy20.get(Unknown Source)
[info] 	at org.apache.http.impl.execchain.MainClientExec.execute(MainClientExec.java:190)
[info] 	at org.apache.http.impl.execchain.ProtocolExec.execute(ProtocolExec.java:184)
[info] 	at org.apache.http.impl.client.InternalHttpClient.doExecute(InternalHttpClient.java:184)
[info] 	at org.apache.http.impl.client.CloseableHttpClient.execute(CloseableHttpClient.java:82)
[info] 	at org.apache.http.impl.client.CloseableHttpClient.execute(CloseableHttpClient.java:55)
[info] 	at com.amazonaws.http.apache.client.impl.SdkHttpClient.execute(SdkHttpClient.java:72)
[info] 	at com.amazonaws.http.AmazonHttpClient$RequestExecutor.executeOneRequest(AmazonHttpClient.java:1190)
[info] 	at com.amazonaws.http.AmazonHttpClient$RequestExecutor.executeHelper(AmazonHttpClient.java:1030)
```

The error is informative in that it tells you that you've run out of connections in your client's pool and that while you were waiting for one to available a time out happened. The error is less helpful in that it doesn't actually tell you where in _your own code_ the exception happened.

#### The problem code:

Luckily for me, I already knew where to look since we abstract all the parts of the system that talk to S3 into a service layer behind some traits. And also luckily for me the code to deal with this is rather small. So, within a short period of time I found myself looking at this method:

```
	def downloadFiles(bucket: String, prefix: String, objectFilter: String => Boolean, target: Path) = {
		for {
			bucketExists <- s3.doesBucketExist(bucket)
			if bucketExists
			objectListing <- s3.listObjects(bucket, prefix)
			s3objectSummaries = getAllObjectSummaries(objectListing)
			s3Objects <- Future.sequence {
				s3objectSummaries.filter { s3ObjectSummary =>
					objectFilter(s3ObjectSummary.getKey())
				}.map { s3ObjectSummary =>
					s3.getObject(bucket, s3ObjectSummary.getKey())
				}
			}
		} yield {
			s3Objects.foreach { s3Object =>
				try {
					val s3ObjectInputStream = s3Object.getObjectContent()
					val targetForFile = target.resolve(s3Object.getKey().split("/").last)
					Files.copy(s3ObjectInputStream, targetForFile, StandardCopyOption.REPLACE_EXISTING)
				} catch {
					case i: IOException =>
						val fullTrace = StackTraceHelper.getFullStackTrace(i)
						Logger.error(s"Could not download ${bucket}:${s3Object.getKey()}: ${fullTrace}")
				} finally {
					s3Object.close()
				}
			}
		}
	}
  ```
  
This method isn't too much to look at. For some context, we have arguments that are specifying what bucket in S3 we're looking at, and also the prefix (folder) in S3 we'll be downloading files from. Unsurprisingly we take in a path of where we'll end up saving the files we find, and also we take in a predicate function that will decide if we actually download a certain file or not based on the key (file name). 

The code we need to understand to understand where the problem was is this:

```
	Future.sequence {
		s3objectSummaries.filter { s3ObjectSummary =>
			objectFilter(s3ObjectSummary.getKey())
		}.map { s3ObjectSummary =>
			s3.getObject(bucket, s3ObjectSummary.getKey())
		}
	}
```

`Future.sequence` is a powerful construct we can use to perform some method in parralel accross all the items in a list. If you want to visualize it, think of "fanning out" performing operations on each individual item, and then "fanning in" and combining all the computed results into a single list. 

![future sequence](https://user-images.githubusercontent.com/1691564/33400177-2743400a-d523-11e7-8c02-1a08d483b31a.png)

So, in the above code we're performing the `s3.getObject` in parralel for all the things we want to download. This _will_ work without error _as long as the number of objects being downloaded isn't greater than the number of connections we have available_. It will look roughly like this:

![success](https://user-images.githubusercontent.com/1691564/33400178-2836b94c-d523-11e7-8851-3f4f5ecaaee3.png)

You can see that we have enough connections, so we download everything and then progress to the next stage of the method and perform some operation (downloading the file in the yield) and then we release the connections. 

But if the number of objects to download in our list is greater than the number of connections we have for our client, we get this scenario:

![fail](https://user-images.githubusercontent.com/1691564/33400320-b0c8a52c-d523-11e7-9014-cc62864b8180.png)

#### The Fix

As noted in the picture, we fail because we never get around to the part of the code that releases the resources. We've starved our pool because the code that acquired the connections was waiting to do things before releasing. The fix for this is pretty easy. We simply need to _not wait_ to operate and return the connection. So, instead of downloading and releasing in the yield, we'll push this into the `Future.sequence`:

```
	def downloadFiles(bucket: String, prefix: String, objectFilter: String => Boolean, target: Path) = {
		for {
			bucketExists <- s3.doesBucketExist(bucket)
			if bucketExists
			objectListing <- s3.listObjects(bucket, prefix)
			s3objectSummaries = getAllObjectSummaries(objectListing)
			s3Objects <- {
				Future.sequence {
					s3objectSummaries.filter { s3ObjectSummary =>
						objectFilter(s3ObjectSummary.getKey())
					}.map { s3ObjectSummary =>
						s3.getObject(bucket, s3ObjectSummary.getKey()).map { s3Object =>
							try {
								val s3ObjectInputStream = s3Object.getObjectContent()
								
								try {
									val targetForFile = target.resolve(s3Object.getKey().split("/").last)
									Files.copy(s3ObjectInputStream, targetForFile, StandardCopyOption.REPLACE_EXISTING)
								} finally {
									s3ObjectInputStream.close()
								}
							} catch {
								case i: IOException => {
									val fullTrace = StackTraceHelper.getFullStackTrace(i)
									Logger.error(s"Could not download ${bucket}:${s3Object.getKey()}: ${fullTrace}")
								}
							} finally {
								s3Object.close()
							}
						}
					}
				}
			}
		} yield ()
	}
```

Doing this will ensure that once a Future we've started during the "fan out" stage is completed, that we've released the connection to AWS's client pool and the next future can run with it so that we can "fan in" every object we're iterating over. 

Doing this prevents the starvation and ends up with us downloading all our objects without running into that exception message anymore. Useful right?

#### Take away

When you use anything that has limited resources, make sure that you're returning those resources as soon as you possibly can. It's obvious to do that when you're working with critical paths, but it can be something easily overlooked if you're not careful. Such as when a connection pool is managed by a client library and said client library returns resources that directly affect its internal state (`S3Object`s are the culprit here since they _must_ be closed in order to return a connection). 

#### For reference:

My build dependencies and versions of the library I'm using:

```
"com.mchange" % "mchange-commons-java" % "0.2.14",
"com.github.dwhjames" %% "aws-wrap" % "0.12.1",
"com.amazonaws" % "aws-java-sdk-s3" % "1.11.129"
```

And the method I'm referring to that gets all my object summaries looks like this for your own reference or if you need it:

```
	@scala.annotation.tailrec
	private def getAllObjectSummaries(objectListing: ObjectListing, prev: List[S3ObjectSummary] = Nil): List[S3ObjectSummary] = {
		val s3objectSummaries = objectListing.getObjectSummaries()
		val data = prev ++ s3objectSummaries.toList
		if (!objectListing.isTruncated) {
			data
		} else {
			val nextObjectListing = s3.client.listNextBatchOfObjects(objectListing)
			getAllObjectSummaries(nextObjectListing, data)
		}
	}
```

Also while working on this I made a seperate execution context for the client to use using the mchange library mentioned in the above so I could limit the parrellism of the I/O work for S3, that looks like this:

```
import com.github.dwhjames.awswrap.s3.AmazonS3ScalaClient

import java.util.concurrent.Executors
import com.mchange.v3.concurrent.BoundedExecutorService

...
	private final val executionContextToLimitS3Download = new BoundedExecutorService(
		Executors.newFixedThreadPool(10), // a pool of ten Threads
		50, // block new tasks when 50 are in process
		25 // restart accepting tasks when the number of in-process tasks falls below 25
	)

	/** Our internal S3 client using the aws-wrap library */
	private final val s3 = new AmazonS3ScalaClient(credentials, executionContextToLimitS3Download)
```
