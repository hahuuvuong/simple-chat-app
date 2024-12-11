import React, {useEffect, useState} from "react";
import Chat from "./components/Chat";
import RoomManager from "./components/RoomManager.tsx";
import "./App.css";
import "./App.scss";
import {useLocation} from "react-router-dom";

const App: React.FC = () => {
    const [username, setUsername] = useState<string>("");
    const [isConfirmUserName, setIsConfirmUserName] = useState<boolean>(false);
    const [activeRoom, setActiveRoom] = useState<string | null>(null);
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const roomFromURL = params.get("room");
        if (!roomFromURL) {
            setActiveRoom("");
        }
    }, [location.search]);

    useEffect(() => {
        const storedUsername = localStorage.getItem("username");
        if (storedUsername) {
            setUsername(storedUsername);
            setIsConfirmUserName(true);
        }
    }, []);

    const handleUsernameSubmit = () => {
        if (username) {
            setIsConfirmUserName(true);
            localStorage.setItem("username", username); // Save username to localStorage
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
                        value={username}
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
