const COLORMAP = "turbo";
const UNCLUSTERED_COLOR = "#000000";
const CIRLE_RADIUS = 5000;

function renderMap(clusters) {
  // Cast all clusters to integers
  for (let i = 0; i < clusters.length; i++) {
    clusters[i].cluster_id = Math.round(clusters[i].cluster_id);
  }

  // Compute number of clusters, not including -1
  const cluster_ids = Array.from(
    clusters.reduce((acc, x) => acc.add(x.cluster_id), new Set())
  );
  const n_clusters = cluster_ids.filter((x) => x != -1).length;

  // Create marker icons for each cluster_id
  icons = {};
  for (let cluster_id of cluster_ids) {
    icons[cluster_id] = createIcon(cluster_id, n_clusters);
  }

  // Group cluster markers by cluster_id
  const markers = clusters.reduce(
    (markers, x) => createMarker(x, n_clusters, markers, icons),
    {}
  );

  const map = initMap(n_clusters, markers);
}

function createIcon(cluster_id, n_clusters) {
  const markerHtmlStyles = `
  background-color: ${clusterToRGB(cluster_id, n_clusters)};
  width: 1rem;
  height: 1rem;
  display: block;
  left: -0.5rem;
  top:  0.5rem;
  position: relative;
  border-radius: 1rem 1rem 0;
  transform: rotate(45deg);
  border: 1px solid #FFFFFF`;

  return L.divIcon({
    className: `cluster-${cluster_id}-icon`,
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStyles}" />`,
  });
}

/**
 * Initialise Leafelet map object and return it
 */
function initMap(n_clusters, markers) {
  const baseLayer = new L.StamenTileLayer("toner");

  // Add all markers to clustering library
  const clusterGroup = L.markerClusterGroup({
    iconCreateFunction: (x) => clusterIconMaker(x, n_clusters),
  });

  for (let cluster in markers) {
    markers[cluster].forEach((x) => clusterGroup.addLayer(x));
  }

  // Create map and add layers
  const map = new L.Map("map", {
    center: new L.LatLng(46.5191, 6.5668),
    zoom: 7,
    layers: [baseLayer, clusterGroup],
  });

  L.control.layers({ base: baseLayer }, { markers: clusterGroup }).addTo(map);

  // Add spiderfier module
  return map;
}

function clusterIconMaker(cluster, n_clusters) {
  // Find most frequent cluster_id in marker cluster

  const counts = {};
  for (let marker of cluster.getAllChildMarkers()) {
    const cluster_id = marker.cluster_id;
    counts[cluster_id] = counts[cluster_id] ? counts[cluster_id] + 1 : 1;
  }

  const cluster_id_most_freq = Object.keys(counts).reduce(
    (iMax, i) => (counts[i] > counts[iMax] ? i : iMax),
    Object.keys(counts)[0]
  );
  console.log(
    cluster.getChildCount(),
    cluster.getAllChildMarkers(),
    counts,
    cluster_id_most_freq,
    n_clusters
  );

  // Generate icon corresponding to mode of cluster_id
  const markerHtmlStyles = `
    background-color: ${clusterToRGB(cluster_id_most_freq, n_clusters)};
    width: 2rem;
    height: 2rem;
    display: block;
    left: -1rem;
    top:  1rem;
    position: relative;
    border-radius: 2rem 2rem 0;
    transform: rotate(45deg);
    border: 1px solid #FFFFFF`;

  const innerTextStyles = `
    text-align: center;
    font-size: 1rem;
    color: white;
    width: 2rem;
    height: 2rem;
    left: -1rem;
    top:  -0.7rem;
    position: relative;`;

  return L.divIcon({
    className: `cluster-${cluster_id_most_freq}-icon`,
    iconAnchor: [0, 24],
    labelAnchor: [-6, 0],
    popupAnchor: [0, -36],
    html: `
      <div>
        <div style="${markerHtmlStyles}"></div>
        <div style="${innerTextStyles}">${cluster.getChildCount()}</div>
      </div>`,
  });
}

function createMarker(
  { cluster_id, journal, lat, lon },
  n_clusters,
  markers,
  icons
) {
  if (lat && lon) {
    // Create circle object
    marker = L.marker([lat, lon], {
      icon: icons[cluster_id],
      title: journal,
    }).bindPopup(journal);

    marker.cluster_id = cluster_id;

    // Add to markers map
    if (!(cluster_id in markers)) {
      markers[cluster_id] = [];
    }
    markers[cluster_id].push(marker);
  }

  return markers;
}

function clusterToRGB(cluster_id, n_clusters) {
  if (cluster_id < 0) {
    return UNCLUSTERED_COLOR;
  }

  [r, g, b] = evaluate_cmap(cluster_id / n_clusters, COLORMAP, false);
  return `rgb(${r}, ${g}, ${b})`;
}
