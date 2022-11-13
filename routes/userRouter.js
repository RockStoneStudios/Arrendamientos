import { Router } from "express";
import { formularioLogin,confirmarCuenta,nuevoPassword,
    comprobarToken,resetPassword,formularioRegistro,registrar,
    formularioOlvidePassword,autenticar } 
    from "../controllers/usuarioController.js";

const router = Router();

//Login
router.get('/login',formularioLogin);
router.post('/login',autenticar);


//Registro
router.post('/registro',registrar);
router.get('/registro',formularioRegistro);

//Confirmar Token de registro
router.get('/confirmar/:token',confirmarCuenta);

router.get('/olvide-password',formularioOlvidePassword);
router.post('/olvide-password',resetPassword);

//

router.get('/olvide-password/:token',comprobarToken);
router.post('/olvide-password/:token',nuevoPassword);



export default router;