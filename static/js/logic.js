function createMap(earthquakes) {

    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Idery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
    });

    var satellite = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Idery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var baseMaps = {
        "Light Map": lightmap,
        "Sattelite": satellite
    };

    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    var map = L.map("map", {
        center: [37.0902, -105.7129],
        zoom: 4,
        layers: [lightmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {
        collaped: false
    }).addTo(map);

    var legend = L.control({position: 'bottomright'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend');
        grades = [0,1,2,3,4,5,6,7,8];
        
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
            }
        
        return div;
    };

    legend.addTo(map);

};

function createMarkers(data) {
    console.log(data);

    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>"+ feature.properties.place + 
        "</h3><hr><h3> Maginitude: " + feature.properties.mag+"</h3><br><pr>"+new Date(feature.properties.time) + "</p>");
        };

    function pointToLayer(feature, latlng) {
        eqMarker = L.circleMarker(latlng, {
            opacity:1,
            fillOpacity: 0.75,
            color: getColor(feature.properties.mag),
            //fillColor: getColor(feature.properties.mag),
            radius: getMarkerSize(feature.properties.mag)
          });

          return eqMarker;
    };

    var earthquakes=L.geoJSON(data, {
        pointToLayer: pointToLayer,
        onEachFeature: onEachFeature
    });
    
    createMap(earthquakes);
};

function getData(url) {
    d3.json(url, function(data) {
        createMarkers(data.features)
    });
};

function getColor(d) {
    return d > 8 ? '#bd0026' :
        d > 7 ? '#d52629' :
        d > 6  ? '#ed3f2a' :
        d > 5  ? '#f86d2e' :
        d > 4  ? '#fd8133' :
        d > 3   ? '#fda045' :
        d > 2   ? '#fcbc5e' :
        d > 1   ? '#fdd57d' :
                '#FFEDA0';
};

function getMarkerSize(d) {
    return d*4;
};

url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
getData(url);