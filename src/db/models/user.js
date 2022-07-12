import { Model } from "sequelize";

export default (sequelize, Sequelize) => {
  class User extends Model {
    static associate(models) {
      // models.user.belongsToMany(models.request, {
      //   through: {
      //     model: models.request_user,
      //     unique: false,
      //   },
      //   foreignKey: 'user_id',
      // });
      // models.user.belongsToMany(models.candidate, {
      //   through: models.user_subscriptions,
      //   foreignKey: 'user_id',
      //   as: 'subscriptions',
      // });
      // models.user.belongsToMany(models.project, {
      //   through: models.user_project,
      //   foreignKey: 'user_id',
      //   as: 'project',
      // });
    }
  }

  User.init({
    id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    firstName: {
      type: Sequelize.STRING,
      notEmpty: true,
    },

    email: {
      type: Sequelize.STRING,
      unique: true,
      notEmpty: true,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: Sequelize.STRING,
      allowNull: false,
      // set(password) {
      //   return this.setDataValue('password', hash(password));
      // },
    },

    role: {
      type: Sequelize.STRING,
      defaultValue: "USER",
    },

    firstName: {
      type: Sequelize.STRING,
    },

    lastName: {
      type: Sequelize.STRING,
    },

    gender: {
      type: Sequelize.STRING,
      default: "none",
    },
    status: {
      type: Sequelize.STRING,
    },
    img: { type: Sequelize.STRING },
    // isActivated: { type: Sequelize.BOOLEAN, default: false },
    // activationLink: { type: Sequelize.STRING },
  },
  {
    sequelize,
    modelName: 'user',
    defaultScope: {
      attributes: {
        exclude: ['password'],
      },
    },
    // freezeTableName: true,
  },);
  return User;
};
