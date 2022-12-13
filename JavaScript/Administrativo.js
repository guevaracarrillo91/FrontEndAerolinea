$(document).ready(function () {
    var evt;
    var seccion;
    AccionesFormulario.AbrirTab(evt, seccion);      
    AccionesFormulario.ActivarTabPrincipal();
});

var AccionesFormulario = {

    ActivarTabPrincipal:function(){
        document.getElementById("tbInicio").className+=" active";
        document.getElementById("Rutas").style.display = "block";
    },

    AbrirTab: function (evt, seccion) {
        // se declaran las variables a usar
        var i;
        var contenido;
        var links;

        //Oculta todos los elementos de cada uno de los tabs
        contenido = document.getElementsByClassName("contenidotab");
        for (i = 0; i < contenido.length; i++) {
            contenido[i].style.display = "none";
        }

        // Remueve la clase activa de todos los botones del menú
        links = document.getElementsByClassName("linktabs");
        for (i = 0; i < links.length; i++) {
            links[i].className = links[i].className.replace(" active", "");
        }

        // Se muestra el tab que desencadeno la acción
        if (seccion !== undefined && seccion !== null && seccion !== "") {
            document.getElementById(seccion).style.display = "block";
        }

        //Se valida que el evento no este vacío y se agrega la clase activa al botón que desencadena la acción
        if (evt !== null && evt !== undefined) {
            evt.currentTarget.className += " active";
        }
    },
    
    CerrarSesion:function(){
        window.location.replace("../Formularios/Informacion.html");
    }
};