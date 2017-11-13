/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月09日
 * @version: 1.0.0
 * @description:
 **************************************************/

const _ = require('lodash');

class QueryCommand {
    constructor( commandBuilder, executor ){
        this._builder = commandBuilder;
        this._executor = executor;
    }

    where( condition, values ){
        this._builder.setWhere(condition, values);
        return this;
    }

    orderBy( values ){
        this._builder.setOrderBy( values );
        return this;
    }

    groupBy(){
        return this;
    }

    having(){
        return this;
    }

    counted( enable ){
        this._builder.setCounted(enable);
        return this;
    }

    page( page, take ){
        this._builder.setPaged(page,take);
        return this;
    }

    select( fields ){
        let sql = this._builder.buildSelect( fields );
        return this.execute(sql);
    }

    execute(sql){
        return this._executor.execute(sql);
    }

    clone(){
        let newObj = _.clone(this);
        newObj._builder = this._builder.clone();
        return newObj;
        //return new QueryCommand(newBuilder,this._executor);
    }
}

module.exports = QueryCommand;