import { Sequelize, DataTypes, Model } from "sequelize";
import { User } from "./User";

export class PrayerRequest extends Model {
  declare id: string;
  declare userId: string;
  declare date: Date;
  declare from: string;
  declare subject: string;
  declare category?: string;
  declare message: string;
  declare prayerCount: number;
  declare lastPrayerDate: Date | null;

  static initSchema(sequelize: Sequelize) {
    PrayerRequest.init(
      {
        id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        userId: {
          type: DataTypes.UUID,
          allowNull: false,
          field: "user_id",
          // references: {
          //   // This is a reference to another model
          //   model: User,

          //   // This is the column name of the referenced model
          //   key: "id",
          // },
        },

        date: {
          type: DataTypes.DATEONLY,
          allowNull: false,
          field: "email_date",
        },
        from: {
          type: DataTypes.STRING,
          allowNull: false,
          field: "from_email",
        },
        subject: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        category: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        message: {
          type: DataTypes.TEXT,
          allowNull: false,
        },
        prayerCount: {
          type: DataTypes.INTEGER,
          allowNull: false,
          defaultValue: 0,
          field: "prayer_count",
        },
        lastPrayerDate: {
          type: DataTypes.DATEONLY,
          allowNull: true,
          defaultValue: null,
          field: "last_prayer_date",
        },
      },
      { sequelize: sequelize, tableName: "prayer_requests" }
    );

    PrayerRequest.hasOne(User, {
      sourceKey: "user_id",
      onDelete: "NO ACTION",
    });

    PrayerRequest.sync({ alter: true });
  }
}
