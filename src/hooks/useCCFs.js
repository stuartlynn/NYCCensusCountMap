import { useState, useEffect } from "react";
import Papa from 'papaparse'

export function useCCFs() {
    const [CCFs, setCCFs] = useState([]);
    useEffect(() => {
        Papa.parse(`${process.env.PUBLIC_URL}/CCFAwardees.csv`, {
            download:true,
            header:true,
            complete: function(results) {
                console.log("Outreach CCF names ", results)
                setCCFs(['NYC Census 2020 Field Team', ...results.data.map(d => ({
                    name : d['Org Name'], 
                    address:d['Contact Address w/o Unit'],
                    latitude: d.latitude,
                    longitude: d.longitude
                }))]);
            }
        });
    }, []);

    return CCFs;
}

export function useFilteredCCFs(query) {
    const ccfs = useCCFs();
    return ccfs.filter(c => c.name.includes(query));
}
