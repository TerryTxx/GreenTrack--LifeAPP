import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/free-solid-svg-icons'

function FootPrint(props) {
    const [colour, setColour] = useState([]);

    // init background color
    useEffect(() => {
        if(props.weight <= 150){
            setColour("lightorange");
        }else if(props.weight <= 550){
            setColour("green");
        }else{
            setColour("#ABB88A");
        }
    }, [props]);

    return (
    <>
      <div className="footprint-background" style={{ borderLeft: `10px solid ${colour}` }}>
        <section className="footprint-info">
            <p style={{ fontSize: "1.2em", margin: "-15px"}}>{props.name}</p>
            <p style={{ fontSize: "0.75em", margin: "0 15px"}}>{props.nums}{props.unit} &nbsp;&nbsp; {props.weight}g</p>
        </section>
        <section>
            <FontAwesomeIcon icon={faTrash} className='exercise-menu-icon' onClick={() => props.handleDelete(props)}/>
        </section>
      </div>
    </>
  );
}

export default FootPrint;