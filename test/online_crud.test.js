/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月13日
 * @version: 1.0.0
 * @description:
 **************************************************/

const Mysql = require('../index');
const assert = require('chai').assert;

const zlib = require( 'zlib' );

function zip( obj ) {
    return new Promise( ( resolve, reject ) => {
        let str = JSON.stringify( obj );
        zlib.deflate( str, ( err, buffer ) => {
            if ( err ) {
                reject( err );
            } else {
                resolve( buffer );
            }
        } );
    } );
}

function unzip( bin ) {
    return new Promise( ( resolve, reject ) => {
        zlib.unzip( bin, ( err, buffer ) => {
            if ( err ) {
                reject( err );
            } else {
                let obj = JSON.parse( buffer.toString() );
                resolve( obj );
            }
        } );
    } );
}

const config = {
    host:'127.0.0.1',
    user:'test',
    password:'flision',
    database:'test',
    pool:true,
    logSQL:true
};

const time = new Date();

const obj = {
  msg: 'hello'
};

let ziped_obj;


describe('online_curd',function () {

    let mysql;

    before(async function () {
        mysql = new Mysql(config);
        mysql.on(Mysql.Events.Error,(err)=>{
            console.log(err);
        });
        mysql.on(Mysql.Events.SQL,(sql)=>{
            console.log('SQL',sql);
        });

        ziped_obj = await zip(obj)
    });

    after(function () {
        console.log('cleaning...');
       mysql.release();
    });

    describe('normal',function (  ) {
        it('paged',async function (  ) {
           try{
               let total_sql = await mysql.table('t_test1');
               let item_sql = total_sql.clone();

               total_sql.counted(true);
               item_sql.page(1,10);

               let total_result = await total_sql.select();
               let item_result = await item_sql.select();

               assert.isNotNaN(total_result.rows[0]);
               assert.isAtLeast(item_result.rows.length,1);
           }catch (err){
               console.log(err);
           }
        });
        it('查询应该返回空',async function (  ) {
            try{
                let result = await mysql.table('t_test1')
                    .where('id=-1')
                    .select();

                assert.isArray(result.rows);
                assert.lengthOf(result.rows,0);
            }catch (err){
                console.log(err);
            }
        });
        it('插入',async function () {
            try {
                let result = await mysql.table( 't_test1' )
                    .insert( {
                        name: 'test1',
                        date_time: time,
                        timestamp: time,
                        blob: ziped_obj
                    } );

                let lst_id = result.insert_id;
                assert.isNotNaN(result.insert_id);

                result = await mysql.table( 't_test1' )
                    .where( 'id=:id', { id: result.insert_id } )
                    .select();

                assert.isArray(result.rows);
                assert.lengthOf(result.rows,1);
                let row = result.rows[0];

                let unzip_obj = await unzip(row.blob);

                assert.equal(obj.msg,unzip_obj.msg);

                await mysql.table('t_test1')
                    .where('id=:id',{id:lst_id})
                    .delete();


            }catch (err){
                console.log(err);
            }
        });

        it('更新',async function () {
            try{
                let result = await mysql.table('t_test1')
                    .insert({
                        name:'test_willupdate',
                        date_time:time,
                        timestamp:time,
                        blob:ziped_obj
                    });
                let lst_id = result.insertId;
                result = await mysql.table('t_test1')
                    .where('name=:name and id=:id',{id:lst_id,name:'test_willupdate'})
                    .update({name:'test_updated'});

                assert.isNotNaN(result.changedRows);

                result = await mysql.table('t_test1')
                    .where('id=:id',{id:lst_id})
                    .delete();


            }catch (err){
                console.log(err);
            }
        });

        it('删除',async function () {
            try{
                let result = await mysql.table('t_test1')
                    .insert({
                        name:'test_willdelete',
                        date_time:time,
                        timestamp:time,
                        blob:ziped_obj
                    });
                result = await mysql.table('t_test1')
                    .where('name=:name',{name:'test_willdelete'})
                    .delete();
                assert.isNotNaN(result.affectedRows);
            }catch (err){
                console.log(err);
            }
        });

    });


    describe('事务',function () {
        it('事务未提交前插入后应该可以查询',async function () {
            let session = await mysql.begin();
            let result = await session.table('t_test1')
                .insert({
                    name:'test_tx_insert',
                    date_time:time,
                    timestamp:time,
                    blob:ziped_obj
                });
            let id = result.insert_id;
            result = await session.table('t_test1')
                .where('id=:id',{id})
                .select();

            assert.isArray(result.rows);
            assert.lengthOf(result.rows,1);

            session.close();

        });

        it('提交 自动关闭连接',async function () {
            let session  = await mysql.begin();
            let result = await session.table('t_test1')
                .insert({
                    name:'text_tx_insert'
                });

            let id = result.insert_id;

            await session.commit();

            assert.isTrue(session.Disposed);

            //clean up
            await mysql.table('t_test1')
                .where('id=:id',{id})
                .delete();

        });

        it('提交后保持连接打开',async function () {
            let session = await mysql.begin({keepOpen:true});
            console.log(session);
            let result = await session.table('t_test1')
                .insert({name:'text_tx_insert'});

            let id = result.insert_id;

            await session.commit();
            assert.isFalse(session.Disposed);

            //clean up
            await session.table('t_test1')
                .where('id=:id',{id})
                .delete();
            await session.close();
            assert.isTrue(session.Disposed);
        })

    })


});

