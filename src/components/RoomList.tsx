import React, { useEffect, useState } from "react";
import { database } from "../configs/firebaseConfig";
import { ref, get, onValue } from "firebase/database";
import {useNavigate} from "react-router-dom";

interface RoomListProps {
    onRoomJoin: (room: string) => void;
}

const RoomList: React.FC<RoomListProps> = ({ onRoomJoin }) => {
    const [rooms, setRooms] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const roomsRef = ref(database, "rooms");

        // Fetch room names in real-time
        const unsubscribe = onValue(roomsRef, (snapshot) => {
            const roomData = snapshot.val();
            const roomNames = roomData ? Object.keys(roomData) : [];
            setRooms(roomNames);
        });

        return () => unsubscribe(); // Cleanup listener on unmount
    }, []);

    const onRoomJoinClick = (room: string ) => {
        navigate(`?room=${room}`);
        onRoomJoin(room);
    }

    return (
        <div>
            <h2>Available Rooms</h2>
            {rooms.length > 0 ? (
                <ul>
                    {rooms.map((room) => (
                        <li key={room}>
                            <button onClick={() => onRoomJoinClick(room)}>
                                Join Room: {room}
                            </button>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No rooms available. Create a new one!</p>
            )}
        </div>
    );
};

export default RoomList;
