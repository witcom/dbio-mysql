/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月10日
 * @version: 1.0.0
 * @description:
 **************************************************/

const _ = require('lodash');
const EventEmitter = require('events');
const {Events} = require('./constant');
const CommandBuilder = require('../commands/CommandBuilder');

const builderOptions = {
    forceUpdate:false,
    forceDelete:false
};

class EngineContext extends EventEmitter {
    constructor( options ){
        super();

        this._pool = options.pool || false;
        this._logSQL = options.logSQL || false;

        this._builderOptions = _.defaults(builderOptions,options);
    }

    get isPool(){
        return this._pool;
    }

    get driver(){
        return this._driver;
    }

    setDriver( driver ){
        this._driver = driver;
        driver.on(Events.ERROR,(err)=>{this.emit(Events.Error,err)});
        driver.on(Events.SQL,(sql)=>{ if(this._logSQL){ this.emit(Events.SQL,sql)}});
    }

    createCommandBuilder( tableName ){
        return new CommandBuilder(tableName, this._builderOptions);
    }
}

module.exports = EngineContext;