import React, { useEffect, useState } from "react";
import { database } from "../configs/firebaseConfig";
import { ref, onValue, push } from "firebase/database";

interface ChatRoomProps {
    room: string;
    username: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ room, username }) => {
    const [messages, setMessages] = useState<{ username: string; text: string }[]>([]);
    const [input, setInput] = useState<string>("");

    useEffect(() => {
        const messagesRef = ref(database, `rooms/${room}/messages`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const messageList = data
                ? Object.values(data).map((msg: any) => ({ username: msg.username, text: msg.text }))
                : [];
            setMessages(messageList);
        });

        return () => unsubscribe();
    }, [room]);

    const sendMessage = () => {
        if (input.trim()) {
            const messagesRef = ref(database, `rooms/${room}/messages`);
            push(messagesRef, { username, text: input });
            setInput("");
        }
    };

    return (
        <div>
            <h2>Room: {room}</h2>
            <div>
                {messages.map((message, index) => (
                    <p key={index}>
                        <strong>{message.username}:</strong> {message.text}
                    </p>
                ))}
            </div>
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default ChatRoom;
