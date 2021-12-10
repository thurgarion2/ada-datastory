function main(clusters) {
  const map = initMap();

  addMarker(clusters[0], map);
  addMarker(clusters[1], map);
  addMarker(clusters[2], map);
  addMarker(clusters[3], map);
  addMarker(clusters[4], map);
}

/**
 * Initialise Leafelet map object and return it
 */
function initMap() {
  const map = new L.Map("map", {
    center: new L.LatLng(46.5191, 6.5668),
    zoom: 9,
  });

  const layer = new L.StamenTileLayer("watercolor");
  map.addLayer(layer);

  return map;
}

function addMarker({ cluster, journal, lat, lon }, map) {
  if (lat && lon) {
    L.marker([lat, lon]).addTo(map);
  }
}
