import {validationResult,check} from 'express-validator';
import {Precio,Categoria,Propiedad} from '../models/index.js';


export const admin = async(req,res)=>{
    res.render('propiedades/admin',{
        pagina : 'Mis Propiedades',
        barra:true
    })
}


export const crear = async(req,res)=> {
    //Consultar Modelo precio y categorias
    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);
    console.log(categorias,precios);
    res.render('propiedades/crear',{
        pagina : 'Crear Propiedad',
        barra : true,
        categorias,
        precios,
        datos:{}
    })
}


export const guardar = async(req,res) =>{
     //Validacion
     await check('titulo').notEmpty().withMessage('El Titulo del anuncio es obligatorio').run(req)
     await check('descripcion').notEmpty().withMessage('La Descripcion no puede ser vacia')
                               .isLength({max : 150}).withMessage('La Descripcion no puede ser tan Larga').run(req);
     await check('categoria').isNumeric().withMessage('Selecciona una Categoria').run(req);
     await check('precio').isNumeric().withMessage('Selecciona un Rango de Precios').run(req);
     await check('habitaciones').isNumeric().withMessage('Selecciona la Cantidad de Habitaciones').run(req);
     await check('estacionamiento').isNumeric().withMessage('Selecciona la Cantidad de Estacionamientos o Garajes de la Propiedad').run(req);
     await check('wc').isNumeric().withMessage('Selecciona la cantidad de Baños').run(req);
     await check('lat').notEmpty().withMessage('Ubica la propiedad en el Mapa').run(req);

    
    let resultado = validationResult(req);                         
    if(!resultado.isEmpty()){
       const [categorias,precios] = await Promise.all([
         Categoria.findAll(),
         Precio.findAll()
       ])
       return res.render('propiedades/crear',{
          pagina : 'Crear Propiedad',
          barra : true,
          categorias,
          precios,
          errores : resultado.array(),
          datos : req.body
       })
   }
   // Crear Propiedad
   const {titulo,descripcion,habitaciones,estacionamiento,wc,calle,lat,lng,precio,categoria} = req.body;
    try{
       const propiedad = await Propiedad.create({
          titulo,
          descripcion,
          habitaciones,
          estacionamiento,
          wc,
          calle,
          lat,
          lng,
          precioId : precio,
          categoriaId : categoria
       })
    }catch(error){
        console.log(error)
    }
}