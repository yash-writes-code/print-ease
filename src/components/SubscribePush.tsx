"use-client"

import { useEffect } from "react"
import axios from "axios"

export const SubscribePush = ()=>{
    useEffect(()=>{
        const subscribe_to_push = async ()=>{
            const permission = await Notification.requestPermission();
        
            if(permission !== "granted"){
              return;
            }
            else{
              const registration = navigator.serviceWorker.ready;
              const subscription = (await registration).pushManager.subscribe({
                userVisibleOnly:true,
                applicationServerKey:process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
              })

              
              
              console.log("in frontend",subscription);
              const jsonsub = (await subscription).toJSON()
              const res=await axios.post(process.env.NEXT_PUBLIC_BASE_URL+"/api/save_subscription",{
                pushSubscription: jsonsub,
                allowsNotification: true,
              });
              console.log(res.data);
             
            }
          }

          subscribe_to_push();
    },[])

    return null;
};