import { Sequelize, DataTypes, Model } from "sequelize";
import { UserEmail } from "./UserEmail";

export class User extends Model {
  declare id: string;
  declare fullname: string;
  declare emails: UserEmail[];

  static initSchema(sequelize: Sequelize) {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        fullname: {
          type: DataTypes.STRING,
          allowNull: false,
        },
      },
      { sequelize, tableName: "users" }
    );
    User.sync({ alter: true });
  }
}
