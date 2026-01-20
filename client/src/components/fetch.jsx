import { useEffect, useState } from "react";

function useFetch(url){
    const [data,setData] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    
    useEffect(()=>{
        async function fetchData() {
            setLoading(true);
            try{
            const req = await fetch(url);
            if(!req.ok){
                throw new Error("faild to fetch");

            }
            const res = await req.json();
            setData(res);
               }
               catch(err){
                // setError();
  setError(err.message || "Something went wrong"); // ✅

               }
               finally{
                setLoading(false);
               }
        }
        fetchData();
    },[url])
    return {data,error,loading}
}
export default useFetch;