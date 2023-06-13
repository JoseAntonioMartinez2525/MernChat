import { useEffect, useState, useContext, useRef } from "react";
import Avatar from "./Avatar";
import Logo from "./Logo";
import { UserContext } from "./UserContext";
import axios from "axios";

export default function Chat() {
  const [ws, setWs] = useState(null);
  const [onlinePeople, setOnlinePeople] = useState({});
  const [offlinePeople, setOfflinePeople] = useState({});
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [newMessageText, setNewMessageText] = useState('');
  const [messages, setMessages] = useState([]);
  const { username, id, setId, setUsername } = useContext(UserContext);
  const divUnderMessages = useRef();

  useEffect(() => {
    const webSocket = new WebSocket("ws://localhost:4000");
    setWs(webSocket);
  }, []);

  useEffect(() => {
    if (ws) {
      ws.addEventListener('message', handleMessage);
    }

    return () => {
      if (ws) {
        ws.removeEventListener('message', handleMessage);
      }
    };
  }, );

  function handleMessage(ev) {
    const messageData = JSON.parse(ev.data);
    console.log({ ev, messageData });
    if ('online' in messageData) {
      showOnlinePeople(messageData.online);
    } else{
       setMessages(prev => ([...prev, {isOur:false,text:messageData.text}]));
    }
  }

  function showOnlinePeople(peopleArray) {
    const people = {};
    peopleArray.forEach(({ userId, username }) => {
      people[userId] = username;
    });
    setOnlinePeople(people);
  }

  function sendMessage(ev) {
    if (ev) ev.preventDefault();
    ws.send(JSON.stringify({
      recipient: selectedUserId,
      text: newMessageText,
    }));
    setNewMessageText('');
    setMessages(prev =>([...prev,{text: newMessageText, isOu:true}]));
  }

  const onlinePeopleExclOurUser = { ...onlinePeople };
  delete onlinePeopleExclOurUser[id];

  return (
    <div className="flex h-screen">
      <div className="bg-white w-1/3">
        <Logo />
        {Object.keys(onlinePeopleExclOurUser).map(userId => (
          <div
            onClick={() => setSelectedUserId(userId)}
            className={"border-b border-gray-100 flex items-center gap-2 cursor-pointer hover:bg-blue-50 "}
            key={userId}
          >
            {userId === selectedUserId && (
              <div className="w-1 bg-blue-500 h-12 round-r-md"></div>
            )}
            <div className="flex gap-2 py-2 pl-4 items-center">
              <Avatar username={onlinePeople[userId]} userId={userId} />
              <span className="text-gray-800">{onlinePeople[userId]}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col bg-blue-50 w-2/3 p-2">
        <div className="flex-grow">
          {!selectedUserId && (
            <div className="flex h-full items-center justify-center">
              <div className="text-gray-400">
                &larr; Selecciona a una persona de la barra lateral</div>
            </div>
          )}
          {!!selectedUserId &&(
            <div>
              {messages.map(message => (
                <div>
                  {message.text}
                </div>
              ))}
            </div>
          )}
        </div>
        {!!selectedUserId && (
          <form className="flex gap-2" onSubmit={sendMessage}>
            <input
              type="text"
              value={newMessageText}
              onChange={ev => setNewMessageText(ev.target.value)}
              placeholder="Escriba su mensaje aquí"
              className="bg-white flex-grow border p-2 rounded-sm"
            />
            <button type="submit" className="bg-blue-500 p-2 text-white rounded-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                />
              </svg>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
