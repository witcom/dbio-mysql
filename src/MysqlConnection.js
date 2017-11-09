/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月10日
 * @version: 1.0.0
 * @description:
 **************************************************/

const DbConnection = require('./dbio').DbConnection;
const mysql = require('./mysql-wrapper');

class MysqlConnection extends DbConnection{
    constructor( conn ){
        super();

        this._conn = conn;
    }

    execute(sql,values){
        return mysql.query(this._conn,sql,values);
    }

    begin( options ){
        return mysql.begin(this._conn,options);
    }

    commit(){
        return mysql.commit(this._conn);
    }

    rollback(){
        return mysql.rollback(this._conn);
    }

    release(){
        return this._conn.end();
    }
}