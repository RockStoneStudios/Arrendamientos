import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const db = new Sequelize(process.env.DB_NOMBRE,process.env.DB_USUARIO,process.env.DB_PASSWORD ?? '',{
    host : process.env.DB_HOST,
    dialect : 'mysql',
    define :{
        timestamps : true
    },
     pool:{
        max:5,
        min:0,
        acquire:30000,
        idle:1000
     },
     operatorAliases:false
});


export default db;