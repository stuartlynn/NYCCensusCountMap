import {useState, useEffect, useRef} from 'react'
import papa from 'papaparse'

export default function useCCFAssignments(){
    const [CCFBizCrosswalk, setCCFBizCrosswalk] = useState([])
    const intervalRef = useRef(null)
    const getData = ()=>{
        console.log("UPDATED ASSIGNEMENTS")
        // papa.parse(`https://docs.google.com/spreadsheets/d/e/2PACX-1vSa1xobVkjf1SwHahluf5e_hxMQEj733XLGf5xj-bH6-2X-IpB3jHZ7XGnqFWABsRMtepFmY3psxF98/pub?gid=0&single=true&output=csv&range=A1:E${10000+Math.floor(100*Math.random())}`,
          papa.parse('https://census-proxy.herokuapp.com/targets',
            {
                download: true,
                header:true,
                complete:(data=> {
                    setCCFBizCrosswalk(data.data)
                })
            })
    }
    
    useEffect(()=>{
        intervalRef.current = setInterval(getData,10000)
        getData()
        return () => clearInterval(intervalRef.current)
    },[])


    return CCFBizCrosswalk
}