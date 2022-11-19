import {Dropzone} from 'dropzone';


Dropzone.options.imagen = {
    dictDefaultMessage : 'Sube tus Imagenes Aqui',
    acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize:6,
    maxFiles:1,
    paralleUploads:1,
    autoProccessQueue : true,
    addRemoveLinks : true,
    dictRemoveFile : 'Borrar Archivo',
    dictMaxFilesExceeded: 'El Limite es 5 archivos',
    paramName : 'imagen',
    init: function(){
       const dropzone = this;
       const btnPublicar = document.querySelector('#publicar');
       btnPublicar.addEventListener('click',function(){
         dropzone.processQueue()
       });
       dropzone.on('queuecomplete',function(){
          if(dropzone.getActiveFiles().length ==0){
            window.location.href='/mis-propiedades'
          }
       })
    }
}