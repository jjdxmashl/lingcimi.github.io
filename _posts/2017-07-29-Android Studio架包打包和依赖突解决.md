---
title: Android Studio架包打包和依赖冲突解决
date: 2017-07-29 08:30:00
categories: Android
tags: gradle
description: 
img:  

---

### 一、为什么使用aar打包，而不是jar ###

随着Android Studio的使用越来越广泛，使用aar打包这种方式也越来越可行实际。
jar打包只打源代码，像资源文件不会打包，而aar恰恰是jar打包的补充完善，它会把代码和资源统统打包进一个文件。

### 二、资源命名问题 ###

既然需要打包为sdk提供出来使用，那就要打包得有水准一点。别把常用的第三方的jar集成到aar里面，这样很容易会造成冲突的。

#### （1）aar中有依赖的架包 ####
①依赖的第三方资源最好是使用jcenter远程仓库的依赖，如果远程仓库上没有；例如下载的类库，直接使用compile进行依赖。

	compile 'com.dou361.download:jjdxm-download:1.0.1'

②自己上传一个到jcenter远程仓库上，学习下打包aar到jcenter也是很有必要的；例如经常用到的微信分享登录的架包libammsdk.jar，打包到jcenter上，以后项目中需要用到就添加以下代码即可：

	compile 'com.dou361.winchat:jjdxm-winchat:1.0.0'


③当然了，如果你实在是嫌麻烦那就直接打包到aar上，如果APP中引用别的aar和你的aar有相同的架包那就悲剧了，不过还是有解决的办法，后面会有相关的处理办法。

#### （2）资源命名 ####

资源命名最好通通加上你的项目名字前缀，比如图片资源、string、color、dimens、layout等等，反正res目录下所有文件最好都使用统一的加前缀命名，防止跟宿主app下的资源重复，因为aar引用跟源码引用起到的效果一样一样的，所有很容易出现资源重复引用的问题，因此加上前缀非常有必要。可以有效避免架包内部部分内容冲突的尴尬情况。

### 三、jar第三方库重复引用问题 ###

同一个项目下多次引用同一个第三方jar库会出现重复引用的编译问题，所以只要保证引用一次就ok了，但是如果你的库引用的第三方库比较多时，就会碰到很尴尬的问题。

比如你的aar库引用了一个第三方库，这个库是本地库，宿主app中也引用了这个第三方库，这时你把你的aar库所引用的那个第三方库引用方式设置成provide，provide的意思是不打包进去，这样没问题，但是你想过一个问题没，如果别人使用你的aar，他不知道你的aar库需要包含那个第三方库，如果他在自己的宿主app中没有引用进来那个库，好吧，这会导致运行时崩溃，崩溃的日志提示找不到一些类定义，总不能给别人提供aar库还要额外提供一堆第三库，然后告诉他把这些库添加进主工程里，这种方式可行，但是很不友好。

#### 以下是第三方库重复引用冲突解决方法： ####

#### 1.本地libs目录中的jar和远程仓库中compile的jar冲突。 ####

解决办法优先删除libs目录中的jar保留compile的引用，也可以删除compile引用保留本地libs目录的。

#### 2.本地libs目录中两个jar，远程仓库compile两个jar或者本地libs目录和远程仓库compile之间的同一jar不同版本冲突。 ####

解决办法优先删除低版本的保留高版本的，其次是优先删除本地libs的保留compile的。这个要根据APP的情况而定，保留高版本的jar可能会引起原来其他地方引用低版本方法变迁或者路径变更出问题，在两者间择优，同步升级其他相关jar的版本，或者同步降级其他相关jar的版本。

#### 3.引用jar和jar、aar和jar或者aar和aar的冲突。 ####

解决办法优先删除jar的引用，保留aar的，如果两个都是aar或者两个都是jar怎么办？当然也是可以删除aar或者jar内部中冲突的

（1）aar中冲突的部分是集成到aar中的，这种情况是比较多，如果是远程仓库的需要下载下来，改为本地引用，有人可能不会下载，其实原来你使用远程仓库引用同步以后已经是下载好在本地的了，这里举一个案例：

	compile 'com.dou361.update:jjdxm-update:1.0.3' 

windows系统 C:\Users\你的计算机用户名\.gradle\caches\modules-2\files-2.1目录下找到compile的groupId com.dou361.update文件，完整的目录：

	C:\Users\Admin\.gradle\caches\modules-2\files-2.1\com.dou361.update\jjdxm-update\1.0.3\fb8f27de2ce0371476023b1dcf4a6096d19e5810\jjdxm-update-1.0.3.aar

 复制出来用即可，本地的libs中的aar，其实就是一个压缩包，用解压工具打开把冲突的部分删除即可；引用如下：

	repositories {
	    flatDir {
	        dirs 'libs'
	    }
	}

	compile (name:'jjdxm-update',ext:'aar')


（2）jar中冲突的部分是jar内部部分内容，和第（1）的处理方法类似，这里要是没有说可能会想不到，jar包其实也是一个压缩包，因此内部的冲突的内容是可以通过解压工具打开去删除的。

（3）如果冲突的jar是采用远程依赖方式引用，那就可以直接使用代码去屏蔽冲突的部分例如：

	compile ('com.dou361.update:jjdxm-update:1.0.3'){
        exclude group: 'com.dou361.download',module:'jjdxm-download'
    }

(4)比较极端的情况，部分类文件目录名称重复，但是两边的方法功能不一样，通过解压工具删除两边重复的内容，然后新建一个目录相同名称相同的类到自己的主应用程序中，把两边的功能都实现在新建的这个类中。