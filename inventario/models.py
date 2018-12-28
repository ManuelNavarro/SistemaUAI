from django.db import models

# Create your models here.
class Unidad(models.Model):
	idUnidad = models.IntegerField(primary_key = True)
	codigoUnidad = models.CharField(max_length = 10)
	nombreUnidad = models.CharField(max_length = 75)
	activo = models.BooleanField(default = True)
	
class PuestoUnidad(models.Model):
	idPuestoUnidad = models.IntegerField(primary_key = True)
	puestoUnidadClaseId = models.IntegerField()
	nombrePuestoUnidad = models.CharField(max_length = 50)
	puestoJefeId = models.IntegerField()
	idUnidad = models.ForeignKey(Unidad, on_delete = models.DO_NOTHING)

class Plaza(models.Model):
	idPlaza = models.IntegerField(primary_key = True)
	nombrePlaza = models.CharField(max_length = 50)
	activo = models.BooleanField(default = True)
	idUnidad = models.ForeignKey(Unidad, on_delete = models.DO_NOTHING)
	
class Persona(models.Model):
	idPersona = models.IntegerField(primary_key = True)
	nombrePersona = models.CharField(max_length = 50)
	apellidoPersona = models.CharField(max_length = 50)
	
class Empleado(models.Model):
	idEmpleado = models.IntegerField(primary_key = True)
	codigoEmpleado = models.CharField(max_length = 7)
	activo = models.BooleanField(default = True)
	idPersona = models.ForeignKey(Persona, on_delete = models.DO_NOTHING)

#Tabla Plaza_x_Empleado
class PlazaEmpleado(models.Model):
	idPlazaEmpleado = models.IntegerField(primary_key = True)
	plaza = models.ForeignKey(Plaza, on_delete = models.DO_NOTHING)
	idEmpleado = models.ForeignKey(Empleado, on_delete = models.DO_NOTHING)
	activo = models.BooleanField(default = True)

class EstadoPrestamo(models.Model):
	idEstadoPrestamo = models.IntegerField(primary_key = True)
	nombreEstadoPrestamo = models.CharField(max_length = 50)
	descripcionEstadoPrestamo = models.CharField(max_length= 200)
	activo = models.BooleanField(default = True)
	
class EstadoTransferencia(models.Model):
	idEstadoTransferencia = models.IntegerField(primary_key = True)
	nombreEstadoTransferencia = models.CharField(max_length = 50)
	descripcionEstadoTransferencia = models.CharField(max_length= 200)
	activo = models.BooleanField(default = True)
	
class Prestamo(models.Model):
	idPrestamo = models.IntegerField(primary_key = True)
	codigoPrestamo = models.CharField(max_length = 25)
	motivoPrestamo = models.CharField(max_length = 200)
	fechaPrestamo = models.DateField()
	fechaProgramadaDevolucion = models.DateField()
	fechaDevolucionPrestamo = models.DateField()
	idEstadoPrestamo = models.ForeignKey(EstadoPrestamo, on_delete = models.DO_NOTHING)
	idUnidad = models.ForeignKey(Unidad, on_delete = models.DO_NOTHING)
	idEmpleado = models.ForeignKey(Empleado, on_delete = models.DO_NOTHING)
	
class Transferencia(models.Model):
	idTransferencia = models.IntegerField(primary_key = True)
	codigoTransferencia = models.CharField(max_length = 25)
	fechaTransferencia = models.DateField()
	motivoTransferencia = models.CharField(max_length = 200)
	observacionesTransferencia = models.CharField(max_length = 200)
	fechaResolucionTransferencia = models.DateField()
	idEstadoTransferencia = models.ForeignKey(EstadoTransferencia, on_delete = models.DO_NOTHING)
	idUnidad = models.ForeignKey(Unidad, on_delete = models.DO_NOTHING)
	idEmpleado = models.ForeignKey(Empleado, on_delete = models.DO_NOTHING)
	
class Serie(models.Model):
	idSerie = models.IntegerField(primary_key = True)
	nombreSerie = models.CharField(max_length = 200)
	DescripcionSerie = models.CharField(max_length = 200)
	codSerie = models.CharField(max_length = 10)
	activa = models.BooleanField(default = True)
	idSeriePadre = models.IntegerField()
	
class Expediente(models.Model):
	idExpediente = models.IntegerField(primary_key = True)
	codExpediente = models.IntegerField()
	nombreExpediente = models.CharField(max_length = 100)
	DescripcionExpediente = models.CharField(max_length = 200)
	fechaIngresoExp = models.DateField()
	fechaInicioExp = models.DateField()
	fechaFinExp = models.DateField()
	esOriginalExp = models.BooleanField(default = True)
	ubicacionDescripcion = models.CharField(max_length = 200)
	activo = models.BooleanField(default = True)
	fechaExpiracion = models.DateField()
	migradoAtom = models.BooleanField(default = False)
	idTransferencia = models.ForeignKey(Transferencia, on_delete = models.DO_NOTHING)
	
class PrestamoExpediente(models.Model):
	idPrestamoExpediente = models.IntegerField(primary_key = True)
	idPrestamo = models.ForeignKey(Prestamo, on_delete = models.DO_NOTHING)
	idExpediente = models.ForeignKey(Expediente, on_delete = models.DO_NOTHING)
	devuelto = models.BooleanField(default = False)
	
class SerieExpediente(models.Model):
	idSerieExpediente = models.IntegerField(primary_key = True)
	esPrincipal = models.BooleanField(default = False)
	idExpediente = models.ForeignKey(Expediente, on_delete = models.DO_NOTHING)
	idSerie = models.ForeignKey(Serie, on_delete = models.DO_NOTHING)
	
class Zona(models.Model):
	idZona = models.IntegerField(primary_key = True)
	nombreZona = models.CharField(max_length = 10)
	descripcionZona = models.CharField(max_length = 150)
	activo = models.BooleanField(default = True)
	
class Carro(models.Model):
	idCarro = models.IntegerField(primary_key = True)
	nombreCarro = models.CharField(max_length = 10)
	descripcionCarro = models.CharField(max_length = 150)
	activo = models.BooleanField(default = True)
	idZona = models.ForeignKey(Zona, on_delete = models.DO_NOTHING)
	
class Estante(models.Model):
	idEstante = models.IntegerField(primary_key = True)
	nombreEstante = models.CharField(max_length = 10)
	descripcionEstante = models.CharField(max_length = 150)
	activo = models.BooleanField(default = True)
	idCarro = models.ForeignKey(Carro, on_delete = models.DO_NOTHING)

class Bandeja(models.Model):
	idBandeja = models.IntegerField(primary_key = True)
	nombreBandeja = models.CharField(max_length = 10)
	descripcionBandeja = models.CharField(max_length = 150)
	activo = models.BooleanField(default = True)
	idEstante = models.ForeignKey(Estante, on_delete = models.DO_NOTHING)
	
class Caja(models.Model):
	idCaja = models.IntegerField(primary_key = True)
	nombreCaja = models.CharField(max_length = 10)
	descripcionCaja = models.CharField(max_length = 150)
	activo = models.BooleanField(default = True)
	idBandeja = models.ForeignKey(Bandeja, on_delete = models.DO_NOTHING)
	
class EstadoExpediente(models.Model):
	idEstadoExpediente = models.IntegerField(primary_key = True)
	nombreEstadoExpediente = models.CharField(max_length = 50)
	descripcionEstadoExpediente = models.CharField(max_length= 200)
	activo = models.BooleanField(default = True)

class ExpedienteCaja(models.Model):
	idExpedienteCaja = models.IntegerField(primary_key = True)
	idExpediente = models.ForeignKey(Expediente, on_delete = models.DO_NOTHING)
	idCaja = models.ForeignKey(Caja, on_delete = models.DO_NOTHING)
	idEstadoExpediente = models.ForeignKey(EstadoExpediente, on_delete = models.DO_NOTHING)
	
