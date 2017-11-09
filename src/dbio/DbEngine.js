/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月10日
 * @version: 1.0.0
 * @description:
 **************************************************/

const EngineContext = require('./EngineContext');
const TableCommand = require('../commands/TableCommand');
const QueryCommand = require('../commands/QueryCommand');
const Session = require('./Session');

class DbEngine {
    constructor(driverName, options){

    const context = new EngineContext( options );

    }

    begin(){
        return new Session()
    }

    table( name ){
        let builder = new CommandBuilder(name);
        return new TableCommand(builder,executor);
    }

    view( name ){
        let builder = new CommandBuilder(name);
        return new QueryCommand(builder,executor);
    }

    proc( name ){

    }

    exec( sql, args ){

    }

    ping(){

    }

    release(){

    }
}

DbEngine.Events = require('./constant').Events;
DbEngine.OrderDescend = require('./constant').OrderDescend;
DbEngine.DbDriver = require('./DbDriver');
DbEngine.DbConnection = require('./DbConnection');
DbEngine.EngineContext = require('./EngineContext');


module.exports = DbEngine;