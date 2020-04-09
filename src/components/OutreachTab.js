import React, { useState } from "react";
import CCFSearch from "./CCFSearch";
import OutreactAssetsSelector from "./OutreachAssetSelector.js";

export default function OutreactTab({ selectedCCF, setSelectedCCF }) {
    const [selectedAssetTypes, setSelectedAssetTypes] = useState([]);
    const [selectedCFF, setSelectedCFF] = useState(null);

    const toggleAssetType = types => {
        let newList = [...selectedAssetTypes];
        types.forEach(type => {
            if (newList.includes(type)) {
                newList = newList.filter(t => t !== type);
            } else {
                newList = [...newList, type];
            }
        });
        setSelectedAssetTypes(newList);
    };

    return (
        <div className="outreach-tab">
            <h3>Outreach</h3>
            <CCFSearch selected={selectedCFF} setSelected={setSelectedCFF} />
            <h3>Community Asset Types</h3>
            <OutreactAssetsSelector
                selected={selectedAssetTypes}
                onSelected={toggleAssetType}
            />
        </div>
    );
}
