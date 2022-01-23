import { Sequelize, DataTypes, Model } from "sequelize";
import { User } from "./User";

export class UserEmail extends Model {
  declare id: string;
  declare userId: string;
  declare email: string;
  declare isPrimary: boolean;

  static initSchema(sequelize: Sequelize) {
    UserEmail.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "user_id",
        },
        email: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        isPrimary: {
          type: DataTypes.BOOLEAN,
          allowNull: false,
          field: "is_primary",
        },
      },
      { sequelize, tableName: "user_emails" }
    );

    UserEmail.hasOne(User, {
      sourceKey: "user_id",
      onDelete: "CASCADE",
    });
    UserEmail.sync({ alter: true });
  }
}
