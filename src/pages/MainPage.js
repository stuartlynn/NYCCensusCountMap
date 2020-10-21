import React, { useRef, useState, useEffect, useCallback } from "react";
import { useMap } from "../hooks/useMap";
import Legend from "../components/Legend";
import Details from "../components/Details";
import VotingDetails from "../components/VotingDetails";
import Papa from "papaparse";
import * as turf from "@turf/turf";
import { useGeoJSONLayer } from "../hooks/useGeoJSONLayer";
import useBoundaryLayers from "../hooks/useBoundaryLayers";
import useFacilitiesLayer from "../hooks/useFacilitiesLayer";
import useVotingTargets from "../hooks/useVotingTargets";
import useVotingLayers from "../hooks/useVotingLayers";
import Layers, { fillStyles } from "../Layers";
import ReactGA from "react-ga";
import queryString from "query-string";
import PrintDialog from "../components/PrintDialog";
import useFacilities from "../hooks/useFacilities";
import CategoryLegend from "../components/CategoryLegend";


export default function MainPage() {
    const mapDiv = useRef(null);
    const [selectedBoundary, setSelectedBoundary] = useState("NOCCs");
    const [selectedTract, setSelectedTract] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [hardToCountStats, setHardToCountStats] = useState([]);
    // const [selectedCCF, setSelectedCCF] = useState(null)

    const [popupFeature, setPopupFeature] = useState(null)

    const [selectedFacilityTypes, setSelectedFacilityTypes] = useState([]);
    const [selectedVotingTypes, setSelectedVotingTypes]= useState([]);
    const [metric, setMetric] = useState("responseRate");
    const [votingMetric, selectVotingMetric] = useState("weightedScore");
    const [showENRFU, setShowNRFU] = useState(false);
    const [showPrintDialog, setShowPrintDialog] = useState(false);
    const [showOutreach, setShowOutreach] = useState(false)
    const [showFacilities, setShowFacilities] = useState(true);
    const [selectedElectoralDistrict, setSelectedElectoralDistrict] = useState(null)

    const [mapImage, setMapImage] = useState(null);
    const [tab, setTab] = useState("voting");

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
        // lnglat: [-73.9625463540349, 40.67728661754935],
        // zoom: 15,
        lnglat: [-73.9920330193022, 40.75078660435196],
        zoom: 10,
        style: "mapbox://styles/mapbox/light-v10",
        key:
            "pk.eyJ1Ijoic3R1YXJ0LWx5bm4iLCJhIjoiM2Q4ODllNmRkZDQ4Yzc3NTBhN2UyNDE0MWY2OTRiZWIifQ.8OEKvgZBCCtDFUXkjt66Pw"
    },popupFeature);

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

    const toggleSelectedVotingTypes= (types)=>{
            let newList = [...selectedVotingTypes];
            types.forEach(type => {
                if (newList.includes(type)) {
                    newList = newList.filter(t => t !== type);
                } else {
                    newList = [...newList, type];
                }
            });
            setSelectedVotingTypes(newList);
    }

    useEffect(() => {
        const params = queryString.parse(window.location.search);
        if (params.layer) {
            setSelectedBoundary(params.layer);
        }
        if (params.metric) {
            setMetric(params.metric);
        }
        if (params.nrfu) {
            setShowNRFU(params.nrfu === "yes");
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

    const votingStyle={
        ...Layers.voting,
        ...{
            paintFill:{"fill-color": fillStyles[votingMetric]}
        }
    }

    const VotingLater = useGeoJSONLayer(
            map,'voting',
        {
            ...votingStyle,
            visible:showOutreach,
            onClick:setSelectedElectoralDistrict,
            selection:selectedElectoralDistrict
        }
    )

    const setTractIfActive = useCallback( (tract)=>{ 
        if(tab==='layers'){ 
            setSelectedTract(tract)
        }
    },[tab])

    const GeojsonLayer = useGeoJSONLayer(map, "HTC", {
        ...style,
        onClick: setTractIfActive,
        selection: selectedTract,
        visible:!showOutreach 
    });

    // const EarlyNRFULocations = useGeoJSONLayer(map, "early_nrfu", {
    //     ...Layers.EarlyNRFU,
    //     visible: showENRFU
    // });

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

    const facilities = useFacilities()

    useFacilitiesLayer(
        map,
        facilities,
        showFacilities,
        selectedFacilityTypes
    );

    const votingTargets = useVotingTargets();
    useVotingLayers(map, votingTargets, showOutreach, selectedVotingTypes,setPopupFeature )
    console.log("Voting targets are ", votingTargets)


    useEffect(()=>{
        if(tab==='layers'){
            console.log("SWITCHING TO layers")
            setShowFacilities(true)
            setShowOutreach(false)
        }
        if(tab ==='voting'){
            console.log("SWITCHING TO outreach", )
            setShowFacilities(false)
            setShowOutreach(true)
        }
    },[tab])

    let shareURL = `${window.location.origin}${process.env.PUBLIC_URL}?layer=${selectedBoundary}&metric=${metric}`;
    if (selectedFeature) {
        shareURL += `&boundaryID=${selectedFeature.id}`;
    }
    return (
        <div className="main-page">
            <div className="map" ref={mapDiv} />
            <div className="info overlay">
                <h2>ATLAS:VOTE NYC</h2>
                <p>
                    This open source platform is a tool to support community-focused ‘Get Out The Vote’ (GOTV) efforts for upcoming elections. Use this map to identify polling locations and visualize geographically relevant data for neighborhood outreach. 
                </p>
            </div>
            <div className="details overlay">
                {tab==='layers' ? 
                    <Details
                        feature={selectedFeature}
                        tract={selectedTract}
                        layer={selectedBoundary}
                        facilityTypes={selectedFacilityTypes}
                        facilities={facilities}
                        tab={tab} />
                    :
                    //<CCFDetails selectedCCF={selectedCCF} assignments={ccfAssigments} outreachTargets={outreachTargets}/>
                    <VotingDetails 
                        electoralDistrict={selectedElectoralDistrict}
                        feature={selectedFeature}
                        layer={selectedBoundary}
                        votingLocations={votingTargets}
                    />
                }
            </div>
            <Legend
                boundaries={boundaryLayers}
                selectedBoundary={selectedBoundary}
                onSelectBoundary={setSelectedBoundary}
                showFacilities={showFacilities}
                onShowFacilitiesChange={setShowFacilities}
                selectedFacilityTypes={selectedFacilityTypes}
                onSelectFacilityType={onToggleFacilityType}
                // selectedCCF= {selectedCCF}
                // onSelectedCCF={setSelectedCCF}
                selectedVotingTypes={selectedVotingTypes}
                onSelectVotingTypes={toggleSelectedVotingTypes}
                metric={metric}
                onSelectMetric={setMetric}
                votingMetric={votingMetric}
                onSelectVotingMetric={selectVotingMetric}
                showENRFU={showENRFU}
                onToggleENRFU={setShowNRFU}
                shareURL={shareURL}
                onPrint={tryToPrint}
                tab = {tab}
                onTabChanged = {setTab}
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
