import {DataTypes,Model} from 'sequelize';
import sequelize from '../config/db.js';


class Categoria extends Model {}

Categoria.init({
    nombre : {
        type : DataTypes.STRING(30),
        allowNull : false
    }
},{
    sequelize,
    modelName : 'categorias'
});


export default Categoria;


