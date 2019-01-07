from django.shortcuts import render
from django.http import HttpResponse

# Create your views here.


def solicitudTrans(request):
	return render(request, 'inventario/solicitudTrans.html')

