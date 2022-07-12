import { Model } from "sequelize";

// const TokenSchema = sequelize.define("user", {
//   user: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   refreshToken: { type: DataTypes.STRING },
// });

export default (sequelize, Sequelize) => {
  class token extends Model{
    static associate(models) {
      models.token.belongsToMany(models.article, {
        through: {
          model: models.article_tag,
          unique: false,
        },
        foreignKey: 'tag_id',
      });
    }
  };
  
  token.init({
    user: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
    refreshToken: { type: Sequelize.STRING },
  });
  return token;
};
