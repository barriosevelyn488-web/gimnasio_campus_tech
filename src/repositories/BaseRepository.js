import pool from '../config/db.js';
/** Base común para encapsular consultas parametrizadas. */
export default class BaseRepository {
 static async query(sql,params=[]) { const [rows]=await pool.execute(sql,params); return rows; }
 static async execute(sql,params=[]) { const [result]=await pool.execute(sql,params); return result; }
 static getConnection() { return pool.getConnection(); }
}
