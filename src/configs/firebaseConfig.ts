import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    databaseURL: "https://tesst-4a0ad-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "tesst-4a0ad",
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);
