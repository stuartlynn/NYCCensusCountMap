import React, { useEffect } from "react";
import useVotingTargets from "./useVotingTargets";

function loadAllImages(map) {
    const images = [
       'mail.png',
       'early.png',
       'election_day.png'
    ];
    return Promise.all(
        images.map(
            img =>
                new Promise((resolve, reject) => {
                    map.loadImage(
                        `${process.env.PUBLIC_URL}/voting_icons/${img}`,
                        function(error, res) {
                            map.addImage(img, res);
                            resolve();
                        }
                    );
                })
        )
    );
}

export default function useVotingLayer(
    map, 
    votingTargets, 
    visible, 
    selectedTypes, 
    onClick, 
    ) {


    const types = ['USPS Dropbox','Early Polling Location', 'Polling Location']
    useEffect(() => {
        if (map.current && votingTargets && Object.keys(votingTargets).length > 0 ) {
            map.current.on("load", () => {
                loadAllImages(map.current).then( () => {
                    types.forEach(type => {
                        console.log(`adding voting layer : ${type}`)
                        if(!map.current.getSource(`voting_source: ${type}`)){
                            try{
                                const source = map.current.addSource(
                                    `voting_source: ${type}`,
                                    {
                                        type: "geojson",
                                        data: { ...votingTargets, features: votingTargets.features.filter(f=>f.properties.asset_type===type)} 
                                    }
                                )
                                map.current.addLayer({
                                    id: `voting: ${type}`,
                                    type: "symbol",
                                    source: `voting_source: ${type}`,
                                    layout: {
                                        "icon-image": ['get','icon'], // ["get", "icon"],
                                        "icon-size": 0.1,
                                        //'icon-allow-overlap': true,
                                        //              'text-allow-overlap': true,
                                        // visibility: selectedTypes.includes(type)
                                        //     ? "visible"
                                        //     : "none"
                                        visibility: "visible"// selectedTypes.includes(type) ? 'visible' :'none'
                                    },

                                });
                                map.current.on('click',  `voting: ${type}`, (e)=>{
                                    if(e.features.length >0){
                                        console.log("clicked feacture ", e.features[0])
                                        const coordinates = e.features[0].geometry.coordinates.slice();
                                        const data = e.features[0].properties
                                        onClick({coordinates,data})
                                    }
                                })
                            }
                            catch{
                                console.log("SOMETHING WENT WRONG SETTING UP LAYER")
                            }
                        }
                    });
                });
            });
        }
    }, [map, votingTargets]);



    useEffect(() => {
        const setVisibility = (layer, shouldBeVisable)=>{
                if (map.current && map.current.loaded() && map.current.getLayer(`voting: ${layer}`)) {
                    map.current.setLayoutProperty(
                        `voting: ${layer}`,
                        "visibility",
                        shouldBeVisable && selectedTypes.includes(layer) ? 'visible' : 'none' 
                    )
                }
                else{
                     setTimeout(()=>setVisibility(layer,shouldBeVisable),200)
                }
            }
            
        types.forEach(type => setVisibility(type,visible));
       
    }, [map, visible, selectedTypes,types]);

}
