import {Model,DataTypes} from 'sequelize';
import sequelize from '../config/db.js';
import bcrypt from 'bcrypt';

class Usuario extends Model {}


Usuario.init({
    nombre:{
        type : DataTypes.STRING,
        allowNull : false
    },
    email:{
        type : DataTypes.STRING,
        allowNull : false
    },
    password : {
        type: DataTypes.STRING,
        allowNull : false
    },
    token : DataTypes.STRING,
    confirmado : DataTypes.BOOLEAN
},{
    sequelize,
    hooks : {
        beforeCreate : async function (usuario){
            const salt = await bcrypt.genSalt(10)
            usuario.password = await bcrypt.hash(usuario.password,salt);
        }
    },
   
});

//Metodos personalizados

Usuario.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password,this.password);
}

export default Usuario;