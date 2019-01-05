# -*- encoding: utf-8 -*-
from django.shortcuts 	import render
from django.http 		import HttpResponse

from django.views.decorators.csrf import ensure_csrf_cookie
from django.conf import settings
from django.db import connection

from inventario.models 			import Zona, Carro, Estante
import json
import ast
import sys



def MantenimientoUbicacionViews(request):
	data = {
		'cmbZona'	: obtenerComboZonas(),
	}

	return render(request, 'inventario/mantenimiento_ubicacion.html', data)

def obtenerComboZonas():
	cmb = ''

	for Z in Zona.objects.exclude(activo=False).order_by('nombreZona'):
		cmb += '<option value="'+str(Z.idZona)+'">'+Z.nombreZona+'</option>'

	return cmb

def llenarComboCarro(request):
	id = request.POST['gZona']
	cmb = '<option value="0">Elige un carro</option>'

	for C in Carro.objects.filter(idZona=id).exclude(activo=False).order_by('nombreCarro'):
		cmb += '<option value="'+str(C.idCarro)+'">'+C.nombreCarro+'</option>'

	return HttpResponse(json.dumps({'opciones': cmb}), content_type='application/json')

def llenarComboEstante(request):
	id = request.POST['gCarro']
	cmb = '<option value="0">Elige un estante</option>'

	for E in Estante.objects.filter(idCarro=id).exclude(activo=False).order_by('nombreEstante'):
		cmb += '<option value="'+str(E.idEstante)+'">'+E.nombreEstante+'</option>'

	return HttpResponse(json.dumps({'opciones': cmb}), content_type='application/json')

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

def dt_ZonaDT(request):
	cursor = connection.cursor()

	str_query = """
					select 
					 row_number() over (order by "nombreZona") as cor 
					,"nombreZona"
					,"descripcionZona" 
					,"idZona"
					,activo
					from inventario_zona
				"""
	
	parametros = {}

	cursor.execute(str_query, parametros)
	qs = cursor.fetchall()
	objects_list = convert_fetchall(qs)
	resp = json.dumps(objects_list)

	cursor.close()

	return HttpResponse(resp, content_type = 'application/json')

def dt_CarroDT(request):
	cursor = connection.cursor()

	str_query = """
					SELECT 
					row_number() over (order by "nombreCarro") as cor
					,"nombreCarro"
					,"descripcionCarro"
					,"idCarro"
					,activo
					from inventario_carro
					where activo = true
					and "idZona_id" = %(zona_id)s
				"""
	
	parametros = {
		"zona_id" : int(request.POST['zona']) if request.POST['zona'] not in [None,''] else 0
	}

	cursor.execute(str_query, parametros)
	qs = cursor.fetchall()
	objects_list = convert_fetchall(qs)
	resp = json.dumps(objects_list)

	cursor.close()

	return HttpResponse(resp, content_type = 'application/json')

def dt_EstanteDT(request):
	cursor = connection.cursor()

	str_query = """
					SELECT 
					row_number() over (order by "nombreEstante") as cor
					,"nombreEstante"
					,"descripcionEstante"
					,"idEstante"
					,activo
					from inventario_estante
					where activo = true
					and "idCarro_id" = %(carro_id)s
				"""
	
	parametros = {
		"carro_id" : int(request.POST['carro']) if request.POST['carro'] not in [None,''] else 0
	}

	cursor.execute(str_query, parametros)
	qs = cursor.fetchall()
	objects_list = convert_fetchall(qs)
	resp = json.dumps(objects_list)

	cursor.close()

	return HttpResponse(resp, content_type = 'application/json')


def dt_BandejaDT(request):
	cursor = connection.cursor()

	str_query = """
					SELECT 
					row_number() over (order by "nombreBandeja") as cor
					,"nombreBandeja"
					,"descripcionBandeja"
					,"idBandeja"
					,activo
					from inventario_bandeja
					where activo = true
					and "idEstante_id" = %(estante_id)s
				"""
	
	parametros = {
		"estante_id" : int(request.POST['estante']) if request.POST['estante'] not in [None,''] else 0
	}

	cursor.execute(str_query, parametros)
	qs = cursor.fetchall()
	objects_list = convert_fetchall(qs)
	resp = json.dumps(objects_list)

	cursor.close()

	return HttpResponse(resp, content_type = 'application/json')

def editarZona(request):
	cursor = connection.cursor()

	str_query = """
					UPDATE inventario_zona set "nombreZona" = %(nombre_zona)s, "descripcionZona" = %(descripcion_zona)s, activo = %(activo_zona)s
					where "idZona" = %(id_zona)s;
 
				"""
	
	parametros = {
		"id_zona" : int(request.POST['id_zona'])
		,"nombre_zona" : (request.POST['nombre_zona']) if request.POST['nombre_zona'] not in [None,''] else ''
		,"descripcion_zona" : (request.POST['descripcion_zona']) if request.POST['descripcion_zona'] not in [None,''] else ''
		,"activo_zona" : bool(request.POST['activo_zona']) 
	}

	cursor.execute(str_query, parametros)
	
	cursor.close()

	return HttpResponse(json.dumps('exito'), content_type = 'application/json')

def editarCarro(request):
	cursor = connection.cursor()

	str_query = """
					UPDATE inventario_carro set "nombreCarro" = %(nombre_carro)s, "descripcionCarro" = %(descripcion_carro)s, activo = %(activo_carro)s
					where "idCarro" = %(id_carro)s;
 
				"""
	
	parametros = {
		"id_carro" : int(request.POST['id_carro'])
		,"nombre_carro" : (request.POST['nombre_carro']) if request.POST['nombre_carro'] not in [None,''] else ''
		,"descripcion_carro" : (request.POST['descripcion_carro']) if request.POST['descripcion_carro'] not in [None,''] else ''
		,"activo_carro" : bool(request.POST['activo_carro']) 
	}

	cursor.execute(str_query, parametros)
	
	cursor.close()

	return HttpResponse(json.dumps('exito'), content_type = 'application/json')


def crearZona(request):
	cursor = connection.cursor()

	str_query = """
					INSERT into inventario_zona ("nombreZona", "descripcionZona", activo) 
					values (%(nombre_zona)s, %(descripcion_zona)s, %(activo_zona)s); 
				"""
	
	parametros = {
		"nombre_zona" : (request.POST['nombre_zona']) if request.POST['nombre_zona'] not in [None,''] else ''
		,"descripcion_zona" : (request.POST['descripcion_zona']) if request.POST['descripcion_zona'] not in [None,''] else ''
		,"activo_zona" : bool(request.POST['activo_zona']) 
	}

	cursor.execute(str_query, parametros)
	
	cursor.close()

	return HttpResponse(json.dumps('exito'), content_type = 'application/json')

def crearCarro(request):
	cursor = connection.cursor()

	str_query = """
					INSERT into inventario_carro ("nombreCarro", "descripcionCarro", activo,"idZona_id") 
					values (%(nombre_carro)s, %(descripcion_carro)s, %(activo_carro)s, %(id_zona)s); 
				"""
	
	parametros = {
		"nombre_carro" : (request.POST['nombre_carro']) if request.POST['nombre_carro'] not in [None,''] else ''
		,"descripcion_carro" : (request.POST['descripcion_carro']) if request.POST['descripcion_carro'] not in [None,''] else ''
		,"activo_carro" : bool(request.POST['activo_carro'])
		,"id_zona" : int(request.POST['id_zona']) 
	}

	cursor.execute(str_query, parametros)
	
	cursor.close()

	return HttpResponse(json.dumps('exito'), content_type = 'application/json')

