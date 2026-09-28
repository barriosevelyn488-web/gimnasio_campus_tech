import pool from './db.js';

async function testConnection() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS resultado');
    console.log('¡Conexión exitosa a la base de datos! Resultado:', rows[0].resultado);
    process.exit(0);
  } catch (error) {
    console.error('Error al conectar con la base de datos:', error.message);
    process.exit(1);
  }
}

testConnection();