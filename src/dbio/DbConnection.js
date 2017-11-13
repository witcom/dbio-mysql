/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月10日
 * @version: 1.0.0
 * @description:
 **************************************************/

const {Events} = require("./constant");

let connection_id = 0;

class DbConnection {
    constructor( ){
        connection_id = connection_id + 1;
    }

    get Events(){
        return Events;
    }

    get ConnectionId(){
        return connection_id;
    }

    execute( sql,values ){

    }

    begin(){

    }

    commit(){

    }

    rollback(){

    }

    release(){

    }
}

module.exports = DbConnection;