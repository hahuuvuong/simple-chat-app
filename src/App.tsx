import React, { useState } from "react";
import Chat from "./components/Chat";
import RoomManager from "./components/RoomManager.tsx";
import "./App.css";

const App: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [isConfirmUserName, setIsConfirmUserName] = useState<boolean>(false);
    const [activeRoom, setActiveRoom] = useState<string | null>(null);

    const handleUsernameSubmit = () => {
        if(username){
            setIsConfirmUserName(true);
        }
    };
    const handleRoomJoin = (room: string) => setActiveRoom(room);

    return (
        <div className="App">
            {!isConfirmUserName ? (
                <div>
                    <h2>Enter Your Username</h2>
                    <input
                        type="text"
                        placeholder="Username"
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <button onClick={handleUsernameSubmit}>Confirm</button>
                </div>
            ) : activeRoom ? (
                <Chat room={activeRoom} username={username} />
            ) : (
                <RoomManager onRoomJoin={handleRoomJoin} />
            )}
        </div>
    );
};

export default App;
