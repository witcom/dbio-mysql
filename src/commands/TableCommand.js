/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月09日
 * @version: 1.0.0
 * @description:
 **************************************************/

const QueryCommand = require('./QueryCommand');

class TableCommand extends QueryCommand {
    constructor( commandBuilder, executor ){
        super(commandBuilder, executor);

    }

    insert( values ){
        let sql = this._builder.buildInsert( values );
        return this._execute(sql);
    }

    update( values ){
        let sql = this._builder.buildUpdate( values );
        return this._execute(sql);
    }

    delete( ){
        let sql = this._builder.buildDelete( );
        return this._execute(sql);
    }
}

module.exports = TableCommand;