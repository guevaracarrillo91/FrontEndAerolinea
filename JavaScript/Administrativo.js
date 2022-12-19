var rutaBaseApiRutas = 'https://localhost:7054/Rutas/'
var rutaBaseApiHorarios = 'https://localhost:7054/Horarios/'
var rutaBaseApiAviones = 'https://localhost:7054/Aviones/'
var modificar = false;

$(document).ready(function () {
    var evt;
    var seccion;
    modificar = false;
    AccionesFormulario.AbrirTab(evt, seccion);
    AccionesFormulario.ActivarTabPrincipal();
    AccionesFormulario.ObtenerRutas();
    document.getElementById("Nombre").disabled = false;

    $("#btnEnviarRutas").click(function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        AccionesFormulario.EnviarDatosRutas();
    });

});

var AccionesFormulario = {

    //#region Métodos Generales
    ActivarTabPrincipal: function () {
        document.getElementById("tbInicio").className += " active";
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

    CerrarSesion: function () {
        window.location.replace("../Formularios/Informacion.html");
    },
    //#endregion Métodos Generales

    //#region Métodos Rutas
    ObtenerRutas: function () {
        var datos = {
            nombreParametro: ""
        }
        $.get(rutaBaseApiRutas + 'ObtenerRutas/', datos, function (data, status) {
            if (status == 'success') {
                if (data.objetoRespuesta.length > 0) {

                    //Se obtiene la tabla por id pero medio del DOM
                    var tabla = document.getElementById("tblRutas");
                    var tblCuerpo = tabla.getElementsByTagName("tbody")[0];

                    for (var i = 0; i < data.objetoRespuesta.length; i++) {

                        //Se crea la fila de la tabla
                        var linea = document.createElement("tr");

                        //Se crean las columnas
                        var codigoRuta = document.createElement("td");
                        var nombreRuta = document.createElement("td");
                        var paisOrigen = document.createElement("td");
                        var paisDestino = document.createElement("td");
                        var duracionHoras = document.createElement("td");
                        var duracionMinutos = document.createElement("td");
                        var basurero = document.createElement("td");
                        var icon = document.createElement("i");

                        //Se llenan las columnas
                        var tCodigoRuta = document.createTextNode(data.objetoRespuesta[i].codigoRuta);
                        var tNombreRuta = document.createTextNode(data.objetoRespuesta[i].nombre);
                        var tPaisOrigen = document.createTextNode(data.objetoRespuesta[i].paisOrigen);
                        var tPaisDestino = document.createTextNode(data.objetoRespuesta[i].paisDestino);
                        var tDuracionHoras = document.createTextNode(data.objetoRespuesta[i].duracionHoras);
                        var tDuracionMinutos = document.createTextNode(data.objetoRespuesta[i].duracionMinutos);
                        var tBasurero = document.createElement("button");
                        tBasurero.type = "button";
                        icon.className = "fa fa-trash";
                        tBasurero.appendChild(icon);

                        //Se agrega el contenido a la tabla
                        codigoRuta.appendChild(tCodigoRuta);
                        nombreRuta.appendChild(tNombreRuta);
                        paisOrigen.appendChild(tPaisOrigen);
                        paisDestino.appendChild(tPaisDestino);
                        duracionHoras.appendChild(tDuracionHoras);
                        duracionMinutos.appendChild(tDuracionMinutos);
                        basurero.appendChild(tBasurero);
                        basurero.setAttribute('onclick', 'AccionesFormulario.EliminarRutas(event)');

                        linea.appendChild(codigoRuta);
                        linea.appendChild(nombreRuta);
                        linea.appendChild(paisOrigen);
                        linea.appendChild(paisDestino);
                        linea.appendChild(duracionHoras);
                        linea.appendChild(duracionMinutos);
                        linea.appendChild(basurero);
                        linea.setAttribute('ondblclick', 'AccionesFormulario.LlenarCamposRutas(event)');
                        tblCuerpo.appendChild(linea);
                    }
                }
            }
        })
    },

    LlenarCamposRutas: function (evt) {

        if (evt !== null && evt !== undefined) {
            document.getElementById("idRuta").value = evt.currentTarget.childNodes[0].textContent;
            document.getElementById("Nombre").value = evt.currentTarget.childNodes[1].textContent;

            for (var i = 0; i < document.getElementById("PaisOrigen").length; i++) {
                if (document.getElementById("PaisOrigen").options[i].text === evt.currentTarget.childNodes[2].textContent) {
                    document.getElementById("PaisOrigen").selectedIndex = i;
                    break;
                }
            }

            for (var i = 0; i < document.getElementById("PaisDestino").length; i++) {
                if (document.getElementById("PaisDestino").options[i].text === evt.currentTarget.childNodes[3].textContent) {
                    document.getElementById("PaisDestino").selectedIndex = i;
                    break;
                }
            }

            var hora = evt.currentTarget.childNodes[4].textContent.length < 2 ? "0" + evt.currentTarget.childNodes[4].textContent : evt.currentTarget.childNodes[4].textContent;
            var minutos = evt.currentTarget.childNodes[5].textContent.length < 2 ? "0" + evt.currentTarget.childNodes[5].textContent : evt.currentTarget.childNodes[5].textContent;

            document.getElementById("Duracion").value = hora + ":" + minutos;
            document.getElementById("idRuta").disabled = true;
            modificar = true;
        }

        if (document.getElementById("tblRutas_length") !== null) {
            document.getElementById("tblRutas_length").remove();
            document.getElementById("tblRutas_info").remove();
            document.getElementById("tblRutas_paginate").remove();
            document.getElementById("tblRutas_filter").remove();
        }
    },

    EliminarRutas: function (evt) {

        var id = value = evt.currentTarget;

        General.delete(rutaBaseApiRutas + id.parentNode.childNodes[0].textContent, function (data, status) {
            if (status == 'success') {
                window.location.reload();
            }
        })
    },

    EnviarDatosRutas: function () {
        if (document.getElementById("Nombre").value == "") {
            alert("Por favor ingrese un nombre para la ruta");
        }
        else if (document.getElementById("Duracion").value == "") {
            alert("Por favor ingrese la duración de la ruta");
        }
        else {
            var tiempo = document.getElementById("Duracion").value;
            var [horas, minutos] = tiempo.split(":");
            if (modificar) {
                General.put(rutaBaseApiRutas + 'ModificarRuta/',
                    {
                        CodigoRuta: document.getElementById("idRuta").value,
                        Nombre: document.getElementById("Nombre").value,
                        PaisOrigen: $("#PaisOrigen option:selected").text(),
                        PaisDestino: $("#PaisDestino option:selected").text(),
                        DuracionHoras: horas,
                        DuracionMinutos: minutos
                    },
                    function (data, success, xhr) {
                        if (success == 'success') {
                            window.location.reload();
                        }
                    });
            }
            else {
                General.post(rutaBaseApiRutas + 'RegistrarRuta/',
                    {
                        CodigoRuta: document.getElementById("idRuta").value,
                        Nombre: document.getElementById("Nombre").value,
                        PaisOrigen: $("#PaisOrigen option:selected").text(),
                        PaisDestino: $("#PaisDestino option:selected").text(),
                        DuracionHoras: horas,
                        DuracionMinutos: minutos
                    },
                    function (data, success, xhr) {
                        if (success == 'success') {
                            window.location.reload();
                        }
                    });
            }
        }
    }
    //#endregion Métodos Rutas

};