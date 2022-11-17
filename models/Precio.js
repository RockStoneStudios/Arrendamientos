import {DataTypes,Model} from 'sequelize';
import sequelize from '../config/db.js';


class Precio extends Model {}

Precio.init({
    nombre : {
        type : DataTypes.STRING(30),
        allowNull : false
    }
},{
    sequelize
})

export default Precio;