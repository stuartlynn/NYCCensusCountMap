import React, { useEffect, useState, useRef } from "react";
import { BoundaryLayers } from "../Layers";

export default function useBoundaryLayers(
    map,
    selectedLayer,
    selectedVar,
    onSelectLayer,
    selectedGeomID,
    onClick
) {
    const [layers, setLayers] = useState({});
    const oldSelectionID = useRef(null);

    useEffect(() => {
        if (map.current) {
            let layerList = {};
            map.current.on("load", () => {
                const boundaryLayers = BoundaryLayers();
                boundaryLayers.forEach(layer => {
                    const sourceName = `${layer.id}_source`;

                    let layerDeets = { ...layer };
                    layerDeets.source = map.current.addSource(sourceName, {
                        type: "geojson",
                        data: `${process.env.PUBLIC_URL}/boundaries/${layer.polygons}`
                    });

                    layerDeets.sourceLabels = map.current.addSource(
                        sourceName + "_labels",
                        {
                            type: "geojson",
                            data: `${process.env.PUBLIC_URL}/boundaries/${layer.labels}`
                        }
                    );

                    layerDeets.fillLayer = map.current.addLayer({
                        id: `${layer.id}-fill`,
                        type: "fill",
                        source: sourceName,
                        paint: {
                            "fill-color": "grey",
                            "fill-opacity": [
                                "case",
                                [
                                    "boolean",
                                    [
                                        "coalesce",
                                        ["feature-state", "selected"],
                                        false
                                    ],
                                    true
                                ],
                                0,
                                0.5
                            ]
                        },
                        layout: {
                            visibility:
                                selectedLayer == layer.id ? "visible" : "none"
                        }
                    });

                    if (layer.paintLine) {
                        layerDeets.lineLayer = map.current.addLayer({
                            id: `${layer.id}-line`,
                            type: "line",
                            source: sourceName,
                            paint: {
                                "line-color": [
                                    "case",
                                    [
                                        "boolean",
                                        [
                                            "coalesce",
                                            ["feature-state", "selected"],
                                            false
                                        ],
                                        true
                                    ],
                                    "red",
                                    "black"
                                ]
                            },
                            layout: {
                                visibility:
                                    selectedLayer == layer.id
                                        ? "visible"
                                        : "none"
                            }
                        });
                    }

                    layerDeets.labelLayer = map.current.addLayer({
                        id: `${layer.id}-labels`,
                        type: "symbol",
                        source: sourceName + "_labels",
                        layout: {
                            visibility:
                                selectedLayer == layer.id ? "visible" : "none",
                            "text-field": ["get", "geoid"],
                            "text-font": [
                                "Open Sans Semibold",
                                "Arial Unicode MS Bold"
                            ],
                            "text-offset": [0, 0.0],
                            "text-size": 15,
                            "text-anchor": "top",
                            "text-allow-overlap": true
                        }
                    });
                    layerList[layer.id] = layerDeets;
                });
                setLayers(layerList);
            });
        }
    }, [map]);

    useEffect(() => {
        if (map.current) {
            Object.entries(layers).forEach(([id, layer]) => {
                map.current.setFeatureState(
                    {
                        source: layer.id + "_source",
                        id: oldSelectionID.current
                    },
                    { selected: false }
                );
                map.current.setLayoutProperty(
                    `${layer.id}-line`,
                    "visibility",
                    id == selectedLayer ? "visible" : "none"
                );
                map.current.setLayoutProperty(
                    `${layer.id}-labels`,
                    "visibility",
                    id == selectedLayer ? "visible" : "none"
                );
                map.current.setLayoutProperty(
                    `${layer.id}-fill`,
                    "visibility",
                    id == selectedLayer ? "visible" : "none"
                );
            });
        }
    }, [map, selectedLayer]);

    useEffect(() => {
        const source_name = `${selectedLayer}_source`;

        if (map.current && selectedGeomID) {
            if (oldSelectionID.current) {
                map.current.setFeatureState(
                    { source: source_name, id: oldSelectionID.current },
                    { selected: false }
                );
            }

            map.current.setFeatureState(
                { source: source_name, id: selectedGeomID },
                { selected: true }
            );
            oldSelectionID.current = selectedGeomID;
        }
    }, [selectedGeomID, selectedLayer, map]);

    useEffect(() => {
        if (map.current) {
            const boundaryLayers = BoundaryLayers();
            boundaryLayers.forEach(layer => {
                map.current.on("click", `${layer.id}-fill`, e => {
                    if (onClick) {
                        onClick(e.features[0], layer.id);
                    }
                });
            });
        }
    }, [map]);
    return layers;
}
