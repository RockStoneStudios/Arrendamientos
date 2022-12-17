import express from 'express';
import userRouter from './routes/userRouter.js';
import propiedadesRouter from './routes/propiedadesRoutes.js';
import appRouter from './routes/appRoutes.js';
import apiRouter from './routes/apiRoutes.js'
import path from 'path';
import { fileURLToPath } from 'url';
import db from './config/db.js';
import csrf from 'csurf';
import cookieParser from 'cookie-parser';


const app = express();


    try{
       await db.authenticate();
       db.sync();
       console.log('Database Connected Successful');
    }catch(error){
        console.log(error);
    }

    
    const __filename = fileURLToPath(import.meta.url);
    
    const __dirname = path.dirname(__filename);
    
   //Habilitar CookieParse
    app.use(cookieParser());
    //Habilitar CSRF
    
    app.use(express.urlencoded({extended : true}));
    app.use(express.json());
    app.set('view engine','pug');
    app.set('views',path.join(__dirname,'views'));
    app.use(express.static(path.join(__dirname,'public')));
    

//Routes

app.use('/auth',userRouter);
app.use('/',propiedadesRouter);
app.use('/',appRouter);
app.use('/api',apiRouter);



app.listen(process.env.PORT || 3001,()=>{
    console.log(`Starting Server on Port --> ${process.env.PORT}`);
});


