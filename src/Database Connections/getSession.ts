// firestoreService.js

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebaseService";
import { SessionData, SessionInfo } from "../Session/Session/SessionInterface";

export async function fetchSessionData(sessionId: string) {
	// Get a document reference
	const docRef = doc(db, "defaultSessions", sessionId);

	try {
		// Fetch the document
		const docSnap = await getDoc(docRef);

		// Check if the document exists
		if (docSnap.exists()) {
			// Return the document data
			return docSnap.data() as SessionData;
		} else {
			// Handle the case where the document does not exist
			console.log("No such document!");
			return null;
		}
	} catch (error) {
		// Handle any errors
		console.error("Error fetching document: ", error);
		return null;
	}
}

export async function fetchAllSessionInfos(): Promise<SessionInfo[]> {
	try {
		// Reference to the 'defaultSessions' collection
		const collectionRef = collection(db, "sessionInfos");

		// Get all documents from the collection
		const querySnapshot = await getDocs(collectionRef);

		// Map the documents to extract only the sessionInfo
		const sessionInfos = querySnapshot.docs.map((doc) => ({
			name: doc.data().name,
			category: doc.data().category,
			id: doc.id, // Firestore document ID
		}));

		return sessionInfos;
	} catch (error) {
		console.error("Error fetching session infos: ", error);
		return [];
	}
}