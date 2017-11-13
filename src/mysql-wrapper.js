/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月09日
 * @version: 1.0.0
 * @description:
 **************************************************/

const mysql = require( 'mysql' );
const MysqlQueryResult = require('./MysqlQueryResult');

exports.create_connection = function ( config ) {
    return new Promise( ( resolve, reject ) => {
        const conn = mysql.createConnection( config );
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

exports.create_pool = function ( config ) {
    const pool = mysql.createPool( config );
    return pool;
}

exports.create_pool_connection = function ( pool ) {
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
    if ( field.type === 'TIMESTAMP' ||
        field.type === 'DATE' ||
        field.type === 'DATETIME' ) {
        return field.string();
    }
    return next();
}



exports.query = function ( conn, sql, values = {}, options = {} ) {

    let query_options = {
        sql,
        typeCast: customCast,
        timeout: options.timeout
    };
    return new Promise( ( resolve, reject ) => {
        const query = conn.query( query_options, values, ( err, result, fields ) => {
            if ( err ) {
                reject( { sql: query.sql, err } );
            }
            else {
                resolve( new MysqlQueryResult(query.sql,result,fields) );
            }
        } );
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
