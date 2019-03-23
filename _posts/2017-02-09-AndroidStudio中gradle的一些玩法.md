---
title: Android Studio中gradle的一些玩法
date: 2017-02-09 20:30:00
categories: AndroidStudio
tags: gradle语法
description: 有一些人反映在github上下载的项目或者作为module导入你的项目中，运行不起来。或者几经折腾才勉强运行起来，不知道你有没有这种感觉，如果你有这种困惑不妨继续阅读下文，相信本文能帮到你。
photos: image-1.png

---

## 前言
有一些人反映在github上下载的项目或者作为module导入你的项目中，运行不起来。或者几经折腾才勉强运行起来，不知道你有没有这种感觉，如果你有这种困惑不妨继续阅读下文，相信本文能帮到你。我一直认为从github或者网上搜索到自己需要的案例，下载下来并且能快速运行起来是作为一个Android开发者最基本的能力要求，可能挖的坑多了以后，已经懂得去处理了吧。只能说github上的项目除了一些项目本身提交不完整，实在是缺三拉四的，其余百分之九十九点九都是可以正常运行的。在如何快速运行一个github的demo之前，先来讲解下Android Studio中gradle的一些玩法。

## Android Studio项目中两种gradle文件
### 1.根目录的build.gradle
新建一个Android Studio项目，根目录会自动生成一个build.gradle文件，主要是配置一些插件和默认的依赖类库的仓库。

	buildscript {
	    repositories {
	        jcenter()
	    }
	    dependencies {
	        classpath 'com.android.tools.build:gradle:2.2.3'
	
	        // NOTE: Do not place your application dependencies here; they belong
	        // in the individual module build.gradle files
	    }
	}
	
	allprojects {
	    repositories {
	        jcenter()
	    }
	}
	
	task clean(type: Delete) {
	    delete rootProject.buildDir
	}

### 2.module中的根目录的build.gradle
Android Studio这个IDE不同于eclipse，eclipse启动打开的是工作空间，一个工作空间下可以包括零个多个工程项目。而Android Studio则是单个工程项目启动，一个工程项目中包括一个或多个module，其中有一个build.gradle文件中头部为apply plugin: 'com.android.application'标识的为应用程序module，其余以apply plugin: 'com.android.library'标识为Android Library。在编译的时候，所有module的build.gradle依赖的类库都会合并为一个。

主程序的build.gradle文件

	apply plugin: 'com.android.application'//作为主程序的标识
	
	android {
	    compileSdkVersion 24//当前向前兼容sdk的版本
	    buildToolsVersion "24.0.3"//构建工具的版本
	    defaultConfig {
	        applicationId "com.dou361.demogradle"//应用程序的id，在市场上使用的包名
	        minSdkVersion 15//最小sdk版本支持
	        targetSdkVersion 24//目标sdk版本
	        versionCode 1//应用程序版本号
	        versionName "1.0"//应用程序版本名称
	        testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
	    }
	    buildTypes {
	        release {
	            minifyEnabled false//混淆是否开启
	            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
	        }
	    }
	}
	
	dependencies {//依赖外部的类库
	    compile fileTree(dir: 'libs', include: ['*.jar'])
	    androidTestCompile('com.android.support.test.espresso:espresso-core:2.2.2', {
	        exclude group: 'com.android.support', module: 'support-annotations'
	    })
	    compile 'com.android.support:appcompat-v7:24.2.1'
	    testCompile 'junit:junit:4.12'
	}

sdk版本设置规则

	minSdkVersion <= targetSdkVersion <= compileSdkVersion
	minSdkVersion <= buildToolsVersion <= compileSdkVersion

Android Library中的build.gradle文件

	apply plugin: 'com.android.library'
	
	android {
	    compileSdkVersion 24
	    buildToolsVersion "24.0.3"
	
	    defaultConfig {
	        minSdkVersion 15
	        targetSdkVersion 24
	        versionCode 1
	        versionName "1.0"
	
	        testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
	
	    }
	    buildTypes {
	        release {
	            minifyEnabled false
	            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
	        }
	    }
	}
	
	dependencies {
	    compile fileTree(dir: 'libs', include: ['*.jar'])
	    androidTestCompile('com.android.support.test.espresso:espresso-core:2.2.2', {
	        exclude group: 'com.android.support', module: 'support-annotations'
	    })
	    compile 'com.android.support:appcompat-v7:24.2.1'
	    testCompile 'junit:junit:4.12'
	}

## gradle的一些玩法
### 1.全局变量的使用
不知道你有没有注意到，在多个module的情况下，不同module的build.gradle文件中有部分配置项类似，或者依赖的类库，有部分是相同的，在维护上不是很方便，这个时候就可以考虑统一配置。在项目根目录的build.gradle文件中添加以下代码和android{}同级

	ext {
	    //全局变量控制，可在module中的build.gradle文件通过rootProject.ext.xxx开头来使用
	    compileSdkVersion = 24
	    buildToolsVersion = '24.0.3'
	    supportVersion = '24.2.1'
	    //主程序版本
	    targetSdkVersion = 24
	    minSdkVersion = 15
	    versionCode = 1
	    versionName = "v1.0.0"
	    //library版本
	    jjdxm_minSdkVersion = 9
	    jjdxm_versionCode = 1
	    jjdxm_versionName = "v1.0.0"
	    jjdxm_v4 = 'com.android.support:support-v4:'+supportVersion
	    jjdxm_v7 = 'com.android.support:appcompat-v7:'+supportVersion
	    jjdxm_design = 'com.android.support:design:'+supportVersion
	    jjdxm_cardview = 'com.android.support:cardview:'+supportVersion
	    jjdxm_recyclerview = 'com.android.support:recyclerview-v7:'+supportVersion
	}

全局变量控制，可在module中的build.gradle文件通过rootProject.ext.xxx开头来使用，在所有module的build.gradle文件中配置以上变量，以后在维护项目的时候，只需要在根目录这个文件中修改对应的配置项即可是不是很简单，可能当前你还觉得这样配置很麻烦，在使用AS过程中相信大家都遇到过架包冲突的情况，例如主程序中依赖了com.android.support:appcompat-v7:23.3.0，而其他module中依赖com.android.support:appcompat-v7:24.2.1的版本，这个时候就会引起冲突，而通过上面的全局配置，只需要在所有的module中配置上rootProject.ext.jjdxm_v7就都统一了不仅解决了冲突问题，而且可以随意切换不同版本的v7类库。

### 2.配置打包用的签名
主要有接过分享或者授权登录功能的都应该知道，像微信或者微博的分享和授权登录提供sdk，只有在指定的签名下才能生效，而我们平时开发都习惯使用默认的androidkeystore打包签名，这个时候想要测试分享或者登录功能就需要手动去打包指定keystore的签名。非常影响开发效率，这个时候可以通过配置gradle，根据release或者是debug打包指定的签名。

项目根目录新建一个签名用到的密码管理文件signing.properties

	signing.alias=dou361			#release
	signing.password=dou361			#release
	signing.jjdxm_alias=dou361		#debug
	signing.jjdxm_password=dou361	#debug


在主程序build.gradle的apply plugin: 'com.android.application'下面添加

	Properties props = new Properties()
	props.load(new FileInputStream(file(rootProject.file("signing.properties"))))

在android{}节点里面添加

	signingConfigs {
        release {
            keyAlias props['signing.alias']
            keyPassword props['signing.password']
            storeFile file(rootProject.file("debug.keystore"))
            storePassword props['signing.password']
        }

        debug {
            keyAlias props['signing.jjdxm_alias']
            keyPassword props['signing.jjdxm_password']
            storeFile file(rootProject.file("debug.keystore"))
            storePassword props['signing.jjdxm_password']
        }
    }
	buildTypes {
        debug {
            signingConfig signingConfigs.debug
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }

        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }

最后所有文件如下
根目录build.gradle

	// Top-level build file where you can add configuration options common to all sub-projects/modules.
	
	buildscript {
	    repositories {
	        jcenter()
	    }
	    dependencies {
	        classpath 'com.android.tools.build:gradle:2.2.3'
	
	        // NOTE: Do not place your application dependencies here; they belong
	        // in the individual module build.gradle files
	    }
	}
	
	allprojects {
	    repositories {
	        jcenter()
	    }
	}
	
	ext {
	    //全局变量控制，可在module中的build.gradle文件通过rootProject.ext.xxx开头来使用
	    compileSdkVersion = 24
	    buildToolsVersion = '24.0.3'
	    supportVersion = '24.2.1'
	    //主程序版本
	    targetSdkVersion = 24
	    minSdkVersion = 15
	    versionCode = 1
	    versionName = "v1.0.0"
	    //library版本
	    jjdxm_minSdkVersion = 9
	    jjdxm_versionCode = 1
	    jjdxm_versionName = "v1.0.0"
	    jjdxm_v4 = 'com.android.support:support-v4:'+supportVersion
	    jjdxm_v7 = 'com.android.support:appcompat-v7:'+supportVersion
	    jjdxm_design = 'com.android.support:design:'+supportVersion
	    jjdxm_cardview = 'com.android.support:cardview:'+supportVersion
	    jjdxm_recyclerview = 'com.android.support:recyclerview-v7:'+supportVersion
	}
	
	task clean(type: Delete) {
	    delete rootProject.buildDir
	}

主程序的build.gradle

	apply plugin: 'com.android.application'
	
	Properties props = new Properties()
	props.load(new FileInputStream(file(rootProject.file("signing.properties"))))
	
	android {
	    signingConfigs {
	        release {
	            keyAlias props['signing.alias']
	            keyPassword props['signing.password']
	            storeFile file(rootProject.file("debug.keystore"))
	            storePassword props['signing.password']
	        }
	
	        debug {
	            keyAlias props['signing.jjdxm_alias']
	            keyPassword props['signing.jjdxm_password']
	            storeFile file(rootProject.file("debug.keystore"))
	            storePassword props['signing.jjdxm_password']
	        }
	    }
	    compileSdkVersion rootProject.ext.compileSdkVersion
	    buildToolsVersion rootProject.ext.buildToolsVersion
	
	    defaultConfig {
	        applicationId "com.dou361.demogradle"
	        minSdkVersion rootProject.ext.minSdkVersion
	        targetSdkVersion rootProject.ext.targetSdkVersion
	        versionCode rootProject.ext.versionCode
	        versionName rootProject.ext.versionName
	        multiDexEnabled true
	        ndk {
	            // 指定要ndk需要兼容的架构(这样其他依赖包里mips,x86,armeabi,arm-v8之类的so会被过滤掉)
	            abiFilters "armeabi-v7a", "armeabi"
	        }
	        testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
	    }
	    buildTypes {
	        debug {
	            signingConfig signingConfigs.debug
	            minifyEnabled false
	            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
	        }
	
	        release {
	            signingConfig signingConfigs.release
	            minifyEnabled false
	            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
	        }
	    }
	}
	
	repositories { flatDir { dirs 'libs' } }
	
	dependencies {
	    compile fileTree(dir: 'libs', include: ['*.jar'])
	    androidTestCompile('com.android.support.test.espresso:espresso-core:2.2.2', {
	        exclude group: 'com.android.support', module: 'support-annotations'
	    })
	    testCompile 'junit:junit:4.12'
	    compile rootProject.ext.jjdxm_v7
	    compile rootProject.ext.jjdxm_design
	}

其他module的build.gradle

	apply plugin: 'com.android.library'
	
	android {
	    compileSdkVersion rootProject.ext.compileSdkVersion
	    buildToolsVersion rootProject.ext.buildToolsVersion
	
	    defaultConfig {
	        minSdkVersion rootProject.ext.jjdxm_minSdkVersion
	        targetSdkVersion rootProject.ext.targetSdkVersion
	        versionCode rootProject.ext.jjdxm_versionCode
	        versionName rootProject.ext.jjdxm_versionName
	
	        testInstrumentationRunner "android.support.test.runner.AndroidJUnitRunner"
	
	    }
	    buildTypes {
	        release {
	            minifyEnabled false
	            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
	        }
	    }
	}
	
	dependencies {
	    compile fileTree(dir: 'libs', include: ['*.jar'])
	    androidTestCompile('com.android.support.test.espresso:espresso-core:2.2.2', {
	        exclude group: 'com.android.support', module: 'support-annotations'
	    })
	    testCompile 'junit:junit:4.12'
	    compile rootProject.ext.jjdxm_v7
	    compile rootProject.ext.jjdxm_design
	}

keystore密码管理文件signing.properties

	signing.alias=dou361
	signing.password=dou361
	signing.jjdxm_alias=dou361
	signing.jjdxm_password=dou361

## github上项目下载运行
之所以先介绍gradle的一些配置，是因为一个AS项目的启动基本上都是在根据gradle文件里面的配置去联网同步内容下来的。先了解gradle的一些配置和具体的用法以后会比较容易理解。其中类库内容同步失败、架包冲突、sdk版本等问题都可能会导致项目运行不起来。所以从github上面下载下来的项目，不要着急立马打开项目，要是网络不好你会发现一只卡在同步中的界面，这个是因为不同开发者环境不尽相同导致的。

既然开发环境不同，那就可以考虑修改为自己已有的环境，可以省去大部分联网同步操作，在网络差的情况是很明智的一个举动，主要有以下几个步骤：
### 1.先修改根目录的build.gradle配置
根目录里面无非就一个gradle版本的差异，修改为你当前已有的版本，例如下载的demo是

	classpath 'com.android.tools.build:gradle:2.2.3'

版本号2.2.3，而你的环境只有2.1.0的，那就可以修改为

	classpath 'com.android.tools.build:gradle:2.1.0'

版本跨越不大的情况下，可以采用以上做法，如果有部分方法不可用，则还是建议联网下载，一劳永逸。
### 2.module目录中的build.gradle配置
大部分module都会依赖到v4 v7等一些support家族的类库，这个时候有两种情况会导致出问题，一是module之间的v4包版本号不一致，二是v4版本你的环境没有。
针对第一种情况，导入别人的module到你的项目中经常会遇到，解决办法是参考上面的配置全局的依赖或者移除重复的；
针对第二种情况，打开别人的项目经常会遇到，解决办法是修为你环境已有的版本或者联网同步下载。

修改完所有module的build.gradle文件以后，这个时候在打开项目，有个别不存在类库会同步去下载，完成以后基本上都是可以运行起来的。
