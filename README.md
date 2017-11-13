# Flision Mysql connector
##使用方法
npm install dbio-mysql

```
const Mysql = require('dbio-mysql');

//创建mysql实例
let mysql = new Mysql({
	host:<host>,
	port:3306,
	user:<user>
	password:<password>
	pool:true,
	logSQL:true
	});
//接收错误信息
mysql.on(Mysql.Events.Error,(err)=>console.log(err));
//接收SQL语句 必须在配置时传入logSQL:true
mysql.on(Mysql.Events.SQL,(sql)=>console.log(sql));
```
## 说明
通过mysql实例可以获取表方法，视图方法，储存过程方法，直接执行SQL方法,分别为

.table(tableName)

.view(viewName)

.proc(procName) (developing)

.execute(sql,values)

除execute方法, 其他方法都有行为触发查询。分别为

###view & table
.select( fields )

###table only
.insert( values )

.update( values )

.delete()

###proc only
.call( values ) (developing)


##查询
.select() 会返回一个查询对象，该对象内容如下
rows 查询结果
fields 字段结构
changed_rows

### where 填充对象
```
let result = await mysql.table('表名')
	 .where('`id`=:id',{id:1})
	 .select();
//The result will contain in rows 
let rows = result.rows
```
### where 填充数组
```
let result = await mysql.table('表名')
	 .where('id=? and name=?',[1,'vincent'])
	 .select();
//The result will contain in rows 
let rows = result.rows
```
### select 指定字段
```
//通过对象 不需要关心值是多少, null or undefined is ok
//here is care about keys of object only
let result = await mysql.table('表名')
	 .select({id:0,name:'xxxx'});
	 
//通过数组
let result = await mysql.table('表名')
	 .select(['id','name']);
	 
//通过字符串 注意sql注入攻击, 通过对象或数组已处理特殊字符串 但字符串没有处理
let result = await mysql.table('表名')
	 .select('id,name');
```

### 排序 .orderBy( values )
```
.orderBy('id desc');
```

### .groupBy()
developing

### .having()
developing

### 计数 .counted( enable )
```
.counted(true)
```

### 分页 .page( page, take )
```
//page 页数， take 项数量
//这里获取第1页，10项纪录
.page(1,10) 
```

## 插入
```
let result = await mysql.table('test1')
	.insert({name:'vincent',gmt_create:new Date()}

//最后插入的id
let lst_id = result.insertId;
```
## 更新
```
let result = await mysql.table('test1')
	.where('id=:id',{id:1})
	.update({name:'bob'});
//改变的行数
let changedRows = result.changedRows;
```
## 删除
```
let result = await mysql.table('test1')
	.where('id=:id',{id:1})
	.delete();
//影响的行数
let affectedRows = result.affectedRows;
```
## 事务

```
let session = mysql.begin();
try{
	session.table('test1').insert(...);
	session.table('test1').where(...).update(...);
	session.table('test1').where(...).delete(...);
	session.commit();
} catch (err) {
	session.rollback();
}
```

##执行后保持打开
默认情况下通过mysql触发的查询行为在执行完毕后连接自动释放，包括事务commit or rollback后。

如需要执行后继续使用连接必须使用session并提供keepOpen参数, 通过 
```
let session = await mysql.session({keepOpen:true})
```

事务调用 .begin 已经自动创建了session, 可以通过begin的参数传入keepOpen 
```
let session = mysql.begin({keepOpen:true});
```

使用完后必须手动释放

```
session.close();
```

###使用场景 分页
```
let session = mysql.session({keepOpen:true});
//构建查询
let pick_what_i_want = session.table('test1')
	.where('bod > :bod',{bod: sometime})
	.orderBy('id desc');

//克隆查询用于查询总数
let total_items = pick_what_i_want.clone();
total_items.counted(true);

//分页
pick_what_i_want.page( 1, 10 );

//执行查询
let total_result = await total_items.select();
let items_result = await pick_what_i_want.select();

await session.close();

return {
	total: total_result.rows[0],
	items: items_result.rows,
	page: 1,
	take: 10
}
	
```


##API
mysql

| 函数 | 参数 | 返回 | 描述 |
|:--------:|:-------:|:-----:|:--------------------:|
| session(options) | keep
