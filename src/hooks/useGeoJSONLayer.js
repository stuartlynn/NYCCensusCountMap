import {useEffect, useRef} from 'react';

export function useGeoJSONLayer(
  map,
  name,
  {url, paintFill, paintLine, sourceLayer, onClick, selection, visible},
) {
  const fillLayer = useRef(null);
  const lineLayer = useRef(null);
  const source = useRef(null);
  const source_name = `${name}_source`;
  const oldSelectionID = useRef(null);
  useEffect(() => {
    if (map.current) {
      map.current.on('load', () => {
        source.current = map.current.addSource(source_name, {
          type: 'geojson',
          data: url,
        });

        if (paintFill) {
          fillLayer.current = map.current.addLayer({
            id: `${name}-fill`,
            type: 'fill',
            source: source_name,
            paint: paintFill,
            layout: {
              visibility: 'visible', // visible ? 'visible' : 'none',
            },
          });
        }
        if (paintLine) {
          lineLayer.current = map.current.addLayer({
            id: `${name}-line`,
            type: 'line',
            source: source_name,
            paint: paintLine,
            layout: {
              visibility: 'visible', // visible ? 'visible' : 'none',
            },
          });
        }
        map.current.on('click', `${name}-fill`, e => {
          console.log(e.features[0]);
          if (onClick) {
            onClick(e.features[0]);
          }
        });
      });
    }
  }, [map]);

  useEffect(() => {
    if (map.current && selection) {
      if (oldSelectionID.current) {
        map.current.setFeatureState(
          {source: source_name, id: oldSelectionID.current},
          {selected: false},
        );
      }

      map.current.setFeatureState(
        {source: source_name, id: selection.id},
        {selected: true},
      );
      oldSelectionID.current = selection.id;
    }
  }, [selection]);

  /*  useEffect(() => {
    if (map.current && map.current.loaded()) {
      map.current.setLayoutProperty(
        `${name}-fill`,
        'visibility',
        visible ? 'visible' : 'none',
      );
      map.current.setLayoutProperty(
        `${name}-line`,
        'visibility',
        visible ? 'visible' : 'none',
      );
    }
  }, [map, visible]);
*/
  useEffect(() => {
    if (map.current && map.current.loaded()) {
      console.log(
        'setting fill color to be ',
        paintFill['fill-color'],
        paintFill,
      );
      map.current.setPaintProperty(
        `${name}-fill`,
        'fill-color',
        paintFill['fill-color'],
      );
    }
  }, [paintFill]);
  return {fillLayer, source};
}
