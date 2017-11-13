/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月13日
 * @version: 1.0.0
 * @description:
 **************************************************/

const CommandBuilder = require( './MysqlCommandBuilder' );
const QueryCommand = require( './commands/QueryCommand' );
const TableCommand = require( './commands/TableCommand' );

class MysqlSession {
    constructor( conn, options ) {
        this._conn = conn;
        options = options || {};
        this._keepOpen = options.keepOpen || false;
        this._isTransaction = false;
        this._disposed = false;
    }

    get Disposed(){
        return this._disposed;
    }

    async begin(transactionOptions) {
        await this._conn.begin(transactionOptions);
        this._isTransaction = true;
    }

    async commit() {
        await this._conn.commit();
        this._isTransaction = false;
        if( !this._keepOpen ){
            await this.close();
        }
    }

    async rollback() {
        await this._conn.rollback();
        this._isTransaction = false;
        if( !this._keepOpen ){
            await this.close();
        }
    }

    table( tableName ) {
        let commandBuilder = new CommandBuilder( tableName );
        return new TableCommand( commandBuilder, {
            execute:(sql,values)=>{ return this.execute(sql,values)}
        } );
    }

    view( viewName ) {
        let commandBuilder = new CommandBuilder( tableName );
        return new QueryCommand( commandBuilder, {
            execute:(sql,values)=>{ return this.execute(sql,values)}
        } );
    }

    proc( procName ) {

    }


    async execute( sql, values ) {
        let result = await this._conn.execute( sql, values );
        if( !this._keepOpen && !this._isTransaction ){
            await this.close();
        }
        return result;
    }

    async close(){
        if( this._isTransaction ){
            await this._conn.rollback();
            this._isTransaction = false;
        }
        await this._conn.release();
        this._disposed = true;
    }
}

module.exports = MysqlSession;
