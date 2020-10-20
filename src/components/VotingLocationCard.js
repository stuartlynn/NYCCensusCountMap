import React from "react";

export default function VotingLocationCard({ assets, title }) {
    const width = Math.max(300, 300 * Math.ceil(assets.length / 3));
    return (
        <div className="asset-card" style={{ width: width + "px" }}>
            <h2>
                {title}
            </h2>
            <ul style={{ width: width + "px" }}>
                {assets.length == 0 && (
                    <li key={`${title}-empty `}>
                        <h3>None identified</h3>
                    </li>
                )}
                {assets.map(asset => (
                    <li key={asset.Name} className="asset">
                        <h3>{asset.Name}</h3>
                        <p>
                            {[
                                asset.Address,
                                asset.City,
                                asset['Zip Code']
                            ].join(",")}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}