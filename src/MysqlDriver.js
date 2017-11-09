/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月10日
 * @version: 1.0.0
 * @description:
 **************************************************/

const dbio = require('./dbio');
const {DbDriver,Events} = dbio;
const MysqlContext = require('./MysqlContext');

class MysqlDriver extends DbDriver {
    constructor( options ){
        super();

        const context = new MysqlContext();

    }

    getConnection(){

    }


    release(){

    }
}

module.exports = MysqlDriver;