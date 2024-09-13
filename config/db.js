// import { Sequelize } from 'sequelize';

// const sequelize = new Sequelize('database_development', 'root', '19841990', {
//   host: 'localhost',
//   dialect: 'mysql',
// });

// export default sequelize;


import { Sequelize } from 'sequelize';


const sequelize = new Sequelize('database_development', 'root', '19841990', {
  host: 'localhost',
  dialect: 'mysql',
});

export default sequelize;
