import React from "react";

interface ChatRoomsListProps {
    rooms: string[];
    onJoinRoom: (room: string) => void;
}

const ChatRoomsList: React.FC<ChatRoomsListProps> = ({ rooms, onJoinRoom }) => {
    return (
        <div>
            <h2>Chat Rooms</h2>
            <ul>
                {rooms.map((room) => (
                    <li key={room}>
                        <button onClick={() => onJoinRoom(room)}>Join {room}</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ChatRoomsList;
