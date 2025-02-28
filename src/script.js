


// Configuration de la carte
var map = new maplibregl.Map({
    container: 'map',
    style: 'https://openmaptiles.geo.data.gouv.fr/styles/fiord-color/style.json', // Fond de carte
    center: [-1.677, 48.110], // lat/long
    zoom: 12, // zoom
    pitch: 50, // Inclinaison
    bearing: 0 // Rotation
});




// Fonction pour ajouter les sources des données (en suite on doit choisir quelle couche prendre de puis la source car parfois plurieurs couches par source)

function addLayers() {
    // Ajouter la source et couche des routes
    map.addSource('france_vector', {
        type: 'vector',
        url: 'https://openmaptiles.geo.data.gouv.fr/data/france-vector.json'
    });
  

    //Proprietes
    map.addSource('Proprietes', {
        type: 'vector',
        url: 'mapbox://ninanoun.a4kdgiot'
    });

   // batiments IGN Tuiles vectorielles 
    map.addSource('BDTOPO', {
        type: 'vector',
        url: 'https://data.geopf.fr/tms/1.0.0/BDTOPO/metadata.json',
        minzoom: 15,
        maxzoom: 19
    });


    // Ajout stations de métro
    map.addSource('Stations', {
      type: 'geojson',
      data: 'https://raw.githubusercontent.com/Toma-TL/data_stock/refs/heads/main/stations_vls.geojson'
    });

  // Ajout cadastre
    map.addSource('Cadastre', {
      type: 'vector',
      url: 'https://openmaptiles.geo.data.gouv.fr/data/cadastre.json' });
      

  
  
  

// Appels de données via API
  
  dataCadastre = 'https://apicarto.ign.fr/api/cadastre/commune?code_insee=35238';
      jQuery.when( jQuery.getJSON(dataCadastre)).done(function(json) {
        for (i = 0; i < json.features.length; i++) {
        json.features[i].geometry = json.features[i].geometry;
        };
          map.addLayer(
            {'id': 'Contourcommune',
             'type':'line',
             'source': {'type': 'geojson','data': json},
             'paint' : {'line-color': 'darkred',
             'line-width':2.5},
             'layout': {'visibility': 'none'},
            }
          );
      });
  
  
dataRPG = 'https://apicarto.ign.fr/api/rpg/v2?annee=2021&geom=%7B%22type%22%3A%20%22Point%22%2C%22coordinates%22%3A%5B1.647%2C48.146%5D%7D&_limit=100';
jQuery.when( jQuery.getJSON(dataRPG)).done(function(json) {
for (i = 0; i < json.features.length; i++) {
json.features[i].geometry = json.features[i].geometry;
};
map.addLayer(
{ 'id': 'RPG',
'type':'fill',
'source': {'type': 'geojson','data': json},
'paint' : {'fill-color': 'red'},
'layout': {'visibility': 'visible'}
});
});
  
  
  // PLU
 dataPLU = 'https://apicarto.ign.fr/api/gpu/zone-urba?partition=DU_243500139';
jQuery.when(jQuery.getJSON(dataPLU)).done(function(json) {
// Filtrer les entités pour ne garder que celles avec typezone = 'U'
var filteredFeatures = json.features.filter(function(feature)
{return feature.properties.typezone === 'N';});
// Créer un objet GeoJSON avec les entités filtrées
var filteredGeoJSON = { type: 'FeatureCollection', features: filteredFeatures};
map.addLayer({
'id': 'PLU',
'type': 'fill',
'source': {'type': 'geojson',
'data': filteredGeoJSON},
'paint': {'fill-color': 'green',
'fill-opacity': 0.5},
 'layout': {'visibility': 'none'}
});
});
  
  
  
  
  // boulangeries
const ville = "Rennes";
$.getJSON(`https://overpass-api.de/api/interpreter?data=[out:json];area[name="${ville}"]->.searchArea;(node["shop"="bakery"](area.searchArea););out center;`,
function(data) {var geojsonData = {
                      type: 'FeatureCollection',
                      features: data.elements.map(function(element) {
                        return {type: 'Feature',
                        geometry: { type: 'Point',coordinates: [element.lon, element.lat]                             },
                        properties: {}};
                        })
                      };
  map.addSource('customData', {
    type: 'geojson',
    data: geojsonData
   });
  map.addLayer({
    'id': 'boulangeries',
    'type': 'circle',
    'source': 'customData',
    'paint': {'circle-color': 'green',
    'circle-radius': 5},
    'layout': {'visibility': 'none'}
  });
});
  
  
  
  
  
  // arrets bus
const ville2 = "Rennes";
$.getJSON(`https://overpass-api.de/api/interpreter?data=[out:json];area[name="${ville2}"]->.searchArea;(node["highway"="bus_stop"](area.searchArea););out center;`,
function(data) {var geojsonData = {
                      type: 'FeatureCollection',
                      features: data.elements.map(function(element) {
                        return {type: 'Feature',
                        geometry: { type: 'Point',coordinates: [element.lon, element.lat]                             },
                        properties: {}};
                        })
                      };
  map.addSource('customData2', {
    type: 'geojson',
    data: geojsonData
   });
  map.addLayer({
    'id': 'Arrets',
    'type': 'circle',
    'source': 'customData2',
    'paint': {'circle-color': 'green',
    'circle-radius': 5},
    'layout': {'visibility': 'none'},
    'paint': {'circle-color': 'red', 'circle-radius': 2}
  });
});
  
  
  
  
  // parc relais 
$.getJSON('https://data.rennesmetropole.fr/api/explore/v2.1/catalog/datasets/tco-parcsrelais-star-etat-tr/records?limit=20',
function(data) {var geojsonData4 = {
                      type: 'FeatureCollection',
                      features: data.results.map(function(element) {
                        return {type: 'Feature',
                        geometry: {type: 'Point',
                        coordinates: [element.coordonnees.lon, element.coordonnees.lat]},
                        properties: { name: element.nom,
                          capacity: element.jrdinfosoliste}};
                      })
                  };
  map.addLayer({ 'id': 'Parcrelais',
    'type':'circle',
    'source': {'type': 'geojson',
    'data': geojsonData4},
      paint: {'circle-stroke-color': 'white',
              'circle-color': '#ff9012',
              'circle-stroke-width': 1.5,
            'circle-radius': {property: 'capacity',
              type: 'exponential',
              stops: [[5, 5],[400, 20]]},
            'circle-opacity': 0.8}
  });
});
  
  
  
  
  
  
  



// Fonction pour ajouter les couches
    map.addLayer({
      'id': 'Arrets',
      'type': 'circle',
      'source': 'Arrets',
      'source-layer': 'customData',
      'layout': {'visibility' : 'none'},
      'minzoom' : 12,
    });
  
  
    map.addLayer({
      "id": "routes",
      "type": "line",
      "source": "france_vector",
      "source-layer": "transportation",
      "filter": ["all", ["in", "class", "motorway", "trunk", "primary"]],
      "layout": {'visibility': 'visible'},
      "paint": {"line-color": "#ffffff", "line-width": 0.5}
    });
   
  
    map.addLayer({
      "id": "hydrologie",
      "type": "fill",
      "source": "france_vector",
      "layout": { 'visibility': 'visible' },
      "source-layer": "water",
      "paint": {'fill-color': '#53cfd5', 'fill-opacity' : 0.3},
    });
  

    //BATIMENTS BD topo via flux de tuiles vectorielles
    map.addLayer({
        'id': 'batiments',
        'type': 'fill-extrusion',
        'source': 'BDTOPO',
        'source-layer': 'batiment',
        'paint': {'fill-extrusion-color': {'property': 'hauteur',
            'stops': [[1, '#ffb45f'],
                      [5, '#ff9e30'],
                      [90, '#ff8800']]},
        'fill-extrusion-height':{'type': 'identity','property': 'hauteur'},
        'fill-extrusion-opacity': 0.90,
        'fill-extrusion-base': 0},
        'layout': {'visibility': 'visible'},
    });


    map.addLayer({
        'id': 'Stations',
        'type': 'circle',
        'source': 'Stations',
        'paint': {'circle-color': 'white','circle-radius': 3},
        'minzoom' : 2,
        'layout': {'visibility': 'none'}
    });

    map.addLayer({
      'id': 'Cadastre',
      'type': 'line',
      'source': 'Cadastre',
      'source-layer': 'parcelles',
      'layout': {'visibility': 'none'},
      'filter' : ['>','contenance', 1000],
      'paint': {'line-color': '#ffffff', "line-width": 1},
      'minzoom':16, 'maxzoom':19 });
      
  
   switchlayer = function (lname) {
            if (document.getElementById(lname + "CB").checked) {
                map.setLayoutProperty(lname, 'visibility', 'visible');
            } else {
                map.setLayoutProperty(lname, 'visibility', 'none');
           }
        }
}







// Charger les couches au démarrage
map.on('load', addLayers);

// Gestion du changement de style
document.getElementById('style-selector').addEventListener('change', function () {
    map.setStyle(this.value);
    map.once('style.load', addLayers); // Recharge les couches après changement de style
});





// Pop Up Parc Relais
map.on('mouseenter', 'Parcrelais', function(e) {
    map.getCanvas().style.cursor = 'pointer';
    var feature = e.features[0];
    var popup = new maplibregl.Popup({ 
        className: "Mypopup2",
        closeButton: false,
        closeOnClick: false
    })
    .setLngLat(feature.geometry.coordinates)
    .setHTML('<h2>' + feature.properties.name + '</h2><hr><h3>'
             + " 🅿️ " + feature.properties.capacity + '</h3><p>')
    .addTo(map);
});
map.on('mouseleave', 'Parcrelais', function() {
    map.getCanvas().style.cursor = '';
    document.querySelector('.Mypopup2')?.remove();
});







//Interactivité CLICK arrets bus
map.on('click', function (e) {
                var features = map.queryRenderedFeatures(e.point, { layers: ['Arrets'] });
                if (!features.length) {
                return;
                }
    var feature = features[0];
    var popup = new maplibregl.Popup({ className: "Mypopup1" })
    .setLngLat(feature.geometry.coordinates)
    .setHTML('<h2>' + "🚌 " + feature.properties.nom + " 🚌"+'</h2><hr><h3>'
        +"Mobilier : " + feature.properties.mobilier + '</h3><p>'
     )
    .addTo(map);
});

map.on('mousemove', function (e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['Arrets'] });
  map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});




//Interactivité CLICK vélos
map.on('click', function (e) {
                var features = map.queryRenderedFeatures(e.point, { layers: ['Stations'] });
                if (!features.length) {
                return;
                }
    var feature = features[0];
    var popup =  new maplibregl.Popup({ className: "Mypopup1"})
    .setLngLat(feature.geometry.coordinates)
    .setHTML('<h2>' + "🚲 "+ feature.properties.nom +  " 🚲"+'</h2><hr><h3>'
     + feature.properties.mobilier +'</h3><p>'
     )
    .addTo(map);
});

map.on('mousemove', function (e) {
  var features = map.queryRenderedFeatures(e.point, { layers: ['Stations'] });
  map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
});









// Boutons de navigation
var nav = new maplibregl.NavigationControl();
map.addControl(nav, 'top-left');

// Ajout Échelle cartographique
map.addControl(new maplibregl.ScaleControl({
    maxWidth: 120,
    unit: 'metric'
}));

// Bouton de géolocalisation
map.addControl(new maplibregl.GeolocateControl({
    positionOptions: { enableHighAccuracy: true },
    trackUserLocation: true,
    showUserHeading: true
}));

// Plein écran
map.addControl(new maplibregl.FullscreenControl({ container: document.querySelector('body') }));











// Configuration onglets geographiques fly to
document.getElementById('Gare').addEventListener('click', function ()
{ map.flyTo({zoom: 16,
center: [-1.672, 48.1043],
pitch: 50,
bearing: 0 });
});


document.getElementById('Rennes1').addEventListener('click', function ()
{ map.flyTo({zoom: 16,
center: [-1.640, 48.118],
pitch: 50});
});


document.getElementById('Rennes2').addEventListener('click', function ()
{ map.flyTo({zoom: 16,
center: [-1.699, 48.118],
pitch: 50});
});