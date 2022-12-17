import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const emailRegistro = async(datos)=>{
    var transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service : 'gmail',
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
       console.log(process.env.EMAIL_HOST,process.env.EMAIL_PORT,process.env.EMAIL_USER,process.env.EMAIL_PASS);
      const {email,nombre,token} = datos;
      console.log(email,nombre,token);

      
      await transport.sendMail({
          from: 'BienesRaices.com',
          to: email,
          subject: 'Confirma tu cuenta en BienesRaices.com',
          text: 'Confirma tu cuenta en BienesRaices.com',
          html: `
              <p>Hola ${nombre}, comprueba tu cuenta en BienesRaices.com </p>
              <p>Tu cuenta ya esta lista solo debes confirmarla en el siguiente enlace:
              <a href ="${process.env.BACKEND_URL}:${process.env.PORT ?? 3001}/auth/confirmar/${token}"> Confirmar Cuenta</a>
              </p>
              <p>
               Si tu no creaste esta cuenta, puedes ignorar este mensaje
              </p>
            `
      })
}


export const emailOlvidePassword = async(datos)=>{
  var transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
     console.log(process.env.EMAIL_HOST,process.env.EMAIL_PORT,process.env.EMAIL_USER,process.env.EMAIL_PASS);
    const {email,nombre,token} = datos;
    console.log(email,nombre,token);

    
    await transport.sendMail({
        from: 'BienesRaices.com',
        to: email,
        subject: 'Restablece tu Password en  BienesRaices.com',
        text: 'Restablece tu Password en BienesRaices.com',
        html: `
            <p>Hola ${nombre}, has solicitado reestablecer tu password en BienesRaices.com </p>
            <p>Sigue el siguiente enlace para generar un password nuevo:
            <a href ="${process.env.BACKEND_URL}:${process.env.PORT ?? 3001}/auth/olvide-password/${token}"> Restablecer Password</a>
            </p>
            <p>
             Si tu no Solicitas el cambio del password, puedes ignorar este mensaje
            </p>
          `
    })
}


