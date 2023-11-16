import classes from "./home.module.css";
import Image from "next/image";
import { getSession } from "next-auth/react";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { FaTrash } from "react-icons/fa";
export default function Home() {
  const [input, setInput] = useState("");
  const [input_id, setInput_id] = useState("");
  const [deletingmsg, setDeletingmsg] = useState(false);
  const [messages, setMessages] = useState([]); // Initialize messages state
  const [name, setName] = useState();

  const router = useRouter();

  function Getmsg(props) {
    setInput_id(props);
    console.log(props);

    fetch(`api/message?input_id=${props}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error fetching messages");
        }
      })
      .then((data) => {
        // Update the messages state with the fetched data
        setMessages(data);
      })
      .catch((error) => {
        console.error("Error fetching messages:", error);
      });
  }

  useEffect(() => {
    getSession().then((session) => {
      if (!session) {
        router.replace("/");
      } else {
        // temp_id = session.user.email;
        setInput_id(session.user.email);
        const emaill = session.user.email;
        const atIndex = emaill.indexOf("@");
        setName(session.user.email.substring(0, atIndex));
        Getmsg(session.user.email);
      }
    });
  }, []);

  async function handleInput(event) {
    event.preventDefault();
    if (input) {
      const response = await fetch("api/message", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ input, input_id }),
      });

      if (response.ok) {
        setInput("");
        Getmsg(input_id); // Fetch messages after adding a new message
      }
    } else {
      console.log("the message is empty");
    }
  }

  function Logouthandler() {
    signOut();
  }

  async function handleDelete(id) {
    setDeletingmsg(true);
    const response = await fetch(`api/message`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      Getmsg(input_id); // Fetch and set the updated messages after deleting a message
    } else {
      console.error("Error deleting message");
    }
    setDeletingmsg(false);
  }
  const messageListRef = useRef(null);
  const scrollToBottom = () => {
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
      console.log("scrolling..");
    }
  };

  useEffect(() => {
    scrollToBottom();
    console.log("useeffect");
  }, [messages]);
  return (
    <>
      <div className={classes.header}>
        <h1>Welcome {name}</h1> <h1>Task List</h1>
        <button onClick={Logouthandler}>Logout</button>
      </div>
      <div className={classes.body}>
        {deletingmsg && <div className={classes.loading}>Deleteing......</div>}
        <div
          className={`${classes.container} ${
            deletingmsg ? classes.containerdelete : ""
          }`}
        >
          <div className={classes.chatContainer} ref={messageListRef}>
            <ul className={classes.messagelist}>
              {Array.isArray(messages) ? (
                messages.map((message) => (
                  <li key={message._id} className={classes.messageitem}>

                    {message.input}
                    <div className={classes.dad}>
                    <div className={classes.date}>

                    {new Date(message.timestamp).toLocaleString()}
                    </div>
                    <button onClick={() => handleDelete(message._id)}>
                      <FaTrash />
                    </button>
                    </div>
                  </li>
                  
                ))
                
              ) : isLoading ? (
                <li>Loading...</li>
              ) : (
                <li>Error loading messages</li>
              )}
            </ul>
          </div>
        </div>
      </div>
      <form onSubmit={handleInput} className={classes.adder}>
        <input
          type="text"
          placeholder="Enter your Task's"
          value={input}
          onChange={(event) => setInput(event.target.value)}
        />
        <button type="submit">+</button>
      </form>
    </>
  );
}
