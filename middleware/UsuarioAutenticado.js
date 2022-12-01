import jwt from 'jsonwebtoken';
import  Usuario  from '../models/Usuario.js';

export const identificarUsuario = async(req,res,next)=>{
    // Identificar si hay token en las cookies 
     const {_token} = req.cookies;
     if(!_token){
        req.usuario = null;
        return next();
     }
    // comprobar Token
    try{
        const decoded = jwt.verify(_token,process.env.TOKEN_SECRET);
        const usuario = await Usuario.findByPk(decoded.id);
        if(usuario){
            req.usuario = usuario;
        }
        return next();
    }catch(error){
        console.log(error);
        return res.clearCookie('_token').redirect('/auth/login');
    }
}