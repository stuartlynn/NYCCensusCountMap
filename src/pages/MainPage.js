import React, { useRef, useState, useEffect, useCallback } from "react";
import { useMap } from "../hooks/useMap";
import Legend from "../components/Legend";
import Details from "../components/Details";
import Papa from "papaparse";
import { useGeoJSONLayer } from "../hooks/useGeoJSONLayer";
import useBoundaryLayers from "../hooks/useBoundaryLayers";
import useFacilitiesLayer from "../hooks/useFacilitiesLayer";
import Layers, { fillStyles } from "../Layers";
import ReactGA from "react-ga";

export default function MainPage() {
    const mapDiv = useRef(null);
    const [selectedBoundary, setSelectedBoundary] = useState("NOCCs");
    const [selectedTract, setSelectedTract] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [hardToCountStats, setHardToCountStats] = useState([]);
    const [showFacilities, setShowFacilities] = useState(true);
    const [selectedFacilityTypes, setSelectedFacilityTypes] = useState([]);
    const [metric, setMetric] = useState("strategy");
    const [showENRFU, setShowNRFU] = useState(true);

    useEffect(() => {
        ReactGA.initialize("UA-159011122-1");
        ReactGA.pageview(window.location.pathname + window.location.search);
    }, []);

    useEffect(() => {
        Papa.parse("/hard_to_count_NY.csv", {
            download: true,
            header: true,
            complete: function(results) {
                setHardToCountStats(results);
            }
        });
    }, []);

    const onToggleFacilityType = types => {
        let newList = [...selectedFacilityTypes];
        types.forEach(type => {
            if (newList.includes(type)) {
                newList = newList.filter(t => t !== type);
            } else {
                newList = [...newList, type];
            }
        });
        setSelectedFacilityTypes(newList);
    };

    const map = useMap(mapDiv, {
        lnglat: [-73.9920330193022, 40.75078660435196],
        zoom: 10,
        style: "mapbox://styles/mapbox/light-v10",
        key:
            "pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiM2Q4ODllNmRkZDQ4Yzc3NTBhN2UyNDE0MWY2OTRiZWIifQ.8OEKvgZBCCtDFUXkjt66Pw"
    });

    const searchBox = useRef(null);

    useEffect(() => {
        setSelectedFeature(null);
    }, [selectedBoundary]);

    const style = {
        ...Layers.HTCLayer,
        ...{
            paintFill: { "fill-color": fillStyles[metric], "fill-opacity": 0.7 }
        }
    };

    const GeojsonLayer = useGeoJSONLayer(map, "HTC", {
        ...style,
        onClick: setSelectedTract,
        selection: selectedTract,
        visible: true
    });

    const EarlyNRFULocations = useGeoJSONLayer(map, "early_nrfu", {
        ...Layers.EarlyNRFU,
        visible: showENRFU
    });

    // BoundaryLayers().forEach(layer => {
    const boundaryLayers = useBoundaryLayers(
        map,
        selectedBoundary,
        null,
        selectedBoundary,
        selectedFeature ? selectedFeature.id : null,
        boundary => {
            setSelectedTract(null);
            setSelectedFeature(boundary);
        }
    );

    const facilities = useFacilitiesLayer(
        map,
        showFacilities,
        selectedFacilityTypes
    );
    return (
        <div className="main-page">
            <div className="map" ref={mapDiv} />
            <div className="info overlay">
                <h2>NYC CENSUS 2020 INTERACTIVE MAP</h2>
                <p>
                    This map is a tool to identify community-based assets, learn
                    about historically undercounted communities, and visualize
                    geographically relevant Census data for 2020 Census efforts.
                </p>
                <p>
                    If you are creating an outreach strategy to get your
                    neighborhood counted, this tool can help! For more
                    information about the map and how to submit data for your
                    neighborhood click on the "?" below.
                </p>
                <div ref={searchBox} />
            </div>
            <div className="details overlay">
                <Details
                    feature={selectedFeature}
                    tract={selectedTract}
                    layer={selectedBoundary}
                    facilityTypes={selectedFacilityTypes}
                />{" "}
            </div>
            <Legend
                boundaries={boundaryLayers}
                selectedBoundary={selectedBoundary}
                onSelectBoundary={setSelectedBoundary}
                showFacilities={showFacilities}
                onShowFacilitiesChange={setShowFacilities}
                selectedFacilityTypes={selectedFacilityTypes}
                onSelectFacilityType={onToggleFacilityType}
                metric={metric}
                onSelectMetric={setMetric}
                showENRFU={showENRFU}
                onToggleENRFU={setShowNRFU}
            />
        </div>
    );
}
