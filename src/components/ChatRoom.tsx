import React, { useEffect, useRef, useState } from "react";
import { database } from "../configs/firebaseConfig";
import { ref as dbRef, onValue, push } from "firebase/database";
import { useNavigate } from "react-router-dom";

interface ChatRoomProps {
    room: string;
    username: string;
}

interface IMessage {
    username: string;
    text: string;
    timestamp: string;
    fileBase64?: string;
    fileName?: string;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ room, username }) => {
    const [messages, setMessages] = useState<IMessage[]>([]);
    const [input, setInput] = useState<string>("");
    const [file, setFile] = useState<File | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const navigate = useNavigate();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

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

    const convertFileToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    const sendMessage = async () => {
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
                try {
                    const base64String = await convertFileToBase64(file);
                    console.log("base64String", base64String);
                    newMessage.fileBase64 = base64String;
                    newMessage.fileName = file.name;
                } catch (error) {
                    console.error("File conversion error:", error);
                    return;
                }
                setFile(null);
                if (fileInputRef.current) {
                    fileInputRef.current!.value = "";
                }
            }

            push(messagesRef, newMessage);
            setInput("");
        }
    };

    const handleBack = () => {
        navigate("/"); // Navigate back to the room list
    };


    const onFileSelect = (e: any) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            if (selectedFile.size >  1024 * 1024) {
                alert("File size exceeds 1MB. Please select a smaller file.");
                e.target.value = "";
            } else {
                setFile(selectedFile);
            }
        }
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
                        {message.fileBase64 && (
                            <p>
                                <a href={message.fileBase64} target="_blank" rel="noopener noreferrer">
                                    <span role="img" aria-label="file-icon">📎</span> {message.fileName}
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
                    ref={fileInputRef}
                    onChange={(e) => onFileSelect(e)}
                />
                <button onClick={sendMessage}>Send</button>
            </div>
        </div>
    );
};

export default ChatRoom;
