# -*- encoding: utf-8 -*-
from django.shortcuts 	import render
from django.http 		import HttpResponse

from django.views.decorators.csrf import ensure_csrf_cookie
from django.conf import settings
from django.db import connection

from inventario.models 			import Unidad, PuestoUnidad, Plaza, Persona, Empleado, PlazaEmpleado
import json
import ast
import sys

# Create your views here.


def ConfiguracionAccesos(request):
	data = {
		'cmbUnidades'	: obtenerComboUnidades(),
	}
	return render(request, 'inventario/confAccesos.html', data)

def obtenerComboUnidades():
	cmb = ''

	for Z in Unidad.objects.order_by('nombreUnidad'):
		cmb += '<option value="'+str(Z.idUnidad)+'">'+Z.nombreUnidad+'</option>'

	return cmb

def llenarComboPuestoGeneral():
	return null

def llenarComboPuestoUnidad(request):
	id = request.POST['gUnidad']
	cmb = '<option value="0">Elige un puesto por unidad</option>'

	for Z in PuestoUnidad.objects.filter(idPuestoUnidad=id).order_by('nombrePuestoUnidad'):
		cmb += '<option value="'+str(Z.idPuestoUnidad)+'">'+Z.nombrePuestoUnidad+'</option>'
		
	return HttpResponse(json.dumps({'opciones': cmb}), content_type='application/json')

def dt_busquedaRoles(request):
	cursor = connection.cursor()

	#str_query = """
	#	select d."nombrePersona", d."apellidoPersona", string_agg(e."nombreUnidad", ', ') as "Unidades", string_agg(c."nombrePlaza", ', ') as plazas, 
	#		   '' as "puesto_general", string_agg(f."nombrePuestoUnidad", ', ') as "puestoUnidad"
	#	from inventario_plazaempleado as a
	#	left outer join inventario_empleado as b on b."idEmpleado" = a."idEmpleado_id"
	#	left outer join inventario_plaza as c on c."idPlaza" = a."plaza_id"
	#	left outer join inventario_persona as d on b."idPersona_id" = d."idPersona"
	#	left outer join inventario_unidad as e on e."idUnidad" = c."idUnidad_id"
	#	left outer join inventario_puestounidad as f on e."idUnidad" = f."idUnidad_id"
	#	where d."nombrePersona" = 
	#	and d."apellidoPersona" = %(apellido)s
	#	and e."idUnidad" = %(unidad)s
	#	and f."idPuestoUnidad" = %(puestoUnidad)s
	#	group by 1, 2
	#	"""

	str_query = """
		select d."nombrePersona", d."apellidoPersona", string_agg(e."nombreUnidad", ', ') as "Unidades", string_agg(c."nombrePlaza", ', ') as plazas, 
			   '' as "puesto_general", string_agg(f."nombrePuestoUnidad", ', ') as "puestoUnidad", d."idPersona"
		from inventario_plazaempleado as a
		left outer join inventario_empleado as b on b."idEmpleado" = a."idEmpleado_id"
		left outer join inventario_plaza as c on c."idPlaza" = a."plaza_id"
		left outer join inventario_persona as d on b."idPersona_id" = d."idPersona"
		left outer join inventario_unidad as e on e."idUnidad" = c."idUnidad_id"
		left outer join inventario_puestounidad as f on e."idUnidad" = f."idUnidad_id"
		group by 1, 2
		"""

	parametros = {
		"nombre" : (request.POST['nombre'])
		,"apellido" : p_apellido
		,"unidad" : p_unidad
		,"puestoUnidad" : p_puestoUnidad
	}

	cursor.execute(str_query, parametros)
	qs = cursor.fetchall()
	objects_list = convert_fetchall(qs)
	resp = json.dumps(objects_list)

	cursor.close()

	return HttpResponse(resp, content_type = 'application/json')

def dt_usuarioRolesDT(request):
	cursor = connection.cursor()

	str_query = """
		select d."nombrePersona", d."apellidoPersona", e."nombreUnidad", c."nombrePlaza", f."nombrePuestoUnidad" as "puestoUnidad", d."idPersona"
		from inventario_plazaempleado as a
		left outer join inventario_empleado as b on b."idEmpleado" = a."idEmpleado_id"
		left outer join inventario_plaza as c on c."idPlaza" = a."plaza_id"
		left outer join inventario_persona as d on b."idPersona_id" = d."idPersona"
		left outer join inventario_unidad as e on e."idUnidad" = c."idUnidad_id"
		left outer join inventario_puestounidad as f on e."idUnidad" = f."idUnidad_id"
		where d."idPersona" = %(idPersona)s
	"""

	parametros = {
		"idPersona" : (request.POST['idPersona'])
	}

	cursor.execute(str_query, parametros)
	qs = cursor.fetchall()
	objects_list = convert_fetchall(qs)
	resp = json.dumps(objects_list)

	cursor.close()

	return HttpResponse(resp, content_type = 'application/json')

def dt_rolesDisponiblesDT(request):
	cursor = connection.cursor()

	str_query = """
		select b."idEmpleado", c."idPlaza", c."nombrePlaza", a."activo"
		from inventario_plazaempleado as a
		left outer join inventario_empleado as b on b."idEmpleado" = a."idEmpleado_id"
		left outer join inventario_plaza as c on c."idPlaza" = a."plaza_id"
		left outer join inventario_persona as d on b."idPersona_id" = d."idPersona"
		left outer join inventario_unidad as e on e."idUnidad" = c."idUnidad_id"
		left outer join inventario_puestounidad as f on e."idUnidad" = f."idUnidad_id"
		where d."idPersona" not in (%(idPersona)s);
	"""

	parametros = {
		"idPersona" : (request.POST['idPersona'])
	}

	cursor.execute(str_query, parametros)
	qs = cursor.fetchall()
	objects_list = convert_fetchall(qs)
	resp = json.dumps(objects_list)

	cursor.close()

	return HttpResponse(resp, content_type = 'application/json')

def agregarRol(request):
	cursor = connection.cursor()

	str_query = """
					INSERT into inventario_plazaempleado ("idEmpleado_id", "plaza_id", "activo") 
					values (%(idEmpleado)s, %(plaza_id)s, %(activo)s); 
				"""
	
	parametros = {
		"idEmpleado" : int(request.POST['insert_idEmpleado_id'])
		,"plaza_id" : int(request.POST['insert_plaza_id'])
		,"activo" : bool(request.POST['insert_activo']) 
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
