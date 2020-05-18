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
            <CCFSearch selected={selectedCCF} onSelected={onSelectedCCF} />
            <h3>COVID-19 Community Assets</h3>
            <div className='key' style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <Unclaimed style={{width:'50px', height:'50px'}}/>
                <p>Unclaimed Asset</p>
                <Claimed  style={{width:'50px', height:'50px'}}/>
                <p>Outreach Pending</p>
                <Done  style={{width:'50px', height:'50px'}}/>
                <p>Outreach Compleated</p>
            </div>
            <p style={{textAlign:'left', fontWeight:700}}>A change from grey to a color signifies a CCF Grantee has commited to do census outreach at that location.</p>
            <OutreactAssetsSelector
                selected={selectedOutreachTypes}
                onSelected={onSelectOutreachTypes}
            />
        </div>
    );
}
