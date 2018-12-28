from django.conf.urls import url, include

from inventario.views import index

urlpatterns = [
    url(r'^index$', index),
]