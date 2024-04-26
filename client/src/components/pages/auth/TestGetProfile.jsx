import React, { useState,useEffect } from "react";
import { Link,useNavigate } from "react-router-dom";
import { currentUser } from "../../../function/auth";


const TestGetProfile = () => {

    const [ userData,setUserData ] = useState(null)

    useEffect(()=>{

        const fetchUserData = async ()=>{
            try {
                const response = await currentUser(localStorage.getItem("token"))
                console.log(response.data)
                setUserData(response.data);
            } catch (err) {
                console.log('Error Fetching user profile data: '+err)
            }
        }
        fetchUserData();
    },[])


    return(
        <div className="profile-container">
            {
                userData ?(
                    <div>
                        <h2>Your CitizenID is:{userData.citizenID} </h2>
                        <h2>Your Name is:{userData.name} </h2>
                        <h2>Your Division is:{userData.divisionName} </h2>
                        <h2>Your Sub-Division is:{userData.sub_division} </h2>
                    </div>
                ):(
                    <p>Loading user data..</p>
                )
            }
        </div>
    )
}

export default TestGetProfile