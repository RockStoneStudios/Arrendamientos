import categorias from "./categorias.js";
import precios from "./precios.js";
import usuarios from "./usuarios.js";
import sequelize from '../config/db.js';
import {Precio, Categoria,Usuario} from '../models/index.js';

const importarDatos = async () => {
     try{
        // Autenticar 
        await sequelize.authenticate();

        // Generar las columnas 
         await sequelize.sync();
        // Insertar Datos
        
        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ]);
        console.log('Datos Importados Correctamente');
        process.exit()
     }catch(error){
        console.log(error);
        process.exit(1);
     }
}

const eliminarDatos = async() => {
    try{
        await sequelize.sync({force : true});
        console.log('Datos Eliminados correctamente');
        process.exit();
    }catch(error){
      console.log(error);
      process.exit(1);
    }
}

if(process.argv[2]=== "-i"){
   importarDatos();
}

if(process.argv[2]=== "-e"){
   eliminarDatos();
}