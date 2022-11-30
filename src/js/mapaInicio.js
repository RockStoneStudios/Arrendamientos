
(function(){
    const lat = 6.5015638;
    const lng = -75.7419;
    const mapa = L.map('mapa-inicio').setView([lat, lng ], 16);
     
     let markers = new L.FeatureGroup().addTo(mapa);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
     const obtenerPropiedades = async() => {
         try{
            const url = '/api/propiedades'
             const res = await fetch(url);
             const propiedades = await res.json();
             console.log(propiedades);
             mostrarPropiedades(propiedades.propiedades);

         }catch(error){
            console.log(error);
         }
     }
     const mostrarPropiedades = propiedades => {
        propiedades.map(propiedad => {
             
             const marker = new L.marker([propiedad?.lat,propiedad?.lng],{
                 autoPan: true

             }).addTo(mapa).bindPopup(
                `<p class="text-indigo-600 font-bold">${propiedad?.categoria.nombre}</p>
                <h1 class = "text-xl font-extrabold uppercase my-5">
                   ${propiedad?.titulo}
                </h1>
                <img src="/uploads/${propiedad?.imagen}" alt="titulo Imagen"/>
                <p class="text-gray-600 font-bold">${propiedad?.Precio.nombre}</p>
                 <a href="/propiedad/${propiedad.id}" class = "bg-indigo-600 block p-2 text-center font-bold text-white">Ver Propiedad</a>
                `
             )
             markers.addLayer(marker)
        })
     }
     obtenerPropiedades()
})()