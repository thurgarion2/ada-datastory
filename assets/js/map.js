function main(clusters) {
  const map = initMap();
  all_clusters = clusters.reduce((acc, x) => acc.add(x.cluster), new Set());

  bonk = {
    1: "red",
    0: "blue",
    "-1": "black",
    2: "green",
    3: "yellow",
    4: "purple",
  };
  clusters.map((x) => addMarker(x, map, bonk));
}

/**
 * Initialise Leafelet map object and return it
 */
function initMap() {
  const map = new L.Map("map", {
    center: new L.LatLng(46.5191, 6.5668),
    zoom: 9,
  });

  const layer = new L.StamenTileLayer("toner");
  map.addLayer(layer);

  return map;
}

function addMarker({ cluster, journal, lat, lon }, map, bonk) {
  if (lat && lon) {
    circle = L.circle([lat, lon], {
      color: bonk[cluster],
      fillOpacity: 0.5,
      radius: 20000,
    });

    circle.addTo(map);
    circle.bindPopup(journal);
  }
}
