import { useState, useEffect } from "react";
import {remapProperties} from '../voting_asset_types'

export default function useVotingTargets() {
    const [targets, setTargets] = useState([]);

    useEffect(() => {
                fetch(
                "/voting_combined.geojson"
                )
                .then(r => r.json())
                .then(setTargets)
    }, []);
    return targets;
}
