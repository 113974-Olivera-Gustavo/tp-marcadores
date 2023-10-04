    // Configuración inicial del mapa
    var platform = new H.service.Platform({
      apikey: 'yydx10xNR7wGhJikOxcox0NIM13wJtQt6taGvSOi2xA' 
    });

    var defaultLayers = platform.createDefaultLayers();
    var map = new H.Map(
      document.getElementById('map'),
      defaultLayers.vector.normal.map,
      {
        zoom: 12,
        center: { lat: -31.4424266, lng: -64.1958503 }
      }
    );

    // Agrega un control de zoom y desplazamiento al mapa
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    // Realiza la solicitud GET a la API para obtener los marcadores
    $.ajax({
      url: 'https://localhost:7107/Marcador',
      method: 'GET',
      dataType: 'json',
      success: function(response) {
        // Agrega los marcadores al mapa
        response.forEach(function(markerData) {
          var marker = new H.map.Marker({ lat: markerData.latitud, lng: markerData.longitud });
          map.addObject(marker);
        });
    
        // Función para centrar el mapa en la ubicación de los marcadores
        function centrarMapaEnMarcadores() {
          var group = new H.map.Group();
          response.forEach(function(markerData) {
            var marker = new H.map.Marker({ lat: markerData.latitud, lng: markerData.longitud });
            group.addObject(marker);
          });
          map.addObject(group);
          map.getViewModel().setLookAtData({ bounds: group.getBoundingBox() });
        }
    
        // Obténer las coordenadas del primer marcador para establecer el centro inicial del mapa
        var firstMarkerData = response[0];
        var initialCenter = { lat: firstMarkerData.latitud, lng: firstMarkerData.longitud };
        map.setCenter(initialCenter);
    
        // Evento para centrar el mapa con los marcadores luego de apretar el boton buscar
        $('#boton').on('click', function() {
          centrarMapaEnMarcadores();
        });
      },
      error: function(xhr, status, error) {
        console.error('Error al obtener los marcadores:', error);
      }
    });

    // Función para cambiar el nivel de zoom del mapa
    function cambiarZoom(nuevoZoom) {
      map.setZoom(nuevoZoom);
    }

    // Evento para acercar el zoom del mapa al hacer clic en el botón "Acercar"
    $('#boton').on('click', function() {
      cambiarZoom(map.getZoom() + 1);
    });

    // Evento para alejar el zoom del mapa al hacer clic en el botón "Alejar"
    $('#boton').on('click', function() {
      cambiarZoom(map.getZoom() - 1);
    });
  