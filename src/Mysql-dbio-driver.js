/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月10日
 * @version: 1.0.0
 * @description:
 **************************************************/

const dbio = require('./dbio');
const {DbDriver} = dbio;
const MysqlContext = require('./MysqlContext');

const {
    MysqlConnectionFactory,
    MysqlPoolConnectionFactory
} = require('./MysqlConnectionFactory');

class MysqlDriver extends DbDriver {
    constructor( options ){
        super();

        const context = new MysqlContext(options);
        context.on(context.Events.Error,(err)=>{this.emit(this.Events.Error)});
        context.on(context.Events.SQL,(sql)=>{this.emit(this.Events.SQL)});

        const enablePool = options.pool || false;
        const factory = enablePool ?
            new MysqlPoolConnectionFactory(context, options):
            new MysqlConnectionFactory(context,options);

        this._factory = factory;

    }

    getConnection(){
        return this._factory.getConnection();
    }


    release(){
        return this._factory.release();
    }
}

module.exports = MysqlDriver;