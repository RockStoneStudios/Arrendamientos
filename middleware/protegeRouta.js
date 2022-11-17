import jwt, { decode } from 'jsonwebtoken';
import  {Usuario}  from '../models/index.js';

export const protegerRuta = async(req,res,next) => {
    
     // Verificar si hay un token
     const {_token} = req.cookies;
      if(!_token){
        return res.redirect('/auth/login')
      }
      try{
         const decoded = jwt.verify(_token,process.env.TOKEN_SECRET);
         console.log('id : '+decoded.id);
         const usuario = await Usuario.findOne({where : {id : decoded.id},attributes:{exclude :['password','token','confirmado','createdAt','updatedAt']}});
         // Almacernar Usuario
        
          if(!usuario) return res.redirect('/auth/login');
          req.usuario =usuario
          return next();

      }catch(error){
        return res.clearCookie('_token').redirect('/auth/login');
      }

     
}


