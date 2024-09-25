const sqlite3 = require('sqlite3').verbose();

class UserDb {
  constructor() {
    this.db = new sqlite3.Database('./users.db', (err) => {
      if (err) {
        console.error('Error opening database', err);
      } else {
        console.log('Database connected');
        this.createTable();
        this.insertDefaultUser();
      }
    });
  }

  createTable() {
    const sql = `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )`;
    this.db.run(sql);
  }

  insertDefaultUser() {
    const sql = 'SELECT COUNT(*) as count FROM users';
    this.db.get(sql, [], (err, row) => {
      if (err) {
        console.error('Error checking users table:', err);
        return;
      }
      if (row.count === 0) {
        const insertSql = 'INSERT INTO users (name, email) VALUES (?, ?)';
        this.db.run(insertSql, ['Default User', 'default@example.com'], (err) => {
          if (err) {
            console.error('Error inserting default user:', err);
          } else {
            console.log('Default user inserted successfully');
          }
        });
      }
    });
  }

  getAllUsers(callback) {
    this.db.all('SELECT * FROM users', [], callback);
  }

  getUser(id, callback) {
    this.db.get('SELECT * FROM users WHERE id = ?', [id], callback);
  }

  createUser(name, email, callback) {
    const sql = 'INSERT INTO users (name, email) VALUES (?, ?)';
    this.db.run(sql, [name, email], function(err) {
      callback(err, this.lastID);
    });
  }

  updateUser(id, name, email, callback) {
    let sql = 'UPDATE users SET ';
    const params = [];
    if (name) {
      sql += 'name = ?, ';
      params.push(name);
    }
    if (email) {
      sql += 'email = ?, ';
      params.push(email);
    }
    sql = sql.slice(0, -2);
    sql += ' WHERE id = ?';
    params.push(id);

    this.db.run(sql, params, function(err) {
      callback(err, this.changes);
    });
  }

  deleteUser(id, callback) {
    const sql = 'DELETE FROM users WHERE id = ?';
    this.db.run(sql, id, function(err) {
      callback(err, this.changes);
    });
  }
}

module.exports = new UserDb();