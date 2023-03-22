import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { InputGroup, Button } from "react-bootstrap";

function OrderItem(props) {
  const [colour, setColour] = useState([]);

  useEffect(() => {
    if (props.weight <= 150) {
      setColour("lightorange");
    } else if (props.weight <= 550) {
      setColour("green");
    } else {
      setColour("#ABB88A");
    }
  }, [props]);

  return (
    <>
      <div
        className="orderItem-background"
        style={{ borderLeft: `10px solid ${colour}` }}
      >
        <section className="orderItem-info">
          <p style={{ fontSize: "1.2em" }}>{props.name}</p>
          <p style={{ fontSize: "0.75em" }}>{props.nums} in stock</p>
        </section>
        <section>
          <div className="order-operator-list">
            <img
              className="order-item-img"
              // src="/static/media/avatar.5170b7a6.png"
              src={props.imgUrl}
              alt=""
            />
            <div>price:{props.price}</div>
            <div className="order-operators">
              {/* <FontAwesomeIcon
                icon={faTrash}
                className="exercise-menu-icon"
                onClick={() => props.handleDelete(props)}
              /> */}
              <InputGroup className="input-group-order">
                <Button disabled={props.value === 0} variant="outline-secondary" onClick={() => {
                    if (props.value > 0) {
                        props.onReduce(props.value - 1)
                    }
                }}>-</Button>
                <input disabled type="number" value={props.value} />
                <Button variant="outline-secondary"  onClick={() => {
                    if (props.value >= 0) {
                        props.onAdd(props.value + 1)
                    }
                }}>+</Button>
              </InputGroup>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default OrderItem;
