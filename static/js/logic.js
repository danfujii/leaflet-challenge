var url = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson';

d3.json(url, function(data){
    createFeatures(data.features);
    console.log(data.features)
});

function createFeatures(quakeData) {
    function onEachFeature(feature, layer) {
        layer.bindPopup("Magnitude: " + feature.properties.mag + "<h3>Location: " + feature.properties.place + 
        "</h3><hr><p>Date: " + new Date(feature.properties.time) + "</p>");
    }

    function markerSize(mag) {
        return mag * 30000;
    }

    function markerColor(mag) {
        if (mag < 1) {
            return '#89cff0';
        } else if (mag < 2) {
            return '#87a96b';
        } else if (mag < 3) {
            return '#9966cc';
        } else if (mag < 4) {
            return '#fbec5d';
        } else if (mag < 5) {
            return '#ff9933';
        } else {
            return '#e62020';
        }
    }

    var earthquakes = L.geoJSON(quakeData, {
        pointToLayer: function(quakeData, latlng) {
            return L.circle(latlng, {
                radius: markerSize(quakeData.properties.mag),
                color: markerColor(quakeData.properties.mag),
                fillOpacity: .8
            });
        },
        onEachFeature: onEachFeature
    });

    createMap(earthquakes);
}



function createMap(earthquakes) {
    var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 8,
        id: "mapbox.streets",
        accessToken: API_KEY
      });

    var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 8,
        id: "mapbox.light",
        accessToken: API_KEY
      });

    var baseMaps = {
        'Satellite Map': streetmap,
        'Light Map': lightmap
    };

    var overlayMap = {
        Earthquakes: earthquakes
    };

    var myMap = L.map('map', {
        center: [37.804363, -122.271111],
        zoom: 4,
        layers: [streetmap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMap, {
        collapsed: false
    }).addTo(myMap);

    // function getColor(d) {
    //     return d > 5 ? "#e62020" :
    //            d > 4 ? "#ff9933" :
    //            d > 3 ? "#fbec5d" : 
    //            d > 2 ? "#9966cc" :
    //            d > 1 ? "#87a96b" :
    //                    "#89cff0";
    // }

    var legend = L.control({position: 'bottomleft'});

    legend.onAdd = function() {
        var div = L.DomUtil.create('div', 'info legend');
        var magnitudes = [0, 1, 2, 3, 4, 5];
        var colors = ["#89cff0", "#87a96b", "#9966cc", "#fbec5d", "#ff9933", "#e62020"];
        // labels = [];

        for (var i = 0; i < magnitudes.length; i++) {
            div.innerHTML += 
                "<i style ='background: " + colors[i] + "'></i> " + magnitudes[i] 
                + (magnitudes[i + 1] ? "&ndash;" + magnitudes[i + 1] + "<br>" : "+");
        }

        return div;
    };

    legend.addTo(myMap);
}