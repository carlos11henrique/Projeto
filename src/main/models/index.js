import { Sequelize } from "sequelize"
import { DEST_USER, DEST_DB } from "../util/caminho";





const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: DEST_DB 
  });