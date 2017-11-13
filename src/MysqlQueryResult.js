/*************************************************
 * @copyright 2017 Flision Corporation Inc.
 * @author: Vincent Chan @ Canton
 * @date: 2017年11月13日
 * @version: 1.0.0
 * @description:
 **************************************************/

class MysqlQueryResult {
    constructor(sql,result,fields){
        this.sql = sql;
        this.rows = result;
        this.fields = fields;

        const {changedRows,affectedRows,insertId} = result;

        this.changed_rows = changedRows;
        this.affected_rows = affectedRows;
        this.insert_id = insertId;

        /// Some developer love to use camelcase
        this.changedRows = changedRows;
        this.affectedRows = affectedRows;
        this.insertId = insertId;
    }
}

module.exports = MysqlQueryResult;