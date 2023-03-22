import React, { Component, useState, useContext, useEffect } from 'react';
import CalendarDay from '../Home/CalendarDay';
import FootPrint from "./FootPrint";
import { addDays, startOfWeek, lastDayOfWeek, format, getWeek, isSameDay, addWeeks, subWeeks } from 'date-fns';
import { AuthContext } from "../../Authentication.jsx";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeftLong, faArrowRightLong,faPersonWalkingWithCane, faLightbulb, faBusSimple } from '@fortawesome/free-solid-svg-icons';
import { collection, query, doc, where, getDocs, deleteDoc, addDoc} from "firebase/firestore"; 
import { db } from "../../firebase";
import Select from 'react-select'
import "./Trackpage.css";

class TrackPage extends Component {
    constructor(props) {
        super(props);

        /* add content */
        this.state = {
            days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
            currentMonth: new Date(),
            selectedDate: new Date(),
            currentWeek: getWeek(new Date()),
            list: [],
            calAddWeight: 0,
            currentUser : null,
            types: [
                {value: "walking", label: "walking"},
                {value: "bus", label: "bus"},
                {value: "no-light", label: "no-light"}
            ],
            addTerm: {name: "", unit: "", nums: 0, weight: 0}
        };

        this.changeWeekHandle = this.changeWeekHandle.bind(this);
        this.queryFootPrints = this.queryFootPrints.bind(this);
    }

    /* week pre or next button */
    changeWeekHandle(btnType){
        if (btnType === "prev") {
          this.setState({currentMonth: subWeeks(this.state.currentMonth, 1)});
          this.setState({currentWeek: getWeek(subWeeks(this.state.currentMonth, 1))});
        }
        if (btnType === "next") {
          this.setState({currentMonth: addWeeks(this.state.currentMonth, 1)});
          this.setState({currentWeek: getWeek(subWeeks(this.state.currentMonth, 1))});
        }
      }
    
    /* desc sort by create time */
    sortByTimestamp = (footA, footB) => {
        if (footA.gmtCreate > footB.gmtCreate) return -1;
        else if (footA.gmtCreate < footB.gmtCreate) return 1;
        else return 0;
    }

    /* get footprint list from db */
    async componentDidMount() {
      // checking for user on page reload and page load
      // init list from db
      this.queryFootPrints(this.state.selectedDate);
    }

    /* The content of the list page is updated in real time 
    when the user selects another date */
    async changeSelectedDate(date){
      this.setState({selectedDate: date});
      // init list from db
      this.queryFootPrints(date);
    }

    // query from db filtered by date 
    async queryFootPrints(date){
      const q = query(collection(db, "footprints"), where("userId", "==", "1"), 
          where("gmtCreate", ">=", new Date(date.setHours(0, 0, 0, 0)).valueOf()), 
          where("gmtCreate", "<=", new Date(date.setHours(23, 59, 59, 0)).valueOf()));
      const querySnapshot = await getDocs(q);
      const tempList = [];
      querySnapshot.forEach((doc) => {
          tempList.push(doc.data());
      });
      this.setState({list: tempList});
    }

    /* calculate every type total weight */
    totalWeight(type){
        const tempList = this.state.list;
        const sum = tempList.filter(pf => pf.name.includes(type)).reduce((prev, curr) => prev + curr.weight, 0);
        return Number.parseFloat(sum).toFixed(2);
    }

    render(){

    const renderDays = () => {
        const startDate = startOfWeek(this.state.currentMonth, { weekStartsOn: 1 });
        const endDate = lastDayOfWeek(this.state.currentMonth, { weekStartsOn: 1 });
        const dateFormat = "d";
        let day = startDate;
        var dates = [];
        let formattedDate = "";
        while (day <= endDate) {
          for (let i = 0; i < 7; i++) {
            formattedDate = format(day, dateFormat);
            dates.push(<CalendarDay key={day} day={day} dayName={this.state.days[i]} date={formattedDate} today={isSameDay(day, new Date())} selected={isSameDay(this.state.selectedDate, day)} changeSelectedDate={(date) => this.changeSelectedDate(date)}></CalendarDay>);
            day = addDays(day, 1);
          }
        }
        return dates
      }

    /* delete footprint button */
    const handleDelete = async (footprint) => {
        const tempList = this.state.list;
        const index = footprint.id;
        if (index !== -1) {
            tempList.splice(index, 1);
            this.setState({list: tempList});
            // deleteDoc(doc(db, "footprints", footprint.uid));
        }
    }

    /* add new footprint  
        Passing values from a child component(AddFootPrint) to a parent component(Trackpage)
    */
    const addNewFootprintList = (data) => {
      this.setState({list: data});
    }

    return (
        <>
          <div className='footprints'>  
            <section className="calendar-wrapper">
              <p className='month-title'>{format(this.state.currentMonth, "MMMM yyyy")}</p>
              <section className="prevAndNextBtn">
                <FontAwesomeIcon className='prevIcon' icon={faArrowLeftLong} onClick={() => this.changeWeekHandle("prev")}/> 
                <FontAwesomeIcon className='nextIcon' icon={faArrowRightLong} onClick={() => this.changeWeekHandle("next")}/>
              </section>
              <section className="calendar">
                {renderDays()}
              </section>
            </section>
            
            <section>
                <div className='footprint-type-sum'>
                    {this.state.types.map((name, index) => (
                        <span className='totalSum' key={index}>
                          {name.value.includes("walk") && <FontAwesomeIcon icon={faPersonWalkingWithCane} />}
                          {name.value.includes("bus") && <FontAwesomeIcon icon={faBusSimple} />}
                          {name.value.includes("light") && <FontAwesomeIcon icon={faLightbulb} />}
                          &nbsp;{this.totalWeight(name.value)}g
                        </span>
                    ))}
                </div>
            </section>

            <section>
                <AddFootPrint 
                addTerm={this.state.addTerm}
                types={this.state.types}
                footprintList = {this.state.list}
                addNewFootprintList = {addNewFootprintList}
          />
            </section>

            <section>
              <div className='footprint-list'>
              {this.state.list.length == 0 && <p>No green footprint yet, please add...</p>}
              {this.state.list?.sort(this.sortByTimestamp).map((fp, index) => {
                    return <FootPrint key={index} rid={fp.id} id={index} name={fp.name} nums={fp.nums} weight={fp.weight} unit={fp.unit} userId={fp.userId} gmtCreate={fp.gmtCreate} handleDelete={handleDelete}/>
                })}
              </div>
            </section>
          </div>
        </>
      );
};
}
// start a new component : AddFootPrint
class AddFootPrint extends Component{
      constructor(props) {
        super(props);
        this.state = {
          selectedOption : ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.submitFootPrint = this.submitFootPrint.bind(this);
      }

      // set drop down box data in real time
      handleChange(e){
        this.setState({
          selectedOption: e.value
        });
      }

      async submitFootPrint(e){
        // get input value
        const nums = e.target[1].value;
        const unit = e.target[2].value;
        // get select option value
        const name = this.state.selectedOption;
        // Generate a random weight value instead of the advanced operation (need to improve)
        const weight = Math.floor(Math.random() * (1000 - 0 + 1));
        // get footprintList from parent component(Trackpage)
        const footList = this.props.footprintList;
        const gmtCreate = (new Date()).valueOf();
        const uid = parseInt(Math.random() * (2000));
        // arguments check if any one is empty stop the function
        if(!nums){
          alert("nums is empty");
          return;
        }
        if(!unit){
          alert("unit is empty");
          return;
        }
        if(!name){
          alert("selectedOption is empty");
          return;
        }
        // push into list
        footList.push({"name": name, "nums": nums, "unit": unit, "weight": weight, "gmtCreate": gmtCreate});
        // Passing values to parent component(Trackpage)
        this.props.addNewFootprintList(footList); 
        // clear input value       
        e.target[1].value = "";
        e.target[2].value = "";

        // insert into db
        try {
          addDoc(collection(db, "footprints"), {
            name: name,
            nums: nums,
            unit: unit,
            weight: weight,
            uid: uid,
            gmtCreate: gmtCreate,
            userId: "1"
          });
          console.log(gmtCreate)
        } catch (e) {
          console.error("Error adding document: ", e);
        }
        e.preventDefault();
    }   

    render(){
        const types = this.props.types;
        return(
            <div className='footprint-add'>
                <p className='add-title'>Add your green footprint</p>
                <br/>
                <form className='submitFootPrint' onSubmit={this.submitFootPrint}>
                    <Select options={types} onChange={this.handleChange.bind(this)} placeholder="select..."/>
                    <input type="text" placeholder='nums'/>
                    <input type="text" placeholder='unit'/>
                    {/* <input type="text" placeholder= "weight"></input> */}
                    <button className='add-btn'>ADD</button>
                </form>
            </div>
        );
    }
}
export default TrackPage;