import { pointGrid } from '@turf/turf'
import React, {useState} from 'react'
import FactCard from './FactCard'
import PieCard from './PieCard'
import VotingDetailsSelector from './VotingDetailsSelector'
import VotingLocationCard from './VotingLocationCard'

export default function VotingDetails({electoralDistrict,feature,layer, votingLocations}){
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
    const layerIDs = {
        cd: "community_district_id",
        tracts: "census_tract_id",
        cc: "city_council_district_id",
        sd: "school_district_id",
        nta: "nta_id",
        police_precincts: "precinct_id",
        congress_districts: "cong_dist_id",
        senate_districts: "st_sen_dist_id",
        NOCCs: "noccs_id"
    };

    let votingLocs = [] 
    if(votingLocations && votingLocations.features){
        if(showBoundaryData && feature){
            votingLocs = votingLocations.features.filter(vl=>vl.properties[layerIDs[layer]] === feature.properties.geoid)
            votingLocs = votingLocs.map(vl => vl.properties)
        }
        else if (!showBoundaryData && electoralDistrict){
            votingLocs = votingLocations.features.filter(vl=>vl.properties.elect_dist_id==electoralDistrict.properties.elect_dist)
            votingLocs = votingLocs.map(vl => vl.properties)
        }
    }
    const featureName = featureNames[layer];

    const dataFeature = showBoundaryData && feature ? feature : electoralDistrict

    console.log("data feature is ",dataFeature)

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
                value: 1- (p.GRE + p.DEM + p.REP)
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
                    { electoralDistrict && (
                        <div
                            className={`boundary-type-selector-type ${
                                showBoundaryData ? "selected" : ""
                            }`}
                            onClick={() => setShowBoundaryData(false)}
                        >
                            <h2>Electoral District: {electoralDistrict.properties.elect_dist}</h2>
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
                        <p>{dataFeature.properties.weighted_participation.toLocaleString({ maximumSignificantDigits: 1 })} % </p>
                        <h3>Weighted Score</h3>
                            </div>

                        </div>
                        <div className='card participation-explanation'>
                           The Voter Participation score ranks NYC residents’ previous election participation. 
                           This weighted score places higher importance on longer term residents compared to residents 
                           who recently moved to NYC. This score was developed by NYC Votes under the NYC Campaign Finance Board. 
                           To learn more about the Voter Participation Score, <a target="_blank" href='https://nyccfb.maps.arcgis.com/apps/View/index.html?appid=8c71e276366d4368890dc792c046015e&extent=-74.4730,40.5190,-73.4843,40.8922'>click here</a>. 
                        </div>
                        </>
                         }
                        {details === 'registration' &&
                        <>
                        {/* <div className='card registered'>
                                <h2></h2>
                                <PieCard 
                                title ={'Voting Population Registered to Vote'}
                                data={makeRegData(electoralDistrict)}
                                norm={false}
                                />
                        </div> */}
                        {/* <div className='card party'>
                                <h2></h2>
                                <PieCard 
                                title ={'Party Affiliation'}
                                data={makePartyData(electoralDistrict)}
                                norm={false}
                                />
                        </div> */}
                        <div className='card affiliaction-choice'>
                                <h2></h2>
                                <PieCard 
                                title ={'Party Affiliation'}
                                data={makePartyChoiceData(dataFeature)}
                                norm={false}
                                />
                                <FactCard
                                    title=''
                                    facts={[
                                        {
                                            name: "% of registered voters who reported an affiliation",
                                            value:10// electoralDistrict.pc_with_affiliation
                                        }
                                    ]}
                                      
                                />


                        </div>
                        <div className='card age'>
                                <h2></h2>
                                <PieCard 
                                title ={'Voting age'}
                                data={makeAgeData(dataFeature)}
                                norm={false}
                                />
                        </div>
                        
                        </>
                         }
                         {details ==='locations' &&
                         <>
                            <VotingLocationCard title={"Early Voting"}
                            assets={votingLocs.filter(vl => vl.asset_type==='Early Polling Location')}
                            />
                            <VotingLocationCard title={"Mail in voting"}
                            assets={votingLocs.filter(vl => vl.asset_type==='USPS Dropbox')}
                            />
                            <VotingLocationCard title={"Election Day Voting"}
                            assets={votingLocs.filter(vl => vl.asset_type==='Polling Location')}
                            />
                            </>
                         }

                    </div>
                </div>
            
            </>
        )
    }
}