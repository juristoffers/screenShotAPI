import express from 'express';
import fs from 'fs';
const port = 3000;
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// Firebase
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  query,
  setDoc,
  getDocs,
  where,
  getDoc,
  deleteField,
  arrayUnion,
  arrayRemove,
  updateDoc,
  onSnapshot,
  deleteDoc
} from 'firebase/firestore';

// Firebase config using environment variables
dotenv
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(firebaseApp);

// Example Firestore usage
const docRef = doc(db, "users", "user_id");

// Initialize Express
const app = express();
app.use(express.json());

// Endpoint to fetch and store URL from TradingView
app.get('/tradereview/:identifier', async (req, res) => {
    const identifier = req.params.identifier;
    const pageURL = `https://www.tradingview.com/x/${identifier}/`;

    // Firestore reference to the document "Test" in the "URLs" collection
    const docRef = doc(db, "URLs", "Test");

    try {
        // Append the new URL to the array field
        await updateDoc(docRef, {
            urls: arrayUnion(pageURL)
        });

        // Send the pageURL in the response
        res.send(pageURL);
    } catch (error) {
        console.error("Error updating document: ", error);
        res.status(500).send("Error updating document");
    }
});

//Endpooint that returns the URLs that were added newly 
app.get('/return', async (req, res) => {
    // Firestore reference to the document "Test" in the "URLs" collection
    const docRef = doc(db, "URLs", "Test");
  
    try {
      // Get the document
      const docSnapshot = await getDoc(docRef);
      if (docSnapshot.exists()) {
        // Retrieve the URLs from the document
        const urls = docSnapshot.data().urls;
  
        // Send the URLs in the response
        res.send(urls);
  
        // Delete the URLs array field
        await updateDoc(docRef, {
          urls: deleteField()
        });
      } else {
        res.status(404).send("Document not found");
      }
    } catch (error) {
      console.error("Error retrieving document: ", error);
      res.status(500).send("Error retrieving document");
    }
  });

// Endpoint to retrieve stored URLs
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});