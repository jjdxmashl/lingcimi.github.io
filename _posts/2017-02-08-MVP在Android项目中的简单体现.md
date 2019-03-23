---
title: MVP在Android项目中的简单体现
date: 2017-02-08 08:14:39
categories: Android
tags: MVP
description: MVP模式是一种架构模式，也是一种经典的界面模式。MVP中的M代表Model, V是View, P是Presenter。

---

通过简单案例来说明MVP的使用，retrofit2+rxjava+mvp
项目地址：[http://www.github.com/jjdxmashl/jjdxm_demomvp](http://www.github.com/jjdxmashl/jjdxm_demomvp)

![](https://raw.githubusercontent.com/jjdxmashl/online_image/master/demomvp/icon01.gif)

##前言
###什么是MVP？
MVP模式是一种架构模式，也是一种经典的界面模式。MVP中的M代表Model, V是View, P是Presenter。

**Model 一部分是处理业务逻辑，一部分是提供View显示的数据。**
**View 代表的是一个接口，一个将UI界面提炼而抽象出来的接口。**
**Presenter Model和View之间的桥梁**
###MVP在Android项目中的其中一种体现方式
经过查阅网上一些MVP的文章之后，<font color=#ff0000>有部分案例在presenter中实现具体的逻辑或者把Model单纯的看作是具体的Bean</font>，**个人觉得是不太准确的**，<font color=#00ff00>MVX（MVC、MVP和MVVM）中，M的职责都应该包含两部分业务逻辑和提供View显示的数据，而X的部分则是为了实现UI界面和业务逻辑解耦的桥梁</font>，在Android项目中使用MVP架构模式，以下这两种架构方式是我比较能接受和认可的。

![](https://raw.githubusercontent.com/jjdxmashl/online_image/master/demomvp/icon01.png)

按照模块分包

	|----包名
	|	|----base
	|	|		BaseActivity		Activity基类
	|	|		BaseMVPActivity		MVP Activity基类
	|	|		BaseModel			Model基类
	|	|		BaseFragment		Fragment基类
	|	|		IBaseDelegate		简化Presenter在Activity的实现
	|	|		IBasePresenter		Presenter基类
	|	|		IBaseView			View基类
	|	|----模块名1
	|	|	|----model				业务逻辑和bean
	|	|	|		xxxModel
	|	|	|		xxxBean
	|	|	|----presenter			连接View和Model的桥梁
	|	|	|		IxxxPresenter
	|	|	|		xxxPresenter
	|	|	|----ui					UI界面相关的类
	|	|	|		xxxActivity
	|	|	|		xxxFragment
	|	|	|----view				UI界面提炼出来的接口
	|	|	|		xxxView
	|	|----模块名2

按照功能分包

	|----包名
	|	|----activity				具体Activity
	|	|		xxxActivity
	|	|----adapter					具体Adapter
	|	|		xxxAdapter
	|	|----base
	|	|		BaseActivity		Activity基类
	|	|		BaseMVPActivity		MVP Activity基类
	|	|		BaseModel			Model基类
	|	|		BaseFragment		Fragment基类
	|	|		IBaseDelegate		简化Presenter在Activity的实现
	|	|		IBasePresenter		Presenter基类
	|	|		IBaseView			View基类
	|	|----fragment				具体Fragment
	|	|		xxxFragment
	|	|----hodler					具体Holder
	|	|		xxxHodler
	|	|----model					业务逻辑和bean
	|	|		xxxModel
	|	|		xxxBean
	|	|----presenter				连接View和Model的桥梁
	|	|		IxxxPresenter
	|	|		xxxPresenter
	|	|----view					UI界面提炼出来的接口
	|	|		xxxView
	|	|----widget

##前期准备
这里使用[聚合数据](https://www.juhe.cn)提供的免费API来实现两个具体的功能历史上的今天和笑话大全，注册并实名为聚合数据的用户后，生成属于自己的用户key即可。

##快速开始
###step1 添加所需的依赖和权限

新建一个项目，在根目录的build.gradle的dependencies节点中添加，用于注解

        classpath 'com.neenbedankt.gradle.plugins:android-apt:1.8'

如图

![](https://raw.githubusercontent.com/jjdxmashl/online_image/master/demomvp/icon02.png)

主程序app module中build.gradle的第二行添加，用于注解

	apply plugin: 'com.neenbedankt.android-apt'

dependencies节点中添加

	compile 'com.android.support:appcompat-v7:24.2.1'
    compile 'com.android.support:design:24.2.1'
    //布局注解
    apt 'com.jakewharton:butterknife-compiler:8.0.1'
    compile 'com.jakewharton:butterknife:8.0.1'
    //响应式编程
    compile 'io.reactivex:rxandroid:1.1.0'
    compile 'io.reactivex:rxjava:1.1.0'
    //联网类库
    compile 'com.squareup.retrofit2:retrofit:2.1.0'
    compile 'com.squareup.retrofit2:adapter-rxjava:2.1.0'
    compile 'com.squareup.retrofit2:converter-scalars:2.1.0'
    compile 'com.dou361.retrofit2:jjdxm-retrofit-converter-fastjson:1.0.0'
    compile 'com.squareup.okhttp3:okhttp:3.3.0'

    //自定义view
    compile 'com.dou361.customui:jjdxm-customui:1.0.9'
    //recyclerview基类
    compile('com.dou361.recyclerview:jjdxm-recyclerview:1.0.2') {
        exclude group: 'com.android.support', module: 'design'
    }

如图

![](https://raw.githubusercontent.com/jjdxmashl/online_image/master/demomvp/icon03.png)

清单文件AndroidManifest.xml中，添加权限

	<uses-permission android:name="android.permission.INTERNET"/>

###step2
先写好两个网络请求方法，Observable<RepoHistory> searchHistory(String month, String day)和Observable<RepoJoke> loadJoke(String page)分别是查询历史今天方法和加载笑话列表

网络接口请求服务类

	public interface IApiService {
	
	    /** 查询历史的今天 */
	    @GET("/japi/toh")
	    Observable<RepoHistory> searchHistory(@QueryMap Map<String, String> map);
	
	    /** 加载笑话列表 */
	    @GET("/joke/content/list.from")
	    Observable<RepoJoke> loadJoke(@QueryMap Map<String, String> map);
	}

网络接口请求基类

	public class ApiBase {
	
	    /**历史上的今天 http://api.juheapi.com/japi/toh?key=7ac7e02ff7f1f8f1ccdc2f9e5dddb6be&v=1
	     * .0&month=11&day=1*/
	    /** 笑话大全 http://japi.juhe.cn/joke/content/list
	     * .from?key=d796a03545bddee0b56d913111f5f199&page=2&pagesize=10&sort=asc&time=1418745237 */
	    protected static IApiService getService() {
	        return getService(null);
	    }
	
	    protected static IApiService getService(String ip) {
	        return getService(ip, 0, 0);
	    }
	
	    protected static IApiService getService(String ip, long readTime, long connectTime) {
	        OkHttpClient client = new OkHttpClient.Builder()
	                .readTimeout(readTime <= 0 ? 30 : readTime, TimeUnit.SECONDS)
	                .connectTimeout(connectTime <= 0 ? 30 : connectTime, TimeUnit.SECONDS)
	                .build();
	        Retrofit retrofit = new Retrofit.Builder()
	                .baseUrl(ip == null ? "http://api.juheapi.com" : ip)
	                .client(client)
	                .addCallAdapterFactory(RxJavaCallAdapterFactory.create())
	                .addConverterFactory(ScalarsConverterFactory.create())
	                .addConverterFactory(FastJsonConverterFactory.create())
	                .build();
	        return retrofit.create(IApiService.class);
	    }
	}

网络接口请求工具类

	public class ApiUtils extends ApiBase {
	
	    public static Observable<RepoHistory> searchHistory(String month, String day) {
	        /**key=7ac7e02ff7f1f8f1ccdc2f9e5dddb6be&v=1.0&month=11&day=1*/
	        Map<String, String> map = new HashMap<>();
	        map.put("key", "7ac7e02ff7f1f8f1ccdc2f9e5dddb6be");
	        map.put("v", "1.0");
	        map.put("month", month);
	        map.put("day", day);
	        return getService().searchHistory(map);
	    }
	
	    public static Observable<RepoJoke> loadJoke(String page) {
	        /**key=d796a03545bddee0b56d913111f5f199&page=2&pagesize=10&sort=asc&time=1418745237*/
	        Map<String, String> map = new HashMap<>();
	        map.put("key", "d796a03545bddee0b56d913111f5f199");
	        map.put("sort", "asc");
	        map.put("time", "1418745237");
	        map.put("page", page);
	        map.put("pagesize", "10");
	        return getService().loadJoke(map);
	    }
	}
如图
![](https://raw.githubusercontent.com/jjdxmashl/online_image/master/demomvp/icon04.png)
###step3
开始架构MVP模式使用到的基类，这里没有使用网上所说的契约类xxxContract把View和Presenter写在一个类中维护，而是分开出来，主要看个人喜好，如图

![](https://raw.githubusercontent.com/jjdxmashl/online_image/master/demomvp/icon05.png)

UI界面抽象出来的接口

	public interface IBaseView {
	
	    /**
	     * 显示加载
	     */
	    void showLoading();
	
	    /**
	     * 完成加载
	     */
	    void dismiss();
	}

业务逻辑实现的基类

	public abstract class BaseModel<IP> {
	
	    protected IP mIPresenter;
	
	    public BaseModel(IP iPresenter) {
	        this.mIPresenter = iPresenter;
	    }
	
	}

连接Model和View的桥梁的基类

	public interface IBasePresenter<V extends IBaseView> {
	
	    /**绑定接口*/
	    void attachView(V view);
	
	    /**释放接口*/
	    void detachView();
	
	}

persenter和activity绑定

	public interface IBaseDelegate<V extends IBaseView, P extends IBasePresenter<V>> {
	
	    /**初始化presenter*/
	    @NonNull
	    P createPresenter();
	
	    /**获取presenter*/
	    @NonNull
	    P getPresenter();
	
	}

最后是Activity的基类

	public abstract class BaseActivity extends
	        AppCompatActivity {
	
	    protected void startActivity(Class<?> clz) {
	        Intent intent = new Intent(this, clz);
	        startActivity(intent);
	    }
	}

MVP的Activity基类

	public abstract class BaseMVPActivity<V extends IBaseView, P extends IBasePresenter<V>> extends
	        BaseActivity implements IBaseDelegate<V, P> {
	
	    protected P mPresenter;
	
	    @Override
	    protected void onCreate(Bundle savedInstanceState) {
	        super.onCreate(savedInstanceState);
	        mPresenter = createPresenter();
	    }
	
	    @NonNull
	    @Override
	    public P getPresenter() {
	        return mPresenter;
	    }
	
	    @Override
	    protected void onDestroy() {
	        mPresenter.detachView();
	        super.onDestroy();
	    }
	}

###step4
针对模块用MVP模式去架构大概有一下4个步骤

	步骤1：UI实现View方法，引用Presenter
	步骤2：Presenter调用Model，走Model具体逻辑
	步骤3：Model逻辑实现，回调Presenter方法
	步骤4：Presenter回调View，即回到UI，回调View方法

###step5
具体模块功能的实现，历史的今天模块，先创建一个HistoryActivity继承BaseMVPActivity，新建IHistoryView并实现。

####1.View的接口的抽取
抽象出来三个功能和父类IBaseView的两个方法，分别是显示加载好的数据，显示空白数据提示，检测数据提示，显示加载中提示，隐藏加载中提示。

	public interface IHistoryView extends IBaseView {
	
	    /**显示数据*/
	    void showData(List<HistoryBean> list);
	
	    /**无数据*/
	    void showEmpty();
	
	    /**检测数据*/
	    void showMessage(String msg);
	}

####2.Model的连接
对应的新建IHistoryPresenter，此接口作用是连接Model

	public interface IHistoryPresenter {
	
	    /**显示数据*/
	    void showData(List<HistoryBean> list);
	
	    /**提示无数据*/
	    void showEmpty();
	
	    /**数据检测提示*/
	    void showMessage(String msg);
	}

####3.Model的实现
具体的逻辑实现，这里只有一个方法就是查询历史今天

	public class HistoryModel extends BaseModel<IHistoryPresenter> {
	
	    public HistoryModel(IHistoryPresenter iPresenter) {
	        super(iPresenter);
	    }
	
	    public void searchHistory(String month, String day) {
	        if (TextUtils.isEmpty(month)) {
	            mIPresenter.showMessage("月份不能为空");
	            return;
	        }
	        int iMonth = Integer.valueOf(month).intValue();
	        if (iMonth <= 0 || iMonth > 12) {
	            mIPresenter.showMessage("只能输入1-12的月份");
	            return;
	        }
	        if (TextUtils.isEmpty(day)) {
	            mIPresenter.showMessage("天不能为空");
	            return;
	        }
	        int iDay = Integer.valueOf(day).intValue();
	        if (iDay <= 0 || iDay > 31) {
	            mIPresenter.showMessage("只能输入1-31的天");
	            return;
	        }
	        ApiUtils.searchHistory(month, day)
	                .observeOn(AndroidSchedulers.mainThread())
	                .subscribeOn(Schedulers.newThread())
	                .subscribe(new Action1<RepoHistory>() {
	                    @Override
	                    public void call(RepoHistory repoHistory) {
	                        if (repoHistory == null || repoHistory.getResult() == null
	                                || repoHistory.getResult().size() <= 0) {
	                            mIPresenter.showEmpty();
	                        } else {
	                            mIPresenter.showData(repoHistory.getResult());
	                        }
	                    }
	                });
	    }
	}

####4.Presenter桥梁的实现

	public class HistoryPresenter implements IBasePresenter<IHistoryView>, IHistoryPresenter {
	
	    private IHistoryView mView;
	    private HistoryModel mModel;
	
	    public HistoryPresenter(IHistoryView view) {
	        attachView(view);
	        mModel = new HistoryModel(this);
	    }
	
	    @Override
	    public void attachView(IHistoryView view) {
	        this.mView = view;
	    }
	
	    @Override
	    public void detachView() {
	        this.mView = null;
	    }
	
	
	    @Override
	    public void showData(List<HistoryBean> list) {
	        mView.dismiss();
	        mView.showData(list);
	    }
	
	    @Override
	    public void showEmpty() {
	        mView.dismiss();
	        mView.showEmpty();
	    }
	
	    @Override
	    public void showMessage(String msg) {
	        mView.showMessage(msg);
	    }
	
	
	    public void searchHistory(String month, String day) {
	        mView.showLoading();
	        mModel.searchHistory(month, day);
	    }
	}

####5.最后在HistoryActivity里面去建立连接
最后创建的类架构图如下：

![](https://raw.githubusercontent.com/jjdxmashl/online_image/master/demomvp/icon06.png)

编译运行效果图如下

![](https://raw.githubusercontent.com/jjdxmashl/online_image/master/demomvp/icon07.png)
![](https://raw.githubusercontent.com/jjdxmashl/online_image/master/demomvp/icon08.png)

同理笑话大全也一样的创建对应的文件，最后运行如下

![](https://raw.githubusercontent.com/jjdxmashl/online_image/master/demomvp/icon09.png)




项目地址：[http://www.github.com/jjdxmashl/jjdxm_demomvp](http://www.github.com/jjdxmashl/jjdxm_demomvp)