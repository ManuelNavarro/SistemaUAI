from django.conf.urls import url, include

from inventario.views import index
from inventario.mantenimiento_ubicacion_views import MantenimientoUbicacionViews
from inventario.mantenimiento_ubicacion_views import obtenerComboZonas
from inventario.mantenimiento_ubicacion_views import llenarComboCarro
from inventario.mantenimiento_ubicacion_views import llenarComboEstante
from inventario.mantenimiento_ubicacion_views import dt_ZonaDT
from inventario.mantenimiento_ubicacion_views import dt_CarroDT
from inventario.mantenimiento_ubicacion_views import dt_EstanteDT
from inventario.mantenimiento_ubicacion_views import dt_BandejaDT
from inventario.mantenimiento_ubicacion_views import editarZona
from inventario.mantenimiento_ubicacion_views import crearZona
from inventario.mantenimiento_ubicacion_views import editarCarro
from inventario.mantenimiento_ubicacion_views import crearCarro
from inventario.solicitud_transferencia_views import solicitudTrans, llenarComboUnidad, llenarTablaBusqueda, insertarExpediente
from inventario.solicitud_transferenciaUAI_views import solicitudTransUAI
from inventario.solicitud_prestamoUAI_views import solicitudPrestamoUAI
from inventario.solicitud_prestamo_views import solicitudPrestamo
from inventario.configuracion_accesos import ConfiguracionAccesos, dt_busquedaRoles, llenarComboPuestoUnidad, dt_usuarioRolesDT, dt_rolesDisponiblesDT, agregarRol

urlpatterns = [
    url(r'^index$', index),

    #Mantenimiento de ubicacion
    url(r'^mantenimiento_ubicacion/', MantenimientoUbicacionViews, name='MantenimientoUbicacionViews'),
    url(r'^obtenerComboZonas/', obtenerComboZonas, name='obtenerComboZonas'),
    url(r'^llenarComboCarro/', llenarComboCarro, name='llenarComboCarro'),
    url(r'^llenarComboEstante/', llenarComboEstante, name='llenarComboEstante'),
    url(r'^dt_ZonaDT/', dt_ZonaDT, name='dt_ZonaDT'),
    url(r'^dt_CarroDT/', dt_CarroDT, name='dt_CarroDT'),
    url(r'^dt_EstanteDT/', dt_EstanteDT, name='dt_EstanteDT'),
    url(r'^dt_BandejaDT/', dt_BandejaDT, name='dt_BandejaDT'),
    url(r'^editarZona/', editarZona, name='editarZona'),
    url(r'^crearZona/', crearZona, name='crearZona'),
    url(r'^editarCarro/', editarCarro, name='editarCarro'),
    url(r'^crearCarro/', crearCarro, name='crearCarro'),

    #AMIRANDA - Solicitudes de transferencia
   	url(r'^solicitudTrans$', solicitudTrans),
   	url(r'^llenarComboUnidad$', llenarComboUnidad, name='llenarComboUnidad'),
   	url(r'^llenarTablaBusqueda$', llenarTablaBusqueda, name='llenarTablaBusqueda'),
   	url(r'^insertarExpediente$', insertarExpediente),

   	#AMIRANDA - Solicitudes de transferencia UAI
   	url(r'^solicitudTransUAI$',solicitudTransUAI),

   	#AMIRANDA - Solicitudes de prestamo
   	url(r'^solicitudPrestamo$', solicitudPrestamo),

   	#AMIRANDA - Solicitudes de prestamo UAI
   	url(r'^solicitudPrestamoUAI$',solicitudPrestamoUAI),

   	#AMIRANDA - Configuracion de accesos
   	url(r'^configuracionAccesos/$',ConfiguracionAccesos, name='ConfiguracionAccessos'),
   	url(r'^dt_busquedaRoles/$', dt_busquedaRoles, name='dt_busquedaRoles'),
   	url(r'^llenarComboPuestoUnidad/$', llenarComboPuestoUnidad, name ='llenarComboPuestoUnidad'),
   	url(r'^dt_usuarioRolesDT/$', dt_usuarioRolesDT, name = 'dt_usuarioRolesDT'),
	url(r'^dt_rolesDisponiblesDT/$', dt_rolesDisponiblesDT, name = 'dt_rolesDisponiblesDT'),
	url(r'^agregarRol/$', dt_usuarioRolesDT, name = 'agregarRol'),
]
