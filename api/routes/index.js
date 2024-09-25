const middleware = require('@blocklet/sdk/lib/middlewares');
const router = require('express').Router();
const userDb = require('../db/userDb');

router.use('/user', middleware.user(), (req, res) => res.json(req.user || {}));

router.use('/data', (req, res) =>
  res.json({
    message: 'Hello Blocklet!',
  }),
);

// 获取所有用户
router.get('/users', middleware.user(), (req, res) => {
  userDb.getAllUsers((err, rows) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ users: rows });
  });
});

// 获取单个用户
router.get('/users/:id', middleware.user(), (req, res) => {
  const { id } = req.params;
  userDb.getUser(id, (err, row) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user: row });
  });
});

// 创建新用户
router.post('/users',  middleware.user(),(req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    res.status(400).json({ error: 'Name and email are required' });
    return;
  }
  userDb.createUser(name, email, (err, id) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({ id, message: 'User created successfully' });
  });
});

// 更新用户
router.put('/users/:id',  middleware.user(),(req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  if (!name && !email) {
    res.status(400).json({ error: 'Name or email is required for update' });
    return;
  }
  userDb.updateUser(id, name, email, (err, changes) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (changes === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'User updated successfully' });
  });
});

// 删除用户
router.delete('/users/:id', middleware.user(), (req, res) => {
  const { id } = req.params;
  userDb.deleteUser(id, (err, changes) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (changes === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ message: 'User deleted successfully' });
  });
});

module.exports = router;
