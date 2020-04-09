import { useState, useEffect } from "react";

export function useCCFs() {
    const [CCFs, setCCFs] = useState([]);
    useEffect(() => {
        fetch(`${process.env.PUBLIC_URL}/CCFAwardees.csv`)
            .then(r => r.text())
            .then(result => {
                const parsed_result = result.split("\n").map(r => ({
                    name: r.split(",")[0],
                    address: r.split(",")[1],
                    lat: parseFloat(r.split(",")[2]),
                    lng: parseFloat(r.split(",")[3])
                }));
                setCCFs(parsed_result);
            })
            .catch(() => alert("failed to get ccfs"));
    }, []);

    return CCFs;
}

export function useFilteredCCFs(query) {
    const ccfs = useCCFs();
    return ccfs.filter(c => c.name.includes(query));
}
