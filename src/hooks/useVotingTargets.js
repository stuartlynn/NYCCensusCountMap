import { useState, useEffect } from "react";
import {remapProperties} from '../voting_asset_types'

const fixIcon = (geoJSON)=>{
    const {features} = geoJSON 
    const newFeatures = features.map((feature)=>{
        const newFeature  = {...feature}
        newFeature.properties.icon = feature.properties.asset_type ===  "Early Polling Location" ? 'early.png' : feature.properties.icon
        return newFeature
    })
    return {...geoJSON, features: newFeatures}
}
export default function useVotingTargets() {
    const [targets, setTargets] = useState([]);

    useEffect(() => {
                fetch(
                "/voting_combined.geojson"
                )
                .then(r => r.json())
                .then(fixIcon)
                .then(setTargets)
    }, []);
    return targets;
}
