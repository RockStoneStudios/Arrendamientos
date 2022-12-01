import {Precio,Categoria,Propiedad} from '../models/index.js';


export const inicio = async (req,res)=>{
   const [categorias,precios] = await Promise.all([
       Categoria.findAll({raw : true}),
       Precio.findAll()
   ]);
    console.log(categorias);
   res.render('inicio',{
    pagina : 'Inicio',
    categorias,
    precios
   })
}

export const categoria = async(req,res)=>{

}

export const noEncontrado = async (req,res)=>{

}


export const buscador = async (req,res)=>{

}