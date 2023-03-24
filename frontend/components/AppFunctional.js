import axios from "axios";
import React, { useEffect, useState } from "react";

// önerilen başlangıç stateleri
const initialMessage = "";
const initialEmail = "";
const initialSteps = 0;
const initialIndex = 4; //  "B" nin bulunduğu indexi

export default function AppFunctional(props) {
  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);
  const [location, setLocation] = useState({
    x: 2,
    y: 2,
  });

  function getXY() {
    const positions = {
      "1,1": 0,
      "2,1": 1,
      "3,1": 2,
      "1,2": 3,
      "2,2": 4,
      "3,2": 5,
      "1,3": 6,
      "2,3": 7,
      "3,3": 8,
    };

    const positionKey = `${location.x},${location.y}`;

    if (positions[positionKey] !== undefined) {
      setIndex(positions[positionKey]);
    }
  }
  useEffect(getXY, [location]);

  function getXYMesaj() {
    // Kullanıcı için "Koordinatlar (2, 2)" mesajını izlemek için bir state'in olması gerekli değildir.
    // Koordinatları almak için yukarıdaki "getXY" helperını ve ardından "getXYMesaj"ı kullanabilirsiniz.
    // tamamen oluşturulmuş stringi döndürür.
    return `Koordinat (${getXY().x},${getXY().y})`;
  }

  function reset() {
    setMessage(initialMessage);
    setEmail(initialEmail);
    setSteps(0);
    setLocation({
      x: 2,
      y: 2,
    });
  }

  function gameOn(e) {
    const id = e.target.id;
    let newLocation = { ...location };
    let newMessage = initialMessage;

    if (id === "up" && location.y >= 2) {
      newLocation.y--;
    } else if (id === "up") {
      newMessage = "Yukarıya gidemezsiniz";
    }

    if (id === "down" && location.y < 3) {
      newLocation.y++;
    } else if (id === "down") {
      newMessage = "Aşağıya gidemezsiniz";
    }

    if (id === "right" && location.x < 3) {
      newLocation.x++;
    } else if (id === "right") {
      newMessage = "Sağa gidemezsiniz";
    }
    if (id === "left" && location.x >= 2) {
      newLocation.x--;
    } else if (id === "left" && location.x <=1) {
      newMessage = "Sola gidemezsiniz";
    }

    if (newMessage === initialMessage) {
      setSteps(steps + 1);
    }

    setLocation(newLocation);
    setMessage(newMessage);
  }

  function onChange(e) {
    // inputun değerini güncellemek için bunu kullanabilirsiniz
    setEmail(e.target.value)
  }

  function onSubmit(e) {
    // payloadu POST etmek için bir submit handlera da ihtiyacınız var.
    e.preventDefault();
    const toSend= {
      x: location.x,
      y: location.y,
      steps:steps,
      email:email
    }

    axios
    .post("http://localhost:9000/api/result",toSend)
    .then((response) => {
      console.log(response.data);
      setMessage(response.data.message)
    })
    .catch((error) => {
      console.log(error);
      setMessage(error.response.data.message);
    })
    .finally(() => {
      setEmail(initialEmail);
    })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">Koordinatlar ({location.x},{location.y})</h3>
        <h3 id="steps">{steps} kere ilerlediniz</h3>
      </div>
      <div id="grid">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((idx) => (
          <div key={idx} className={`square${idx === index ? " active" : ""}`}>
            {idx === index ? "B" : null}
          </div>
        ))}
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={gameOn}>SOL</button>
        <button id="up" onClick={gameOn}>YUKARI</button>
        <button id="right" onClick={gameOn}>SAĞ</button>
        <button id="down" onClick={gameOn}>AŞAĞI</button>
        <button id="reset" onClick={reset}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="email girin" onChange={(e) => onChange(e)} value={email} ></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  );
}
