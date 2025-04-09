import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv';
import { Cart } from "./models/cart.model";
import { Category } from "./models/category.model";
import { Project } from "./models/project.model";
import { ProjectImage } from "./models/projectImage.model";
import { Role } from "./models/role.model";
import { User } from "./models/user.model";

dotenv.config();

const sequelize = new Sequelize({
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '3306'),
    dialect: "mysql",
    models: [Cart, Category, Project, ProjectImage, Role, User],
});

export default sequelize;