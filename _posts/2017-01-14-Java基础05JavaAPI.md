---
title: Java基础05Java API
date: 2017-01-13 08:30:00
categories: Java
tags: Java基础
description: 掌握Object类、Scanner类、String类、StringBuffer类、StringBuilder类、Arrays类、基本包装类、正则表达式、Math类、Random类、System类、BigInteger类、BigDecimal类、Date类、DateFormate类、Calendar类，及其常用方法。

---


## 常用类
Object类：lang包下；

概述：Object是类层次结构的根类。所有的类都直接或间接的继承Object类。

	boolean equals(Object obj) 比较对象是否相等（对象一般需要重写）
	protected  void finalize()  当对象被回收时自动调用此方法
	int hashCode() 返回该对象的哈希码值（对象一般需要重写）
	String toString() 返回该对象的字符串表示（对象一般需要重写）

String类：lang包下，代表字符串；

	char charAt(int index) 返回指定索引处的字符
	int compareTo(String anotherString)  按字典顺序比较字符串
	String concat(String str)  连接字符串
	boolean contains(CharSequence s) 判断是否包含指定字符串
	int indexOf(String str, int fromIndex)  从指定索引处开始，返回第一次出现的字符串的索引
	int length() 返回字符串的长度
	boolean matches(String regex)  告知此字符串是否匹配给定的正则表达式（验证用户名）
	String replace(char oldChar, char newChar)  替换指定字符为指定字符
	String replaceAll(String regex, String replacement)  按照指定规则替换指定字符串
	String[] split(String regex) 使用正则表达式来分割字符串
	String substring(int beginIndex, int endIndex)  截取指定索引间的内容
	char[] toCharArray()将此字符串转换为一个新的字符数组。
	String toLowerCase()所有字符都转换为小写
	String toUpperCase()所有字符都转换为大写
	String trim()忽略前导空白和尾部空白
	static String valueOf(Object obj) 将其他类型转换为字符串
	int indexOf(String str, int fromIndex)  从指定索引起返回指定字符串的索引

StringBuffer类：lang包下。线程安全可变字符序列。

	StringBuffer() 构造方法，默认容量为16
	StringBuffer(int capacity) 构造方法，指定容量
	StringBuffer(String str) 构造方法，容量为16加传进来的参数长度
	StringBuffer append(Object obj) 追加内容
	int capacity() 获取当前容量
	StringBuffer reverse() 反转字符串
	StringBuffer delete(int start, int end)  删除指定间内容
	StringBuffer insert(int offset, Object obj)  指定位置插入内容

StringBuild类：lang包下，一个不安全可变字符序列。

	StringBuilder replace(int start, int end, String str) 替换指定索引间内容
	StringBuilder reverse() 反转字符串

System类：lang包下，最终类，不能创建对象

	static void arraycopy(Object src, int srcPos, Object dest, int destPos, int length)复制数组
	static long currentTimeMillis()  返回以毫秒为单位的当前时间
	static void exit(int status)  终止正在运行的Java虚拟机
	static Properties getProperties() 返回系统属性

Runtime类： lang包下，使应用程序能够与其运行的环境相连接。可以通过 getRuntime 方法获取当前运行时。不能创建对象，可通过方法返回对象

	static Runtime getRuntime()返回与当前 Java 应用程序相关的运行时对象。
	void halt(int status) 强行终止目前正在运行的 Java 虚拟机
	void exit(int status) 终止当前正在运行的 Java 虚拟机
	long freeMemory() 返回 Java 虚拟机中的空闲内存量

Math类：lang包下，执行基本数学运算的方法，不能创建对象

	static double pow(double a, double b) 返回第一个参数的第二个参数次幂的值。
	static double random()返回带正号的 double 值，该值大于等于 0.0 且小于 1.0。
	static double sqrt(double a)  返回正确舍入的 double 值的正平方根。
	static double ceil(double a)  进一法，该值大于等于参数
	static double floor(double a) 退一法，该值小于等于参数
	static long round(double a)  四舍五入

Random类：util包下，生成随机数流

	int nextInt(int n)  返回一个0到参数之间的随机数，包左不包右
	double nextDouble() 返回一个0.0-1.0的随机小数，包左不包右

Date类：util包下，类 Date 表示特定的瞬间，精确到毫秒。

	Date()构造方法初始化此对象
	Date(long date)构造方法分配指定的Date对象
	int compareTo(Date anotherDate) 比较两个日期的顺序。
	long getTime() 返回当前时间毫秒值
	String toString()  格式化输出，根据创建对象定义的格式输出

Calendar类：util包下，抽象类，不可以创建对象，可以通过方法获取对象

	abstract  void add(int field, int amount) 为给定的日历字段添加或减去指定的时间量。
	int compareTo(Calendar anotherCalendar) 比较两个 Calendar 对象表示的时间值
	int get(int field) 返回给定日历字段的值。
	static Calendar getInstance()  使用默认时区和语言环境获得一个日历。返回一个日历对象
	Date getTime() 返回一个Date对象
	long getTimeInMillis()返回此 Calendar 的时间值，以毫秒为单位。
	void set(int field, int value)  将给定的日历字段设置为给定值。
	void set(int year, int month, int date)  设置日历字段 YEAR、MONTH 和 DAY_OF_MONTH 的值。
	void setTime(Date date) 使用给定的 Date 设置此 Calendar 的时间。
	void setTimeInMillis(long millis)  用给定的 long 值设置此 Calendar 的当前时间值。

Dateformat类：text包下，抽象类，不可以创建对象，可以通过方法获取对象

	String format(Date date)  将一个 Date 格式化为日期/时间字符串。
	Calendar getCalendar()获取与此日期/时间格式器关联的日历。
	static DateFormat getInstance()获取为日期和时间使用 SHORT 风格的默认日期/时间格式器。
	Date parse(String source) 根据给定的解析位置开始解析日期/时间字符串

SimpleDateFormat类：text包下，继承DateFormat类

	SimpleDateFormat()构造方法用默认的模式和默认语言环境的日期格式符号构造
	SimpleDateFormat(String pattern)构造方法用给定的模式和默认语言环境的日期格式符号构造

BigInteger类：math包下的不可变的任意精度的整数

	BigInteger(String val)构造方法将 BigInteger 的十进制字符串表示形式转换为 BigInteger。
	BigInteger add(BigInteger val)  加法
	BigInteger divide(BigInteger val)  除法
	BigInteger multiply(BigInteger val) 乘法

BigDecimal类：math包下不可变的、任意精度的有符号十进制数。

	BigDecimal(BigInteger val) 构造方法将 BigInteger 转换为 BigDecimal。
	BigDecimal(String val)构造方法将 BigDecimal 的字符串表示形式转换为 BigDecimal（两个double类型的数运算会损失精度，建议使用String类型构造）

Stack类：util包下Stack 类表示后进先出（LIFO）的对象堆栈。

	boolean empty()测试堆栈是否为空。
	E pop()移除堆栈顶部的对象，并作为此函数的值返回该对象。

Runnable接口：lang包下，实现该接口并重写run方法可以使用多线程。

## 包装类

	Byte：
	Short：
	Integer：
	Long：
	Float：
	Double：
	Character：
	Boolean：

都在lang包下，不需要导包。每个类型的方法基本上一样，故只使用Integer包装类为例

	Integer(int value) 构造方法构造一个新分配的 Integer 对象，它表示指定的 int 值。
	Integer(String s) 构造方法构造一个新分配的 Integer 对象，它表示 String 参数所指示的 int 值。
	int intValue()以 int 类型返回该 Integer 的值。
	static int parseInt(String s)  将字符串参数作为有符号的十进制整数进行解析。
	static int reverse(int i) 返回通过反转指定 int 值的二进制补码表示形式中位的顺序而获得的值。
	static Integer valueOf(int i)  返回一个表示指定的 int 值的 Integer 实例。

## 工具类
Collections：util包下

	static <T> void fill(List<? super T> list, T obj) 使用指定元素替换指定列表中的所有元素。
	static <T extends Object & Comparable<? super T>> T max(Collection<? extends T> coll)  根据指定比较器产生的顺序，返回给定 collection 的最大元素。
	static void reverse(List<?> list) 反转指定列表中元素的顺序。
	static void shuffle(List<?> list) 使用默认随机源对指定列表进行置换。
	static <T extends Comparable<? super T>> void sort(List<T> list)  根据元素的自然顺序 对指定列表按升序进行排序。
	static void swap(List<?> list, int i, int j)  在指定列表的指定位置处交换元素。

Arrays:util包下此类包含用来操作数组（比如排序和搜索）的各种方法。

	static int binarySearch(Object[] a, Object key) 使用二分搜索法来搜索指定数组，以获得指定对象。
	static void sort(Object[] a)  根据元素的自然顺序对指定对象数组按升序进行排序。
