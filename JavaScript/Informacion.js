var rutaBaseApi = 'https://localhost:7054/Descuentos/'
var textoGenerico='Vuelo: '
var Separador=' - '
var porcentaje= '%'
var textoDescuento=' descuento'

$(document).ready(function () {
    var evt;
    var seccion;
    AccionesFormulario.ObtenerDescuentos();
    AccionesFormulario.AbrirTab(evt, seccion);    
    AccionesFormulario.ActivarTabInicio();
    
    $('#btnEnviar').click(function(event){
        event.preventDefault();
        event.stopImmediatePropagation(); 
        AccionesFormulario.LogIn();
    });

});

var AccionesFormulario = {

    ActivarTabInicio:function(){
        document.getElementById("tbInicio").className+=" active";
        document.getElementById("Inicio").style.display = "block";
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

    ObtenerDescuentos: function (){
       $.get(rutaBaseApi+'0', function(data,status){
        if(status=='success'){
            if(data.objetoRespuesta.length>0){
                for(var i=0; i<data.objetoRespuesta.length;i++){
                    var p = document.createElement("p");
                    var saltoLinea=document.createElement("br")
                    p.className="Banner";
                    var texto= textoGenerico + 
                               data.objetoRespuesta[i].origen+
                               Separador+ 
                               data.objetoRespuesta[i].destino+' ';
                    var txtDescuento=data.objetoRespuesta[i].porcentaje+
                                       porcentaje+
                                       textoDescuento;                               
                    var contenido= document.createTextNode(texto);
                    var contenido2=document.createTextNode(txtDescuento);
                    p.appendChild(contenido);
                    p.appendChild(saltoLinea);
                    p.appendChild(contenido2);
                    var div= document.getElementById("Slider");
                    div.appendChild(p);
                }                
            }
        }                
       })
    },

    LogIn:function(){
        var usuario = $('#txtUsername').val();
        var contrasena = $('#txtPassword').val();
        if(usuario==""){
            alert("Por favor indique el nombre de usuario");
        }
        else if (contrasena==""){
            alert("Por favor indique la contraseña");
        }
        else{
            window.location.replace("../Formularios/Administrativo.html");
        }
    }
};