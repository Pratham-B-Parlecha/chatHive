import { useContext, useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../firebase.js";
import { AuthContext } from "../store/AuthContext.jsx";
import { UserContext } from "../store/userContext.jsx";

export default function Chat() {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const { dispatcherFn } = useContext(UserContext);
  useEffect(() => {
    function getData() {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    }
    currentUser && currentUser.uid && getData();
  }, [currentUser && currentUser.uid]);
  function handleUserClick(user) {
    dispatcherFn({ type: "SWITCH_USER", payload: user });
  }
  return (
    <div className="chat">
      {Object.entries(chats)?.sort((a,b) => b[1].date - a[1].date).map((chat) => (
        <div
          className="userChat"
          key={chat[0]}
          onClick={() => handleUserClick(chat[1].userInfo)}
        >
          <img src={chat[1].userInfo.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{chat[1].userInfo.displayName}</span>
            <p>{chat[1].lastMessage?.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
