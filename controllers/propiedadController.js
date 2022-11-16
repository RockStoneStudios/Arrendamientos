


export const admin = async(req,res)=>{
    res.render('propiedades/admin',{
        pagina : 'Mis Propiedades',
        barra:true
    })
}


export const crear = async(req,res)=> {
    res.render('propiedades/crear',{
        pagina : 'Crear Propiedad',
        barra : true
    })
}