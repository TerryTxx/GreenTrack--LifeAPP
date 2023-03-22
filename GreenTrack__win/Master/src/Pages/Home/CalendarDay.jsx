import React, { useState, useEffect } from 'react';
import "./Trackpage.css";

function CalendarDay(props) {
    const [customStyles, setCustomStyles] = useState({});
    useEffect(() => {
      if(props.selected){
        setCustomStyles({
          background: "#94A871",
        })
      }else{
        // looks useless but it does revert a selected day back to no background after being unselected
        setCustomStyles({
          background: "none",
        })
      }
    }, [props.today, props.selected])
  
    return (
      <>
        <div className="day-wrapper" style={customStyles} onClick={() => props.changeSelectedDate(props.day)}>
          {props.dayName?(<p style={{ fontSize: "1.2em"}} >{props.dayName.split("").splice(0,3)}</p>):(<div></div>)}
          <p style={{ fontSize: "1.2em"}}>{props.date}</p> 
        </div>
      </>
    );
  }
  
  export default CalendarDay;