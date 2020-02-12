import React, {useRef, useState, useEffect} from 'react';
import {useMap} from '../hooks/useMap';
import Legend from '../components/Legend';
import Details from '../components/Details';
import Papa from 'papaparse';
import {useMVTLayer} from '../hooks/useMVTLayer';
import {useGeoJSONLayer} from '../hooks/useGeoJSONLayer';
import useBoundaryLayers from '../hooks/useBoundaryLayers';
import useFacilitiesLayer from '../hooks/useFacilitiesLayer';
import Layers, {fillStyles} from '../Layers';

export default function MainPage() {
  const mapDiv = useRef(null);
  const [selectedBoundary, setSelectedBoundary] = useState('cd');
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [hardToCountStats, setHardToCountStats] = useState([]);
  const [showFacilities, setShowFacilities] = useState(true);
  const [selectedFacilityTypes, setSelectedFacilityTypes] = useState([]);
  const [metric, setMetric] = useState('strategy');

  useEffect(() => {
    Papa.parse('/hard_to_count_NY.csv', {
      download: true,
      header: true,
      complete: function(results) {
        setHardToCountStats(results);
      },
    });
  }, []);

  const onToggleFacilityType = type => {
    selectedFacilityTypes.includes(type)
      ? setSelectedFacilityTypes(selectedFacilityTypes.filter(t => t !== type))
      : setSelectedFacilityTypes([...selectedFacilityTypes, type]);
  };

  const map = useMap(mapDiv, {
    lnglat: [-73.9920330193022, 40.75078660435196],
    zoom: 10,
    style: 'mapbox://styles/mapbox/light-v10',
    key:
      'pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiM2Q4ODllNmRkZDQ4Yzc3NTBhN2UyNDE0MWY2OTRiZWIifQ.8OEKvgZBCCtDFUXkjt66Pw',
  });

  useEffect(() => {
    setSelectedFeature(null);
  }, [selectedBoundary]);
  //  const stategyLayer = useMVTLayer(map, Layers.censusStrategyLayer);

  //  const HTCLayer = useMVTLayer(map, Layers.HTCLayer);
  const style = {
    ...Layers.HTCLayer,
    ...{paintFill: {'fill-color': fillStyles[metric], 'fill-opacity': 0.7}},
  };

  const GeojsonLayer = useGeoJSONLayer(map, 'HTC', {
    ...style,
    onClick: feature => {
      if (selectedBoundary === 'tracts') {
        setSelectedFeature(feature);
      }
    },
    selection: selectedFeature,
    visible: selectedBoundary === 'tracts',
  });

  // BoundaryLayers().forEach(layer => {
  const boundaryLayers = useBoundaryLayers(
    map,
    selectedBoundary,
    null,
    selectedBoundary,
    selectedFeature ? selectedFeature.id : null,
    boundary => setSelectedFeature(boundary),
  );

  const facilities = useFacilitiesLayer(map, showFacilities);
  return (
    <div className="main-page">
      <div className="map" ref={mapDiv} />
      <div className="info overlay">
        <h2>NYC CENSUS 2020 INTERACTIVE MAP</h2>
        <h3>Created by Stuart Lynn: Hosted/designed Hester Street</h3>
        <p>
          This interactive map serves the purpose for any organization to learn
          more about the people they serve. This map is fully interactive and
          will remain avaliable after the Census effort
        </p>
      </div>
      <div className="details overlay">
        <Details
          feature={selectedFeature}
          layer={selectedBoundary}
          facilityTypes={selectedFacilityTypes}
        />{' '}
      </div>
      <Legend
        boundaries={boundaryLayers}
        selectedBoundary={selectedBoundary}
        onSelectBoundary={setSelectedBoundary}
        showFacilities={showFacilities}
        onShowFacilitiesChange={setShowFacilities}
        selectedFacilityTypes={selectedFacilityTypes}
        onSelectFacilityType={onToggleFacilityType}
        metric={metric}
        onSelectMetric={setMetric}
      />
    </div>
  );
}
