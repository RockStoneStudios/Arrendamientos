export const esVendedor = (usuarioId,propiedadUsuarioId)=>{
    return usuarioId === propiedadUsuarioId;
}

export const formatearFecha = fecha => {
  const nuevaFecha=  new Date(fecha).toISOString().split('T');

  const opciones = {
    weekday:'long',
    year : 'numeric',
    month : 'long',
    day:'numeric'
  }

  return new Date(nuevaFecha).toLocaleDateString('es-ES',opciones);
}