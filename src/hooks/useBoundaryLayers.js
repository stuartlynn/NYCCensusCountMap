import React, {useEffect, useState, useRef} from 'react';
import {BoundaryLayers} from '../Layers';

export default function useBoundaryLayers(map, selectedLayer) {
  const [layers, setLayers] = useState({});

  useEffect(() => {
    if (map.current) {
      let layerList = {};
      map.current.on('load', () => {
        console.log('adding boundary layers');
        const boundaryLayers = BoundaryLayers();
        boundaryLayers.forEach(layer => {
          const sourceName = `${layer.id}_source`;

          let layerDeets = {...layer};
          console.log('adding source ', sourceName);
          layerDeets.source = map.current.addSource(sourceName, {
            type: 'geojson',
            data: `${process.env.PUBLIC_URL}/boundaries/${layer.id}.geojson`,
          });

          if (layer.paintFill) {
            layerDeets.fillLayer = map.current.addLayer(
              {
                id: `${layer.id}-fill`,
                type: 'fill',
                source: sourceName,
                paint: layer.paintFill,
              },
              'waterway-label',
            );
          }
          if (layer.paintLine) {
            layerDeets.lineLayer = map.current.addLayer(
              {
                id: `${layer.id}-line`,
                type: 'line',
                source: sourceName,
                paint: layer.paintLine,
                layout: {
                  visibility: selectedLayer == layer.id ? 'visible' : 'none',
                },
              },
              'waterway-label',
            );
          }
          layerList[layer.id] = layerDeets;
        });
        setLayers(layerList);
      });
    }
  }, [map]);

  useEffect(() => {
    if (map.current) {
      Object.entries(layers).forEach(([id, layer]) => {
        map.current.setLayoutProperty(
          `${layer.id}-line`,
          'visibility',
          id == selectedLayer ? 'visible' : 'none',
        );
      });
    }
  }, [map, selectedLayer]);
  return layers;
}
