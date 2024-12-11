import React, {useEffect, useState} from "react";
import { database } from "../configs/firebaseConfig";
import { ref, get, set } from "firebase/database";
import {useLocation, useNavigate} from "react-router-dom";
import RoomList from "./RoomList.tsx";

interface RoomManagerProps {
    onRoomJoin: (room: string) => void;
}

const RoomManager: React.FC<RoomManagerProps> = ({ onRoomJoin }) => {
    const [newRoomName, setNewRoomName] = useState<string>("");
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const roomFromURL = params.get("room");
        if (roomFromURL) {
            onRoomJoin(roomFromURL);
        }
    }, [location.search, onRoomJoin]);

    const handleRoomCreationOrJoin = async () => {
        if (!newRoomName.trim()) {
            alert("Room name cannot be empty!");
            return;
        }

        const roomRef = ref(database, `rooms/${newRoomName}`);

        try {
            const snapshot = await get(roomRef);
            if (!snapshot.exists()) {
                await set(roomRef, { messages: {} });
            }
            navigate(`?room=${newRoomName}`);
            onRoomJoin(newRoomName); // Join the room
        } catch (error) {
            console.error("Error checking or creating room:", error);
        }
    };

    return (
        <div>
            <h2>Create or Join a Room</h2>
            <input
                type="text"
                placeholder="Enter room name"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
            />
            <button onClick={handleRoomCreationOrJoin}>Create/Join Room</button>
            <RoomList onRoomJoin={onRoomJoin} />
        </div>
    );
};

export default RoomManager;
