import {DataTypes,INTEGER,Model} from 'sequelize';
import sequelize from '../config/db.js';


class Propiedad extends Model {}

Propiedad.init({
    id:{
        type:INTEGER,
        autoIncrement : true,
        allowNull : false,
        primaryKey : true
    },
    titulo :{
        type: DataTypes.STRING(80),
        allowNull : false
    },
    descripcion:{
        type: DataTypes.TEXT,
        allowNull : false
    },
    habitaciones:{
        type : DataTypes.INTEGER,
        allowNull : false
    },
    estacionamiento:{
        type : DataTypes.INTEGER,
        allowNull : false
    },
    wc:{
        type : DataTypes.INTEGER,
        allowNull : false
    },
    calle :{
        type : DataTypes.STRING(50),
        allowNull : false
    },
    lat : {
        type: DataTypes.STRING,
        allowNull : false
    },
    lng : {
        type: DataTypes.STRING,
        allowNull : false
    },
     imagen :{
        type : DataTypes.STRING,
        allowNull : false
     },
    publicado :{
        type : DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue : false
    },
    verificado : {
        type: DataTypes.BOOLEAN,
        defaultValue : false
    }
},{
     sequelize,
     tableName : 'propiedades'
});


export default Propiedad;
