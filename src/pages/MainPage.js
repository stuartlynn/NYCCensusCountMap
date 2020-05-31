import React, { useRef, useState, useEffect, useCallback } from "react";
import { useMap } from "../hooks/useMap";
import Legend from "../components/Legend";
import Details from "../components/Details";
import Papa from "papaparse";
import * as turf from "@turf/turf";
import { useGeoJSONLayer } from "../hooks/useGeoJSONLayer";
import useBoundaryLayers from "../hooks/useBoundaryLayers";
import useFacilitiesLayer from "../hooks/useFacilitiesLayer";
import Layers, { fillStyles } from "../Layers";
import ReactGA from "react-ga";
import queryString from "query-string";
import PrintDialog from "../components/PrintDialog";

export default function MainPage() {
    const mapDiv = useRef(null);
    const [selectedBoundary, setSelectedBoundary] = useState("NOCCs");
    const [selectedTract, setSelectedTract] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [hardToCountStats, setHardToCountStats] = useState([]);
    const [showFacilities, setShowFacilities] = useState(true);
    const [selectedFacilityTypes, setSelectedFacilityTypes] = useState([]);
    const [metric, setMetric] = useState("responseRate");
    const [showNYCHA, onToggleNYCHA] = useState(false);
    const [showPrintDialog, setShowPrintDialog] = useState(false);
    const [mapImage, setMapImage] = useState(null);

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

    const { map, zoomToBounds } = useMap(mapDiv, {
        lnglat: [-73.9920330193022, 40.75078660435196],
        zoom: 10,
        style: "mapbox://styles/mapbox/light-v10",
        key:
            "pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiM2Q4ODllNmRkZDQ4Yzc3NTBhN2UyNDE0MWY2OTRiZWIifQ.8OEKvgZBCCtDFUXkjt66Pw"
    });

    const tryToPrint = () => {
        const canvas = document.getElementsByClassName("mapboxgl-canvas")[0];
        const imageURL = canvas.toDataURL("image/png");
        setMapImage(imageURL);
        setShowPrintDialog(true);
        /*  canvas.toBlob(blob => {
                debugger;
                setMapImage(blob);
                setShowPrintDialog(true);
            }, "image/png");
*/
    };

    useEffect(() => {
        const params = queryString.parse(window.location.search);
        if (params.layer) {
            setSelectedBoundary(params.layer);
        }
        if (params.metric) {
            setMetric(params.metric);
        }
        if (params.boundaryID) {
            const zoomToFeature = () => {
                if (
                    map.current &&
                    map.current.isStyleLoaded &&
                    map.current.getLayer(params.layer + "-fill") &&
                    map.current.querySourceFeatures(params.layer + "_source")
                        .length > 0
                ) {
                    const features = map.current.querySourceFeatures(
                        params.layer + "_source"
                    );
                    const sf = features.find(
                        f => f.id + "" === params.boundaryID
                    );
                    if (sf) {
                        setSelectedFeature(sf);
                        let bounds = turf.bbox(
                            turf.buffer(sf, 1, { units: "miles" })
                        );
                        console.log("bounds ", bounds);
                        map.current.fitBounds(bounds);
                    }
                } else {
                    setTimeout(zoomToFeature, 500);
                }
            };
            zoomToFeature();
        }
    }, [window.location.search]);

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

    const NYCHALocations = useGeoJSONLayer(map, "NYCHA", {
        ...Layers.NYCHA,
        onClick: setSelectedTract,
        selection: selectedTract,
        visible: showNYCHA
    });

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

    let shareURL = `${window.location.origin}${process.env.PUBLIC_URL}?layer=${selectedBoundary}&metric=${metric}`;
    if (selectedFeature) {
        shareURL += `&boundaryID=${selectedFeature.id}`;
    }
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
                showNYCHA={showNYCHA}
                onToggleNYCHA={onToggleNYCHA}
                shareURL={shareURL}
                onPrint={tryToPrint}
            />
            {showPrintDialog && (
                <PrintDialog
                    mapImage={mapImage}
                    onClose={() => setShowPrintDialog(false)}
                />
            )}
        </div>
    );
}
