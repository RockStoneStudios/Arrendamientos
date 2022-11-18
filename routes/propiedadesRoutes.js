import {Router} from 'express';
import {admin,crear,guardar,agregarImagen,almacenarImagen} from '../controllers/propiedadController.js';
import {protegerRuta} from '../middleware/protegeRouta.js'
import { body } from 'express-validator';
import upload from '../middleware/subirImagen.js';
const router = Router();


router.get('/mis-propiedades',protegerRuta,admin);
router.get('/propiedades/crear',protegerRuta,crear);
router.post('/propiedades/crear',protegerRuta,guardar);
router.get('/propiedades/agregar-imagen/:id',protegerRuta,agregarImagen);
router.post('/propiedades/agregar-imagen/:id',protegerRuta,upload.single('imagen'),almacenarImagen);
   




export default router;