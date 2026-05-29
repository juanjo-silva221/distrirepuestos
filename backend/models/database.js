import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let database = null;

function getSqliteDatabasePath() {
  return process.env.DATABASE_PATH ?? path.join(__dirname, '..', 'data', 'motorepuestos.db');
}

function getDatabaseClientName() {
  const configuredClient = process.env.DB_CLIENT;

  if (configuredClient) {
    return configuredClient.toLowerCase();
  }

  return process.env.DB_HOST || process.env.DB_NAME ? 'mysql' : 'sqlite';
}

export function isMysqlMode() {
  return getDatabaseClientName() === 'mysql';
}

export function getMySqlConfig() {
  return {
    host: process.env.DB_HOST ?? '127.0.0.1',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'motorepuestos'
  };
}

export function getDatabaseConfig() {
  if (isMysqlMode()) {
    return {
      client: 'mysql',
      ...getMySqlConfig()
    };
  }

  return {
    client: 'sqlite',
    path: getSqliteDatabasePath()
  };
}

function escapeIdentifier(value) {
  return '`' + String(value).replace(/`/g, '``') + '`';
}

async function createSqliteClient() {
  const { DatabaseSync } = await import('node:sqlite');
  const sqliteDatabasePath = getSqliteDatabasePath();

  mkdirSync(path.dirname(sqliteDatabasePath), { recursive: true });

  const sqlite = new DatabaseSync(sqliteDatabasePath);

  return {
    async exec(sql) {
      sqlite.exec(sql);
    },
    prepare(sql) {
      const statement = sqlite.prepare(sql);

      return {
        async all(params = {}) {
          return statement.all(params);
        },
        async get(params = {}) {
          return statement.get(params);
        },
        async run(params = {}) {
          return statement.run(params);
        }
      };
    },
    async close() {
      sqlite.close();
    }
  };
}

async function createMysqlClient() {
  let mysql;

  try {
    mysql = await import('mysql2/promise');
  } catch (error) {
    error.message = `${error.message}. Instala las dependencias del backend con \`npm install\` para usar MySQL.`;
    throw error;
  }

  const config = getMySqlConfig();
  const bootstrapConnection = await mysql.createConnection({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    namedPlaceholders: true,
    charset: 'utf8mb4'
  });

  await bootstrapConnection.query(
    `CREATE DATABASE IF NOT EXISTS ${escapeIdentifier(config.database)} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  await bootstrapConnection.end();

  const pool = mysql.createPool({
    host: config.host,
    port: config.port,
    user: config.user,
    password: config.password,
    database: config.database,
    waitForConnections: true,
    connectionLimit: 10,
    namedPlaceholders: true,
    charset: 'utf8mb4'
  });

  return {
    async exec(sql) {
      await pool.query(sql);
    },
    prepare(sql) {
      return {
        async all(params = {}) {
          const [rows] = await pool.execute(sql, params);
          return rows;
        },
        async get(params = {}) {
          const [rows] = await pool.execute(sql, params);
          return rows[0] ?? null;
        },
        async run(params = {}) {
          const [result] = await pool.execute(sql, params);
          return result;
        }
      };
    },
    async close() {
      await pool.end();
    }
  };
}

async function createDatabaseClient() {
  return isMysqlMode() ? createMysqlClient() : createSqliteClient();
}

function getSchemaStatements() {
  if (isMysqlMode()) {
    return [
      `
        CREATE TABLE IF NOT EXISTS products (
          id INT NOT NULL,
          brand VARCHAR(120) NOT NULL,
          title VARCHAR(255) NOT NULL,
          specs VARCHAR(255) NOT NULL,
          price INT NOT NULL,
          stock INT NOT NULL,
          category VARCHAR(120) NOT NULL,
          category_slug VARCHAR(120) NOT NULL,
          image VARCHAR(255) NOT NULL,
          PRIMARY KEY (id),
          KEY idx_products_category_slug (category_slug)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      `
        CREATE TABLE IF NOT EXISTS users (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(120) NOT NULL,
          email VARCHAR(255) NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at VARCHAR(40) NOT NULL,
          PRIMARY KEY (id),
          UNIQUE KEY uq_users_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      `
        CREATE TABLE IF NOT EXISTS orders (
          id VARCHAR(32) NOT NULL,
          customer_name VARCHAR(120) NOT NULL,
          customer_email VARCHAR(255) NOT NULL,
          customer_phone VARCHAR(50) NOT NULL,
          shipping_address VARCHAR(255) NOT NULL,
          city VARCHAR(120) NOT NULL,
          payment_method VARCHAR(50) NOT NULL,
          total INT NOT NULL,
          status VARCHAR(50) NOT NULL,
          items_json LONGTEXT NOT NULL,
          created_at VARCHAR(40) NOT NULL,
          PRIMARY KEY (id),
          KEY idx_orders_customer_email (customer_email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `,
      `
        CREATE TABLE IF NOT EXISTS contact_messages (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(120) NOT NULL,
          phone VARCHAR(50) NOT NULL,
          email VARCHAR(255) NOT NULL,
          message TEXT NOT NULL,
          created_at VARCHAR(40) NOT NULL,
          PRIMARY KEY (id),
          KEY idx_contact_messages_email (email)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `
    ];
  }

  return [
    `
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        brand TEXT NOT NULL,
        title TEXT NOT NULL,
        specs TEXT NOT NULL,
        price INTEGER NOT NULL,
        stock INTEGER NOT NULL,
        category TEXT NOT NULL,
        category_slug TEXT NOT NULL,
        image TEXT NOT NULL
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        customer_name TEXT NOT NULL,
        customer_email TEXT NOT NULL,
        customer_phone TEXT NOT NULL,
        shipping_address TEXT NOT NULL,
        city TEXT NOT NULL,
        payment_method TEXT NOT NULL,
        total INTEGER NOT NULL,
        status TEXT NOT NULL,
        items_json TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `,
    `
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        phone TEXT NOT NULL,
        email TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT NOT NULL
      )
    `,
    'CREATE INDEX IF NOT EXISTS idx_products_category_slug ON products(category_slug)',
    'CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email)',
    'CREATE INDEX IF NOT EXISTS idx_contact_messages_email ON contact_messages(email)'
  ];
}

export function getInsertedId(result) {
  return isMysqlMode() ? result.insertId : Number(result.lastInsertRowid);
}

export function getDatabase() {
  if (!database) {
    throw new Error('Database has not been initialized');
  }

  return database;
}

export async function initializeDatabase() {
  if (database) {
    return database;
  }

  database = await createDatabaseClient();

  for (const statement of getSchemaStatements()) {
    await database.exec(statement);
  }

  return database;
}

export async function closeDatabase() {
  if (!database) {
    return;
  }

  await database.close();
  database = null;
}
