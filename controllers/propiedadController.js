import {validationResult,check} from 'express-validator';
import {Precio,Categoria,Propiedad,Mensaje, Usuario} from '../models/index.js';
import {v4 as uuidv4, v4} from 'uuid';
import {unlink} from 'node:fs/promises'
import {esVendedor} from '../helpers/index.js'




export const admin = async(req,res)=>{
    const{pagina:paginaActual} = req.query;
    const {id} = req.usuario;
    const expresion = /^[1-9]$/
    if(!expresion.test(paginaActual)){
       return res.redirect('/mis-propiedades?pagina=1');
    }
    try{
        const limit = 10;
        const offset = ((paginaActual*limit)-limit);
        const [propiedades,total ]= await Promise.all([
            await Propiedad.findAll({
                    limit,
                    offset,
                    where : {
                        usuarioId : id
                    },
                    include: [
                      {model : Categoria, as:'categoria'},
                      {model : Precio},
                      {model : Mensaje}
                    ]
                  }),
                  Propiedad.count({
                    where :{
                         usuarioId :id
                    }
                  })
        ]);
       
        
          res.render('propiedades/admin',{
              pagina : 'Mis Propiedades',
              propiedades,
              paginas : Math.ceil(total/limit),
              paginaActual : Number(paginaActual),
              offset,
              limit,
              total
          });
          console.log(total);
    }catch(error){
        console.log(error);
    }
    
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
        pagina : `Agregar Imagenes : ${propiedad.titulo}`,
        propiedad
    })
}


export const almacenarImagen = async (req,res,next)=>{
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
     try{
        console.log(req.file);
         //Almacenar la imagen y publicar propiedad
          propiedad.imagen = req.file.filename;
          propiedad.publicado = 1;

          await propiedad.save();
          next();
     }catch(error){
        console.log(error);
     }
}



export const editar = async(req,res)=> {

     const {id} = req.params;
     
     const propiedad = await Propiedad.findByPk(id);

     if(!propiedad) return res.redirect('/mis-propiedades');
    //  //Rvisar que quien visita la url creo la propiedad
     if(propiedad.usuarioId.toString() !== req.usuario.id.toString()) return res.redirect('/mis-propiedades');
   
     const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ]);




    res.render('propiedades/editar',{
        pagina:`Editar Propiedades: ${propiedad.titulo}`,
        categorias,
        precios,
        datos: propiedad
    })
}



export const guardarEdicion = async(req,res)=>{
    
    await check('titulo').notEmpty().withMessage('El Titulo del anuncio es obligatorio').run(req)
    await check('descripcion').notEmpty().withMessage('La Descripcion no puede ser vacia')
                              .isLength({max : 150}).withMessage('La Descripcion no puede ser tan Larga').run(req);
    await check('categoria').isNumeric().withMessage('Selecciona una Categoria').run(req);
    await check('precio').isNumeric().withMessage('Selecciona un Rango de Precios').run(req);
    await check('habitaciones').isNumeric().withMessage('Selecciona la Cantidad de Habitaciones').run(req);
    await check('estacionamiento').isNumeric().withMessage('Selecciona la Cantidad de Estacionamientos o Garajes de la Propiedad').run(req);
    await check('wc').isNumeric().withMessage('Selecciona la cantidad de Baños').run(req);
    await check('lat').notEmpty().withMessage('Ubica la propiedad en el Mapa').run(req);
    const {id} = req.params;
     
    let resultado = validationResult(req);
     if(!resultado.isEmpty()){
        const [categorias,precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])
     

        return  res.render('propiedades/editar',{
              pagina:'Editar Propiedades',
              categorias,
              precios,
              errores: resultado.array(),
              datos: req.body
          })
     
     }
     const propiedad = await Propiedad.findByPk(id);

     if(!propiedad) return res.redirect('/mis-propiedades');
    //  //Rvisar que quien visita la url creo la propiedad
     if(propiedad.usuarioId.toString() !== req.usuario.id.toString()) return res.redirect('/mis-propiedades');
     
      //Reescribir el Objeto y actualizarlo

      try{
        const {titulo,descripcion,habitaciones,estacionamiento,wc,calle,lat,lng,precio:precioId,categoria:categoriaId} = req.body;
        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        });

        await propiedad.save();
        res.redirect('/mis-propiedades')
      }catch(error){
        console.log(error);
      }

    }



export const eliminar = async(req,res)=>{
    const {id} = req.params;
    const propiedad = await Propiedad.findByPk(id);
    if(!propiedad) return res.redirect('/mis-propiedades');
    if(propiedad.usuarioId.toString()!==req.usuario.id.toString()) return res.redirect('/mis-propiedades');
     
    //Eliminar la imagen
    await unlink(`public/uploads/${propiedad.imagen}`);
    console.log('Se elimino la imagen'+propiedad.imagen);
    //Eliminar Propiedad
    await propiedad.destroy();
    res.redirect('/mis-propiedades');
}


export const mostrarPropiedad = async(req,res)=>{
 
     const {id} = req.params;
     
    console.log('id:--------------- '+id);
   
    const propiedad = await Propiedad.findByPk(id,{
        include :[
            {model : Precio},
            {model : Categoria}
        ]});
    
   
   console.log(propiedad);
     
    //  const propiedad = propiedades.filter(prop => prop.id === id);
    //  console.log('propiedad-------',propiedad);
     res.render('propiedades/mostrar',{
         propiedad,
         pagina: propiedad.titulo,
         usuario : req.usuario,
         esVendedor : esVendedor(req.usuario?.id,propiedad.usuarioId)
        });
        if(!propiedad){
            
            return res.redirect('/404'); 
        }
}

export const enviarMensaje = async (req,res)=>{ 
     check('mensaje').isLength({min : 10}).withMessage('El mensaje no puede ir vacio o es muy corto').run(req);
     const {id} = req.params;
     const propiedad = await Propiedad.findByPk(id,{
        include:[
             {model : Precio},
             {model : Categoria}
        ]
     });
     
     if(!propiedad){
        return res.redirect('/404')
     }
       let resultado = validationResult(req);
    
       if(!resultado.isEmpty()){
        return  res.render('propiedades/mostrar',{
            propiedad,
            pagina: propiedad.titulo,
            usuario : req.usuario,
            esVendedor : esVendedor(req.usuario?.id,propiedad.usuarioId),
            errores : resultado.array()
        });
       }
       const {mensaje} = req.body;
       const {id : propiedadId} = req.params;
       const {id:usuarioId} = req.usuario;
     // Almacenar el modelo
     await Mensaje.create({
        mensaje,
        propiedadId,
        usuarioId
     })
 
      res.redirect('/');
}

//Leer mensajes recicbidos 

export const verMensajes = async(req,res)=>{
    const {id} = req.params;
    const propiedad = await Propiedad.findByPk(id,{
        include:[
            {model:Mensaje,
            
             include:[{model : Usuario}]
            }
        ]
    });
    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    res.render('propiedades/mensajes',{
        pagina : 'Mensajes',
        mensajes: propiedad.Mensajes
    })
}







