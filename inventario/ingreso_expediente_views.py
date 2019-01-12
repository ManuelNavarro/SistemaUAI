# -*- encoding: utf-8 -*-
from django.shortcuts 	import render
from django.http 		import HttpResponse

from django.views.decorators.csrf import ensure_csrf_cookie
from django.conf import settings
from django.db import connection

from inventario.models 			import Serie
import json
import ast
import sys



def IngresoExpedienteViews(request):
	data = {
		'dataSeries'	: 	cargarSeries(),
	}

	return render(request, 'inventario/ingreso_expediente.html', data)


def cargarSeries():
	arbol = "{ 'Id' : 0, 'Title' : 'My Tree','ParentId' : null },"#{ 'Id' : 2, 'Title' : '1 - Proyección social', 'ParentId' : 1 },"
#			 { 'Id' : 0, 'Title' : 'My Tree','ParentId' : null },{ 'Id' : 2, 'Title' : '1 - Proyección social', 'ParentId' : 1 },

	for S in Serie.objects.exclude(activa=False).order_by('idSeriePadre','idSerie'): #[0:2]:
		arbol += "{ 'Id' : "+ str(S.idSerie) +", 'Title' : '"+ str(S.codSerie) +" - "+ str(S.nombreSerie) +"', 'ParentId' :  "+ str(S.idSeriePadre) +"},"
	print (arbol)

	return arbol 

"""
		var treeViewData = [
        	{{dataSeries|safe}}
            /*{ 'Id' : 0, 'Title' : 'My Tree','ParentId' : null },
            { 'Id' : 2, 'Title' : '1 - Proyección social', 'ParentId' : 0 },
            { 'Id' : 3, 'Title' : '2 - InvestigacióN social', 'ParentId' : 0 },
            { 'Id' : 4, 'Title' : '3 - Docencia', 'ParentId' : 0 },
            { 'Id' : 5, 'Title' : '1.1 - Lineamientos de proyección social', 'ParentId' : 2 },
            { 'Id' : 6, 'Title' : '1.2 - Propuestas estrategicas de incidencia para la transformación social', 'ParentId' : 2 },
            { 'Id' : 7, 'Title' : '2.1 - Agenda de Investigación', 'ParentId' : 3 },
            { 'Id' : 8, 'Title' : '2.2 - Opinion publica', 'ParentId' : 3 },
            { 'Id' : 9, 'Title' : '2.2 - Investigaciones ejecutadas', 'ParentId' : 3 },
            { 'Id' : 10, 'Title' : '3.1 - Planes y programas de estudio (Pregrado, postgrado y formacion continua)', 'ParentId' : 4 },
            { 'Id' : 11, 'Title' : '3.2 - Programas de materias', 'ParentId' : 4 },
            { 'Id' : 12, 'Title' : '3.2.1 - Evaluaciones', 'ParentId' : 11 },
            { 'Id' : 13, 'Title' : '3.2.2 - Cuadernos y materiales de catedra', 'ParentId' : 11 },
            { 'Id' : 14, 'Title' : '3.2.3 - Direccion de trabajos de graduacion', 'ParentId' : 11 },
            { 'Id' : 15, 'Title' : '3.2.3.1 - Prueba', 'ParentId' : 14 },*/
        ];
"""        