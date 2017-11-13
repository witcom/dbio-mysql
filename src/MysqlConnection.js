/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月10日
 * @version: 1.0.0
 * @description:
 **************************************************/

const mysql = require( './mysql-wrapper' );

class MysqlConnection {
    constructor( context, conn ) {

        this._conn = conn;
        this._context = context;
    }

    execute( sql, values ) {
        const context = this._context;
        return mysql.query( this._conn, sql, values )
            .then( ( result ) => {
                if ( context.IsLogSQL ) {
                    context.emit( context.Events.SQL, result.sql );
                }
                return result;
            }, ( err ) => {
                if ( context.IsLogSQL ) {
                    context.emit( context.Events.SQL, err.sql );
                }
                return Promise.reject( err.err );
            } )
    }

    begin( options ) {
        const context = this._context;
        return mysql.begin( this._conn, options )
            .then( () => {
                if ( context.IsLogSQL ) {
                    context.emit( context.Events.SQL, `Begin Transaction #${this._conn.connection_id}.` )
                }
            } )
    }

    commit() {
        const context = this._context;
        return mysql.commit( this._conn )
            .then( () => {
                if ( context.IsLogSQL ) {
                    context.emit( context.Events.SQL, `Commit Transaction #${this._conn.connection_id}.` )
                }
            } );
    }

    rollback() {
        const context = this._context;
        return mysql.rollback( this._conn )
            .then( () => {
                if ( context.IsLogSQL ) {
                    context.emit( context.Events.SQL, `Rollback Transaction #${this._conn.connection_id}.` )
                }
            } )
    }

    ping(){
        return mysql.ping(this._conn);
    }

    release() {
        return this._conn.end();
    }
}

class MysqlPoolConnection extends MysqlConnection {
    constructor( context, conn ) {
        super( context, conn );

    }

    release() {
        return this._conn.release();
    }
}

module.exports = { MysqlConnection, MysqlPoolConnection };