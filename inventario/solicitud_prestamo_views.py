from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def solicitudPrestamo(request):
	return render(request, 'inventario/solicitudPrest.html')

