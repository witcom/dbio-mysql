/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月13日
 * @version: 1.0.0
 * @description:
 **************************************************/

const {Events} = require('./constant');
const mysql = require( './mysql-wrapper' );

const { MysqlConnection, MysqlPoolConnection } = require( './MysqlConnection' );

let connection_id = 1;

class MysqlConnectionFactory {
    constructor( context, config ) {

        this._context = context;
        this._config = config;

    }

    assignConnectionId( conn ){
        if( !conn.hasOwnProperty('connection_id')){
            conn.connection_id = connection_id;
            connection_id++;
        }
    }

    getConnection() {
        const config = this._config;
        const context = this._context;

        return mysql.create_connection( config ).then( ( conn ) => {
            conn.on( 'error', ( err ) => context.emit( Events.Error, err ) );
            this.assignConnectionId(conn);
            return new MysqlConnection( context, conn );
        }, ( err ) => {
            context.emit( Events.ERROR, err );
            return Promise.reject( err );
        } );
    }

    release() {
        return Promise.resolve();
    }
}

class MysqlPoolConnectionFactory extends MysqlConnectionFactory {
    constructor( context, config ) {
        super( context, config );

        const pool = mysql.create_pool( config );
        pool.on( 'error', ( err ) => context.emit( Events.Error, err ) );

        this._pool = pool;
    }

    getConnection() {
        const pool = this._pool;
        const context = this._context;

        return mysql.create_pool_connection( pool ).then( ( conn ) => {
            this.assignConnectionId(conn);
            return new MysqlPoolConnection( context, conn );
        });
    }

    release() {
        const pool = this._pool;
        return mysql.release_pool( pool ).then( () => {
            this._pool = undefined;
        } );
    }
}

module.exports = { MysqlConnectionFactory, MysqlPoolConnectionFactory };