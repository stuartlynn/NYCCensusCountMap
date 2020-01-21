import React, {useEffect} from 'react';
import useFacilities from './useFacilities';

export default function useFacilitiesLayer(map, visible) {
  const facilities = useFacilities();

  useEffect(() => {
    console.log('Map ', map, ' Facilities ', facilities);
    if (map.current && facilities) {
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
                'icon-size': 0.4,
                'text-field': ['get', 'facname'],
                'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
                'text-offset': [0, 0.6],
                'text-size': 10,
                'text-anchor': 'top',
                visibility: visible ? 'visible' : 'none',
              },
            });
          },
        );
      });
    }
  }, [map, facilities]);

  useEffect(() => {
    if (map.current && map.current.isStyleLoaded()) {
      map.current.setLayoutProperty(
        `facilities`,
        'visibility',
        visible ? 'visible' : 'none',
      );
    }
  }, [map, visible]);

  return facilities;
}
