import React, {useEffect} from 'react';
import useFacilities from './useFacilities';

export default function useFacilitiesLayer(map, visible, layer, id, types) {
  const facilities = useFacilities();

  useEffect(() => {
    console.log('Map ', map, ' Facilities ', facilities);
    if (map.current && facilities) {
      console.log('Facilities are ', facilities);
      map.current.on('load', () => {
        map.current.loadImage(
          `${process.env.PUBLIC_URL}/marker.png`,
          (error, image) => {
            if (error) throw error;
            map.current.addImage('marker', image);
            map.current.addLayer({
              id: 'facilities',
              type: 'symbol',
              source: {
                type: 'geojson',
                data: facilities,
              },
              layout: {
                'icon-image': 'marker',
                'icon-size': 0.2,
                'text-field': ['get', 'name'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 0.6],
                'text-size': 10,
                'text-anchor': 'top',
                //'icon-allow-overlap': true,
                //              'text-allow-overlap': true,
                visibility: visible ? 'visible' : 'none',
              },
              paint: {
                'text-color': 'rgba(255,255,255,1)',
              },
            });
          },
        );
      });
    }
  }, [map, facilities]);

  useEffect(() => {
    if (map.current && map.current.loaded()) {
      console.log('Toggling visible on facilities');
      map.current.setLayoutProperty(
        `facilities`,
        'visibility',
        visible ? 'visible' : 'none',
      );
    }
  }, [map, visible]);

  return facilities;
}
