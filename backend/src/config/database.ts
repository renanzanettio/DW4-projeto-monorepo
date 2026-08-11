import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
import { rejects } from "node:assert";

dotenv.config();

export const sequelize = new Sequelize(
    process.env.DB_NAME  || 'postgres',
    process.env.DB_USER  || 'postgres',
    process.env.DB_PASSWORD  || '',
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT || '5432', 10),
        logging: false,
        dialectOptions: {
            ssl: {
                require: true,
                rejectUnauthorized: false
            }
        }
    }
)