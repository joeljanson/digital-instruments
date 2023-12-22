// firestoreService.js

import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "./firebaseService";
import { SessionData, SessionInfo } from "../Session/Session/SessionInterface";
import { publicDefaultSessions, publicSessionInfos } from "./paths";

export async function fetchSessionData(sessionId: string) {
	// Get a document reference
	const docRef = doc(db, publicDefaultSessions, sessionId);

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
		const collectionRef = collection(db, publicSessionInfos);

		// Get all documents from the collection
		const querySnapshot = await getDocs(collectionRef);

		// Map the documents to extract only the sessionInfo
		const sessionInfos = querySnapshot.docs.map((doc) => ({
			name: doc.data().name,
			category: doc.data().category,
			id: doc.id, // Firestore document ID
			imageUrl: doc.data().imageUrl
				? doc.data().imageUrl
				: "https://i.pinimg.com/564x/6f/c5/e4/6fc5e41e71b3307cbb37da48ad4d6491.jpg",
		}));

		return sessionInfos;
	} catch (error) {
		console.error("Error fetching session infos: ", error);
		return [];
	}
}
