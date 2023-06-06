import React, { useEffect, useState } from "react";
import "./App.css";

const ScaledroneChat = () => {
  const [drone, setDrone] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");

  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  function UsernameRandomizer() {
    const colors = [
      "Plavi",
      "Žuti",
      "Crveni",
      "Zeleni",
      "Bijeli",
      "Ljubičasti",
      "Narančasti",
      "Crni",
      "Ružičasti",
      "Smeđi",
      "Crni",
    ];
    const randomColor = colors[getRandomInt(colors.length - 1)];

    const animals = [
      "Rakun",
      "Zec",
      "Konj",
      "Mačak",
      "Pas",
      "Lav",
      "Miš",
      "Pauk",
      "Rak",
      "Jelen",
      "Majmun",
      "Nosorog",
      "Slon",
      "Leptir",
      "Mrav",
      "Tigar",
      "Magarac",
      "Skakavac",
      "Dabar"
    ];
    const randomAnimal = animals[getRandomInt(animals.length - 1)];

    return randomColor + " " + randomAnimal;
  }

  useEffect(() => {
    const drone = new window.Scaledrone("SbJE33dI8wwK0axJ", {
      data: {
        name: UsernameRandomizer(),
      },
    });

    drone.on("open", () => {
      setDrone(drone);
      const room = drone.subscribe("observable-room");

      room.on("data", (data, member) => {
        const newMessage = {
          userId: member.id,
          name: member.clientData.name,
          text: data,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });
    });

    return () => {
      drone.close();
    };
  }, []);

  const handleMessageSubmit = (event) => {
    event.preventDefault();
    if (drone && inputValue) {
      drone.publish({
        room: "observable-room",
        message: inputValue,
      });
      setInputValue("");
    }
  };

  console.log(drone);

  return (
    <div className="chat-container">
      <div className="message-container">
        {messages.map((message, index) => (
          <div
            key={index}
            className={
              "message" + (message.userId === drone.clientId ? " my" : "")
            }
          >
            <div className="message-name">{message.name}</div>
            <div className="message-text">{message.text}</div>
          </div>
        ))}
      </div>

      <form onSubmit={handleMessageSubmit} className="input-form">
        <input
          type="text"
          value={inputValue}
          onChange={(event) => setInputValue(event.target.value)}
          className="input-field"
          placeholder="Napiši svoju poruku..."
        />

        <button type="submit" className="send-button">
          Pošalji
        </button>
      </form>
    </div>
  );
};

export default ScaledroneChat;
