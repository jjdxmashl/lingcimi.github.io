---
title: This Toast was not created with Toast.makeText()
date: 2017-07-30 08:30:00
categories: Android
tags: 开源
description: 
img:  

---

这里先抛出错误代码：

	java.lang.RuntimeException: This Toast was not created with Toast.makeText()

大家都用过Toast，不过每次调用都使用以下方式，也挺麻烦的：

	Toast.makeText(context,msg,Toast.LENGTH_SHORT).show();

这个时候相信会想到封装一个工具类，通过一个方法直接调用，例如下面的代码：

	public class ToastUtils {
	
	    private static Toast mToast;
	
	    public static void showToast(Context context, String msg){
	        if(null == mToast){
	            mToast = new Toast(context);
	        }
	        mToast.setDuration(Toast.LENGTH_SHORT);
	        mToast.setText(msg);
	        mToast.show();
	    }
	
	    public static void showToast(Context context, View view){
	        if(null == mToast){
	            mToast = new Toast(context);
	        }
	        mToast.setDuration(Toast.LENGTH_SHORT);
	        mToast.setView(view);
	        mToast.show();
	    }
	}

咋眼一看好像没什么问题，mToast对象如果为空就创建，如果不为空就复用。其实不然，稍有不慎就会抛出以上异常。This Toast was not created with Toast.makeText()这里解释下为什么会出现这个异常，当执行showToast(Context context, String msg)方法之后再执行showToast(Context context, View view)方法，这个时候是没有问题的。

反过来执行则会出问题

###  问题原因：

1.这个是因为先执行showToast(Context context, View view)方法之后；

2.mToast.setView(view);把Toast中的contentView替换为自定义的view了；

3.而再执行showToast(Context context, String msg)方法之后，mToast对象不为空，复用了前面的对象；

4.mToast.setText(msg);这句代码里面的实现是给指定的TextView设置msg文本，而这个指定的TextView在默认的contentView中，这个时候contentView已经修改为自定义的view了，里面已经没有指定的那个TextView了呢。


### 解决方法：
知道问题原因，再去处理就好办多了，mToast对象分开去复用，将setText的方法归到一个类用同一个对象，setView的方法归到另一个对象去处理。

	public class ToastUtils {
	
	    private static Toast mTextToast;
	    private static Toast mViewToast;
	
	    public static void showToast(Context context, String msg){
	        if(null == mTextToast){
	            mTextToast = new Toast(context);
	        }
	        mTextToast.setDuration(Toast.LENGTH_SHORT);
	        mTextToast.setText(msg);
	        mTextToast.show();
	    }
	
	    public static void showToast(Context context, View view){
	        if(null == mViewToast){
	            mViewToast = new Toast(context);
	        }
	        mViewToast.setDuration(Toast.LENGTH_SHORT);
	        mViewToast.setView(view);
	        mViewToast.show();
	    }
	}