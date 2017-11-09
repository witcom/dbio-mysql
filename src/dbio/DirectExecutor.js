/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月10日
 * @version: 1.0.0
 * @description:
 **************************************************/

class DirectExecutor {
    constructor( driver ){
        this._driver = driver;
    }

    async execute( sql, values ){
       const conn = this._driver.getConnection();
       let result = await conn.execute( sql, values );

    }
}