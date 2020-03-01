import React from "react";

export default function AssetCategoryCard({ assets, title }) {
    const icons = {
        "Hospitals and Rehab Centers": "Dot_Hospitals.png",
        "Faith-Based Organizations": "Dot_FBO.png",
        "City Wide Community Schools": "Dot_CommunitySchools.png",
        "LGBTQ Centers and Services": "Dot_LGBTQ.png",
        "Food Kitchens and Pantries": "Dot_FoodKitchens.png",
        "Senior Centers": "Dot_SeniorCenters.png",
        "Universal Pre-K": "Dot_UniPreK.png",
        "K-12 (NYC Public Schools)": "Dot_K12.png",
        "Community Schools": "Dot_CommunityCenters.png",
        "Mental Health Services": "Dot_MentalHealth.png",
        "Community-Based Organizations": "Dot_CBO.png",
        "Public Libraries": "Dot_Libraries.png",
        "Head Start and Early Head Start": "Dot_HeadStart.png"
    };

    const width = Math.max(300, 300 * Math.ceil(assets.length / 3));
    return (
        <div className="asset-card" style={{ width: width + "px" }}>
            <h2>
                <img src={`${process.env.PUBLIC_URL}/imgs/${icons[title]}`} />
                {title}
            </h2>
            <ul style={{ width: width + "px" }}>
                {assets.length == 0 && (
                    <li key={`${title}-empty `}>
                        <h3>None identified</h3>
                    </li>
                )}
                {assets.map(asset => (
                    <li key={asset.name} className="asset">
                        <h3>{asset.name}</h3>
                        <p>
                            {[
                                asset.address,
                                asset.boro,
                                asset.city,
                                asset.zipcode
                            ].join(",")}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
