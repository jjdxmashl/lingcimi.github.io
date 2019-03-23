---
title: 基于ijkplayer封装支持简单界面UI定制的视频播放器
date: 2016-08-25 00:14:39
categories: Android
tags: 播放器
description: 当前项目是基于[ijkplayer][url1]项目进行的播放器界面UI封装。是一个适用于 Android 的 RTMP 直播推流 SDK，可高度定制化和二次开发。特色是同时支持 H.264 软编／硬编和 AAC 软编／硬编。主要是支持RIMP、HLS、MP4、M4A等视频格式的播放。

---

感谢作者[tcking][author]、[Bilibili][author1]，本项目借鉴了[GiraffePlayer][url]项目，项目一开始的灵感来源于[GiraffePlayer][url]项目，后期做纯粹做了视频播放器的界面的定制，基于[ijkplayer][url1]项目进行的播放器界面UI封装。

## 简介 ##

当前项目是基于[ijkplayer][url1]项目进行的播放器界面UI封装。是一个适用于 Android 的 RTMP 直播推流 SDK，可高度定制化和二次开发。特色是同时支持 H.264 软编／硬编和 AAC 软编／硬编。主要是支持RIMP、HLS、MP4、M4A等视频格式的播放。
项目地址：[http://www.github.com/jjdxmashl/jjdxm_ijkplayer][project]

## 特性 ##

1. 基于ijkplayer封装的视频播放器界面,支持 RTMP , HLS (http & https) , MP4,M4A 等；
2. 可根据需求去定制部分界面样式；
3. 常用的手势操作左边上下亮度，右边上下声音，左右滑动播放进度调整；
4. 支持多种分辨率流的切换播放；
5. 播放出错尝试重连；
6. 界面裁剪显示样式；

## 截图 ##

![](https://raw.githubusercontent.com/jjdxmashl/jjdxm_ijkplayer/master/screenshots/icon01.gif) 
![](https://raw.githubusercontent.com/jjdxmashl/jjdxm_ijkplayer/master/screenshots/icon02.gif) 
![](https://raw.githubusercontent.com/jjdxmashl/jjdxm_ijkplayer/master/screenshots/icon03.gif) 
![](https://raw.githubusercontent.com/jjdxmashl/jjdxm_ijkplayer/master/screenshots/icon04.gif) 
![](https://raw.githubusercontent.com/jjdxmashl/jjdxm_ijkplayer/master/screenshots/icon01.png) 
![](https://raw.githubusercontent.com/jjdxmashl/jjdxm_ijkplayer/master/screenshots/icon02.png) 

 
## demo下载 ##

[demo apk下载][downapk]


## 代码混淆 ##

根据你的混淆器配置和使用，您可能需要在你的proguard文件内配置以下内容：

    -keep com.dou361.ijkplayer.** {
    *;
    }

## 快速开始 ##

#### step1: ####
依赖本项目类库

该项目已经打包到jcenter中心了，可以通过compile命令直接依赖，在主程序目录build.gradle中，添加以下代码：

     compile 'com.dou361.ijkplayer:jjdxm-ijkplayer:1.0.5' 


类库中添加了以下的依赖

    compile 'tv.danmaku.ijk.media:ijkplayer-java:0.6.0'
    compile 'tv.danmaku.ijk.media:ijkplayer-armv7a:0.6.0'
    compile 'com.android.support:support-v7:23.3.0' 

如果你的项目中已经有依赖了v4或者v7包并且使用的版本不一样可能会造成冲突，可以类似下面的方式进行引入依赖

    compile('com.dou361.ijkplayer:jjdxm-ijkplayer:1.0.5') {
        exclude group: 'com.android.support', module: 'appcompat-v7'
    }

更多关于冲突问题可看这里：[架包的打包引用以及冲突解决][jaraar] 

该项目是基于ijkplayer项目进行的视频UI的二次封装，目前只是默认在：

    compile 'com.dou361.ijkplayer:jjdxm-ijkplayer:1.0.5' 

中加入了以下依赖：

    compile 'tv.danmaku.ijk.media:ijkplayer-java:0.6.0'
    compile 'tv.danmaku.ijk.media:ijkplayer-armv7a:0.6.0'

如果要支持多种ABI类型的机型，可以根据需要添加以下依赖：

    # required, enough for most devices.
    compile 'tv.danmaku.ijk.media:ijkplayer-java:0.6.0'
    compile 'com.dou361.ijkplayer-armv7a:jjdxm-ijkplayer-armv7a:1.0.0'

    # Other ABIs: optional
    compile 'com.dou361.ijkplayer-armv7a:jjdxm-ijkplayer-armv7a:1.0.0'
    compile 'com.dou361.ijkplayer-armv5:jjdxm-ijkplayer-armv5:1.0.0'
    compile 'com.dou361.ijkplayer-arm64:jjdxm-ijkplayer-arm64:1.0.0'
    compile 'com.dou361.ijkplayer-x86:jjdxm-ijkplayer-x86:1.0.0'
    compile 'com.dou361.ijkplayer-x86_64:jjdxm-ijkplayer-x86_64:1.0.0'



#### step2: ####

多种分辨率流切换的案例，例如播放器的标清、高清、超清、720P等。

#### 1.简单的播放器实现 ####

    setContentView(R.layout.simple_player_view_player);
    String url = "http://9890.vod.myqcloud.com/9890_9c1fa3e2aea011e59fc841df10c92278.f20.mp4";
    player = new PlayerView(this)
            .setTitle("什么")
            .setScaleType(PlayStateParams.fitparent)
            .hideMenu(true)
            .forbidTouch(false)
            .showThumbnail(new OnShowThumbnailListener() {
                @Override
                public void onShowThumbnail(ImageView ivThumbnail) {
                    Glide.with(mContext)
                            .load("http://pic2.nipic.com/20090413/406638_125424003_2.jpg")
                            .placeholder(R.color.cl_default)
                            .error(R.color.cl_error)
                            .into(ivThumbnail);
                }
            })
            .setPlaySource(url)
            .startPlay();

#### 2.多种不同的分辨率流的播放器实现 ####
在布局中使用simple_player_view_player.xml布局

    <include
        layout="@layout/simple_player_view_player"
        android:layout_width="match_parent"
        android:layout_height="180dp"/>

代码中创建一个播放器对象

    /**播放资源*/
    ist<VideoijkBean> list = new ArrayList<VideoijkBean>();
    String url1 = "http://9890.vod.myqcloud.com/9890_4e292f9a3dd011e6b4078980237cc3d3.f20.mp4";
    String url2 = "http://9890.vod.myqcloud.com/9890_4e292f9a3dd011e6b4078980237cc3d3.f30.mp4";
    VideoijkBean m1 = new VideoijkBean();
    m1.setStream("标清");
    m1.setUrl(url1);
    VideoijkBean m2 = new VideoijkBean();
    m2.setStream("高清");
    m2.setUrl(url2);
    list.add(m1);
    list.add(m2);
    /**播放器*/
    player = new PlayerView(this)
                .setTitle("什么")
                .setScaleType(PlayStateParams.fitparent)
                .hideMenu(true)
                .forbidTouch(false)
                .showThumbnail(new OnShowThumbnailListener() {
                    @Override
                    public void onShowThumbnail(ImageView ivThumbnail) {
                        /**加载前显示的缩略图*/
                        Glide.with(mContext)
                                .load("http://pic2.nipic.com/20090413/406638_125424003_2.jpg")
                                .placeholder(R.color.cl_default)
                                .error(R.color.cl_error)
                                .into(ivThumbnail);
                    }
                })
                .setPlaySource(list)
                .startPlay();

#### step3: ####

配置生命周期方法,为了让播放器同步Activity生命周期，建议以下方法都去配置，注释的代码，主要作用是播放时屏幕常亮和暂停其它媒体的播放。

     @Override
    protected void onPause() {
        super.onPause();
        if (player != null) {
            player.onPause();
        }
        /**demo的内容，恢复系统其它媒体的状态*/
        //MediaUtils.muteAudioFocus(mContext, true);
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (player != null) {
            player.onResume();
        }
        /**demo的内容，暂停系统其它媒体的状态*/
        MediaUtils.muteAudioFocus(mContext, false);
        /**demo的内容，激活设备常亮状态*/
        //if (wakeLock != null) {
        //    wakeLock.acquire();
        //}
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        if (player != null) {
            player.onDestroy();
        }
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (player != null) {
            player.onConfigurationChanged(newConfig);
        }
    }

    @Override
    public void onBackPressed() {
        if (player != null && player.onBackPressed()) {
            return;
        }
        super.onBackPressed();
        /**demo的内容，恢复设备亮度状态*/
        //if (wakeLock != null) {
        //    wakeLock.release();
        //}
    }

## 更多UI样式的设置 ##

1.视频界面裁剪设置，可通过方法setScaleType(int type)去设置

    （1）. PlayStateParams.fitParent:可能会剪裁,保持原视频的大小，显示在中心,当原视频的大小超过view的大小超过部分裁剪处理
    （2）. PlayStateParams.fillParent:可能会剪裁,等比例放大视频，直到填满View为止,超过View的部分作裁剪处理
    （3）. PlayStateParams.wrapcontent:将视频的内容完整居中显示，如果视频大于view,则按比例缩视频直到完全显示在view中
    （4）. PlayStateParams.fitXY:不剪裁,非等比例拉伸画面填满整个View
    （5）. PlayStateParams.f16_9:不剪裁,非等比例拉伸画面到16:9,并完全显示在View中
    （6）. PlayStateParams.f4_3:不剪裁,非等比例拉伸画面到4:3,并完全显示在View中


2.播放器底部bar播放进度条样式定制
默认的进度样式是竖屏为上下样式，即进度条在播放时长的上面，横屏为左右样式，即进度条在播放时长的中间。样式定制主要是两个方法搭配使用toggleProcessDurationOrientation方法和setProcessDurationOrientation方法，横竖屏切换2中情况，和3种进度条样式

    /**上下样式*/
    PlayStateParams.PROCESS_PORTRAIT
    /**左右样式*/
    PlayStateParams.PROCESS_LANDSCAPE
    /**中间两边样式*/
    PlayStateParams.PROCESS_CENTER

总共有2的3次方中样式，下面只罗列几种样式

（1）.横竖屏都为上下样式

    player = new PlayerView(this) {
            @Override
            public PlayerView toggleProcessDurationOrientation() {
                return setProcessDurationOrientation(PlayStateParams.PROCESS_PORTRAIT);
            }
        }
                .setTitle("什么")
                .setProcessDurationOrientation(PlayStateParams.PROCESS_PORTRAIT)
                .setScaleType(PlayStateParams.fitparent)
                .forbidTouch(false)
                .hideCenterPlayer(true)
                .setPlaySource(list)
                .startPlay();

（2）.横竖屏都为左右样式

    player = new PlayerView(this) {
            @Override
            public PlayerView toggleProcessDurationOrientation() {
                return setProcessDurationOrientation(PlayStateParams.PROCESS_LANDSCAPE);
            }
        }
                .setTitle("什么")
                .setProcessDurationOrientation(PlayStateParams.PROCESS_LANDSCAPE)
                .setScaleType(PlayStateParams.fitparent)
                .forbidTouch(false)
                .hideCenterPlayer(true)
                .setPlaySource(list)
                .startPlay();

（3）.横屏为上下样式竖屏为左右样式

    player = new PlayerView(this) {
            @Override
            public PlayerView toggleProcessDurationOrientation() {
                return setProcessDurationOrientation(getScreenOrientation() == ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE?PlayStateParams.PROCESS_LANDSCAPE:PlayStateParams.PROCESS_PORTRAIT);
            }
        }
                .setTitle("什么")
                .setProcessDurationOrientation(PlayStateParams.PROCESS_LANDSCAPE)
                .setScaleType(PlayStateParams.fitparent)
                .forbidTouch(false)
                .hideCenterPlayer(true)
                .setPlaySource(list)
                .startPlay();

（4）.横屏为左右样式竖屏为上下样式

    player = new PlayerView(this) {
            @Override
            public PlayerView toggleProcessDurationOrientation() {
                return setProcessDurationOrientation(getScreenOrientation() == ActivityInfo.SCREEN_ORIENTATION_PORTRAIT?PlayStateParams.PROCESS_PORTRAIT:PlayStateParams.PROCESS_LANDSCAPE);
            }
        }
                .setTitle("什么")
                .setProcessDurationOrientation(PlayStateParams.PROCESS_CENTER)
                .setScaleType(PlayStateParams.fitparent)
                .forbidTouch(false)
                .hideCenterPlayer(true)
                .setPlaySource(list)
                .startPlay();

（5）.横屏为左右样式竖屏为中间两边样式

    player = new PlayerView(this) {
            @Override
            public PlayerView toggleProcessDurationOrientation() {
                return setProcessDurationOrientation(getScreenOrientation() == ActivityInfo.SCREEN_ORIENTATION_PORTRAIT?PlayStateParams.PROCESS_CENTER:PlayStateParams.PROCESS_LANDSCAPE);
            }
        }
                .setTitle("什么")
                .setProcessDurationOrientation(PlayStateParams.PROCESS_CENTER)
                .setScaleType(PlayStateParams.fitparent)
                .forbidTouch(false)
                .hideCenterPlayer(true)
                .setPlaySource(list)
                .startPlay();

3.隐藏部分不想要的界面

    //隐藏返回键，true隐藏，false为显示
    PlayerView hideBack(boolean isHide)
    //隐藏菜单键，true隐藏，false为显示
    PlayerView hideMenu(boolean isHide)
    //隐藏分辨率按钮，true隐藏，false为显示
    PlayerView hideSteam(boolean isHide)
    //隐藏旋转按钮，true隐藏，false为显示
    PlayerView hideRotation(boolean isHide)
    //隐藏全屏按钮，true隐藏，false为显示
    PlayerView hideFullscreen(boolean isHide)
    //隐藏中间播放按钮,ture为隐藏，false为不做隐藏处理，但不是显示
    PlayerView hideCenterPlayer(boolean isHide)

4.视频移动流量是播放提醒

    //设置2/3/4/5G和WiFi网络类型提示 true为进行2/3/4/5G网络类型提示 false 不进行网络类型提示
    PlayerView setNetWorkTypeTie(boolean isGNetWork)

5.视频加载前显示缩略图

    player.showThumbnail(new OnShowThumbnailListener() {
                    @Override
                    public void onShowThumbnail(ImageView ivThumbnail) {
                        /**加载前显示的缩略图*/
                        Glide.with(mContext)
                                .load("http://pic2.nipic.com/20090413/406638_125424003_2.jpg")
                                .placeholder(R.color.cl_default)
                                .error(R.color.cl_error)
                                .into(ivThumbnail);
                    }
                })

6.默认显示上下操作栏bar

    //设置是否禁止隐藏bar，true为一直显示，false为点击可以隐藏或显示
    PlayerView setForbidHideControlPanl(boolean flag)

7.设置播放出错后尝试重连的方式和重连的时间

    //设置自动重连的模式或者重连时间，isAuto true 出错重连，false出错不重连，connectTime重连的时间
    setAutoReConnect(boolean isAuto, int connectTime)

8.视频界面的旋转，当前默认使用setPlayerRotation方法为90、270、0轮询切换，如果需要指定角度旋转可以使用setPlayerRotation方法

    //旋转角度
    PlayerView setPlayerRotation()
    //旋转指定角度
    PlayerView setPlayerRotation(int rotation)

10.自定义视频界面，可以复制以下布局内容到自己的项目中，注意已有的id不能修改或删除，可以增加view，可以对以下布局内容调整显示位置或者自行隐藏

    <?xml version="1.0" encoding="utf-8"?>
    <RelativeLayout
        android:id="@+id/app_video_box"
        xmlns:android="http://schemas.android.com/apk/res/android"
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:background="@android:color/black"
        android:orientation="vertical">
    
    
        <com.dou361.ijkplayer.widget.IjkVideoView
            android:id="@+id/video_view"
            android:layout_width="match_parent"
            android:layout_height="match_parent"/>
    
        <LinearLayout
            android:id="@+id/ll_bg"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:background="@android:color/black"
            android:orientation="vertical">
    
            <!-- 封面显示-->
            <ImageView
                android:id="@+id/iv_trumb"
                android:layout_width="match_parent"
                android:layout_height="match_parent"
                android:scaleType="fitXY"
                android:visibility="visible"/>
        </LinearLayout>
    
        <!--重新播放-->
        <LinearLayout
            android:id="@+id/app_video_replay"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:background="#33000000"
            android:gravity="center"
            android:orientation="vertical"
            android:visibility="gone">
            <!-- 播放状态-->
            <TextView
                android:id="@+id/app_video_status_text"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:text="@string/small_problem"
                android:textColor="@android:color/white"
                android:textSize="14dp"/>
    
            <ImageView
                android:id="@+id/app_video_replay_icon"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_centerHorizontal="true"
                android:layout_marginTop="8dp"
                android:src="@drawable/simple_player_circle_outline_white_36dp"/>
        </LinearLayout>
        <!-- 网络提示-->
        <LinearLayout
            android:id="@+id/app_video_netTie"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:background="#33000000"
            android:gravity="center"
            android:orientation="vertical"
            android:visibility="gone">
    
            <TextView
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:layout_marginBottom="8dp"
                android:gravity="center"
                android:paddingLeft="8dp"
                android:paddingRight="8dp"
                android:text="您正在使用移动网络播放视频\n可能产生较高流量费用"
                android:textColor="@android:color/white"/>
    
            <TextView
                android:id="@+id/app_video_netTie_icon"
                android:layout_width="wrap_content"
                android:layout_height="wrap_content"
                android:background="@drawable/simple_player_btn"
                android:gravity="center"
                android:paddingLeft="8dp"
                android:paddingRight="8dp"
                android:text="继续"
                android:textColor="@android:color/white"/>
        </LinearLayout>
    
        <!--加载中-->
        <LinearLayout
            android:id="@+id/app_video_loading"
            android:layout_width="match_parent"
            android:layout_height="match_parent"
            android:gravity="center"
            android:orientation="vertical"
            android:visibility="gone">
    
            <ProgressBar
                android:layout_width="50dp"
                android:layout_height="50dp"
                android:indeterminateBehavior="repeat"
                android:indeterminateOnly="true"/>
            <TextView
                android:id="@+id/app_video_speed"
                android:layout_width="wrap_content"
                android:layout_marginTop="4dp"
                android:layout_height="wrap_content"
                android:gravity="center"
                android:visibility="gone"
                android:text="188Kb/s"
                android:textColor="@android:color/white"/>
        </LinearLayout>
    
        <!-- 中间触摸提示-->
        <include
            layout="@layout/simple_player_touch_gestures"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_centerInParent="true"/>
    
        <!-- 顶部栏-->
        <include layout="@layout/simple_player_topbar"/>
        <!-- 底部栏-->
        <include
            layout="@layout/simple_player_controlbar"
            android:layout_width="match_parent"
            android:layout_height="wrap_content"
            android:layout_alignParentBottom="true"/>
    
        <!--声音亮度控制-->
        <LinearLayout
            android:id="@+id/simple_player_settings_container"
            android:layout_width="250dp"
            android:layout_height="match_parent"
            android:layout_alignParentLeft="true"
            android:background="#80000000"
            android:gravity="center_vertical"
            android:orientation="vertical"
            android:visibility="visible">
    
            <LinearLayout
                android:id="@+id/simple_player_volume_controller_container"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:gravity="center"
                android:orientation="horizontal">
    
                <ImageView
                    android:layout_width="30dp"
                    android:layout_height="30dp"
                    android:src="@drawable/qcloud_player_icon_audio_vol_mute"/>
    
                <SeekBar
                    android:id="@+id/simple_player_volume_controller"
                    style="?android:attr/progressBarStyleHorizontal"
                    android:layout_width="150dp"
                    android:layout_height="wrap_content"/>
    
                <ImageView
                    android:layout_width="30dp"
                    android:layout_height="30dp"
                    android:src="@drawable/qcloud_player_icon_audio_vol"/>
            </LinearLayout>
    
            <LinearLayout
                android:id="@+id/simple_player_brightness_controller_container"
                android:layout_width="match_parent"
                android:layout_height="wrap_content"
                android:layout_marginTop="20dp"
                android:gravity="center"
                android:orientation="horizontal">
    
                <ImageView
                    android:layout_width="30dp"
                    android:layout_height="30dp"
                    android:padding="5dp"
                    android:src="@drawable/qcloud_player_icon_brightness"/>
    
                <SeekBar
                    android:id="@+id/simple_player_brightness_controller"
                    style="?android:attr/progressBarStyleHorizontal"
                    android:layout_width="150dp"
                    android:layout_height="wrap_content"/>
    
                <ImageView
                    android:layout_width="30dp"
                    android:layout_height="30dp"
                    android:src="@drawable/qcloud_player_icon_brightness"/>
            </LinearLayout>
    
        </LinearLayout>
    
    
        <!--分辨率选择-->
        <LinearLayout
            android:id="@+id/simple_player_select_stream_container"
            android:layout_width="150dp"
            android:layout_height="match_parent"
            android:layout_alignParentRight="true"
            android:background="#80000000"
            android:gravity="center_vertical"
            android:visibility="gone">
    
            <ListView
                android:id="@+id/simple_player_select_streams_list"
                android:layout_width="150dp"
                android:layout_height="wrap_content"/>
        </LinearLayout>
    
    
        <ImageView
            android:id="@+id/play_icon"
            android:layout_width="wrap_content"
            android:layout_height="wrap_content"
            android:layout_centerInParent="true"
            android:layout_marginTop="8dp"
            android:src="@drawable/simple_player_center_play"/>
    
    </RelativeLayout>


11.播放器PlayerView对象的方法如下：

    PlayerView(Activity activity)

    //生命周期方法回调
    PlayerView onPause()
    PlayerView onResume()
    PlayerView onDestroy()
    PlayerView onConfigurationChanged(final Configuration newConfig)
    boolean onBackPressed()
    //显示缩略图
    PlayerView showThumbnail(OnShowThumbnailListener onShowThumbnailListener)
    //设置播放信息监听回调
    PlayerView setOnInfoListener(IMediaPlayer.OnInfoListener onInfoListener)
    //设置播放器中的返回键监听
    PlayerView setPlayerBackListener(OnPlayerBackListener listener)
    //设置控制面板显示隐藏监听
    PlayerView setOnControlPanelVisibilityChangListenter(OnControlPanelVisibilityChangeListener listener)
    //百分比显示切换
    PlayerView toggleAspectRatio()
    //设置播放区域拉伸类型
    PlayerView setScaleType(int showType)
    //旋转角度
    PlayerView setPlayerRotation()
    //旋转指定角度
    PlayerView setPlayerRotation(int rotation)
    //设置播放地址包括视频清晰度列表对应地址列表
    PlayerView setPlaySource(List<VideoijkBean> list)
    //设置播放地址单个视频VideoijkBean
    PlayerView setPlaySource(VideoijkBean videoijkBean)
    //设置播放地址单个视频地址时带流名称
    PlayerView setPlaySource(String stream, String url)
    //设置播放地址单个视频地址时
    PlayerView setPlaySource(String url)
    //自动播放
    PlayerView autoPlay(String path)
    //开始播放
    PlayerView startPlay()
    //设置视频名称
    PlayerView setTitle(String title)
    //选择要播放的流
    PlayerView switchStream(int index)
    //暂停播放
    PlayerView pausePlay()
    //停止播放
    PlayerView stopPlay()
    //设置播放位置
    PlayerView seekTo(int playtime)
    //获取当前播放位置
    int getCurrentPosition()
    //获取视频播放总时长
    long getDuration()
    //设置2/3/4/5G和WiFi网络类型提示 true为进行2/3/4/5G网络类型提示 false 不进行网络类型提示
    PlayerView setNetWorkTypeTie(boolean isGNetWork)
    //是否仅仅为全屏
    PlayerView setOnlyFullScreen(boolean isFull)
    //设置是否禁止双击
    PlayerView setForbidDoulbeUp(boolean flag)
    //设置是否禁止隐藏bar
    PlayerView setForbidHideControlPanl(boolean flag)
    //当前播放的是否是直播
    boolean isLive()
    //是否禁止触摸
    PlayerView forbidTouch(boolean forbidTouch)
    //隐藏所有状态界面
    PlayerView hideAllUI()
    获取顶部控制barview
    View getTopBarView()
    //获取底部控制barview
    View getBottonBarView()
    //获取旋转view
    ImageView getRationView()
    //获取返回view
    ImageView getBackView()
    //获取菜单view
    ImageView getMenuView()
    //获取全屏按钮view
    ImageView getFullScreenView()
    //获取底部bar的播放view
    ImageView getBarPlayerView()
    //获取中间的播放view
    ImageView getPlayerView()
    //隐藏返回键，true隐藏，false为显示
    PlayerView hideBack(boolean isHide)
    //隐藏菜单键，true隐藏，false为显示
    PlayerView hideMenu(boolean isHide)
    //隐藏分辨率按钮，true隐藏，false为显示
    PlayerView hideSteam(boolean isHide)
    //隐藏旋转按钮，true隐藏，false为显示
    PlayerView hideRotation(boolean isHide)
    //隐藏全屏按钮，true隐藏，false为显示
    PlayerView hideFullscreen(boolean isHide)
    //隐藏中间播放按钮,ture为隐藏，false为不做隐藏处理，但不是显示
    PlayerView hideCenterPlayer(boolean isHide)
    //显示或隐藏操作面板
    PlayerView operatorPanl()
    //全屏切换
    PlayerView toggleFullScreen()
    //设置自动重连的模式或者重连时间，isAuto true 出错重连，false出错不重连，connectTime重连的时间
    setAutoReConnect(boolean isAuto, int connectTime)
    //进度条和时长显示的方向切换
    PlayerView toggleProcessDurationOrientation()
    //设置进度条和时长显示的方向，默认为上下显示，PlayStateParams.PROCESS_PORTRAIT为上下显示PlayStateParams.PROCESS_LANDSCAPE为左右显示PlayStateParams.PROCESS_CENTER为中间两边样式
    setProcessDurationOrientation(int portrait)
    //显示菜单设置
    showMenu()
    //获取界面方向
    int getScreenOrientation()
    //显示加载网速
    PlayerView setShowSpeed(boolean isShow)



12.ijkplayer封装的视频播放信息返回码监听，可以通过setOnInfoListener去监听

    /*
     * Do not change these values without updating their counterparts in native
     */
    int MEDIA_INFO_UNKNOWN = 1;//未知信息
    int MEDIA_INFO_STARTED_AS_NEXT = 2;//播放下一条
    int MEDIA_INFO_VIDEO_RENDERING_START = 3;//视频开始整备中
    int MEDIA_INFO_VIDEO_TRACK_LAGGING = 700;//视频日志跟踪
    int MEDIA_INFO_BUFFERING_START = 701;//开始缓冲中
    int MEDIA_INFO_BUFFERING_END = 702;//缓冲结束
    int MEDIA_INFO_NETWORK_BANDWIDTH = 703;//网络带宽，网速方面
    int MEDIA_INFO_BAD_INTERLEAVING = 800;//
    int MEDIA_INFO_NOT_SEEKABLE = 801;//不可设置播放位置，直播方面
    int MEDIA_INFO_METADATA_UPDATE = 802;//
    int MEDIA_INFO_TIMED_TEXT_ERROR = 900;
    int MEDIA_INFO_UNSUPPORTED_SUBTITLE = 901;//不支持字幕
    int MEDIA_INFO_SUBTITLE_TIMED_OUT = 902;//字幕超时

    int MEDIA_INFO_VIDEO_INTERRUPT= -10000;//数据连接中断
    int MEDIA_INFO_VIDEO_ROTATION_CHANGED = 10001;//视频方向改变
    int MEDIA_INFO_AUDIO_RENDERING_START = 10002;//音频开始整备中

    int MEDIA_ERROR_UNKNOWN = 1;//未知错误
    int MEDIA_ERROR_SERVER_DIED = 100;//服务挂掉
    int MEDIA_ERROR_NOT_VALID_FOR_PROGRESSIVE_PLAYBACK = 200;//数据错误没有有效的回收
    int MEDIA_ERROR_IO = -1004;//IO错误
    int MEDIA_ERROR_MALFORMED = -1007;
    int MEDIA_ERROR_UNSUPPORTED = -1010;//数据不支持
    int MEDIA_ERROR_TIMED_OUT = -110;//数据超时


项目地址：[http://www.github.com/jjdxmashl/jjdxm_ijkplayer][project]

[web]:http://www.dou361.com
[github]:https://github.com/jjdxmashl/
[project]:https://github.com/jjdxmashl/jjdxm_ijkplayer/
[issues]:https://github.com/jjdxmashl/jjdxm_ijkplayer/issues/new
[downapk]:https://raw.githubusercontent.com/jjdxmashl/jjdxm_ijkplayer/master/apk/app-debug.apk
[lastaar]:https://raw.githubusercontent.com/jjdxmashl/jjdxm_ijkplayer/master/release/jjdxm-ijkplayer-1.0.0.aar
[lastjar]:https://raw.githubusercontent.com/jjdxmashl/jjdxm_ijkplayer/master/release/jjdxm-ijkplayer-1.0.0.jar
[icon01]:https://raw.githubusercontent.com/jjdxmashl/jjdxm_ijkplayer/master/screenshots/icon01.png
[icon02]:https://raw.githubusercontent.com/jjdxmashl/jjdxm_ijkplayer/master/screenshots/icon02.png

[jaraar]:https://github.com/jjdxmashl/jjdxm_ecodingprocess/blob/master/架包的打包引用以及冲突解决.md
[minify]:https://github.com/jjdxmashl/jjdxm_ecodingprocess/blob/master/AndroidStudio代码混淆注意的问题.md
[author]:https://github.com/tcking
[author1]:https://github.com/Bilibili
[url]:https://github.com/tcking/GiraffePlayer
[url1]:https://github.com/Bilibili/ijkplayer