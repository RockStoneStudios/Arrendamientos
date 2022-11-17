import {Router} from 'express';
import {admin,crear,guardar} from '../controllers/propiedadController.js';
import { body } from 'express-validator';
const router = Router();


router.get('/mis-propiedades',admin);
router.get('/propiedades/crear',crear);
router.post('/propiedades/crear',guardar);


export default router;