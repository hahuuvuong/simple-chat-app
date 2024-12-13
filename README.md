# Chat Application - React + TypeScript + Firebase

This project is a simple chat application built with React, TypeScript, and Firebase. It supports real-time messaging, file uploads, and room-based chats.

## Features

- Real-time messaging using Firebase Realtime Database.
- File sharing with support for files encoded in Base64.
- Room-based chat functionality.
- File size validation (alerts if file size exceeds 1MB).

## Firebase Setup

1. Add your Firebase configuration to `src/configs/firebaseConfig.ts`:
   ```typescript
   import { initializeApp } from "firebase/app";
   import { getDatabase } from "firebase/database";
   import { getStorage } from "firebase/storage";

   const firebaseConfig = {
       databaseURL: "YOUR_DATABASE_URL",
       projectId: "YOUR_PROJECT_ID",
   };

   const app = initializeApp(firebaseConfig);
   export const database = getDatabase(app);
   export const storage = getStorage(app);
