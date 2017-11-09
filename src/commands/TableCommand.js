/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月09日
 * @version: 1.0.0
 * @description:
 **************************************************/



class TableCommand extends QueryCommand {
    constructor( context, builder ){
        super(context, builder);

    }

    insert( values ){
        let sql = this._builder.buildInsert( values );
        this._execute(sql);
    }

    update( values ){
        let sql = this._builder.buildUpdate( values );
        this._execute(sql);
    }

    delete( ){
        let sql = this._builder.buildDelete( );
        this._execute(sql);
    }
}

module.exports = TableCommand;