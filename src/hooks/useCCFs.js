import { useState, useEffect } from "react";
import Papa from 'papaparse'

export function useCCFs() {
    const [CCFs, setCCFs] = useState([]);
    useEffect(() => {
        Papa.parse(`${process.env.PUBLIC_URL}/CCFAwardeesWithColors.csv`, {
            download:true,
            header:true,
            complete: function(results) {
                setCCFs(results.data.map(d => ({
                    name : d['Org Name'], 
                    address:d['Contact Address w/o Unit'],
                    latitude: d.Latitude,
                    longitude: d.Longitude,
                    color: d.color
                })));
            }
        });
    }, []);

    return CCFs;
}

export function useFilteredCCFs(query) {
    const ccfs = useCCFs();
    return ccfs.filter(c => c.name.includes(query));
}
