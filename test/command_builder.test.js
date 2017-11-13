/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月09日
 * @version: 1.0.0
 * @description:
 **************************************************/

const assert = require('chai').assert;
const sqlstring = require( 'sqlstring' );
const CommandBuilder = require( '../src/MysqlCommandBuilder' );
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

suite( 'CommandBuilder', function () {

    let driver;
    let time = new Date();
    let binObj = { name: 'vincent', time };
    let bin;

    setup( async function () {
        driver = sqlstring;
        bin = await zip( binObj );
    } );

    test( '#setWhere empty args', function () {
        const builder = new CommandBuilder( 't_test1', driver );
        builder.setWhere( 'id=(select * from t_test2)' );

        assert.equal(builder._whereCause,'WHERE id=(select * from t_test2)');

    } );

    test('#setWhere args is array',function () {
        const builder = new CommandBuilder( 't_test1', driver );
        builder.setWhere( '`id`=? and name=? and `time`=? and `binary`=?', [ 1, 'vincent', time, bin ] );
        console.log(builder._whereCause);
    });
    test('#setWhere args is obj',function () {
        const builder = new CommandBuilder( 't_test1', driver );
        let obj = {
            id: 1,
            name: 'vincent',
            time,
            bin
        };
        builder.setWhere( '`id`=:id and `name`=:name and `binary`=:bin', obj );
        console.log(builder._whereCause);
    });


    test( '#buildSelect by obj', function () {
        const builder = new CommandBuilder( 't_test1', driver );
        let sql = builder.buildSelect({id:undefined,name:undefined});

        console.log( sql );
    } );

    test( '#buildSelect by array', function () {
        const builder = new CommandBuilder( 't_test1', driver );
        let sql = builder.buildSelect(['id','name']);

        console.log( sql );
    } );

    test( '#buildSelect by string', function () {
        const builder = new CommandBuilder( 't_test1', driver );
        let sql = builder.buildSelect('id,name');

        console.log( sql );
    } );

    test('#buildSelect paged',function () {
        const builder = new CommandBuilder( 't_test1', driver );
        let obj = {
            id: 1,
            name: 'vincent',
            time,
            bin
        };
        builder.setWhere( 'id=:id and name=:name', obj );
        builder.setAlias('t1');
        builder.setOrderBy('`id` desc');

        const builder2 = builder.clone();
        builder.setPaged(3,10);
        builder2.setCounted(true);

        let sql = builder.buildSelect();
        let sql_count = builder2.buildSelect();
        console.log('sql',sql);
        console.log('sql_count',sql_count);
    });

    test('#buildUpdate',function () {
        const builder = new CommandBuilder( 't_test1', driver );
        let obj = {
            name: 'vincent_1',
            time
        };
        builder.setWhere('id = :id',{id:1});
        let sql = builder.buildUpdate(obj);
        console.log(sql);
    });

    test('#buildInsert',function () {
        const builder = new CommandBuilder( 't_test1', driver );
        let obj = {
            name: 'vincent'
        };
        let sql = builder.buildInsert(obj);
        console.log(sql);
        assert.equal('INSERT INTO `t_test1` SET `name` = \'vincent\'', sql);
    })

    test('#buildDelete',function () {
        const builder = new CommandBuilder( 't_test1', driver );
        builder.setWhere('`id` > :id',{id:5});
        let sql = builder.buildDelete();
        console.log(sql);
    })
} );