import {Router} from 'express';
import {admin,crear,guardar,agregarImagen} from '../controllers/propiedadController.js';
import {protegerRuta} from '../middleware/protegeRouta.js'
import { body } from 'express-validator';
const router = Router();


router.get('/mis-propiedades',protegerRuta,admin);
router.get('/propiedades/crear',protegerRuta,crear);
router.post('/propiedades/crear',protegerRuta,guardar);
router.get('/propiedades/agregar-imagen/:id',protegerRuta,agregarImagen);


export default router;