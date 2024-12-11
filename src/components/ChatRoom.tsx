import React, { useEffect, useRef, useState } from "react";
import { database, storage } from "../configs/firebaseConfig";
import { ref as dbRef, onValue, push, set } from "firebase/database";
import { ref as storageRef, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useNavigate } from "react-router-dom";

interface ChatRoomProps {
    room: string;
    username: string;
}

interface IMessage {
    username: string;
    text: string;
    timestamp: string;
    fileUrl?: string;
    fileName?: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ room, username }) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [input, setInput] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const messagesRef = dbRef(database, `rooms/${room}/messages`);
        const unsubscribe = onValue(messagesRef, (snapshot) => {
            const data = snapshot.val();
            const messageList = data
                ? Object.values(data).map((msg: any) => (msg))
                : [];
            setMessages(messageList as IMessage[]);
        });

        return () => unsubscribe();
    }, [room]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current!.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    const sendMessage = () => {
        if (input.trim() || file) {
            const currentDate = new Date();
            const formattedTimestamp = currentDate.toLocaleString();
            const messagesRef = dbRef(database, `rooms/${room}/messages`);

            const newMessage: Partial<IMessage> = {
                username,
                text: input.trim() || "",
                timestamp: formattedTimestamp,
            };

            if (file) {
                const fileRef = storageRef(storage, `rooms/${room}/${file.name}`);
                const uploadTask = uploadBytesResumable(fileRef, file);

                uploadTask.on(
                    "state_changed",
                    null,
                    (error) => console.error("File upload error:", error),
                    async () => {
                        const downloadUrl = await getDownloadURL(fileRef);
                        newMessage.fileUrl = downloadUrl;
                        newMessage.fileName = file.name;

                        push(messagesRef, newMessage);
                        setFile(null);
                        setInput("");
                    }
                );
            } else {
                push(messagesRef, newMessage);
                setInput("");
            }
        }
    };

    const handleBack = () => {
        navigate("/"); // Navigate back to the room list
    };

    return (
        <div className="chat-container">
            <h2>Room: {room}</h2>
            <button className="back-button" onClick={handleBack}>Back to Room List</button>
            <div className="message-list" id="message-list">
                {messages.map((message, index) => (
                    <div key={index} className="message">
                        <p>
                            <strong>{message.username}:</strong> {message.text}
                            <span className="timestamp"> ({message.timestamp})</span>
                        </p>
                        {message.fileUrl && (
                            <p>
                                <a href={message.fileUrl} target="_blank" rel="noopener noreferrer">
                                    {message.fileName}
                                </a>
                            </p>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="input-area">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type a message..."
                />
                <input
                    type="file"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;
