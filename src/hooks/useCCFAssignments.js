import {useEffect, useState} from 'react'
import Papa from 'papaparse'

export default function useCCFAssigments(){

    const [mapping, setMappings] = useState([])
    useEffect(()=>{
        Papa.parse('https://docs.google.com/spreadsheets/d/e/2PACX-1vSa1xobVkjf1SwHahluf5e_hxMQEj733XLGf5xj-bH6-2X-IpB3jHZ7XGnqFWABsRMtepFmY3psxF98/pub?gid=0&single=true&output=csv',{
            download:true,
            header:true,
            complete:(results=>setMappings( results.data))
        })
    },[])
    return mapping
}