import {validationResult,check} from 'express-validator';
import {Precio,Categoria,Propiedad} from '../models/index.js';


export const admin = async(req,res)=>{
    res.render('propiedades/admin',{
        pagina : 'Mis Propiedades',
    
    })
}


export const crear = async(req,res)=> {
    //Consultar Modelo precio y categorias
    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);
   
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
          categorias,
          precios,
          errores : resultado.array(),
          datos : req.body
       })
   }
   // Crear Propiedad
   const {titulo,descripcion,habitaciones,estacionamiento,wc,calle,lat,lng,precio,categoria} = req.body;
    console.log('----hello----'+req.usuario);
    const {id} = req.usuario;
    console.log(req.usuario.id);
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
          categoriaId : categoria,
          usuarioId : req.usuario.id,
          imagen:''
       });
       const {id} = propiedad;
       res.redirect(`/propiedades/agregar-imagen/${id}`);
    }catch(error){
        console.log(error)
    }
}


export const agregarImagen = async(req,res)=>{
    const {id} = req.params;
    // Validar que la propiedad exista
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad){
        return res.redirect('/mis-propiedades');
    }
    //Validar que la propiedad no este publicada
    if(propiedad.publicado){
        return res.redirect('/mis-propiedades');
    }
   // Validar que la propiedad pertenece a quien visita la pagina 
    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
        return res.redirect('/mis-propiedades');
    }

    res.render('propiedades/agregar-imagen',{
        pagina : 'Agregar Imagenes'
    })
}