import React from "react";
import ChatRoom from "./ChatRoom";

interface ChatProps {
    room: string;
    username: string;
}

const Chat: React.FC<ChatProps> = ({ room, username }) => {
    return (
        <div>
            <h2>Welcome, {username}</h2>
            <ChatRoom room={room} username={username} />
        </div>
    );
};

export default Chat;
