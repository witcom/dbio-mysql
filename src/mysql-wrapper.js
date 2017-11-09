/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月09日
 * @version: 1.0.0
 * @description:
 **************************************************/

const mysql = require( 'mysql' );
const events = require( './events' );


exports.create_connection = function ( config, event_bus ) {
    return new Promise( ( resolve, reject ) => {
        const conn = mysql.createConnection( config );
        conn.on( 'error', ( err ) => {
            event_bus.emit( events.ERROR, err );
        } );
        conn.connect( ( err ) => {
            if ( err ) {
                reject( err )
            }
            else {
                resolve( conn );
            }
        } );
    } );
}

exports.create_pool = function ( config, event_bus ) {
    const pool = mysql.createPool( config );
    pool.on( 'error', ( err ) => {
        event_bus.emit( events.ERROR, err );
    } );
    return Promise.resolve( pool );
}

exports.create_connection_pool = function ( pool ) {
    return new Promise( ( resolve, reject ) => {
        pool.getConnection( ( err, conn ) => {
            if ( err ) {
                reject( err )
            }
            else {
                resolve( conn );
            }
        } );
    } );
}

exports.release_pool = function ( pool ) {
    return new Promise( ( resolve, reject ) => {
        pool.end( ( err ) => {
            if ( err ) {
                reject( err )
            }
            else {
                resolve()
            }
        } );
    } );
}

exports.ping = function ( conn ) {
    return new Promise( ( resolve, reject ) => {
        conn.ping( ( err ) => {
            if ( err ) {
                reject( err )
            }
            else {
                resolve( conn )
            }
        } );
    } );
};

function customCast( field, next ) {

    //日期时间直接返回字符串
    if( field.type === 'TIMESTAMP' ||
        field.type === 'DATE' ||
        field.type === 'DATETIME'){
        return field.string();
    }
    return next();
}

exports.query = function ( conn, sql, values ={}, options={} ) {
    let log_sql = options.log_sql || false;
    let logger = options.logger;
    let query_options = {
        sql,
        typeCast: customCast,
        timeout: options.timeout
    };
    return new Promise( ( resolve, reject ) => {
        const query = conn.query( query_options, values, ( err, result, fields ) => {
            if ( err ) {
                reject( err );
            }
            else {
                resolve( {
                    rows: result,
                    fields,
                    changed_rows: result.changedRows,
                    affected_rows: result.affectedRows,
                    insert_id: result.insertId
                } );
            }
        } );
        if ( log_sql && typeof logger === 'function' ) {
            logger( query.sql );
        }
    } );
};

exports.begin = function ( conn, options ) {
    return new Promise( ( resolve, reject ) => {
        conn.beginTransaction( options, ( err ) => {
            if ( err ) {
                reject( err )
            }
            else {
                resolve( conn );
            }
        } );
    } );
};

exports.commit = function ( conn, options ) {
    return new Promise( ( resolve, reject ) => {
        conn.commit( options, ( err ) => {
            if ( err ) {
                reject( err )
            }
            else {
                resolve( conn );
            }
        } );
    } );
};

exports.rollback = function ( conn, options ) {
    return new Promise( ( resolve, reject ) => {
        conn.rollback( options, ( err ) => {
            if ( err ) {
                reject( err )
            }
            else {
                resolve( conn );
            }
        } );
    } );
};

exports.keyed_query_format = function ( query, values ) {
    if ( !values ) return query;
    return query.replace( /\:(\w+)/g, function ( txt, key ) {
        if ( values.hasOwnProperty( key ) ) {
            return this.escape( values[ key ] );
        }
        return txt;
    }.bind( this ) );
};
