---
title: Android Studio中gradle的一些玩法(2)
date: 2017-07-11 08:30:00
categories: Android
tags: 开源
description: 
img:  

---

开篇前先唠叨几句，随着谷歌对外声明停止对eclipse的支持和维护，力推Android Studio（后文简称：as）开发工具之后，as的普及也就越来越广了，GitHub上面的Android项目放眼望去大多都是as的，相信大多数码友都有在GitHub上搜索案例代码的习惯，那么问题就来了，由于每个人的开发环境不尽相同，下载下来的demo能否正常跑起来的问题估计难倒不少人吧，作为一个程序员，我觉得GitHub上面下载的demo源码并让其运行起来是一个很基本的要求。

as的项目运行不起来也就那一个问题，build构建任务不通过，而构建用到的工具则是gradle，这就得聊聊Java工具的发展史了，推荐各位去看下[海乃百川](http://blog.csdn.net/bailyzheng)的[Java构建工具：Ant vs Maven vs Gradle](http://blog.csdn.net/bailyzheng/article/details/48395949),总的来说Java构建工具按照时间发展分为三代三大构建工具：

	第一代：Ant
	第二代：Maven
	第三代：Gradle

这三大工具我都有用过，有兴趣的可以自行去了解。目前这三大工具都有人在使用，工具的使用还是得看使用者，新的东西总少不了学习的成本，从更新换代的角度来说，个人是觉得Gradle的使用更加简洁方便了。闲话不多说，接下来就介绍下gradle的一些语法的使用以及让一个项目正常运行起来。

可以先回顾下我的前一篇文章[Android Studio中gradle的一些玩法](http://www.jianshu.com/p/17ee08af5f45)

### as项目中的gradle文件
一个as项目包括以下gradle文件
#### settings.gradle
settings文件中，在新建一个module（可以看做一个子项目或者模块）时，会自动添加一段代码

	include ':app'

意思是将这个module包含在当前项目中格式为include ':module名称'，如果不想让一个module关联进来，就可以手动删除对应的代码段，或者图像工具中删除,在as项目中使用快捷按键Ctrl+Alt+Shift+S，

点击减号移除即可

#### 根目录build.gradle
build文件作用
指定代码仓库

	repositories {
        google()//as3.0后默认的google仓库
        jcenter()//默认的jcenter仓库
    }

指定依赖的gradle版本获取其他插件的版本

	dependencies {
        classpath 'com.android.tools.build:gradle:3.0.0-alpha9'//gradle插件的版本
        classpath 'com.jakewharton:butterknife-gradle-plugin:8.5.0'//其他插件的版本
    }

#### modules中的build.gradle
build文件的第一行代码决定module的性质
#### 主程序module
第一行代码：

	apply plugin: 'com.android.application'


####library库module
第一行代码：

	apply plugin: 'com.android.library'

### 全局变量配置
一个项目中，如果有多个module时，由于不同module中可能依赖到相同的类库，而这个类库的版本或者依赖方式等不同，就有可能造成依赖冲突，这里不做更多的解释，如果想了解更多冲突解决方面的内容，可以浏览我写的另外一篇文章[Android Studio中架包打包和依赖冲突解决](http://www.jianshu.com/p/d7c3b6bd25c7)
在根目录的build文件中，添加以下代码


定义全局变量方便统一使用和配置

	ext {
	    compileSdkVersion = 26
	    //the build tools version
	    buildToolsVersion = "26.0.0"
	    //the support library version
	    supportLibVersion = "26.0.0-beta1"
	
	    applicationId = "com.xxx.xxx"
	    minSdkVersion = 15
	    targetSdkVersion = 26
	    versionCode = 1
	    versionName = "v0.0.1"
	    //library version
	    jjdxm_minSdkVersion = 15
	    jjdxm_versionCode = 1
	    jjdxm_versionName = "v0.0.1"
	
	    jjdxm_v4 = "com.android.support:support-v4:${supportLibVersion}"
	    jjdxm_v7 = "com.android.support:appcompat-v7:${supportLibVersion}"
	    jjdxm_design = "com.android.support:design:${supportLibVersion}"
	    jjdxm_recyclerview = "com.android.support:recyclerview-v7:${supportLibVersion}"
	    jjdxm_vector = "com.android.support:support-vector-drawable:${supportLibVersion}"
	    jjdxm_constraint = "com.android.support.constraint:constraint-layout:1.0.2"
	}

### 指定签名配置

### 多渠道配置