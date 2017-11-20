/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月09日
 * @version: 1.0.0
 * @description:
 **************************************************/

const _ = require( 'lodash' );
const SqlFormat = require('sqlstring');

function keyedFormat( query, values,escape ) {
    if ( !values ) return query;
    return query.replace( /\:(\w+)/g, function ( txt, key ) {
        if ( values.hasOwnProperty( key ) ) {
            return escape( values[ key ] );
        }
        return txt;
    });
}

class MysqlCommandBuilder {
    constructor( tableName, options = {} ) {

        this._options = options;
        this._forceDelete = options.forceDelete || false;
        this._forceUpdate = options.forceUpdate || false;

        this._tableName = tableName;

        this._alias = false;
        this._aliasName = '';

        this._paged = false;
        this._page = 0;
        this._take = 0;

        this._orderBy = false;
        this._orderCause = '';

        this._groupBy = false;
        this._groupFields = 'id';

        this._join = false;
        this._joinCause = '';

        this._having = false;
        this._havingCause = '';
        this._havingArgs = {};

        this._where = false;
        this._whereCause = '';


        this._counted = false;

    }

    get paged() {
        return this._paged;
    }

    get isCounted() {
        return this._counted;
    }

    get hasAlias(){
        return this._alias;
    }

    get alias(){
        return this._aliasName;
    }

    setAlias( name ){
        if(_.isUndefined(name)){
            this._alias = false;
            this._aliasName = '';
        }else {
            this._alias = true;
            this._aliasName = `AS \`${name}\``;
        }
        return this;
    }

    setPaged( page, take ) {
        if ( _.isUndefined( page ) ) {
            this._paged = false;
            this._page = 0;
        }

        if ( page === 0 || !_.isNumber( page ) ) {
            page = 1;
        }
        if ( take === 0 || !_.isNumber( take ) || _.isUndefined( take ) ) {
            take = 1;
        }

        this._paged = true;
        this._page = page;
        this._take = take;
        return this;
    }

    setCounted( enable ) {
        this._counted = enable === undefined ? false : enable;
        return this;
    }

    setJoin( str ){
        if(str === '' || str === undefined){
            this._join = false
        }else{
            this._join = true;
            this._joinCause = str;
        }
    }

    setWhere( condition, ...args ) {
        if ( _.isUndefined( condition ) ) {
            this._where = false;
            this._whereCause = '';
            return this;
        }

        this._where = true;

        let whereCause = condition;

        if ( args.length !== 0 ) {

            const format = SqlFormat.format;
            const escape = SqlFormat.escape;

            const argv = args[ 0 ];
            if ( _.isArray( argv ) ) {
                whereCause = format( condition, argv );
            } else if ( _.isObject( argv ) ) {
                whereCause = keyedFormat(condition, argv, escape);
            }
        }

        this._whereCause = `WHERE ${whereCause}`;
    }

    setOrderBy(args){
        if( _.isUndefined(args)){
            this._orderBy = false;
            return this;
        }

        this._orderBy = true;

        if( typeof args === 'string'){
            this._orderCause = `ORDER BY ${args}`;
        }
    }

    buildSelect( fields ) {
        const escape = SqlFormat.escape;

        if ( fields instanceof Array ) {
            // fields = _.join(fields.map((v)=>{
            //     return `${v}`
            // }),',');
            fields = _.join(fields,',');
        } else if ( typeof fields === 'object' ) {
            fields = _.join(_.keys(fields).map((v)=>{ return `\`${v}\``}));
        } else if ( typeof fields === 'string') {

        } else {
            fields = '*'
        }

        if ( this._counted ) {
            if ( fields instanceof Array ) {
                fields = `COUNT(\`${fields[ 0 ]}\`) as count`;
            } else {
                fields = `COUNT(*) as count`;
            }
        }

        let sql = `SELECT ${fields} FROM \`${this._tableName}\` `;

        if(this._alias){
            sql = sql + `${this._aliasName} `;
        }

        if(this._join){
            sql += `${this._joinCause} `;
        }

        if ( this._where ) {
            sql = sql + `${this._whereCause} `
        }

        if ( this._orderBy ) {
            sql = sql + `${this._orderCause} `
        }

        if ( this._groupBy ) {
            sql = sql + `${this._groupFields} `
        }

        if ( this._having ) {
            sql = sql + `${this._havingCause}`
        }

        if ( this._paged ) {
            const take = this._take;
            let skip = (this._page - 1) * take;

            sql = sql + `LIMIT ${skip},${take} `
        }

        return `${sql}`;
    }

    /**
     *
     * @param values an Object is required
     */
    buildInsert( values ) {
        const escape = SqlFormat.escape;

        values = escape(values);

        return `INSERT INTO \`${this._tableName}\` SET ${values}`;
    }

    /**
     *
     * @param values an Object is required
     */
    buildUpdate( values ) {
        const escape = SqlFormat.escape;
        values = escape(values);

        let sql = `UPDATE \`${this._tableName}\` SET ${values} `;

        if(!this._where){
            console.warn('Caution: Update command without WhereCause will update all rows');
            if(!this._forceUpdate){
                throw new Error('Update must use WhereCause');
            }
        }else{
            sql += this._whereCause;
        }
        return sql;
    }

    buildDelete() {

        let sql = `DELETE FROM \`${this._tableName}\` `;

        if(!this._where){
            console.warn('Caution: Delete command without WhereCause will clean a table');
            if(!this._forceDelete){
                throw new Error('Delete must use WhereCause');
            }
        }else{
            sql += this._whereCause;
        }

        return sql;
    }

    clone(){
        return _.clone(this);
    }
}

module.exports = MysqlCommandBuilder;