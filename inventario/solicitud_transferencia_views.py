from django.shortcuts import render
from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def solicitudTrans(request):
	return render(request, 'inventario/solicitudTrans.html')

def llenarComboUnidad(request):
	cursor = connection.cursor()

	str_query = """
		select b."idEmpleado", c."idPlaza", c."nombrePlaza"
		from inventario_plazaempleado as a
		left outer join inventario_empleado as b on b."idEmpleado" = a."idEmpleado_id"
		left outer join inventario_plaza as c on c."idPlaza" = a."plaza_id"
		left outer join inventario_persona as d on b."idPersona_id" = d."idPersona"
		left outer join inventario_unidad as e on e."idUnidad" = c."idUnidad_id"
		left outer join inventario_puestounidad as f on e."idUnidad" = f."idUnidad_id"
		where d."idPersona" = %(idEmpleado)s;

	"""

	parametros = {
		"idEmpleado" : (request.POST['idEmpleado'])
	}

	cursor.execute(str_query, parametros)
	qs = cursor.fetchall()
	objects_list = convert_fetchall(qs)
	resp = json.dumps(objects_list)

	cursor.close()

	return HttpResponse(resp, content_type = 'application/json')

def llenarTablaBusqueda(request):
	cursor = connection.cursor()

	str_query = """
		select c."codigoTransferencia", c."fechaTransferencia", a."nombrePersona" || ' ' || a."apellidoPersona" as "nombre_solicitante", 
	   			d."nombreUnidad", count(f."idExpediente") as "cantidad_expedientes", e."nombreEstadoTransferencia" as "estado_transferencia"
		from inventario_persona as a 
		inner join inventario_empleado as b on a."idPersona" = b."idPersona_id"
		inner join inventario_transferencia as c on b."idEmpleado" = c."idEmpleado_id"
		inner join inventario_unidad as d on c."idUnidad_id" = d."idUnidad"
		inner join inventario_estadotransferencia as e on c."idEstadoTransferencia_id" = e."idEstadoTransferencia"
		left outer join inventario_expediente as f on c."idTransferencia" = f."idTransferencia_id"
		where e.activo is true
		and b."idEmpleado" = %(idEmpleado)s
		group by c."codigoTransferencia", c."fechaTransferencia", a."nombrePersona" || ' ' || a."apellidoPersona", 
	   	d."nombreUnidad", e."nombreEstadoTransferencia"
	   	"""

	parametros = {
		"idEmpleado" : (request.POST['idEmpleado'])
	}

	cursor.execute(str_query, parametros)
	qs = cursor.fetchall()
	objects_list = convert_fetchall(qs)
	resp = json.dumps(objects_list)

	cursor.close()

	return HttpResponse(resp, content_type = 'application/json')

def insertarExpediente(request):
	cursor = connection.cursor()

	str_query = """
				insert into inventario_expediente ("codExpediente", "nombreExpediente", "DescripcionExpediente", "fechaIngresoExp", "fechaInicioExp", "fechaFinExp"
	,"fechaExpiracion","esOriginalExp", "ubicacionDescripcion", "idTransferencia_id", "activo", "migradoAtom")
				values(%(ins_codExpediente)s, %(ins_nombreExpediente)s, %(ins_descExpediente)s, %(ins_fechaIngreso)s, %(ins_fechaInicioExp)s,  %(ins_fechaFinExp)s,  
				%(ins_fechaExpiracion)s, %(ins_esOriginalExp)s, %(ins_ubicacionDescripcion)s, %(ins_idTransferencia)s, %(ins_activo)s, )
				"""
	
	parametros = {
		"ins_codExpediente" : int(request.POST['ins_codExpediente'])
		,"ins_nombreExpediente" : (request.POST['ins_codExpediente']) if request.POST['ins_nombreExpediente'] not in [None,''] else ''
		,"ins_descExpediente" : (request.POST['ins_descExpediente']) if request.POST['ins_descExpediente'] not in [None,''] else ''
		,"ins_fechaIngreso" : (request.POST['ins_fechaIngreso']) if request.POST['ins_fechaIngreso'] not in [None,''] else ''
		,"ins_fechaInicioExp" : (request.POST['ins_fechaInicioExp']) if request.POST['ins_fechaInicioExp'] not in [None,''] else ''
		,"ins_fechaFinExp" : (request.POST['ins_fechaFinExp']) if request.POST['ins_fechaFinExp'] not in [None,''] else ''
		,"ins_fechaExpiracion" : (request.POST['ins_fechaExpiracion']) if request.POST['ins_fechaExpiracion'] not in [None,''] else ''
		,"ins_esOriginalExp" : bool(request.POST['ins_esOriginalExp']) 
		,"ins_ubicacionDescripcion" : (request.POST['ins_ubicacionDescripcion']) if request.POST['ins_ubicacionDescripcion'] not in [None,''] else ''
		,"ins_idTransferencia" : int(request.POST['ins_codExpediente'])
		,"ins_activo" : int(request.POST['ins_activo'])
	}

	cursor.execute(str_query, parametros)
	
	cursor.close()

	return HttpResponse(json.dumps('exito'), content_type = 'application/json')



def convert_fetchall(cursor):
	dict_cursor={}
	list_aux=[]
	for item in cursor:
		list_aux.append(list(item))
	dict_cursor['recordsTotal']=len(list_aux)
	dict_cursor['recordsFiltered']=len(list_aux)
	dict_cursor['draw']= len(list_aux)//10
	dict_cursor['data']=list_aux
	return dict_cursor
