



// LAYER
 var baseosm = L.tileLayer('https://tile.thunderforest.com/outdoors/{z}/{x}/{y}.png?apikey=c9677aa344434a529392f9edef75852f', {
	attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	apikey: 'c9677aa344434a529392f9edef75852f',
  maxZoom: 20,
  minZoom: 8,
});




/* var baseosm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	
  maxZoom: 20,
  minZoom: 8,
});
*/ 






// MARKERS 

let vMarker = new L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

let nvMarker = new L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});


// MAP OPTIONS
let mapOptions = {
    center: [46.4870,11.3516],
    zoom: 9,
    // layers: [Thunderforest_Outdoors] //
    layers: [baseosm]
}

// MAP
let map = new L.map('map', mapOptions);



// ADD MARKERS TO MAP
    
  const locations = fetch('locations.json')
  .then(response => response.json())
  .then(locationData => {

    let geoMarkers = L.geoJSON(locationData, {
      pointToLayer: function(feature, latlng) {
          let visited = feature.properties.beenthere;
          if (visited == 'true') {
              return L.marker(latlng, {icon: vMarker});
          } else {
              return L.marker(latlng, {icon: nvMarker});
          }
      },
      
      onEachFeature: function (feature, layer) {


        // SET DIFFICULTY FLAG COLOR

        let difficultyColor;

        switch (feature.properties.difficulty) {
            case 'Facile':
                difficultyColor = '#7bdc39';
                break;
            case 'Moderata':
                difficultyColor = '#39dcb7';
                break;
            case 'Media':
                difficultyColor = '#dca239'; 
                break;
            case 'Difficile':
                difficultyColor = '#dc6039'; 
                break;
            case 'Folle':
                difficultyColor = '#9a39dc';
                break;
            default:
                difficultyColor = 'white';
        };


        // MARKERS POPUPS PROPERTIES

        let popupContent = `
            ${feature.properties.beenthere === 'true' ? `<img class="popupImage" src="${feature.properties.photo}">` : ''}
            <h2>${feature.properties.name}</h2>
            <b>Area:</b> ${feature.properties.area}<br>
            <b>Percorso:</b> ${feature.properties.km}<br>
            <b>Dislivello:</b> ${feature.properties.altitude}<br><br>

            ${feature.properties.beenthere === 'true' ? `<b>Difficoltà:</b> <span style="color: ${difficultyColor};">${feature.properties.difficulty}</span><br>` : ''}
            ${feature.properties.beenthere === 'true' ? `<b>Stagioni:</b> ${feature.properties.seasons}<br><br>` : ''}
            ${feature.properties.beenthere === 'true' ? `<b>Info:</b> ${feature.properties.info}<br>` : ''}
            ${feature.properties.beenthere === 'true' ? `<b>Parcheggio:</b> ${feature.properties.parking}<br><br>` : ''}
            <b>Visitato:</b> ${feature.properties.beenthere === 'true' ? 'Si' : 'No'}<br>
            <a target="_blank" href="http://maps.google.com/maps?q=${feature.geometry.coordinates[1]},${feature.geometry.coordinates[0]}">Let's Go!</a>


        `;
        layer.bindPopup(popupContent);
    }
    }).addTo(map);
    

    // SEARCH CONTROL

    let searchControl = new L.Control.Search({
      layer: geoMarkers,
      propertyName: 'name',
      initial: false,
      zoom: 15,
      position: 'topleft'
  });

  searchControl.on('search:locationfound', function(e) {
      e.layer.openPopup();
  });


    map.addControl(searchControl);



  // REPOSITION

    let BZ = [46.4946, 11.3695];
    let TN = [46.0627,11.1278];
    let VN = [46.4766,12.3624];
    let TS = [44.1270, 10.5496];
    let LG = [44.2531,9.4565];

  L.easyButton('<b style="color:#d7d7d7">BZ</b>', function(btn, map){
    map.setView(BZ);
  }, 'Alto Adige').addTo(map);

  L.easyButton('<b style="color:#d7d7d7">TN</b>', function(btn, map){
    map.setView(TN);
  }, 'Trentino').addTo(map);

  L.easyButton('<b style="color:#d7d7d7">VN</b>', function(btn, map){
    map.setView(VN);
  }, 'Veneto').addTo(map);

  L.easyButton('<b style="color:#d7d7d7">TS</b>', function(btn, map){
    map.setView(TS);
  }, 'Toscana/Emilia').addTo(map);

  L.easyButton('<b style="color:#d7d7d7">LG</b>', function(btn, map){
    map.setView(LG);
  }, 'Liguria').addTo(map);

});

