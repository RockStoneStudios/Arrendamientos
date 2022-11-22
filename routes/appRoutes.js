import express from 'express';
import {inicio,categoria,noEncontrado,buscador } from '../controllers/appController.js'
const router = express.Router();

//Pagina Inicio
router.get('/',inicio);


//Categorias
router.get('/categorias/:id',categoria);
//  Pagina 404

// Buscador
router.get('/404',noEncontrado);

router.post('/buscador',buscador);

export default router;