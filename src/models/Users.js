import { DataTypes, Model } from "sequelize";

export default function initUsersModel(sequelize) {
  class Users extends Model {}

  Users.init(
    {
      id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(120),
        allowNull: true,
      },
      idade: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING(120),
        allowNull: true,
      },
      telefone: {
        type: DataTypes.STRING(120),
        allowNull: true,
      },
      endereco: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      cidade: {
        type: DataTypes.STRING(120),
        allowNull: false,
      },
      senha: {
        type: DataTypes.STRING(120),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "users",
      modelName: "Users",
      timestamps: true,
      underscored: true,
    }
  );

  return Users;
}
