/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月09日
 * @version: 1.0.0
 * @description:
 **************************************************/

class QueryCommand {
    constructor( context, builder ){
        this._builder = builder;
        this._execute = context.execute;
    }

    where( condition, values ){
        this._builder.setWhere(condition, values);
    }

    orderBy( values ){
        this._builder.setOrderBy( values );
    }

    groupBy(){}

    having(){}

    page( page, take ){
        this._builder.setPage(page,take);
    }

    select( fields ){
        let sql = this._builder.buildSelect( fields );
        this._execute(sql);
    }
}

module.exports = QueryCommand;