import React, {useRef, useState, useEffect} from 'react';
import {useMap} from '../hooks/useMap';
import Legend from '../components/Legend';
import Details from '../components/Details';
import Papa from 'papaparse';
import {useMVTLayer} from '../hooks/useMVTLayer';
import {useGeoJSONLayer} from '../hooks/useGeoJSONLayer';
import useBoundaryLayers from '../hooks/useBoundaryLayers';
import useFacilitiesLayer from '../hooks/useFacilitiesLayer';
import {useCensusTractFacilities} from '../hooks/useFacilities';
import Layers from '../Layers';

export default function MainPage() {
  const mapDiv = useRef(null);
  const [selectedBoundary, setSelectedBoundary] = useState('cd');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [hardToCountStats, setHardToCountStats] = useState([]);
  const [showFacilities, setShowFacilities] = useState(true);

  useEffect(() => {
    Papa.parse('/hard_to_count_NY.csv', {
      download: true,
      header: true,
      complete: function(results) {
        setHardToCountStats(results);
      },
    });
  }, []);

  const map = useMap(mapDiv, {
    lnglat: [-73.9920330193022, 40.75078660435196],
    zoom: 10,
    style: 'mapbox://styles/mapbox/light-v10',
    key:
      'pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiM2Q4ODllNmRkZDQ4Yzc3NTBhN2UyNDE0MWY2OTRiZWIifQ.8OEKvgZBCCtDFUXkjt66Pw',
  });

  //  const stategyLayer = useMVTLayer(map, Layers.censusStrategyLayer);

  //  const HTCLayer = useMVTLayer(map, Layers.HTCLayer);
  const GeojsonLayer = useGeoJSONLayer(map, 'HTC', {
    ...Layers.HTCLayer,
    onClick: feature => setSelectedFeature(feature),
  });

  // BoundaryLayers().forEach(layer => {
  const boundaryLayers = useBoundaryLayers(map, selectedBoundary);

  const facilities = useFacilitiesLayer(map, showFacilities);
  const tractFacilities = useCensusTractFacilities(
    selectedFeature ? selectedFeature.properties.GEOID : null,
    facilities,
  );
  return (
    <div className="main-page">
      <div className="map" ref={mapDiv} />
      <div className="details">
        <Details facilities={tractFacilities} feature={selectedFeature} />{' '}
      </div>
      <Legend
        boundaries={boundaryLayers}
        selectedBoundary={selectedBoundary}
        onSelectBoundary={setSelectedBoundary}
        showFacilities={showFacilities}
        onShowFacilitiesChange={setShowFacilities}
      />
    </div>
  );
}
