import { Sequelize } from "sequelize-typescript";
import config from './config/config.js';
import { Cart } from "./models/cart.model";
import { Category } from "./models/category.model";
import { Project } from "./models/project.model";
import { ProjectImage } from "./models/projectImage.model";
import { Role } from "./models/role.model";
import { User } from "./models/user.model";

const sequelize = new Sequelize({
    username : config.development.username,
    password : config.development.password,
    database : config.development.database,
    host : config.development.host,
    dialect : "mysql",
    models : [Cart,Category,Project,ProjectImage,Role,User],

})

export default sequelize