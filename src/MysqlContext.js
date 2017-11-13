/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月09日
 * @version: 1.0.0
 * @description:
 **************************************************/

const EventEmitter = require('events');

const {Events} = require('./constant');

class MysqlContext extends EventEmitter {
    constructor(options){
        super();

        this._logSQL = options.logSQL || false;
    }

    get Events(){
        return Events;
    }

    get IsLogSQL(){
        return this._logSQL;
    }
}



module.exports = MysqlContext;

