from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def solicitudTransUAI(request):
	return render(request, 'inventario/solicitudTransUAI.html')

