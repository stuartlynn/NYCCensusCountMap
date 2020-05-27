import React, { useState } from "react";
import ContactTypeLegend from "./ContactTypeLegend";
import RangeLegend from "./RangeLegend";
import CategoryLegend from "./CategoryLegend";
import BoundarySelector from "./BoundarySelector";
import FacilitiesSelector from "./FacilitiesSelector";
import HelpTab from "./HelpTab";
import InfoTab from "./InfoTab";
import { CopyToClipboard } from "react-copy-to-clipboard";
import OutreachTab from "./OutreachTab";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faInfoCircle,
    faLayerGroup,
    faQuestionCircle,
    faExclamationCircle,
    faList
} from "@fortawesome/free-solid-svg-icons";

import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

export default function Legend({
    selectedBoundary,
    boundaries,
    onSelectBoundary,
    showFacilities,
    onShowFacilitiesChange,
    selectedCCF, onSelectedCCF,
    selectedOutreachTypes,
    onSelectOutreachTypes,
    tab,
    onTabChanged,
    onSelectMetric,
    metric,
    selectedFacilityTypes,
    onSelectFacilityType,
    onPrint,
    showENRFU,
    onToggleENRFU,
    shareURL
}) {


    return (
        <div className="Legend overlay">
            <div className="tabs">
                <div
                    className={tab === "layers" ? "selected" : ""}
                    onClick={() => onTabChanged("layers")}
                >
                    <FontAwesomeIcon icon={faLayerGroup} />
                </div>
                <div
                    className={tab === "outreach" ? "selected" : ""}
                    onClick={() => onTabChanged("outreach")}
                >
                    <FontAwesomeIcon
                        style={{ color: "red" }}
                        icon={faExclamationCircle}
                    />
                </div>
                <div
                    className={tab === "info" ? "selected" : ""}
                    onClick={() => onTabChanged("info")}
                >
                    <FontAwesomeIcon icon={faInfoCircle} />
                </div>
                <div
                    className={tab === "questions" ? "selected" : ""}
                    onClick={() => onTabChanged("questions")}
                >
                    <FontAwesomeIcon icon={faQuestionCircle} />
                </div>
            </div>
            <div className="content">
                {tab === "layers" && (
                    <section className="thematic-layer">
                        <h3>LAYERS</h3>
                        <h3>Neighborhood Information</h3>
                        <Dropdown
                            options={[
                                {
                                    value: "responseRate",
                                    label: "2020 Self Response Rate to date"
                                },
                                {
                                    value: "strategy",
                                    label: "2020 Census Mail Contact Stategies"
                                },
                                {
                                    value: "returnCount",
                                    label: "Hard to Count Populations(2010)"
                                },
                                {
                                    value: "blackPop",
                                    label: "Black Population (%)"
                                },
                                {
                                    value: "latinxPop",
                                    label: "Latinx Population (%)"
                                },
                                {
                                    value: "asianPop",
                                    label: "Asian Population (%)"
                                },
                                {
                                    value: "whitePop",
                                    label: "White Population (%)"
                                },
                                {
                                    value: "otherPop",
                                    label: "Other Population (%)"
                                },
                                {
                                    value: "noInternetPC",
                                    label:
                                        "Population with No Internet Access (%)"
                                },
                                {
                                    value: "englishProficency",
                                    label: "Limited English Proficiency (%)"
                                },
                                {
                                    value: "under5",
                                    label: "Population Under 5 Years Old (%)"
                                }
                            ]}
                            onChange={a => onSelectMetric(a.value)}
                            value={metric}
                            placeholder="Select a metric"
                        />
                        {metric === "strategy" && (
                            <CategoryLegend
                                categories={[
                                    {
                                        color: "#C2A5CF",
                                        name: "Internet First, English",
                                        sub:
                                            "Housing unit will receive letter to complete Census via online link, in English"
                                    },
                                    {
                                        color: "#9970AB",
                                        name: "Internet First, Bilingual",
                                        sub:
                                            "Housing unit will receive letter to complete Census via online link, in English and Spanish"
                                    },
                                    {
                                        color: "#A6DBA0",
                                        name: "Internet Choice, English",
                                        sub:
                                            "Housing unit will receive letter to complete Census via online link or paper survey, in English"
                                    },
                                    {
                                        color: "#5AAE61",
                                        name: "Internet Choice, Bilingual",
                                        sub:
                                            "Housing unit will receive letter to complete Census via online link or paper survey, in English and Spanish "
                                    }
                                ]}
                            />
                        )}
                        {metric === "responseRate" && (
                            <RangeLegend
                                name={"Self Response Rate to date(%)"}
                                min={"0%"}
                                max={"70%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#faaf12"}
                            />
                        )}
                        {metric === "returnCount" && (
                            <CategoryLegend
                                categories={[
                                    { color: "#b95356", name: "0 - 60%" },
                                    { color: "#ee5658", name: "60 - 65%" },
                                    { color: "#ecbaa8", name: "65 - 70%" },
                                    { color: "#f9bd53", name: "70 - 73%" },
                                    {
                                        color: "rgba(0,0,0,0)",
                                        name: "Not hard to count"
                                    }
                                ]}
                            />
                        )}
                        {metric === "asianPop" && (
                            <RangeLegend
                                name={"Asian Population (%)"}
                                min={"0%"}
                                max={"100%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#8f1158"}
                            />
                        )}
                        {metric === "blackPop" && (
                            <RangeLegend
                                name={"Black Population (%)"}
                                min={"0%"}
                                max={"100%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#b93f22"}
                            />
                        )}
                        {metric === "latinxPop" && (
                            <RangeLegend
                                name={"Latinx Population (%)"}
                                min={"0%"}
                                max={"100%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#cf0621"}
                            />
                        )}
                        {metric === "whitePop" && (
                            <RangeLegend
                                name={"White Population (%)"}
                                min={"0%"}
                                max={"100%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#faaf12"}
                            />
                        )}
                        {metric === "otherPop" && (
                            <RangeLegend
                                name={"Other Population (%)"}
                                min={"0%"}
                                max={"20%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#000000"}
                            />
                        )}
                        {metric === "noInternetPC" && (
                            <RangeLegend
                                name={"% No Internet"}
                                min={"0%"}
                                max={"100%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#faaf12"}
                            />
                        )}
                        {metric === "englishProficency" && (
                            <RangeLegend
                                name={"% Proficent in English"}
                                min={"0%"}
                                max={"100%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#faaf12"}
                            />
                        )}
                        {metric === "under5" && (
                            <RangeLegend
                                name={"% under 5 years old"}
                                min={"0%"}
                                max={"10%"}
                                colStart={"#FFFFFF"}
                                colEnd={"#faaf12"}
                            />
                        )}
                        <BoundarySelector
                            selectedBoundary={selectedBoundary}
                            onSelect={onSelectBoundary}
                            boundaries={boundaries}
                        />
                        <FacilitiesSelector
                            selected={selectedFacilityTypes}
                            onSelected={onSelectFacilityType}
                        />
                      
                        <div className="share">
                            <h3>Share</h3>
                            <div className="share-buttons">
                                <CopyToClipboard text={window.location}>
                                    <button className="share-button">
                                        Copy Map Link
                                    </button>
                                </CopyToClipboard>

                                <CopyToClipboard text={shareURL}>
                                    <button className="share-button">
                                        Copy Current Map View
                                    </button>
                                </CopyToClipboard>
                            </div>

                            <div
                                style={{
                                    marginTop: "20px",
                                    display: "flex",
                                    justifyContent: "space-around"
                                }}
                            >
                                <button
                                    onClick={onPrint}
                                    className="share-button"
                                    style={{ width: "200px" }}
                                >
                                    Print Map
                                </button>
                            </div>
                        </div>
                    </section>
                )}
                {tab === "outreach" && <OutreachTab 
                    selectedOutreachTypes={selectedOutreachTypes} 
                    onSelectOutreachTypes={onSelectOutreachTypes}
                    selectedCCF={selectedCCF}
                    onSelectedCCF={onSelectedCCF}
                />}

                {tab === "info" && <InfoTab />}
                {tab === "questions" && <HelpTab />}
            </div>
        </div>
    );
}
