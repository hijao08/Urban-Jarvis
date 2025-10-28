import sequelize from "../config/database.js";
import initItemModel from "./Item.js";
import initUrbsScheduleModel from "./UrbsSchedule.js";
import initUsersModel from "./Users.js";

const models = {};

models.Users = initUsersModel(sequelize);
models.Item = initItemModel(sequelize);
models.UrbsSchedule = initUrbsScheduleModel(sequelize);

export { sequelize };
export default models;
