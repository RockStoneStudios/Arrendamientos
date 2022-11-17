import Propiedad from './Propiedad.js';
import Precio from './Precio.js';
import Categoria from './Categoria.js';
import Usuario from './Usuario.js';


Propiedad.belongsTo(Usuario,{foreignKey : 'usuarioId'});
Propiedad.belongsTo(Categoria,{foreignKey : 'categoriaId'});
Propiedad.belongsTo(Precio,{foreignKey : 'precioId'});

export {
    Propiedad,
    Precio,
    Categoria,
    Usuario
}
