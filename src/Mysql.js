/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月09日
 * @version: 1.0.0
 * @description:
 **************************************************/

const MysqlContext = require( './MysqlContext' );
const {
    Events,
    OrderDescend
} = require( './constant' );
const {
    MysqlConnectionFactory,
    MysqlPoolConnectionFactory
} = require( './MysqlConnectionFactory' );
const MysqlSession = require( './MysqlSession' );
const QueryCommand = require( './commands/QueryCommand' );
const TableCommand = require( './commands/TableCommand' );
const CommandBuilder = require( './MysqlCommandBuilder' );

class Mysql {
    constructor( options ) {

        const context = new MysqlContext( options );

        const enablePool = options.pool || false;
        const factory = enablePool ?
            new MysqlPoolConnectionFactory( context, options ) :
            new MysqlConnectionFactory( context, options );

        this._factory = factory;
        this._context = context;
    }

    on( event_name, callback ) {
        return this._context.on( event_name, callback );
    }

    async session( options ) {
        let conn = await this._factory.getConnection();
        return new MysqlSession( conn, options );
    }

    async begin( options ) {
        let session = await this.session(options);
        let transactionOptions = {};
        await session.begin(transactionOptions);
        return session;
    }

    table( tableName ) {
        let commandBuilder = new CommandBuilder( tableName );
        return new TableCommand( commandBuilder, {
            execute: ( sql, values ) => {
                return this.execute( sql, values )
            }
        } );
    }

    view( viewName ) {
        let commandBuilder = new CommandBuilder( tableName );
        return new QueryCommand( commandBuilder, {
            execute: ( sql, values ) => {
                return this.execute( sql, values )
            }
        } );
    }

    proc( name ) {

    }

    async execute( sql, values ) {
        let conn = await this._factory.getConnection();
        let result = conn.execute( sql, values );
        await conn.release();
        return result;
    }

    async ping() {
        let conn = this._factory.getConnection();
        let result = await conn.ping();
        conn.release();
        return result;
    }

    release() {
        return this._factory.release();
    }
}

Mysql.Events = Events;
Mysql.OrderDescend = OrderDescend;

module.exports = Mysql;