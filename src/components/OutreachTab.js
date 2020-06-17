import React, { useState } from "react";
import CCFSearch from "./CCFSearch";
import OutreactAssetsSelector from "./OutreachAssetSelector.js";
import {ReactComponent as  Unclaimed}  from '../icons/laundry_484949.svg'
import {ReactComponent as Claimed}  from '../icons/laundry_A44098_alert.svg'
import {ReactComponent as Done}  from '../icons/laundry_A44098.svg'


export default function OutreactTab({ selectedCCF, onSelectedCCF, selectedOutreachTypes, onSelectOutreachTypes }) {
    return (
        <div className="outreach-tab">
            <h3>Outreach</h3>
            <p className='outreach-step'><span>Step 1</span>: Select a Census Grantee</p>
            <CCFSearch selected={selectedCCF} onSelected={onSelectedCCF} />
            <h3>COVID-19 Community Assets</h3>


            <p className='outreach-step'><span>Step 2</span>: Review Outreach Icons</p>
            <div className='key'>
                <div className='icon'>
                    <Unclaimed style={{width:'47px', height:'63px'}}/>
                    <p>Unclaimed Asset</p>
                </div>
                <div className='icon'>
                    <Claimed  style={{width:'47px', height:'63px'}}/>
                    <p>Claimed Asset: Outreach Pending</p>
                </div>

                <div className='icon'>
                    <Done  style={{width:'47px', height:'63px'}}/>
                    <p>Claimed Asset: Outreach Compleated</p>
                </div>
            </div>

            <p className='outreach-step'><span>Step 3</span>: Select Buisness Categories</p>

            <OutreactAssetsSelector
                selected={selectedOutreachTypes}
                onSelected={onSelectOutreachTypes}
            />

            <p className='outreach-step'>
                <span>Step 4</span>: Review Map and Buisness Locations For Outreach
            </p>

            <p className='outreach-step'>
                <span>Step 5</span>: Claim Buisness for Outreach
            </p>
        </div>
    );
}
