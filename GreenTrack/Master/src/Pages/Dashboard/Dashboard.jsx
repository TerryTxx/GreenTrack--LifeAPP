import React, { useState, useEffect } from 'react';
import Chart from "../../Component/Chart";
import { addDays, startOfWeek, lastDayOfWeek, format, getWeek, addWeeks, subWeeks } from 'date-fns';
import "./Dashboard.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faArrowRightLong} from '@fortawesome/free-solid-svg-icons';
import CalendarDay from '../Home/CalendarDay';
import { collection, query, where, getDocs} from "firebase/firestore"; 
import { db } from "../../firebase";
import excellentImg from "../Images/excellent.jpg";

//https://kalacloud.com/blog/react-echarts-tutorial/
function Dashboard(props){

  const [ currentMonth, setCurrentMonth ] = useState(new Date());

  const [ currentWeek, setCurrentWeek ] = useState(getWeek(new Date()));

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

  const [ currentDates, setCurrentDates ] = useState([]);

  const [ weights, setWeights ] = useState([]);

  const [ totalWeight, setTotalWeight ] = useState(0);

  const [walkingWeights, setWalkingWeights] = useState([]);

  const [busWeights, setBusWeights] = useState([]);

  const [lightgWeights, setLightWeights] = useState([]);

  /* week pre or next button : update start&end date of week for charts*/
  const changeWeekHandle = function(btnType){
    let startDate;
    let endDate;
    let weekDay;
    if (btnType === "prev") {
      weekDay = subWeeks(currentMonth, 1);
      setCurrentMonth(weekDay);
      setCurrentWeek(getWeek(weekDay));
      startDate = startOfWeek(weekDay, { weekStartsOn: 1 });
      endDate = lastDayOfWeek(weekDay, { weekStartsOn: 1 });
    }
    if (btnType === "next") {
      weekDay = addWeeks(currentMonth, 1);
      setCurrentMonth(weekDay);
      setCurrentWeek(getWeek(weekDay));
      startDate = startOfWeek(weekDay, { weekStartsOn: 1 });
      endDate = lastDayOfWeek(weekDay, { weekStartsOn: 1 });
    }
    changeWeights(startDate, endDate);
    startDate && changeCurrentDates(startDate, endDate);
  }

  const renderDays = () => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
    const dateFormat = "d";
    let day = startDate;
    var dates = [];
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        dates.push(<CalendarDay key={day} day={day} dayName={days[i]} date={formattedDate}></CalendarDay>);
        day = addDays(day, 1);
      }
    }
    return dates;
  }

  // update the current week's total weight
  useEffect(() => {
    const startDate = startOfWeek(currentMonth, { weekStartsOn: 1 });
    const endDate = lastDayOfWeek(currentMonth, { weekStartsOn: 1 });
    if(currentDates.length == 0){
      changeCurrentDates(startDate, endDate);
      changeWeights(startDate, endDate);
    }
  }, [currentMonth, currentDates]);  

  const changeCurrentDates = function(startDate, endDate){
    let formatDateStr = [];
    let day = startDate;
    let formattedDate = "";
    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, "d");
        formatDateStr.push(formattedDate + '');
        day = addDays(day, 1);
      }
    }
    setCurrentDates(formatDateStr);
  }

  // get footprint list from db filtered by date
  const changeWeights = async function(startDate, endDate){
    const q = query(collection(db, "footprints"), 
    where("userId", "==", "1"), 
    where("gmtCreate", ">=", startDate.valueOf()),
    where("gmtCreate", "<", endDate.valueOf()))
    ;
    const querySnapshot = await getDocs(q);
    const tempList = [];
    querySnapshot.forEach((doc) => {
        tempList.push(doc.data());
    });

    // Here are several arrays of size 7, 
    // each position corresponding to the total weight of a day of the week for a certain environmental type
    const ws = [0,0,0,0,0,0]; // total weight per day
    const w = [0,0,0,0,0,0];  // walking 
    const b = [0,0,0,0,0,0];  // bus
    const l = [0,0,0,0,0,0];  // no-light
    // total weight
    let tw = 0;
    // millseconds per day
    let dayMills = 86400000;
    for(let i = 0; i < tempList.length; i++){
      // get array index by date
      // Subtract the start date from the timestamp for each creation time and divide by the total number of milliseconds in a day 
      // to get the day of the week for the record
      let idx = parseInt((tempList[i].gmtCreate - startDate.valueOf()) / dayMills);
      tw += tempList[i].weight;
      switch(tempList[i].name){
        case "bus":
          b[idx] += tempList[i].weight;
          break;
        case "walking":
          w[idx] += tempList[i].weight;
          break;
        case "no-light":
          l[idx] += tempList[i].weight;
          break;
        default:break;
      }
      ws[idx] += tempList[i].weight;
    }
    setWalkingWeights(w);
    setBusWeights(b);
    setLightWeights(l);
    setTotalWeight(tw);
    setWeights(ws);
    return tempList;
  }
  
  return (
      <div className='dashboard'>
          <div className="week">
            <p className='month-title'>{format(currentMonth, "MMMM yyyy")}</p>
            <section className="prevAndNextBtn">
              <FontAwesomeIcon className='prev' icon={faArrowLeftLong} onClick={() => changeWeekHandle("prev")}/> 
              <FontAwesomeIcon className='next' icon={faArrowRightLong} onClick={() => changeWeekHandle("next")}/>
            </section>
            <section className="calendar">
              {renderDays()}
            </section>
          </div>
          <div className='encourageZone'>
            <img className='slogonImg' src={excellentImg} />
            {totalWeight <= 400 && <p className='slogon'>Your total weight is {totalWeight}.You can keep trying, please do!</p>}
            {totalWeight > 400 && <p className='slogon'>Your total weight is {totalWeight}. Excellent job!</p>}
            {/* {totalWeight >= 600 && <p className='slogon'>Your total weight is {totalWeight}. Wonderfull!</p>} */}
          </div>
          <div className='weightChart'>
            <Chart currentDates={currentDates} weights={weights} walkingWeights={walkingWeights} busWeights={busWeights} lightgWeights={lightgWeights}/>
          </div>
      </div>
  )
}
export default Dashboard ;