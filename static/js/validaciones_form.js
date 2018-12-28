
$(document).on('showalert', '.alert', function(event,tiempo){
    window.setTimeout($.proxy(function() {
		myalert = $(this);
		bucle = setInterval(function(){ //Y vuelve a iniciar
            if(myalert.find(":hover").length==0){
            	myalert.fadeTo(500, 0).slideUp(500, function(){
		            myalert.remove();
		            clearInterval( bucle );
		       	});
            }
        }, 1000);
    }, this), tiempo);
});

/*
	FUNCION PARA VALIDAR QUE:
		- NO PONGAN LETRAS EN VES DE NUMEROS -> EJ: aa-bb-cc
		- LA FECHA SIGA EL FORMATO PARA QUE EL SERVIDOR NO ENTRE EN CONFLICTO
	PARAMETROS:
		fecha -> ARREGLO DE 3 POSICIONES
			POSICION 0 -> DIA
					 1 -> MES
					 2 -> AÑO
*/
function validarFormato(fecha){
	if(fecha[0].length==2 && fecha[1].length==2 && fecha[2].length==4){ //valida que esten dos caracteres en cada posicion dia-mes-año
		if(!isNaN(fecha[0]) && !isNaN(fecha[1]) && !isNaN(fecha[2])){ // valida que dia, mes y año sean numeros y no cualquier otra cosa.
			return true; // todo bien, el formato cumple.
		}
	}

	return false; //el formato no cumple
}

function validarCorreo(correo){
	return /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(correo);
}

function validarAnioFecha(fecha){ //year=1800 is before 1900; the datetime strftime() methods require year >= 1900
	if(parseInt(fecha[2]) >= 1900){
		return false; //Todo Ok
	}else{
		return true; //Muestra error
	}
}

function validarAnioNacimiento(fecha){
	var fecha_nacimiento = new Date(fecha[2]+"-"+fecha[1]+"-"+fecha[0]).getTime();
	var hoy 			 = new Date().getTime();
	var diff 			 = hoy - fecha_nacimiento;
	
	//console.log((diff/(1000*60*60*24))/365); 
	diff = (diff/(1000*60*60*24))/365; //--> milisegundos -> segundos -> minutos -> horas -> días -> años

	if(diff < 14){
		return true // Es menor de 14 años, muestra error!!
	}else{
		return false // Todo Ok
	}


}


function validarFecha(desde,hasta,div_padre){
			/*

			VALIDAR SI LA FECHA "DESDE" VA ANTES DE LA FECHA "HASTA"
			POSICION 0 PARA DIA, 1 PARA MES Y 2 PARA AÑO
			ENVIARA TRUE  SI LAS FECHAS NO SON VALIDAS

			*/
			var msj="";
			var no_cumple=false;
			if(desde!=""){
				if(desde.length!=3 || !validarFormato(desde) ){
						msj+="<li><strong>Desde:</strong> Formato inválido <br></li>";
						no_cumple=true;
				}else{
						if(hasta!=""){
								if(hasta.length!=3 || !(validarFormato(hasta))){
										msj+="<li><strong>Hasta:</strong> Formato inválido </li>";
										no_cumple=true;
								}else{
									var desde= new Date(desde[2],desde[1],desde[0]);
									var hasta= new Date(hasta[2],hasta[1],hasta[0]);
									if(desde>=hasta){
											msj+="<li><strong>Desde/Hasta:</strong> Rango de fechas inválidas </li>";
											no_cumple=true;
									}
								}
						}
				}

			}else{
				msj+="<li><strong>Desde:</strong> Campo obligatorio <br></li>";
				no_cumple=true;

			}
			if(no_cumple){
				create_alert(msj,"ERROR",div_padre,false,0);
				return true;
			}else{
				return false;
			}
		}

	function validarFechaCustom(desde,hasta){
			/*

			VALIDAR SI LA FECHA "DESDE" VA ANTES DE LA FECHA "HASTA"
			POSICION 0 PARA DIA, 1 PARA MES Y 2 PARA AÑO
			ENVIARA TRUE  SI LAS FECHAS NO SON VALIDAS

			*/
			var msj="";
			var no_cumple=false;
			if(desde!=""){
				if(desde.length!=3 || !validarFormato(desde) ){
						no_cumple=true;
				}else{
						if(hasta!=""){
								if(hasta.length!=3 || !(validarFormato(hasta))){
										no_cumple=true;
								}else{
									var desde= new Date(desde[2],desde[1],desde[0]);
									var hasta= new Date(hasta[2],hasta[1],hasta[0]);
									if(desde>hasta){
											no_cumple=true;
									}
								}
						}
				}

			}

			if(no_cumple){
				return true;
			}else{
				return false;
			}
		}


function validarCombo(combo){
	if(combo.value==""){
		return true; // NO HA SELECCIONADO NADA
	}
	else{
		return false;
	}
}


function validarCadenaAlfabetica(nombre){
	return /^(^[a-zA-Z_áéíóúñ\s]*$)/.test(nombre);
}




 function create_alert(mensaje, tipo_alerta, div_padre, emergente,tiempo){
    	/*
		RECIBE:
    		mensaje ---> LA CADENA CON EL MENSAJE A MOSTRAR.
    		tipo_alerta ---> EL TIPO DE ALERTA QUE SE DESEA EJECUTAR, IMPLICA LO SIGUIENTE:
    			EXITO ----------- "success" ----------- glyphicon glyphicon-ok-sign
				ERROR ----------- "danger" ------------ glyphicon glyphicon-remove-sign
				INFO ------------ "info" -------------- glyphicon glyphicon-info-sign
			div_padre ---> NOMBRE DEL DIV DONDE SE DESEA MOSTRAR EL MENSAJE
			emergente ---> TRUE SI VA A DESAPARECER EN UN DETERMINADO TIEMPO, DE LO CONTRARIO QUEDARA ESTATICO.
			tiempo ---> EN EL CASO DE LAS EMERGENTES, EL TIEMPO QUE SE VA A TARDAR EN PANTALLA
    	*/

    var padre="#" + div_padre;
    var cad='';
    switch(tipo_alerta) {
    	case "EXITO":
    		var msj_aux='<b>¡Éxito!</b>';
    		var tipo= 'success';
    		var icono='ok-sign';
    		break;
    	case "ERROR":
    		var msj_aux= '<b>Atención.</b> <small style="color: black">Se han encontrado los siguientes inconvenientes:</small>';
    		var tipo= 'danger';
    		var icono='remove-sign';
    		break;
    	case "INFO":
    		var msj_aux='<b>Información</b>';
    		var tipo= 'info';
    		var icono='info-sign';
    		break;
    	case "WAR":
    		var msj_aux='<b>Validación.</b> <small>Por favor verifique la siguiente información:</small>';
    		var tipo= 'warning';
    		var icono='exclamation-sign';
    		break;
    }

    if(emergente){
	    cad+= '<div class="alert alert-'+ tipo+ '" style="margin: 0px 2% 2%;">\
	    		<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>';
	    cad+= '<strong style="font-size: 20px;"><i  class="glyphicon glyphicon-'+ icono+ '"></i>  ' + msj_aux + '</strong><br/>';
	     cad+= '<div style="margin-left:5%;"><ul>' + mensaje + '</ul></div>';
	    $(cad).appendTo(padre).trigger('showalert',[tiempo]);
    }else{
    	cad+= '<div style="margin: 0px 2% 2%;" class="alert alert-'+ tipo+ '"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a> \
    			';
	    cad+= '<strong style="font-size: 15px;"><i  class="glyphicon glyphicon-'+ icono+ '"></i>  ' + msj_aux + '</strong><br/>';
	    cad+= '<div style="margin-left:5%;"><ul>' + mensaje + '</ul></div></div>';
    	document.getElementById(div_padre).innerHTML=cad;
    }
 }


/*
	FUNCIÓN QUE PERMITE GENERAR UN ALERT DE TIPO INFORMACIÓN PARA FORMULARIOS
	RECIBE:
		tipo_accion ---> STRING DE QUE TIPO DE ACCIÓN SE PLANEABA REALIZAR.
		div_padre ---> NOMBRE DEL DIV DONDE SE MOSTRARÁ LA ALERTA
		emergente ---> TRUE SI VA A DESAPARECER EN UN DETERMINADO TIEMPO, DE LO CONTRARIO QUEDARA ESTATICO.
		tiempo ---> EN EL CASO DE LAS EMERGENTES, EL TIEMPO QUE SE VA A TARDAR EN PANTALLA
*/

function info_seleccion(tipo_accion,div_padre,emergente,tiempo){
	var cad= "Debe seleccionar un registro para realizar la " + tipo_accion;
	create_alert(cad,"INFO",div_padre,emergente,tiempo);
}

/*
	FUNCIÓN QUE PERMITE GENERAR UN ALERT DE TIPO WARNING PARA FORMULARIOS
	UTILIZAR EN VALIDACIONES CUYOS MENSAJES PROVIENEN DEL SERVIDOR.
	RECIBE:
		json ---> VARIABLE DE TIPO JSON QUE CONTIENE LA LLAVE "ERRORS" QUE ES UN DICCIONARIO QUE SE IMPRIMIRÁ EN PANTALLA.
		div_padre ---> NOMBRE DEL CONTENEDOR EN DONDE SE COLOCARÁ EL CÓDIGO DEL ALERT.

*/
function show_errors(json, div_padre){
	var json_keys= Object.keys(json["errors"]);
	var message='';
	for (var i = json_keys.length - 1; i >= 0; i--) {
		message+="<li> <strong class='text-capitalize'>" + correc_palabras(json_keys[i].toString())  + ": </strong>" + json['errors'][json_keys[i]][0] + "</li>";
	};
	create_alert(message,"ERROR",div_padre,false,0);
}

function correc_palabras(palabra){
	/*
		Corrección de ortográfia para el form.errors de Django.
	*/
	var arr_palabras=[
				['escalafon','Tipo de categoría'],
				['descripcion','Descripción'],
				['categoria_puesto', 'Categoría del puesto'],
				['Unidad_GrupoUnidades','Unidad / Grupo de unidades'],
				['tipo_funcion','Tipo de la función'],
				['nivel_funcion','Nivel de la función'],
				['__all__','Institución'],
				[' Correo_contacto','Correo Electrónico del contacto'],
				['unidad_grupoUnidades', 'Unidad'],
				['fecha_de_falta','Fecha de sanción'],
				['permiso_tipo', 'Tipo de permiso'],
				['sancion_tipo', 'Tipo de Sanción'],
				['sancion_gravedad', 'Gravedad de la Sanción'],
				['correo','Dirección de correo electrónico'],
				['correo_tipo','Tipo de correo'],
				['titulo_obtenido','Título obtenido'],
				['formacion_academica_tipo','Tipo de formación académica'],
				['institucion','Institución'],
				['fecha_nacimiento','Fecha de nacimiento'],
				['departamento_origen','Departamento de origen'],
				['departamento_domicilio','Departamento de domicilio'],
				['direccion_domicilio','Dirección de domicilio'],
				['region','Región'],
				['pais_domicilio','País de domicilio'],
				['pais_origen','País de origen'],
				['contrasena_actual','Contraseña actual'],
				['contrasena_nueva','Contraseña nueva'],
				['telefono_tipo','Tipo de télefono'],
				['fecha_inicio_periodo', 'fecha inicio de periodo'],
				['fecha_fin_periodo', 'fecha fin de periodo'],
				['rango_salarial', 'Rango salarial'],
				['experiencia_laboral_tipo','Tipo de experiencia laboral'],
				['nombre_puesto','Nombre del puesto'],
				['cantidad_encargado','Cantidad de encargados'],
				['pais_empresa','País empresa'],
				['funciones_realizadas','Funciones realizadas'],
				['rango_salarial','Rango Salarial'],
				['institucion_bancaria','Institución Bancaria'],
				['numero_cuenta','Número de cuenta'],
				['fecha_labores','Fecha de labores'],
				['tiempo_dias','Días'],
				['tiempo_meses','Meses'],
				['tiempo_anhos','Anhos'],
				['fecha_efectiva','Fecha efectiva de despido'],
				['fecha_inicio','Fecha inicio'],
				['fecha_fin','Fecha fin'],
				['tipo_presupuesto','Tipo de financiamiento'],
				['fecha_inicio_fin','Fecha inicio / fin'],
				['tipo_otra_actividad','Tipo de otra actividad'],
				['tipo_gestion_academica','Tipo de gestión académica'],
				['institucion_organizacion','Institución / Organización'],
				['desde_hasta','Desde / Hasta'],
				['fechaini_graduacion','Fecha de graduación'],
				['tipo_dependencia','Tipo de dependencia'],
				['correo_contacto','Correo de contacto'],
				['despido_tipo','Tipo de despido'],
				['documento_despido','Documento'],
				['motivo_despido','Motivo del despido'],
				['correo_unidades','Correo'],
				['detalle_publicacion','Detalle de la publicación'],
				['lugar_trabajo','Lugar de trabajo'],
				['tipo_equipo_investigacion','Tipo de equipo'],
				['tipo_cobertura_espacial','Cobertura espacial'],
				['nombre_revista','Nombre de la revista'],
				['pais','País'],
				['dedicacion','Horas de dedicación'],
				['linea_aprobacion','Línea de aprobación'],
				['motivo_dosis','Motivo / dosis'],
				['nombre_actividad','Nombre de la actividad'],
				['anhomes_participacion_inicio','Inicio'],
				['anhomes_participacion_fin','Fecha inicio / fin'],
				['tipo_estudio','Tipo de estudio'],
				['url_titulo','Subir atestado'],
				['fecha_graduacion','Fecha de graduación'],
				['fin_periodo','Fin de período'],
				['caracter_investigacion','Carácter de investigación'],
				['tipo_linea','Línea de investigación UCA'],
				['tipo_objetivo_socieconomico','Objetivo socioeconómico'],
				['tipo_proyecto_social','Tipo de proyecto'],
				['tipo_objetivo_socieconomico','Objetivo socioeconómico'],
				['tipo_publicacion_academica','Tipo de publicación'],
				['medio_publicacion','Medio de publicación'],
				['codigo_prestacion','Código de prestación'],
				['es_credito','Información de crédito'],
				['es_descuento','Información de descuento'],
				['max_monto','Monto máximo'],
				['meses_periodicidad','Periodicidad de la prestación'],
				['anho_prestacion','Años requeridos para obtener prestación'],
				['rango_inicial','Rango inicial'],
				['valor_tipo','Tipo de valor'],
				['fecha_inicio_aplicacion','Fecha inicio de la aplicación'],
				['descripcion_valor','Descripción'],
				['rango_tipo','Tipo de rango'],
				['rango_fin','Rango final'],
				['mes_prestacion','Mes de la prestación'],
				['movimiento_tipo','Movimiento tipo'],
				//['anhomes_participacion_fin','Fin'],
				//['anhomes_participacion_fin','Fin'],
				];
	for(var i=0;i<arr_palabras.length;i++){
		if(palabra==arr_palabras[i][0]){

			palabra=arr_palabras[i][1];
		}
	}
	return palabra.capitalize();
}

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}


function datatable_catchError(){
	mensaje="<br><div class='alert alert-danger'>"
	mensaje+="<strong>Atención</strong> <i class='ace-icon fa fa-wrench icon-animated-wrench bigger-125'></i><br>"
	mensaje+="Ocurrío un inconveniente. Por favor intentelo más tarde."
	mensaje+="</div>"
	bootbox.dialog({
	  message: mensaje
	});
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

Number.prototype.toFixedDown = function(digits) {
    var re = new RegExp("(\\d+\\.\\d{" + digits + "})(\\d)"),
        m = this.toString().match(re);
    return m ? parseFloat(m[1]) : this.valueOf();
};

/*
Función que permite abrir un enlace (url) en una pestaña aparte
*/
function abrirEnPestana(url) {
	var a = document.createElement("a");
	a.target = "_blank";
	a.href = url;
	a.click();
}


/*Funcion que recibe una string y lo coloca en formato con comas :)*/
function addCommas(nStr) {
    nStr += '';
    x = nStr.split('.');
    x1 = x[0];
    x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

function daysBetweenDates(date1,date2){
	var arr_date1= date1.split('-'); //dd-mm-yyyy
	var arr_date2= date2.split('-');

	var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
	var firstDate = new Date(arr_date1[2],arr_date1[1],arr_date1[0]);
	var secondDate = new Date(arr_date2[2],arr_date2[1],arr_date2[0]);

	var diffDays = Math.round(Math.abs((firstDate.getTime() - secondDate.getTime())/(oneDay)));
	return diffDays;

}


function addCommas2(nStr) {
    if(nStr!='N/A' && nStr!='N/D'){	
	    nStr += '';
	    x = nStr.split('.');
	    x1 = x[0];
	    x2 = x.length > 1 ? '.' + x[1] : '.00';
	    var rgx = /(\d+)(\d{3})/;
	    while (rgx.test(x1)) {
	            x1 = x1.replace(rgx, '$1' + ',' + '$2');
	    }
	    if( x2.length == 2 ){
	    	x2 = x2 + '0';
	    }
	    if( x2.length > 3 ){
	    	x2 = parseFloat(x2).toFixed(2) + "";
	    	x2 = x2.substr(1)
	    }
		if(x1[0]=='-'){
			x1 = x1.replace('-','(');
    		return x1 + x2+')';
		}else{
			return x1 + x2;
		}
    }else{
    	return nStr
    }
}

function roundNumber(rnum, rlength) { 
    var newnumber = Math.round(rnum * Math.pow(10, rlength)) / Math.pow(10, rlength);
    return newnumber;
}


Array.prototype.remove = function(from, to) {
	var rest = this.slice((to || from) + 1 || this.length);
	this.length = from < 0 ? this.length + from : from;
	return this.push.apply(this, rest);
};


function obtenerMes(mes){
	var nombre = ""
	switch(mes){
		case '01':
			nombre = 'Enero';
			break;
		case '02':
			nombre = 'Febrero';
			break;
		case '03':
			nombre = 'Marzo';
			break;
		case '04':
			nombre = 'Abril';
			break;
		case '05':
			nombre = 'Mayo';
			break;
		case '06':
			nombre = 'Junio';
			break;
		case '07':
			nombre = 'Julio';
			break;
		case '08':
			nombre = 'Agosto';
			break;
		case '09':
			nombre = 'Septiembre';
			break;
		case '10':
			nombre = 'Octubre';
			break;
		case '11':
			nombre = 'Noviembre';
			break;
		case '12':
			nombre = 'Diciembre';
			break;
	}
	return nombre;
}


/*
DUI = 00016297-5
Posiciones -> 9     8     7     6     5     4     3      2
DUI        -> 0     0     0     1     6     2     9      7
DV         =  5
sum:     (9*0) + (8*0) + (7*0) + (6*1) + (5*6) + (4*2) + (3*9) + (2*7) = 85
residuo: (85 % 10) = 5
resta:   10 - residuo = 5
IF DV == Resta THEN true ELSE false

isDUI('00016297-5');  // true

isDUI('12345678-1');  // false
isDUI('123456789-1'); // false
isDUI('12345678-12'); // false
*/

var isDUI = function(str){
   var regex = /(^\d{8})-(\d$)/,
       parts = str.match(regex);
    // verficar formato y extraer digitos junto al digito verificador
    if(parts !== null){
      var digits = parts[1],
          dig_ve = parseInt(parts[2], 10),
          sum    = 0;
      // sumar producto de posiciones y digitos
      for(var i = 0, l = digits.length; i < l; i++){
        var d = parseInt(digits[i], 10);
        sum += ( 9 - i ) * d;
      }
      return dig_ve === (10 - ( sum % 10 ))%10;
    }else{
      return false;
    }
};

function isNRC(cad){
	var regex = /^([0-9])+(-([0-9])+)?$/;

	return regex.test(cad)
}

function convertirMes(mes){
	var meses = [
		  "Enero", "Febrero", "Marzo",
		  "Abril", "Mayo", "Junio", "Julio",
		  "Agosto", "Septiembre", "Octubre",
		  "Noviembre", "Diciembre"
		]
	return meses[parseInt(mes)-1];
}

$(document).ready(function() {


	$(".bloquear_letras_decimal").keydown(function (e) {
	    if ($.inArray(e.keyCode, [8, 9, 27, 13, 110,190,188]) !== -1 ||
	         // Allow: Ctrl+A
	        (e.keyCode == 65 && e.ctrlKey === true) ||
	         // Allow: Ctrl+C
	        (e.keyCode == 67 && e.ctrlKey === true) ||
	         // Allow: Ctrl+X
	        (e.keyCode == 88 && e.ctrlKey === true) ||
	         // Allow: home, end, left, right
	        (e.keyCode >= 35 && e.keyCode <= 39)) {
	             // let it happen, don't do anything
	             return;
	    }
	    // Ensure that it is a number and stop the keypress
	    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
	        e.preventDefault();
	    }
	});


	$('.money_input').on('blur',function(){
	    $(this).formatCurrency({roundToDecimalPlace: 2, symbol: ''});
	});

	$(".bloquear_letras_no_decimal").keydown(function (e) {
	    if ($.inArray(e.keyCode, [8, 9, 27, 13]) !== -1 ||
	         // Allow: Ctrl+A
	        (e.keyCode == 65 && e.ctrlKey === true) ||
	         // Allow: Ctrl+C
	        (e.keyCode == 67 && e.ctrlKey === true) ||
	         // Allow: Ctrl+X
	        (e.keyCode == 88 && e.ctrlKey === true) ||
	         // Allow: home, end, left, right
	        (e.keyCode >= 35 && e.keyCode <= 39)) {
	             // let it happen, don't do anything
	             return;
	    }
	    // Ensure that it is a number and stop the keypress
	    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
	        e.preventDefault();
	    }
	});


	$(".evaluar_max").on('change',function(){
		var max_value = $(this).attr('max');
		var value= $(this).val();

		if (typeof max_value !== typeof undefined && max_value !== false) {
		   if(parseFloat(value)> parseFloat(max_value)){
		   		$(this).val(max_value);
		   }
		}
	});

});

//FUNCION QUE EVITA QUE SE PUEDA CHECK UN CHECKBOX
function blocked_check(event){
	event.preventDefault();
    event.stopPropagation();
    
    return false;
}