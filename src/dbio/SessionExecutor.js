/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月10日
 * @version: 1.0.0
 * @description:
 **************************************************/

class SessionExecutor {
    constructor( executor ){
        this._nextExecutor = executor;
    }

    execute( sql, values ){
        const conn = this._nextExecutor.connection;
        conn.
    }
}