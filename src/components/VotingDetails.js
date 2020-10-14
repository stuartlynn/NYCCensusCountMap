import { pointGrid } from '@turf/turf'
import React, {useState} from 'react'
import PieCard from './PieCard'
import VotingDetailsSelector from './VotingDetailsSelector'

export default function VotingDetails({electoralDistrict,feature,layer}){
    console.log("selected ED ", electoralDistrict)
    const [details, setDetails] = useState('participation')
    const [showBoundaryData, setShowBoundaryData] = useState(false )
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

    const makeAgeData = (ed)=>{
        const p= ed.properties
        return[
            {
            name: 'Under 18-30',
            value: p.age_20
            },
            {
            name: '30 - 40',
            value: p.age_30
            },

            {
            name: '40 - 60',
            value: p.age_40 + p.age_50
            },
            {
            name: '>60',
            value: p.age_60 + p.age_70+ p.age_80 + p.age_90
            },

        ]
    }

    const makePartyData=ed=>{

        const p= ed.properties
        return [
            {
                name:'affiliated',
                value:0.2
            },

            {
                name:'unaffiliated',
                value:0.8
            }
        ]
    }
    
    const makeRegData = ed=>{
        const p = ed.properties
        return [
            {
                name:'Registered',
                value:p.registered_voter_pc
            },
            {
                name:'Unregistered',
                value: 1-p.registered_voter_pc
            }
        ]
    }

    const makePartyChoiceData= ed=>{
        const p= ed.properties
        return [
            {
                name:'Green',
                value: p.GRE
            },

            {
                name:'Democrat',
                value:p.DEM
            },

            {
                name:'Republican',
                value:p.REP
            },
            {
                name:"Other",
                value: 1- p.GRE + p.DEM + p.REP
            }
        ]

    }
    
    if (!electoralDistrict){
        return (
            <div className='placeholder'>
                <h2>Select and electoral district to see details</h2>
            </div>
        )
    }
    else{
        return(
            <>
            <div className='overview'>
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
                    {electoralDistrict && (
                        <div
                            className={`boundary-type-selector-type ${
                                showBoundaryData ? "selected" : ""
                            }`}
                            onClick={() => setShowBoundaryData(false)}
                        >
                            <h2>Electoral District: {electoralDistrict.properties.GEOID}</h2>
                        </div>
                    )}
                </div>
                </div>
                <div className="selector-cards">
                    <VotingDetailsSelector
                        selected={details}
                        onSelect={detail => setDetails(detail)}
                    />
                    <div className='cards'>
                        {details === 'participation' &&
                        <>
                        <div className='card participation'>
                                <h2>Participation Score</h2>
                            <div className='participation-grid'>
                        <p>{electoralDistrict.properties.participation_score_2018.toLocaleString({ maximumSignificantDigits: 1 })} % </p>
                        <h3>Unweighted Score</h3>
                        <p>{electoralDistrict.properties.weighted_participation.toLocaleString({ maximumSignificantDigits: 1 })} % </p>
                        <h3>Weighted Score</h3>
                            </div>

                        </div>
                        <div className='card participation-explanation'>
                            Developed by NYC Votes. Voter Participation shows two scores:
                            unweighted and weighted. The weighted score counts people who were
                            eligible for multiple elections more importaint than those who were
                            eligible for less elections. The unweighted score marks all eligible voters 
                            as equally important. To learn more about these Voter Participation scores, 
                            click here.
                        </div>
                        </>
                         }
                        {details === 'registration' &&
                        <>
                        <div className='card registered'>
                                <h2></h2>
                                <PieCard 
                                title ={'Voting Population Registered to Vote'}
                                data={makeRegData(electoralDistrict)}
                                norm={false}
                                />
                        </div>
                        <div className='card party'>
                                <h2></h2>
                                <PieCard 
                                title ={'Party Affiliation'}
                                data={makePartyData(electoralDistrict)}
                                norm={false}
                                />
                        </div>
                        <div className='card affiliaction-choice'>
                                <h2></h2>
                                <PieCard 
                                title ={'Affiliation Choice'}
                                data={makePartyChoiceData(electoralDistrict)}
                                norm={false}
                                />
                        </div>
                        <div className='card age'>
                                <h2></h2>
                                <PieCard 
                                title ={'Voting age'}
                                data={makeAgeData(electoralDistrict)}
                                norm={false}
                                />
                        </div>
                        
                        </>
                         }
                    </div>
                </div>
            
            </>
        )
    }
}