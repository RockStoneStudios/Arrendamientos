import {Router} from 'express';
import {admin,crear,guardar,agregarImagen,mostrarPropiedad,almacenarImagen,editar,guardarEdicion,eliminar} from '../controllers/propiedadController.js';
import {protegerRuta} from '../middleware/protegeRouta.js'
import { body } from 'express-validator';
import upload from '../middleware/subirImagen.js';
import { identificarUsuario } from '../middleware/UsuarioAutenticado.js';
const router = Router();


router.get('/mis-propiedades',protegerRuta,admin);
router.get('/propiedades/crear',protegerRuta,crear);
router.post('/propiedades/crear',protegerRuta,guardar);
router.get('/propiedades/agregar-imagen/:id',protegerRuta,agregarImagen);
router.post('/propiedades/agregar-imagen/:id',protegerRuta,upload.single('imagen'),almacenarImagen);
   
router.get('/propiedades/editar/:id',protegerRuta,editar);
router.post('/propiedades/editar/:id',protegerRuta,guardarEdicion);
router.post('/propiedades/eliminar/:id',protegerRuta,eliminar)

//Area publica
router.get('/propiedad/:id',identificarUsuario,mostrarPropiedad);

export default router;