// Create Marker Color function
function markerColor(mag) {

    if (mag <= 2.5) {
        return "cyan";
    } else if (2.5 < mag & mag <= 4.00) {
        return "lightgreen";
    } else if (4.00 < mag & mag <= 5.00) {
        return "green";
    } else if (5.00 < mag & mag <= 8.00) {
        return "darkgreen";
    } else {
        return "red";
    };
}


// Create the createMap function
function createMap(earthquakes) {

    // Create two tile layer options that will be the background of our map
    var satelitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.satellite",
        accessToken: API_KEY
    });

    var darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.dark",
        accessToken: API_KEY
    });

    // Create a baseMaps object to hold the layers
    var baseMaps = {
        "Satelite Map": satelitemap,
        "Dark Map": darkmap
    };

    // Create an overlayMaps object to hold the earthquakes layer
    var overlayMaps = {
        "Earthquakes": earthquakes
    };

    // Creating map, giving it the satelite map and earthquakes layers to display on load
    var myMap = L.map("mapid", {
        center: [0, 0],
        zoom: 2,
        layers: [darkmap, earthquakes]
    });

    // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);


    // Create legend
    var legend = L.control({ position: 'bottomright' });

    legend.onAdd = () => {
        var div = L.DomUtil.create('div', 'info legend');
        var magnitudes = [2.5, 4.0, 5, 8];

        magnitudes.forEach(m => {
            var range = `${m} - ${m + 0.25}`;
            if (m >= 5.75) { range = `${m}+` }
            var html = `<div class="legend-item">
              <div style="height: 25px; width: 25px; background-color:${markerColor(m)}"> </div>
              <div class=legend-text>Magnitude:- <strong>${range}</strong></div>
          </div>`
            div.innerHTML += html
        });
        return div;
    };
    legend.addTo(myMap);
}

// Create Markers function
function createMarkers(response) {

    var earthquakes = response.features;
    var earthquakeMarkers = []

    for (var index = 0; index < earthquakes.length; index++) {
        var earthquake = earthquakes[index];

        var marker = L.circleMarker([earthquake.geometry.coordinates[1], earthquake.geometry.coordinates[0]], {
            radius: earthquake.properties.mag * 2,
            fillColor: markerColor(earthquake.properties.mag),
            fillOpacity: 0.75,
            stroke: false
        }
        ).bindPopup("<h4>" + earthquake.properties.place + "</h4><hr><p>" + new Date(earthquake.properties.time) + "</p>" + "<p><b>Magnitude: " + earthquake.properties.mag + "<b></p>");

        earthquakeMarkers.push(marker);
    }
    createMap(L.layerGroup(earthquakeMarkers));

}


// Perform an API call to USGS API to get earthquake data got earthquakes with a magnitude 
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);



