import { DataTypes,Model } from "sequelize";
import sequelize from "../config/db.js";


class Mensaje extends Model{}

Mensaje.init({
    mensaje:{
        type : DataTypes.STRING(190),
        allowNull : false
    }
},{
     sequelize
});

export default Mensaje;