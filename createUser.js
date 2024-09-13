import bcrypt from 'bcrypt';
import User from './models/user.js';
import sequelize from './config/db.js';

async function createUser(username, email, password) {
  try {
    await sequelize.authenticate(); // Проверка подключения к базе данных
    await sequelize.sync(); // Синхронизация моделей с базой данных

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log('User created:', user.toJSON());
  } catch (error) {
    console.error('Error creating user:', error);
  }
}

// Пример создания пользователя
createUser('Alena', 'user1@example.com', '123456');
