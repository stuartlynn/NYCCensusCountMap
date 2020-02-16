import {useEffect, useRef} from 'react';

export function useMVTLayer(
  map,
  {url, paintFill, paintLine, sourceLayer, onClick},
) {
  const fillLayer = useRef(null);
  const lineLayer = useRef(null);
  const source = useRef(null);
  useEffect(() => {
    if (map.current) {
      map.current.on('load', () => {
        source.current = map.current.addSource('strategy', {
          type: 'vector',
          tiles: [url],
          minzoom: 0,
          maxzoom: 20,
        });

        fillLayer.current = map.current.addLayer(
          {
            id: 'strategy-fill',
            type: 'fill',
            source: 'strategy',
            'source-layer': sourceLayer,
            paint: paintFill,
          },
          'waterway-label',
        );

        lineLayer.current = map.current.addLayer(
          {
            id: 'strategy-line',
            type: 'line',
            source: 'strategy',
            'source-layer': sourceLayer,
            paint: paintLine,
          },
          'waterway-label',
        );
        map.current.on('click', 'strategy-fill', e => {
          console.log(e.features[0].id);
          if (onClick) {
            onClick(e.features[0]);
          }
        });
      });
    }
  }, [map]);
  return {fillLayer, source};
}
