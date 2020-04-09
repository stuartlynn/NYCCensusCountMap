import React, { useState, useCallback } from "react";
import { RadialChart } from "react-vis";
import FacilityCard from "./FacilityCard";
import SimpleBarChart from "./SimpleBarChart";
import PieCard from "./PieCard";
import FactCard from "./FactCard";
import AssetCategoryCard from "./AssetCategoryCard";
import DetailsSelector from "./DetailsSelector";
import { useFilteredFacilities } from "../hooks/useFacilities";
import { saveAs } from "file-saver";
import ProgressBar from "./ProgressBar";
import LanguageCard from "./LanguageCard";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

export default function Details({
    feature,
    onSelectFacility,
    layer,
    tract,
    facilityTypes
}) {
    const [showFacilities, setShowFacilities] = useState(false);
    const [showBoundaryData, setShowBoundaryData] = useState(true);

    const [selectedDetails, setSelectedDetails] = useState("census2020");

    const facilities = useFilteredFacilities(
        showBoundaryData
            ? feature
                ? feature.properties.geoid
                : null
            : tract
            ? tract.properties.GEOID
            : null,
        showBoundaryData ? layer : "tracts",
        facilityTypes
    );

    const makeRenting = feature => {
        const properties = feature.properties;
        return [
            { name: "Renters", value: properties.own_vs_rent_rent },
            { name: "Owners", value: properties.own_vs_rent_owner }
        ];
    };

    const featureNames = {
        tracts: "Census Tract",
        cd: "Community District",
        sd: "School District",
        cc: "City Council District",
        nat: "Neighborhood Tablulation Area",
        NOCCs: "NOCC",
        senate_districts: "Senate District",
        police_precincts: "Police Precinct",
        congress_districts: "Congressional District",
        state_assembly_districts: "State Assembly Districts"
    };

    const featureName = featureNames[layer];
    const displayFeature =
        showBoundaryData && layer !== "tracts"
            ? feature
            : tract && {
                  ...tract,
                  properties: {
                      ...tract.properties,
                      geoid: tract.properties.GEOID
                  }
              };
    console.log("DISPLAY FEATURE IS ", displayFeature);
    const downloadAssets = useCallback(() => {
        let csv = ["name", "address", "type"].join(",") + "\n";
        csv += facilities
            .map(f => [f.name, f.address, f.asset_type].join(","))
            .join("\n");
        var blob = new Blob([csv], { type: "text/plain;charset=utf-8" });
        const boundaryType = showBoundaryData ? layer : "tract";
        const boundaryId = displayFeature.id;
        console.log(boundaryType, boundaryId, facilities, displayFeature);

        saveAs(blob, `assets_for_${boundaryType}-${boundaryId}.csv`);
    }, [facilities, displayFeature]);

    const makeAgeData = feature => {
        const properties = feature.properties;
        const data = [
            {
                name: "5 years or younger",
                value: properties.age_less_5
            },
            {
                name: "6 yrs - 15 yrs",
                value: properties.age_6_15
            },
            {
                name: "16 yrs - 64 yrs",
                value: properties.age_16_64
            },
            {
                name: "65 yrs or older",
                value: properties.age_64_over
            }
        ];
        return data;
    };
    const makeForeignData = feature => {
        const properties = feature.properties;
        return [
            { name: "US Born", value: properties.foreign_born_native },
            { name: "Foreign Born", value: properties.foreign_born_foreign }
        ];
    };
    const makeEnglishData = feature => {
        const properties = feature.properties;

        return [
            //  { name: "English", value: properties.english_english },
            { name: "Asian Languages", value: properties.english_asian },
            { name: "Spanish", value: properties.english_spanish },
            { name: "European Languages", value: properties.english_european },
            { name: "Other", value: properties.english_other }
        ];
    };
    const makeInternetData = feature => {
        const properties = feature.properties;
        const data = [
            { name: "No Internet", value: properties.internet_no_access },
            {
                name: "Full Subscription",
                value: properties.internet_subscription
            },
            {
                name: "Limited Subscription",
                value: properties.internet_no_subscription
            }
        ];
        console.log(properties);
        return data;
    };
    const contactStrategy = feature => {
        switch (feature.strategy_code) {
            case 0:
                return "Internet First, English";
            case 1:
                return "Internet First, Bilingual";
            case 2:
                return "Internet Choice, English";
            case 3:
                return "Internet Choice, Bilingual";
        }
    };
    const makeDemographicData = feature => {
        return [
            {
                name: "white",
                value:
                    feature.properties.race_white /
                    feature.properties.race_total
            },
            {
                name: "black",
                value:
                    feature.properties.race_black /
                    feature.properties.race_total
            },
            {
                name: "asian",
                value:
                    feature.properties.race_asian /
                    feature.properties.race_total
            },
            {
                name: "latinx",
                value:
                    feature.properties.race_hispanic /
                    feature.properties.race_total
            },
            {
                name: "other",
                value:
                    feature.properties.race_other /
                    feature.properties.race_total
            }
        ];
    };
    const makeLanguage = feature => {
        const cols = [
            "Speak only English",
            "Spanish",
            "French (incl. Cajun)",
            "Haitian",
            "Italian",
            "Portuguese",
            "German",
            "Yiddish, Pennsylvania Dutch or other West Germanic languages",
            "Greek",
            "Russian",
            "Polish",
            "Serbo-Croatian",
            "Ukrainian or other Slavic languages",
            "Armenian",
            "Persian (incl. Farsi, Dari)",
            "Gujarati",
            "Hindi",
            "Urdu",
            "Punjabi",
            "Bengali",
            "Nepali, Marathi, or other Indic languages",
            "Other Indo-European languages",
            "Telugu",
            "Tamil",
            "Malayalam, Kannada, or other Dravidian languages",
            "Chinese (incl. Mandarin, Cantonese)",
            "Japanese",
            "Korean",
            "Hmong",
            "Vietnamese",
            "Khmer",
            "Thai, Lao, or other Tai-Kadai languages",
            "Other languages of Asia",
            "Tagalog (incl. Filipino)",
            "Ilocano, Samoan, Hawaiian, or other Austronesian languages",
            "Arabic",
            "Hebrew",
            "Amharic, Somali, or other Afro-Asiatic languages",
            "Yoruba, Twi, Igbo, or other languages of Western Africa",
            "Swahili or other languages of Central, Eastern, and Southern Africa",
            "Navajo",
            "Other Native languages of North America",
            "Other and unspecified languages"

            /*            "speak_only_english",
            "spanish",
            "french,_haitian,_or_cajun",
            "german_or_other_west_germanic_languages",
            "russian,_polish,_or_other_slavic_languages",
            "other_indo-european_languages",
            "korean",
            "chinese_(incl._mandarin,_cantonese)",
            "vietnamese",
            "tagalog_(incl._filipino)",
            "other_asian_and_pacific_island_languages"

*/
        ];
        const data = cols.map(col => ({
            value:
                (feature.properties[col] * 100.0) /
                feature.properties["language_total_pop"],
            title: col
        }));
        return data;
    };

    const makeLEP = feature => {
        const cols = [
            "LEPHHs",
            "LEPspanHHs",
            "LEPindoeurHHs",
            "LEPapacHHs",
            "LEPotherHHs"
        ];
        const data = cols.map(col => ({
            value: feature.properties[col],
            title: col
        }));
        return data;
    };

    return displayFeature ? (
        <React.Fragment>
            <div className="overview">
                <div className="boundary-type-selector">
                    {feature && (
                        <div
                            className={`boundary-type-selector-type ${
                                showBoundaryData ? "" : "selected"
                            }`}
                            onClick={() => setShowBoundaryData(true)}
                        >
                            <h2 className={showBoundaryData ? "" : "selected"}>
                                {featureName}:{" "}
                                {featureName === "NOCC"
                                    ? feature.properties.nocc_id
                                    : feature.properties.geoid}{" "}
                                {featureName === "NOCC"
                                    ? feature.properties.neighborhood
                                    : ""}
                            </h2>
                        </div>
                    )}
                    {tract && (
                        <div
                            className={`boundary-type-selector-type ${
                                showBoundaryData ? "selected" : ""
                            }`}
                            onClick={() => setShowBoundaryData(false)}
                        >
                            <h2>Census Tract: {tract.properties.GEOID}</h2>
                        </div>
                    )}
                </div>
                <div className="top-stats">
                    {displayFeature && (
                        <p>
                            Population:{" "}
                            <span style={{ color: "red" }}>
                                {Math.floor(
                                    displayFeature.properties.total_population
                                ).toLocaleString()}
                            </span>
                        </p>
                    )}
                    {showBoundaryData && feature ? (
                        <>
                            <p>
                                Population in HTC areas:{" "}
                                <span style={{ color: "red" }}>
                                    {Math.floor(
                                        (feature.properties.htc_pop * 100.0) /
                                            feature.properties.total_population
                                    ).toLocaleString()}
                                    %
                                </span>
                            </p>
                        </>
                    ) : (
                        tract && (
                            <>
                                <p>
                                    Mail return rate 2010:{" "}
                                    <span style={{ color: "red" }}>
                                        {tract.properties.MRR2010}%
                                    </span>
                                </p>
                                <p>
                                    2020 Census Mail Contact Strategy:{" "}
                                    <span style={{ color: "red" }}>
                                        {contactStrategy(tract.properties)}
                                    </span>
                                </p>
                            </>
                        )
                    )}
                    {selectedDetails === "assets" && (
                        <p onClick={downloadAssets} className="download-assets">
                            <FontAwesomeIcon icon={faDownload} />
                            Download Community Assets
                        </p>
                    )}
                </div>
            </div>
            <div className="selector-cards">
                <DetailsSelector
                    selected={selectedDetails}
                    onSelect={detail => setSelectedDetails(detail)}
                />
                {displayFeature && (
                    <div className="cards">
                        {selectedDetails === "census2020" && (
                            <>
                                <div className="card selfresponse">
                                    <h3>Self Response Rate</h3>
                                    <p className="bigPC">
                                        {Math.floor(
                                            displayFeature.properties.CRRALL
                                        )}{" "}
                                        %
                                    </p>
                                    <p>Last updated 8th April</p>
                                </div>
                                <div className="card comparison">
                                    <p>
                                        <span
                                            style={{
                                                color: "red",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {Math.floor(
                                                displayFeature.properties.CRRALL
                                            )}
                                            %{" "}
                                        </span>{" "}
                                        <span style={{ fontWeight: "bold" }}>
                                            Self response rate as of 9th April
                                            2020
                                        </span>
                                        <br />
                                        25th day of counting
                                    </p>
                                    <ProgressBar
                                        pc={displayFeature.properties.CRRALL}
                                    />
                                    <p>
                                        <span
                                            style={{
                                                color: "red",
                                                fontWeight: "bold"
                                            }}
                                        >
                                            {Math.floor(
                                                displayFeature.properties
                                                    .HISTORIC_RESP_RATE
                                            )}
                                            %{" "}
                                        </span>{" "}
                                        <span style={{ fontWeight: "bold" }}>
                                            Self response rate as of 8th April
                                            2010
                                        </span>
                                        <br />
                                        25th day of counting
                                    </p>
                                    <ProgressBar
                                        pc={
                                            displayFeature.properties
                                                .HISTORIC_RESP_RATE
                                        }
                                    />
                                    {!showBoundaryData && (
                                        <>
                                            <p>
                                                <span>
                                                    {Math.floor(
                                                        displayFeature
                                                            .properties.MRR2010
                                                    )}
                                                    %
                                                </span>{" "}
                                                Final self response rate in 2010
                                                census
                                            </p>
                                            <ProgressBar
                                                pc={
                                                    displayFeature.properties
                                                        .MRR2010
                                                }
                                            />
                                        </>
                                    )}
                                </div>
                            </>
                        )}
                        {selectedDetails === "languages" && (
                            <>
                                <div className="card english_proficency">
                                    <PieCard
                                        title="Limited English Proficency"
                                        data={makeEnglishData(displayFeature)}
                                        norm={true}
                                    />
                                    <FactCard
                                        title={""}
                                        facts={[
                                            {
                                                name:
                                                    "% of housholds are bilingual",
                                                value: Math.floor(
                                                    (displayFeature.properties
                                                        .bilingual *
                                                        100.0) /
                                                        displayFeature
                                                            .properties
                                                            .english_total_households
                                                )
                                            },
                                            {
                                                name:
                                                    "% of housholds have limited english proficency",
                                                value: Math.floor(
                                                    ((displayFeature.properties
                                                        .english_total_households -
                                                        displayFeature
                                                            .properties
                                                            .english_english) *
                                                        100.0) /
                                                        displayFeature
                                                            .properties
                                                            .english_total_households
                                                )
                                            }
                                        ]}
                                    />
                                </div>

                                <LanguageCard
                                    data={makeLanguage(displayFeature)}
                                />
                            </>
                        )}
                        {selectedDetails === "demographics" && (
                            <>
                                <div className="card demographics">
                                    <PieCard
                                        title="Race"
                                        data={makeDemographicData(
                                            displayFeature
                                        )}
                                    />
                                    <FactCard
                                        title={""}
                                        facts={[
                                            {
                                                name: "identify as Latinx",
                                                value:
                                                    Math.floor(
                                                        (displayFeature
                                                            .properties
                                                            .race_hispanic *
                                                            100.0) /
                                                            displayFeature
                                                                .properties
                                                                .race_total
                                                    ).toLocaleString() + "%"
                                            },
                                            {
                                                name: "identify as Black",
                                                value:
                                                    Math.floor(
                                                        (displayFeature
                                                            .properties
                                                            .race_black *
                                                            100.0) /
                                                            displayFeature
                                                                .properties
                                                                .race_total
                                                    ).toLocaleString() + "%"
                                            }
                                        ]}
                                    />
                                </div>
                                <div className="card foreign">
                                    <PieCard
                                        title="Foreign Born"
                                        data={makeForeignData(displayFeature)}
                                    />
                                </div>
                                <div className="card age">
                                    <PieCard
                                        title="Age"
                                        data={makeAgeData(displayFeature)}
                                        norm={true}
                                    />
                                    <FactCard
                                        title={""}
                                        facts={[
                                            {
                                                name:
                                                    "people under 5 years old",
                                                value: Math.floor(
                                                    displayFeature.properties
                                                        .age_less_5
                                                ).toLocaleString()
                                            }
                                        ]}
                                    />
                                </div>
                            </>
                        )}
                        {selectedDetails === "housing" && (
                            <>
                                <div className="card internet">
                                    <PieCard
                                        title="Internet Access"
                                        data={makeInternetData(displayFeature)}
                                        norm={true}
                                        style={{ width: "500px" }}
                                    />
                                    <FactCard
                                        facts={[
                                            {
                                                name:
                                                    "people have no internet access",
                                                value: Math.floor(
                                                    displayFeature.properties
                                                        .internet_no_access
                                                ).toLocaleString()
                                            }
                                        ]}
                                    />
                                </div>
                                <div className="card housing">
                                    <PieCard
                                        title="Housing Tenure"
                                        data={makeRenting(displayFeature)}
                                    />
                                </div>
                            </>
                        )}
                        {selectedDetails === "assets" && (
                            <>
                                {facilityTypes && facilityTypes.length > 0 ? (
                                    facilityTypes.map(type => (
                                        <AssetCategoryCard
                                            title={type}
                                            key={type}
                                            assets={facilities.filter(
                                                f => f.asset_type === type
                                            )}
                                        />
                                    ))
                                ) : (
                                    <div className="asset-placeholder">
                                        <h2>
                                            Turn on some Community Assets to
                                            view here
                                        </h2>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}
            </div>
        </React.Fragment>
    ) : (
        <div className="placeholder">
            <h2>Click {featureName} for details</h2>
        </div>
    );
}
