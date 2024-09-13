import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Захешируйте пароль '123456' перед добавлением в массив
const hashedPassword = bcrypt.hashSync('123456', 10);

const users = [
  { id: 1, username: 'user1', email: 'user1@example.com', password: hashedPassword , role: 'user'}
];

const authorizeRole = (role) => (req, res, next) => {
  const user = users.find(u => u.id === req.user.id);
  if (user && user.role === role) {
    next();
  } else {
    res.status(403).send('Access denied');
  }
};




const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);

  if (user) {
    const validPassword = bcrypt.compareSync(password, user.password);
    if (validPassword) {
      const accessToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
      res.json({ accessToken });
    } else {
      res.send('Invalid password');
    }
  } else {
    res.send('User not found');
  }
});

app.put('/update-email', authenticateJWT, (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.id === req.user.id);

  if (user) {
    user.email = email;
    res.send({ message: 'Email updated successfully', user });
  } else {
    res.status(404).send('User not found');
  }
});

app.delete('/delete-account', authenticateJWT, (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.user.id);
  
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.send({ message: 'Account deleted successfully' });
  } else {
    res.status(404).send('User not found');
  }
});


app.put('/update-role', authenticateJWT, authorizeRole('admin'), (req, res) => {
  const { id, newRole } = req.body;
  const user = users.find(u => u.id === id);

  if (user) {
    user.role = newRole;
    res.send({ message: 'Role updated successfully', user });
  } else {
    res.status(404).send('User not found');
  }
});



app.post('/refresh-token', authenticateJWT, (req, res) => {
  const user = req.user;
  const newToken = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token: newToken });
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
