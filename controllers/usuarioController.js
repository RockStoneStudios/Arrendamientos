import Usuario from '../models/Usuario.js';
import {check,validationResult} from 'express-validator';
import {generaId} from '../helpers/tokens.js';
import { emailRegistro,emailOlvidePassword } from '../helpers/email.js';
import bcrypt from 'bcrypt';
import {generateToken} from '../helpers/generateToken.js'

export const formularioLogin = async (req,res)=> {
    res.render('auth/login',{
        pagina : 'Iniciar Sesion'
    });
}

export const autenticar = async (req,res)=> {
     await check('email').isEmail().withMessage('Email Obligatorio').run(req);
     await check('password').isLength({min : 6}).withMessage('Password Obligatorio').run(req);
     let result = validationResult(req);
     if(!result.isEmpty()){
        return res.render('auth/login',{
            pagina : 'Iniciar Sesion',
            errores : result.array(),
            barra : false
        })
     }
      const {email,password} = req.body;
     // Comprobar si usuario existe
     const usuario = await Usuario.findOne({where:{email}});
     if(!usuario){
        return res.render('auth/login',{
            pagina : 'Iniciar Sesion',
            errores : [{msg : 'No hay Usuario Resgitrado con este Email'}]
        })
     }

     // Comprobar si el usuario esta confirmado 
     if(!usuario.confirmado){
         return res.render('auth/login',{
            pagina : 'Iniciar Sesion',
            errores : [{msg : 'Tu cuanta no ha sido verificada'}]
         })
     }

     // Revisar el Password 
     if(!usuario.verificarPassword(password)){
        return res.render('auth/login',{
            pagina : 'Iniciar Sesion',
            errores : [{msg : 'El Password es incorrecto'}]
         })
     }
     const token =  generateToken({id : usuario.id,nombre : usuario.nombre});
     console.log(token);

     //Almacernar en un cookie
     return res.cookie('_token',token,{
        httpOnly:true,
        
     }).redirect('/mis-propiedades');
}

export const registrar = async (req,res)=>{
    // Validation
    await check('nombre').notEmpty().withMessage('Ingresa Nombre').run(req);
    await check('email').isEmail().withMessage('Email incorrecto').run(req);
    await check('password').isLength({min:6}).withMessage('Password debe tener minimo 6 caracteres').run(req);
    await check('repetir_password').equals(req.body.password).withMessage('Passwords no coinciden!!').run(req);
    console.log(req.body.password,req.body.repetir_password);
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            errores : resultado.array(),
            usuario:{
                nombre:req.body.nombre,
                email: req.body.email
            },
            barra : false
        })
    }
     const {nombre,email,password} = req.body;
     //Verificar que el usuario no este duplicado 

    const existeUsuario = await Usuario.findOne({where :{email }})
     if(existeUsuario){
        return res.render('auth/registro',{
            pagina: 'Crear Cuenta',
            errores : [{msg : 'El Usuario ya esta registrado!!'}],
            usuario:{
                nombre:req.body.nombre,
                email: req.body.email
            }
        })
     }
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generaId()
    });

     //Envia email de confirmacion
     
       emailRegistro({
           nombre: usuario.nombre,
           email : usuario.email,
           token : usuario.token
       })
   
    //Mostrar Mensaje de confirmacion 
    res.render('templates/mensaje',{
        pagina: 'Cuenta Creada Correctamente',
        mensaje : 'Hemos Enviado un Email de confirmacion'
    })
}

export const formularioRegistro = async (req,res)=>{
    
    res.render('auth/registro',{
        pagina : 'Crear Cuenta',
        barra : false
    });



}
export const  formularioOlvidePassword = async (req,res)=>{
   res.render('auth/olvide',{
      pagina : 'Recupera tu accesso a Bienes Raices'
   })
}   
export const resetPassword = async(req,res)=>{
     await check('email').isEmail().withMessage('Email Incorrecto').run(req);
     let resultado = validationResult(req);

     if(!resultado.isEmpty()){
        return res.render('auth/olvide',{
            pagina : 'Recupera tu accesso a Bienes Raices',
             errores : resultado.array()

        })
     }

     const {email} = req.body;
     const usuario = await Usuario.findOne({where :{email}});
     if(!usuario){
        return res.render('auth/olvide',{
            pagina : 'Recupera tu accesso a Bienes Raices',
            errores : [{msg : 'No hay Usuario Registrado con este Email!'}]

        })
     }

     //Generar un token y enviar Email
     usuario.token = generaId();
     await usuario.save();

     //Enviar un Email
     emailOlvidePassword({
        email: usuario.email,
        nombre : usuario.nombre,
        token : usuario.token
     })
     //Rendereizar 
    res.render('templates/mensaje',{
        pagina : 'Reestablece tu Password',
        mensaje : 'Hemos enviado un email con las instrucciones'
    })
}

export const comprobarToken = async (req,res)=>{
   const {token} = req.params;

   const usuario = await Usuario.findOne({where : {token}});
   if(!usuario) {
    return res.render('auth/confirmar-cuenta',{
        pagina: 'Restablecer tu Password',
        mensaje : 'Hubo un error al validar tu informacion',
        error : true
    })
   }

   //Mostrar Formulario para modificar password
   res.render('auth/reset-password',{
      pagina : 'Reestablece tu Password'
   })
}

export const nuevoPassword = async(req,res)=>{
    // Validar password
    await check('password').isLength({min : 6}).withMessage('El password debe ser de al menos 6 caracteres').run(req);
    let resultado = validationResult(req);
    if(!resultado.isEmpty()){
        return res.render('auth/reset-password',{
            pagina : 'Reestablece tu Password',
            errores : resultado.array()

        })
    }
    const {token} = req.params;
    const {password} = req.body;

    const usuario = await Usuario.findOne({where:{token}});

    //hasehar Password
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(password,salt);
    usuario.token = null;

    await usuario.save();

    res.render('auth/confirmar-cuenta',{
        pagina: 'Password Reestablecido',
        mensaje : 'El Password se guardo correctamente'
    })
}

export const confirmarCuenta = async (req,res)=> {
      const {token} = req.params;
      const usuario = await Usuario.findOne({where :{token}});
      
      if(!usuario){
        console.log('Estoy ');
         return res.render('auth/confirmar-cuenta',{
             pagina: 'Error al confirmar tu cuenta',
             mensaje : 'Hubo un error al confirmar tu cuenta intenta de nuevo',
             error : true
         })
      }

      //Confirmar cuenta
       usuario.token = null;
       usuario.confirmado = true;
       await usuario.save();
       res.render('auth/confirmar-cuenta',{
         pagina : 'Cuenta Confirmada',
         mensaje:'La Cuenta se confirmo Correctamente',
         error : false
       })

      
      

}



