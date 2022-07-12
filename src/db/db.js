import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import configFile from '../config/config.json';
import requireDirectory from "require-directory";

const models = requireDirectory(module, "./models/");
const basename = path.basename(module.filename);
const env = process.env.NODE_ENV || 'development';
const config = configFile[env]
const db = {};

let sequelize;

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable]);
} else {
  sequelize = new Sequelize(
    config.database, config.username, config.password, config
  );
};

fs
  .readdirSync(`${__dirname}/models`)
  .filter((file) =>
    (file.indexOf('.') !== 0) &&
    (file !== basename) &&
    (file.slice(-3) === '.js'))
  .forEach((file) => {
    const fileName = file.slice(0, -3);
    if (fileName === "index") {
      return;
    };

    const model = models[fileName].default(sequelize, Sequelize.DataTypes);

    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
