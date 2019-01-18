
var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/dark-v9',
    pitch: 45,
    bearing: -17.6,
    center: [-3.7, 40.42], // starting position
    zoom: 12 // starting zoom,
});

// Add zoom and rotation controls to the map.
map.addControl(new mapboxgl.NavigationControl());

map.on('load', function() {
    // Insert the layer beneath any symbol layer.
    var layers = map.getStyle().layers.reverse();
    var labelLayerIdx = layers.findIndex(function (layer) {
        return layer.type !== 'symbol';
    });
    var labelLayerId = labelLayerIdx !== -1 ? layers[labelLayerIdx].id : undefined;

    var hora = "x.9";
    
    // Cartografía de Fondo
    map.addLayer({
        'id': '3d-buildings',
        'source': 'composite',
        'source-layer': 'building',
        'filter': ['==', 'extrude', 'true'],
        'type': 'fill-extrusion',
        'minzoom': 15,
        'paint': {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': {
                'type': 'identity',
                'property': 'height'
            },
            'fill-extrusion-base': {
                'type': 'identity',
                'property': 'min_height'
            },
            'fill-extrusion-opacity': .6
        }
    }, labelLayerId);

    map.addSource('contaminacionData', {
      type: 'geojson',
      data: './data/contaminacion_octubre_2018.geojson' 
    });

    // Datos de tráfico
    map.addLayer({
        id: 'contaminacion',
        type: 'circle',
        source: "contaminacionData",
        paint: {
          'circle-radius': {
                'base': 10,
                'stops': [[12, 20], [18, 300]]
          },
          'circle-color': {
              "property": "NO2",
              "stops": [
                  [0, '#1a9641'],
                  [25, '#a6d96a'],
                  [60, '#f7f79a'],
                  [100, '#fdae61'],
                  [150, '#d7191c']
              ]
          } ,
          'circle-opacity': 0.8
        }
      }, 'admin-2-boundaries-dispute');



    map.addSource('traficoData1_10', {
        type: 'geojson',
        data: './data/tramos_trafico_1_10.geojson' 
    });

        // Datos de tráfico
    map.addLayer({
        id: 'trafico_1_10',
        type: 'line',
        source: "traficoData1_10",
        layout: {
            "line-join": "round",
            "line-cap": "round"
        },
        paint: {
          'line-width': {
                'base': 1.75,
                'stops': [[12, 2], [22, 180]]
          },
          'line-color': {
              "property": hora,
              "stops": [
                  [0, '#ffffff'],
                  [1500, '#ffbfbf'],
                  [3500, '#ff8080'],
                  [7500, '#ff4040'],
                  [15000, '#ff0000']
              ]
          } ,
          'line-opacity': 0.8
        }
      }, 'contaminacion');

    map.setFilter('trafico_1_10', ['==', 'dia', 1]);
    

    // document.getElementById('daySlider').addEventListener('input', function(e) {
    //   var day = parseInt(e.target.value);
    //   // update the map
    //   map.setFilter('contaminacion', ['==', 'DIA', day]);
    //   map.setFilter('trafico_1_10', ['==', 'dia', day]);

    //   // update text in the UI
    //   document.getElementById('active-day').innerText = day;
    // });

    document.getElementById('hourSlider').addEventListener('input', function(e) {
      var hour = parseInt(e.target.value);
      // update the map
      map.setFilter('contaminacion', ['==', 'HORA', hour]);
      map.setPaintProperty("trafico_1_10", 'line-color', {
              "property": "x." + hour,
              "stops": [
                  [0, '#ffffff'],
                  [1500, '#ffbfbf'],
                  [3500, '#ff8080'],
                  [7500, '#ff4040'],
                  [15000, '#ff0000']
              ]
          });

      // update text in the UI
      document.getElementById('active-hour').innerText = hour + ":00";
    });
});
