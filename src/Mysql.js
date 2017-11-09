/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月09日
 * @version: 1.0.0
 * @description:
 **************************************************/

const EngineContext = require('./dbio').EngineContext;
const MysqlDriver = require('./MysqlDriver');


class Mysql {
    constructor( options ){

        const context = new EngineContext( options );

        const driver = new MysqlDriver( options );
        context.setDriver(driver);

        this._context = context;
    }

    on(event_name, callback){
        this._context.on(event_name, callback);
    }

    begin(){

    }

    table( name ){

    }

    view( name ){

    }

    proc( name ){

    }

    exec( sql, ...args ){

    }

    ping(){

    }

    release(){

    }
}


module.exports = Mysql;