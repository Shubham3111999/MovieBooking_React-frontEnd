import React, { useState } from 'react';
import "../css/DropdownShow.css"

export default function DropdownShow({btnText,data, setTimes,dateTimeShowObj,setSelectedDate,setSelectedTime}) {
    const [showDropdown, setShowDropdown] = useState(false);

    const toggleDropdown = () => {
        setShowDropdown(!showDropdown);
    };

    const haneleOptions=(dataIn)=>{
        
        if(setTimes != undefined){
            
            const timeObj=[];
            for(const datekey in  dateTimeShowObj){

                if(dataIn==datekey){
                    dateTimeShowObj[datekey].map((obj)=>{
                        timeObj.push(obj.time)
                    })
                    break;
                }
                
            }
            
            setTimes(timeObj);   //set times array for times drop down
        }

        if(setSelectedDate && setSelectedTime){
            setSelectedDate(dataIn);
            setSelectedTime("Select Time");
        }

        if( !(setSelectedDate && setSelectedTime)){
            setSelectedTime(dataIn);
        }
    }

    return (
        <div className="dropdown">
            <button
                className="btn btn-link dropdown-toggle dropdown-btn"
                onClick={toggleDropdown}
            >
                {btnText}
            </button>
            {showDropdown && (
                <div className="dropdown-menu dropdown-menu-end show" onClick={toggleDropdown}>
                    
                    {data.map((dataIn,ind) => <a className="dropdown-item" key={ind} onClick={()=>haneleOptions(dataIn)}>
                        {dataIn}
                    </a>)}
                    
                </div>
            )}
        </div>
    )
}
