import {Propiedad,Precio,Categoria} from '../models/index.js'

export const propiedades = async(req,res)=>{
    const propiedades = await Propiedad.findAll({
        include: [
            {model : Precio},
            {model : Categoria}
        ]
    })
  res.json({
    propiedades
  })
}