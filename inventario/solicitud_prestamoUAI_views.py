from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def solicitudPrestamoUAI(request):
	return render(request, 'inventario/solicitudPrestUAI.html')

