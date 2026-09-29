import pool from './db.js';

try {
  const [rows] = await pool.query('SELECT 1 AS ok');
  console.log(rows[0].ok === 1 ? 'Conexión MySQL correcta.' : 'Respuesta inesperada de MySQL.');
} catch (error) {
  console.error(`No fue posible conectar con MySQL: ${error.message}`);
  process.exitCode = 1;
} finally {
  await pool.end();
}
