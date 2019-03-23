---
title: Android利用泛型和反射来实现对数据库的操作SqlHelper
date: 2014-11-13 23:30:09
categories:
- Android
tags: 
- 数据库
- 泛型
- 反射
description: 这是一个Android数据库操作利用泛型和反射技术简单封装的帮助类，只需要定义和表结构相同类型的Bean就可以进行数据的增删改查等操作。

---


利用泛型和反射来实现对数据库的操作

1.对数据库操作的接口类

	package com.dou361.dal;
	
	import java.util.List;
	
	
	/**
	 * @author jjdxm
	 * http://www.dou361.com
	 * http://blog.csdn.net/jiujiedexiaoming
	 * 通过反射来对数据库操作
	 *
	 * @param <T>
	 */
	public interface SqlHelper<T> {
		/**
		 * 添加
		 * @param table 添加对应的表
		 * @param t 表对应的对象
		 * @return 插入的位置索引
		 */
		long insert(String table,T t);
		/**
		 * 删除
		 * @param table 删除对应的表
		 * @param columname 通过的字段
		 * @param vaule 字段对应的值
		 * @return 删除影响的行数
		 */
		int delete(String table,String columname,String vaule);
		/**
		 * 修改
		 * @param table 修改对应的表
		 * @param t 修改的表对应的对象
		 * @return 修改影响的行数
		 */
		int update(String table,T t);
		/**
		 * 查询一个
		 * @param table 需要查询的表
		 * @param columname 需要查询的字段名
		 * @param vaule 需要查询的字段对应的值
		 * @return 表对应的对象
		 */
		List<T> query(String table,String columname,String vaule);
		
		/**
		 * 查询一页
		 * @param table 需要查询的表
		 * @param startIndex 查询的起始索引
		 * @param pageSize 查询的页面条数
		 * @return page数据
		 */
		List<T> queryPage(String table,int startIndex,int pageSize);
		
		/**
		 * @param table 需要查询的表
		 * @return 所有数据
		 */
		List<T> queryAll(String table);
	}

2.对数据操作的实现类

	package com.dou361.dal;
	
	import java.lang.reflect.Field;
	import java.util.ArrayList;
	import java.util.List;
	
	import android.content.ContentValues;
	import android.content.Context;
	import android.database.Cursor;
	import android.database.sqlite.SQLiteDatabase;
	
	import com.dou361.db.DBOpenHelper;
	
	/**
	 * @author jjdxm 
	 * http://www.dou361.com
	 * http://blog.csdn.net/jiujiedexiaoming
	 * 通过反射来对数据库操作
	 * @param <T>
	 */
	public class SqlHelperImpl<T> implements SqlHelper<T> {
	
		/**
		 * 反射得到字节码文件
		 */
		private Class clazz;
	
		/**
		 * 对应表的映射字段（操作表的所有属性）
		 */
		private String[] sqlcolumns;
	
		/**
		 * 创建数据库的帮助对象
		 */
		private DBOpenHelper dbOpenHelper;
	
		/**
		 * 构造函数，初始化工作
		 * 
		 * @param context
		 *            上下文
		 * @param clazz
		 *            表对应bean对象的字节码文件
		 * @param dbName
		 *            数据库名称
		 * @param sql
		 *            创建表语句
		 * @param sqlcolumns
		 *            对应表的映射字段（操作表的所有属性）
		 */
		public SqlHelperImpl(Context context, Class clazz, String dbName,
				String sql, String[] sqlcolumns) {
			this.clazz = clazz;
			this.sqlcolumns = sqlcolumns;
			dbOpenHelper = new DBOpenHelper(context, dbName, sql);
		}
	
		@Override
		public long insert(String table, T t) {
			try {
				SQLiteDatabase database = dbOpenHelper.getWritableDatabase();
				if (sqlcolumns != null && sqlcolumns.length > 0) {
					ContentValues values = new ContentValues();
					for (int i = 1; i < sqlcolumns.length; i++) {
						try {
							Field field = t.getClass().getDeclaredField(
									sqlcolumns[i]);
							field.setAccessible(true);
							Object objVaule = field.get(t);
							if (objVaule != null) {
								values.put(sqlcolumns[i], (String) objVaule);
							}
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
					long insertIndex = database.insert(table, null, values);
					database.close();
					return insertIndex;
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			return -1;
		}
	
		@Override
		public int delete(String table, String columname, String value) {
			SQLiteDatabase database = dbOpenHelper.getWritableDatabase();
			int rows = database.delete(table, columname + "=?",
					new String[] { value });
			database.close();
			return rows;
		}
	
		@Override
		public int update(String table, T t) {
			try {
				SQLiteDatabase database = dbOpenHelper.getWritableDatabase();
				String whereValue = null;
				if (sqlcolumns != null && sqlcolumns.length > 0) {
					ContentValues values = new ContentValues();
					for (int i = 0; i < sqlcolumns.length; i++) {
						try {
							Field field = t.getClass().getDeclaredField(
									sqlcolumns[i]);
							field.setAccessible(true);
							Object objVaule = field.get(t);
							if (objVaule != null) {
								if (i == 0) {
									whereValue = objVaule.toString();
								} else {
									values.put(sqlcolumns[i], (String) objVaule);
								}
							}
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
					int rows = database.update(table, values, sqlcolumns[0] + "=?",
							new String[] { whereValue });
					database.close();
					return rows;
				}
			} catch (Exception e) {
				e.printStackTrace();
			}
			return -1;
		}
	
		@Override
		public List<T> query(String table, String columname, String value) {
			SQLiteDatabase database = dbOpenHelper.getWritableDatabase();
			Cursor cursor = database.query(table, sqlcolumns, columname + "=?",
					new String[] { value }, null, null, null);
			List<T> list = new ArrayList<T>();
			while (cursor.moveToNext()) {
				try {
					Object obj = clazz.newInstance();
					for (int i = 0; i < sqlcolumns.length; i++) {
						try {
							Field field = clazz.getDeclaredField(sqlcolumns[i]);
							field.setAccessible(true);
	
							int type = cursor.getType(i);
							Object objValue = null;
							switch (type) {
							case Cursor.FIELD_TYPE_STRING:
								objValue = cursor.getString(i);
								break;
							case Cursor.FIELD_TYPE_INTEGER:
								objValue = cursor.getInt(i);
								break;
							case Cursor.FIELD_TYPE_FLOAT:
								objValue = cursor.getFloat(i);
								break;
							case Cursor.FIELD_TYPE_BLOB:
								objValue = cursor.getBlob(i);
								break;
	
							default:
								break;
							}
	
							field.set(obj, objValue);
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
					T t = (T) obj;
					list.add(t);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			cursor.close();
			database.close();
			return list;
		}
	
		@Override
		public List<T> queryPage(String table, int startIndex, int pageSize) {
			SQLiteDatabase database = dbOpenHelper.getWritableDatabase();
			Cursor cursor = database.query(table, sqlcolumns, null, null, null,
					null, sqlcolumns[0] + " desc", startIndex + "," + pageSize);
			List<T> list = new ArrayList<T>();
			while (cursor.moveToNext()) {
				try {
					Object obj = clazz.newInstance();
					for (int i = 0; i < sqlcolumns.length; i++) {
						try {
							Field field = clazz.getDeclaredField(sqlcolumns[i]);
							field.setAccessible(true);
	
							int type = cursor.getType(i);
							Object objValue = null;
							switch (type) {
							case Cursor.FIELD_TYPE_STRING:
								objValue = cursor.getString(i);
								break;
							case Cursor.FIELD_TYPE_INTEGER:
								objValue = cursor.getInt(i);
								break;
							case Cursor.FIELD_TYPE_FLOAT:
								objValue = cursor.getFloat(i);
								break;
							case Cursor.FIELD_TYPE_BLOB:
								objValue = cursor.getBlob(i);
								break;
	
							default:
								break;
							}
	
							field.set(obj, objValue);
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
					T t = (T) obj;
					list.add(t);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			cursor.close();
			database.close();
			return list;
		}
	
		@Override
		public List<T> queryAll(String table) {
			SQLiteDatabase database = dbOpenHelper.getWritableDatabase();
			Cursor cursor = database.query(table, sqlcolumns, null, null, null,
					null, null, null);
			List<T> list = new ArrayList<T>();
			while (cursor.moveToNext()) {
				try {
					Object obj = clazz.newInstance();
					for (int i = 0; i < sqlcolumns.length; i++) {
						try {
							Field field = clazz.getDeclaredField(sqlcolumns[i]);
							field.setAccessible(true);
							int type = cursor.getType(i);
							Object objValue = null;
							switch (type) {
							case Cursor.FIELD_TYPE_STRING:
								objValue = cursor.getString(i);
								break;
							case Cursor.FIELD_TYPE_INTEGER:
								objValue = cursor.getInt(i);
								break;
							case Cursor.FIELD_TYPE_FLOAT:
								objValue = cursor.getFloat(i);
								break;
							case Cursor.FIELD_TYPE_BLOB:
								objValue = cursor.getBlob(i);
								break;
	
							default:
								break;
							}
							field.set(obj, objValue);
						} catch (Exception e) {
							e.printStackTrace();
						}
					}
					T t = (T) obj;
					list.add(t);
				} catch (Exception e) {
					e.printStackTrace();
				}
			}
			cursor.close();
			database.close();
			return list;
		}
	
	}
	3.通过以上的帮助类，可以开速的编写对数据库的操作类
	如一个新闻的实体类和其对应的表
	package com.dou361.domain;
	
	import java.io.Serializable;
	
	public class Acount implements Serializable {
	
		private static final long serialVersionUID = 1L;
	
		private Integer _id;
		private String acountName;
	
		public Integer get_id() {
			return _id;
		}
	
		public void set_id(Integer _id) {
			this._id = _id;
		}
	
		public String getAcountName() {
			return acountName;
		}
	
		public void setAcountName(String acountName) {
			this.acountName = acountName;
		}
	
	}

4.具体的数据库操作类

	package com.dou361.dao.impl;
	
	import java.util.List;
	
	import android.content.Context;
	
	import com.dou361.dal.SqlHelperImpl;
	import com.dou361.domain.Acount;
	
	public class AcountDaoImpl extends SqlHelperImpl<Acount> {
	
		private String table = "T_Acounts";
		static String sql = "create table T_Acounts (_id Integer primary key autoincrement,acountName varchar(30))";
		static String[] sqlcolumns = new String[] { "_id", "acountName" };
	
		public AcountDaoImpl(Context context) {
			super(context, "mobilesafe.db", sql, Acount.class, sqlcolumns);
		}
	
		@Override
		public long add(Acount acount) {
			return super.insert(table, acount);
		}
	
		@Override
		public int deleteByValue(String columname, String value) {
			return super.delete(table, columname, value);
		}
	
		@Override
		public int update(Acount acount) {
			return super.update(table, acount);
		}
	
		@Override
		public List<Acount> getByValue(String columname, String value) {
			return super.query(table, columname, value);
		}
	
		@Override
		public List<Acount> getAll() {
			return super.queryAll(table);
		}
	
	}


5.为了方便起见，还可以进一步优化

	package com.dou361.bussiness.impl;
	
	import java.util.List;
	
	import android.content.Context;
	
	import com.dou361.bussiness.AcountBusinessServer;
	import com.dou361.dao.impl.AcountDaoImpl;
	import com.dou361.domain.Acount;
	
	public class AcountBusinessServerImpl implements AcountBusinessServer {
	
		private AcountDaoImpl<span style="font-family: Arial, Helvetica, sans-serif;"> </span>acountDao;
	
		public AcountBusinessServerImpl(Context context) {
			acountDao = new AcountDaoImpl(context);
		}
	
		/**
		 * 添加
		 * 
		 * @param Acount
		 *            添加的Acount对象
		 * @return 返回状态
		 */
		@Override
		public boolean add(Acount acount) {
			return acountDao.add(acount) > 0;
		}
	
	
		/**
		 * 删除
		 * 
		 * @param id
		 *            通过id删除一个BlackNumber对象
		 * @return 返回状态
		 */
		@Override
		public boolean deleteById(String id) {
			return acountDao.deleteByValue("_id", id) > 0;
		}
	
	
		/**
		 * 修改
		 * 
		 * @param Acount
		 *            修改的acount对象
		 * @return 返回状态
		 */
		@Override
		public boolean update(Acount acount) {
			return acountDao.update(acount) > 0;
		}
	
		/**
		 * 查找一个Acount对象
		 * 
		 * @param id
		 *            通过id查找
		 * @return 返回Acount
		 */
		@Override
		public List<Acount> getById(String id) {
			return acountDao.getByValue("_id", id);
		}
		
	
		/**
		 * 查找一个Acount对象
		 * 
		 * @param acountName
		 *            通过acountName查找
		 * @return 返回Acount
		 */
		@Override
		public List<Acount> getByAcountName(String acountName) {
			return acountDao.getByValue("acountName", acountName);
		}
	
		/**
		 * @return 返回所有
		 */
		@Override
		public List<Acount> getAll() {
			return acountDao.getAll();
		}
	
	}

6.接下来就是使用了，在这里只需要创建最后一个类的实例即可方便的使用了。



