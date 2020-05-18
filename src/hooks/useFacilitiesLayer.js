import React, { useEffect } from "react";
import useFacilities from "./useFacilities";

function loadAllImages(map) {
    const images = [
        "Dot_Hospitals.png",
        "Dot_FBO.png",
        "Dot_CommunitySchools.png",
        "Dot_LGBTQ.png",
        "Dot_FoodKitchens.png",
        "Dot_SeniorCenters.png",
        "Dot_UniPreK.png",
        "Dot_K12.png",
        "Dot_CommunityCenters.png",
        "Dot_MentalHealth.png",
        "Dot_CBO.png",
        "Dot_Libraries.png"
    ];
    return Promise.all(
        images.map(
            img =>
                new Promise((resolve, reject) => {
                    map.loadImage(
                        `${process.env.PUBLIC_URL}/imgs/${img}`,
                        function(error, res) {
                            map.addImage(img, res);
                            resolve();
                        }
                    );
                })
        )
    );
}

export default function useFacilitiesLayer(map, visible, selectedTypes) {
    const facilities = useFacilities();
    const types = facilities
        ? facilities.features.reduce((set, f) => {
              set.add(f.properties.asset_type);
              return set;
          }, new Set())
        : [];

    useEffect(() => {
        if (map.current && facilities) {
            map.current.on("load", () => {
                loadAllImages(map.current).then(() => {
                    types.forEach(type => {
                        map.current.addLayer({
                            id: `facilities: ${type}`,
                            type: "symbol",
                            source: {
                                type: "geojson",
                                data: {
                                    ...facilities,
                                    features: facilities.features.filter(
                                        f => f.properties.asset_type === type
                                    )
                                }
                            },

                            layout: {
                                "icon-image": ["get", "icon"],
                                "icon-size": 0.02,
                                "text-field": ["get", "name"],
                                "text-font": [
                                    "Open Sans Semibold",
                                    "Arial Unicode MS Bold"
                                ],
                                "text-offset": [0, 0.6],
                                "text-size": 13,
                                "text-anchor": "top",
                                //'icon-allow-overlap': true,
                                //              'text-allow-overlap': true,
                                visibility: selectedTypes.includes(type)
                                    ? "visible"
                                    : "none"
                            },
                            //    filter: ['match', ['get', 'asset_type'], types, true, false],

                            paint: {
                                "text-color": "rgba(255,255,255,1)",
                                "text-halo-color": "rgba(10, 10, 10, 0.8)",
                                "text-halo-width": 1,
                                "text-halo-blur": 0
                            }
                        });
                    });
                });
            });
        }
    }, [map, facilities]);

    useEffect(() => {

        const setVisibility = (shouldBeVisable)=>{
            if (map.current && map.current.loaded()) {
                types.forEach( type=>{
                    map.current.setLayoutProperty(
                        `facilities: ${type}`,
                        "visibility",
                        shouldBeVisable && selectedTypes.includes(type) ? "visible" : "none"
                    );
                    })
            }
            else{
                setTimeout(()=>setVisibility(shouldBeVisable),200)
            }
        }
        setVisibility(visible);
       
    }, [map, visible, types,selectedTypes]);

    return facilities;
}
