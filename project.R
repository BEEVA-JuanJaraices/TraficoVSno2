
library(sp)
library(gstat)
library(maptools)
library(raster)
library(reshape2)
library(lubridate)
library(rgdal)



setwd('/home/juanjaraices/Proyectos/Tráfico_Madrid/')

############################################################################
# Cargamos las estaciones TRÁFICO
############################################################################
traficoPoints <- readShapeSpatial('Tráfico/pmed_ubicacion_10_2018_point.shp')
plot(traficoPoints)
traficoPoints <- traficoPoints[, c("id")]
head(traficoPoints)

# Cargamos y limpiamos las mediciones de tráfico
medicionesTrafico <- read.csv('Tráfico/Tráfico_10-2018.csv', sep = ";")
medicionesTrafico$dia <- day(medicionesTrafico$fecha)
medicionesTrafico$hora <- hour(medicionesTrafico$fecha)
medicionesTrafico <- medicionesTrafico[, c("id", "dia", "hora", "intensidad", "ocupacion")]
medicionesTrafico <- medicionesTrafico[!is.na(medicionesTrafico$intensidad),]
head(medicionesTrafico)
nrow(medicionesTrafico)

# Agregamos por hora
medicionesPorHora <- aggregate(x = medicionesTrafico$intensidad, 
                              by = list(id = medicionesTrafico$id, dia = medicionesTrafico$dia, hora = medicionesTrafico$hora), 
                              FUN=sum)
head(medicionesPorHora)

nn<-reshape(medicionesPorHora, timevar="hora", idvar=c("id", "dia"), direction="wide")
nn[is.na(nn)]<-0
head(nn)

# Merge
estacionesTrafico <- merge(nn, traficoPoints, by = "id")
head(estacionesTrafico)

trafico2export <- trafico2export[trafico2export$dia <= 1, ]
trafico2export <- trafico2export[!is.na(trafico2export$x),]
head(trafico2export)
nrow(trafico2export)

write.csv(estacionesTrafico, file = 'Tráfico/trafico_octubre_dias.csv')
############################################################################


############################################################################
# Cargamos las estaciones NO2
############################################################################
contaminacionPoints <- readShapeSpatial('CalidadAire/estaciones_red_calidad_aire.shp')
plot(contaminacionPoints)
names(contaminacionPoints@data)[1] = 'id_estacion'
contaminacionPoints@data[7:23] <- list(NULL)
head(contaminacionPoints@data)


# Cargamos las mediciones calidad del aire
medicionesAire <- read.csv('CalidadAire/oct_mo18.csv', sep = ";")
names(medicionesAire)[3] = 'id_estacion'

# Nos quedamos con las mediciones de NO2
medicionesAire <- medicionesAire[medicionesAire$MAGNITUD == 8, ]

#Convertimos columnas con hora a filas
medicionesAireNorm <- melt(medicionesAire, id.vars=c("PROVINCIA", "MUNICIPIO", "id_estacion", "MAGNITUD", "PUNTO_MUESTREO", "ANO", "MES", "DIA"))
medicionesAireNorm <- subset(medicionesAireNorm, grepl("H", variable))


# Merge
estacionesContaminacion <- merge(medicionesAireNorm, contaminacionPoints, by = "id_estacion")

#Renombramos columnas
names(estacionesContaminacion)[9] <- c("HORA")
names(estacionesContaminacion)[10] <- c("NO2")

#Parseamos a entero la columna con la hora
estacionesContaminacion$HORA <- as.numeric(substr(estaciones2export$HORA, 2, 3))
nrow(estacionesContaminacion)


estaciones2export <- estacionesContaminacion[, c("id_estacion", "ANO", "MES", "DIA", "HORA", "NO2", "coords.x1", "coords.x2")]
head(estaciones2export)
nrow(estaciones2export) # 17K filas

estaciones2export <- estaciones2export[estaciones2export$DIA <= 7, ]

write.csv(estaciones2export, file = 'CalidadAire/contaminacion_oct_points.csv')
############################################################################


