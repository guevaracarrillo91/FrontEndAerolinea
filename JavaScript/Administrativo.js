var rutaBaseApiRutas = 'https://localhost:7054/Rutas/'
var rutaBaseApiHorarios = 'https://localhost:7054/Horarios/'
var rutaBaseApiAviones = 'https://localhost:7054/Aviones/'
var modificar = false;
var modificarHorario = false;
var duracionRuta = "";

$(document).ready(function () {
    var evt;
    var seccion;
    modificar = false;
    modificarHorario = false;
    AccionesFormulario.AbrirTab(evt, seccion);
    AccionesFormulario.ActivarTabPrincipal();
    AccionesFormulario.ObtenerRutas();
    document.getElementById("Nombre").disabled = false;

    $("#btnEnviarRutas").click(function (event) {
        event.preventDefault();
        event.stopImmediatePropagation();
        AccionesFormulario.EnviarDatosRutas();
    });

    AccionesFormulario.ObtenerRutasHorarios();

    $("#dpnRutas").change(function () {
        AccionesFormulario.ObtenerInfoRuta();
    });


    $("#tmHoraSalida").change(function () {
        AccionesFormulario.CalcularHoraLlegada();
    });

    $("#btnEnviarHorarios").click(function(event){
        event.preventDefault();
        event.stopImmediatePropagation();
        AccionesFormulario.EnviarDatosHorarios();
    });

    AccionesFormulario.ObtenerHorarios();

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
    },
    //#endregion Métodos Rutas

    //#region Métodos Horarios
    ObtenerRutasHorarios: function () {
        var datos = {
            nombreParametro: ""
        }
        $.get(rutaBaseApiRutas + 'ObtenerRutas/', datos, function (data, status) {
            if (status == 'success') {
                if (data.objetoRespuesta.length > 0) {

                    var dpnRutas = document.getElementById("dpnRutas");
                    for (var i = 0; i < data.objetoRespuesta.length; i++) {
                        var opcion = document.createElement("option");
                        var txtOpcion = document.createTextNode(data.objetoRespuesta[i].paisOrigen + " - " + data.objetoRespuesta[i].paisDestino);
                        opcion.appendChild(txtOpcion);
                        opcion.setAttribute('value', data.objetoRespuesta[i].codigoRuta);
                        dpnRutas.appendChild(opcion);
                        if (duracionRuta == "") {
                            duracionRuta = data.objetoRespuesta[i].duracionHoras + ":" + data.objetoRespuesta[i].duracionMinutos;
                        }
                    }
                }
            }
        })
    },

    ObtenerHorarios: function () {
        var datos = {
            nombreParametro: ""
        }
        $.get(rutaBaseApiHorarios + 0, datos, function (data, status) {
            if (status == 'success') {
                if (data.objetoRespuesta.length > 0) {

                    //Se obtiene la tabla por id pero medio del DOM
                    var tabla = document.getElementById("tblHorarios");
                    var tblCuerpo = tabla.getElementsByTagName("tbody")[0];

                    for (var i = 0; i < data.objetoRespuesta.length; i++) {

                        //Se crea la fila de la tabla
                        var linea = document.createElement("tr");

                        //Se crean las columnas
                        var codigoHorario = document.createElement("td");
                        var codigoRuta = document.createElement("td");
                        var dia = document.createElement("td");
                        var hora = document.createElement("td");
                        var minuto = document.createElement("td");
                        var horaLlegada = document.createElement("td");
                        var basurero = document.createElement("td");
                        var icon = document.createElement("i");

                        //Se llenan las columnas
                        var tCodigoHorario = document.createTextNode(data.objetoRespuesta[i].codigoHorario);
                        var tCodigoRuta = document.createTextNode(data.objetoRespuesta[i].codigoRuta);
                        var tDia = document.createTextNode(data.objetoRespuesta[i].dia);
                        var tHora = document.createTextNode(data.objetoRespuesta[i].hora);
                        var tMinuto = document.createTextNode(data.objetoRespuesta[i].minuto);
                        var fecha=new Date(data.objetoRespuesta[i].horaLlegada);
                        var tHoraLlegada = document.createTextNode(fecha.getHours()+":"+fecha.getMinutes());
                        var tBasurero = document.createElement("button");
                        tBasurero.type = "button";
                        icon.className = "fa fa-trash";
                        tBasurero.appendChild(icon);

                        //Se agrega el contenido a la tabla
                        codigoHorario.appendChild(tCodigoHorario);
                        codigoRuta.appendChild(tCodigoRuta);
                        dia.appendChild(tDia);
                        hora.appendChild(tHora);
                        minuto.appendChild(tMinuto);
                        horaLlegada.appendChild(tHoraLlegada);
                        basurero.appendChild(tBasurero);
                        basurero.setAttribute('onclick', 'AccionesFormulario.EliminarHorario(event)');

                        linea.appendChild(codigoHorario);
                        linea.appendChild(codigoRuta);
                        linea.appendChild(dia);
                        linea.appendChild(hora);
                        linea.appendChild(minuto);
                        linea.appendChild(horaLlegada);
                        linea.appendChild(basurero);
                        linea.setAttribute('ondblclick', 'AccionesFormulario.LlenarCamposHorario(event)');
                        tblCuerpo.appendChild(linea);
                    }
                }
            }
        })
    },

    ObtenerInfoRuta: function () {
        var dpnRutas = document.getElementById("dpnRutas");;

        $.get(rutaBaseApiRutas + dpnRutas.value, function (data, status) {
            if (status == 'success') {
                duracionRuta = data.objetoRespuesta.duracionHoras + ":" + data.objetoRespuesta.duracionMinutos;
            }
        })
    },

    CalcularHoraLlegada: function () {
        var horaSalida = document.getElementById("tmHoraSalida").value;

        var [horas, minutos] = horaSalida.split(":");
        var [horaSum, minutosSum] = duracionRuta.split(":");

        horas = horas.length < 2 ? "0" + horas : horas;
        minutos = minutos.length < 2 ? "0" + minutos : minutos;

        horaSum = horaSum.length < 2 ? "0" + horaSum : horaSum;
        minutosSum = minutosSum.length < 2 ? "0" + minutosSum : minutosSum;

        var fecha = new Date();
        fecha.setHours(parseInt(horas) + parseInt(horaSum));
        fecha.setMinutes(parseInt(minutos) + parseInt(minutosSum));

        var fechaFinal = fecha.getHours().toString();
        var minutosFinal = fecha.getMinutes().toString();

        fechaFinal = fechaFinal.length < 2 ? "0" + fechaFinal : fechaFinal
        minutosFinal = minutosFinal.length < 2 ? "0" + minutosFinal : minutosFinal

        document.getElementById("tmHoraLlegada").value = fechaFinal + ":" + minutosFinal;
    },

    EnviarDatosHorarios: function () {
        if (document.getElementById("tmHoraSalida").value == "") {
            alert("Por favor ingrese la duración de la hora de salida");
        }
        else {
            var tiempo = document.getElementById("tmHoraSalida").value;
            var [horas, minutos] = tiempo.split(":");
            var tiempoLlegada=document.getElementById("tmHoraLlegada").value
            var [horaLlegada,minutosLlegada]=tiempoLlegada.split(":");

            fechaLlegada=new Date();
            fechaLlegada.setHours(parseInt(horaLlegada));
            fechaLlegada.setHours(parseInt(minutosLlegada));

            if (modificarHorario) {
                General.put(rutaBaseApiHorarios + 'ModificarHorario/',
                    {
                        CodigoHorario: document.getElementById("idHorario").value,
                        CodigoRuta: document.getElementById("dpnRutas").value,
                        Dia: document.getElementById("dtDia").value,
                        Hora: horas,
                        Minuto: minutos,
                        HoraLlegada: fechaLlegada
                    },
                    function (data, success, xhr) {
                        if (success == 'success') {
                            window.location.reload();
                        }
                    });
            }
            else {
                General.post(rutaBaseApiHorarios + 'RegistrarHorario/',
                    {
                        CodigoHorario: document.getElementById("idHorario").value,
                        CodigoRuta: document.getElementById("dpnRutas").value,
                        Dia: document.getElementById("dtDia").value,
                        Hora: horas,
                        Minuto: minutos,
                        HoraLlegada: fechaLlegada
                    },
                    function (data, success, xhr) {
                        if (success == 'success') {
                            window.location.reload();
                        }
                    });
            }
        }
    },

    LlenarCamposHorario: function (evt) {

        if (evt !== null && evt !== undefined) {
            document.getElementById("idHorario").value = evt.currentTarget.childNodes[0].textContent;
            

            for (var i = 0; i < document.getElementById("dpnRutas").length; i++) {
                if (document.getElementById("dpnRutas").options[i].value === evt.currentTarget.childNodes[1].textContent) {
                    document.getElementById("dpnRutas").selectedIndex = i;
                    break;
                }
            }

            document.getElementById("dtDia").value=evt.currentTarget.childNodes[2].textContent;

            var hora = evt.currentTarget.childNodes[3].textContent.length < 2 ? "0" + evt.currentTarget.childNodes[3].textContent : evt.currentTarget.childNodes[3].textContent;
            var minutos = evt.currentTarget.childNodes[4].textContent.length < 2 ? "0" + evt.currentTarget.childNodes[4].textContent : evt.currentTarget.childNodes[4].textContent;

            document.getElementById("tmHoraSalida").value = hora + ":" + minutos;
            
            var [horaLlegada,minutosLlegada]=evt.currentTarget.childNodes[5].textContent;
            
            var hLlegada=horaLlegada.length< 2 ? "0" +horaLlegada:horaLlegada;
            var mLLegada=minutosLlegada.length< 2 ? "0" +minutosLlegada:minutosLlegada;

            document.getElementById("tmHoraLlegada").value=hLlegada+":"+mLLegada;

            document.getElementById("idRuta").disabled = true;
            modificarHorario = true;
        }

        if (document.getElementById("tblRutas_length") !== null) {
            document.getElementById("tblRutas_length").remove();
            document.getElementById("tblRutas_info").remove();
            document.getElementById("tblRutas_paginate").remove();
            document.getElementById("tblRutas_filter").remove();
        }
    },

    EliminarHorario: function (evt) {

        var id = value = evt.currentTarget;

        General.delete(rutaBaseApiHorarios + id.parentNode.childNodes[0].textContent, function (data, status) {
            if (status == 'success') {
                window.location.reload();
            }
        })
    },

    //#endregion Métodos Horarios
};