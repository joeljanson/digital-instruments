import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	setDoc,
	updateDoc,
} from "firebase/firestore";
import { db } from "../../Database Connections/firebaseService";
import {
	publicDefaultSessions,
	publicSessionInfos,
} from "../../Database Connections/paths";

// Your session data
const defaultInstrumentOne = {
	sessionInfo: {
		name: "Divisions",
		id: "",
		category: "sampler",
		imageUrl:
			"https://i.pinimg.com/564x/64/ed/69/64ed69f86a7cd9e4c796d25e9582911a.jpg",
	},
	sessionData: {
		sequencerChainData: {
			chain1: [
				{ name: "input", type: "all" }, // Cast to specific type,
				{
					name: "stepsequencer",
					subdivision: "16n",
				},
				{ name: "output", output: "SEQUENCER_EVENT" },
			],
		},
		instrumentChainData: [
			{
				name: "divisions",
				loopDuration: 0,
				usesBuffer: true,
				imageUrl:
					"https://i.pinimg.com/564x/64/ed/69/64ed69f86a7cd9e4c796d25e9582911a.jpg",
			},
		],
		effectChainData: [
			{
				name: "delay",
				displayName: "Delay",
				delayTime: 0.5,
				bypassed: true,
			},
			{ name: "convolver", displayName: "Conputer", bypassed: true },
			{
				name: "distortion",
				displayName: "Distortion",
				bypassed: true,
			},
		],
	},
};

const defaultInstrumentTwo = {
	sessionInfo: {
		name: "Gran dame",
		id: "",
		category: "sampler",
		imageUrl:
			"https://i.pinimg.com/564x/60/8a/cf/608acff0dc0f7f004fe42b005d630d1b.jpg",
	},
	sessionData: {
		sequencerChainData: {
			chain1: [
				{ name: "input", type: "all" }, // Cast to specific type,
				{
					name: "chordcreator",
					chords: [
						{ note: 0, voicing: [0, 2, 4, 7, 11] },
						{ note: 2, voicing: [0, 2, 3, 7, 10] },
						{ note: 4, voicing: [0, 2, 3, 7, 10] },
						{ note: 5, voicing: [0, 2, 4, 7, 11] },
						{ note: 7, voicing: [0, 2, 4, 7, 10] },
						{ note: 9, voicing: [0, 2, 3, 7, 10] },
						{ note: 11, voicing: [0, 2, 3, 6, 10] },
						{ note: 1, voicing: [0, 2, 3, 6, 9] },
						{ note: 3, voicing: [0, 2, 3, 6, 10] },
						{ note: 6, voicing: [0, 2, 3, 6, 9] },
						{ note: 8, voicing: [0, 2, 3, 7, 10] },
						{ note: 10, voicing: [0, 2, 4, 7, 11] },
					],
				},
				{ name: "output", output: "SEQUENCER_EVENT" },
			],
		},
		instrumentChainData: [
			{
				name: "grandame",
				loopDuration: 0,
				usesBuffer: true,
				imageUrl:
					"https://i.pinimg.com/564x/60/8a/cf/608acff0dc0f7f004fe42b005d630d1b.jpg",
			},
		],
		effectChainData: [
			{
				name: "delay",
				displayName: "Delay",
				delayTime: 0.5,
				bypassed: true,
			},
			{ name: "convolver", displayName: "Conputer", bypassed: true },
			{
				name: "distortion",
				displayName: "Distortion",
				bypassed: true,
			},
		],
	},
};

const defaultInstrumentThree = {
	sessionInfo: {
		name: "Looking synth",
		id: "",
		category: "synth",
		imageUrl: "",
	},
	sessionData: {
		sequencerChainData: {
			chain1: [
				{ name: "input", type: "all" }, // Cast to specific type,
				{
					name: "chordcreator",
					chords: [
						{ note: 0, voicing: [0, 2, 4, 7, 11] },
						{ note: 2, voicing: [0, 2, 3, 7, 10] },
						{ note: 4, voicing: [0, 2, 3, 7, 10] },
						{ note: 5, voicing: [0, 2, 4, 7, 11] },
						{ note: 7, voicing: [0, 2, 4, 7, 10] },
						{ note: 9, voicing: [0, 2, 3, 7, 10] },
						{ note: 11, voicing: [0, 2, 3, 6, 10] },
						{ note: 1, voicing: [0, 2, 3, 6, 9] },
						{ note: 3, voicing: [0, 2, 3, 6, 10] },
						{ note: 6, voicing: [0, 2, 3, 6, 9] },
						{ note: 8, voicing: [0, 2, 3, 7, 10] },
						{ note: 10, voicing: [0, 2, 4, 7, 11] },
					],
				},
				{ name: "output", output: "SEQUENCER_EVENT" },
			],
		},
		instrumentChainData: [
			{
				name: "testinstrument",
				loopDuration: 0,
				usesBuffer: true,
			},
		],
		effectChainData: [
			{
				name: "delay",
				displayName: "Delay",
				delayTime: 0.5,
				bypassed: false,
			},
			{ name: "convolver", displayName: "Conputer", bypassed: false },
		],
	},
};

export async function updateSessionInFirestore() {
	try {
		// Reference to the existing document in 'defaultSessions' collection
		const sessionRef = doc(
			db,
			publicDefaultSessions,
			defaultInstrumentOne.sessionInfo.id
		);

		// Update the document with 'sessionData'
		await updateDoc(sessionRef, defaultInstrumentOne);

		console.log("Document successfully updated!");
	} catch (error) {
		console.error("Error updating document: ", error);
	}
}

export async function addInstruments() {
	try {
		await deleteAllSessionData();
		addNewSessionToFirestore([
			defaultInstrumentOne,
			defaultInstrumentTwo,
			defaultInstrumentThree,
		]);
	} catch (error) {
		console.log("Could not delete and therefore not create new instruments");
	}
}

export async function deleteAllSessionData() {
	try {
		// Paths to the collections
		const publicDefaultSessionsPath = "public/sessions/defaultSessions";
		const publicSessionInfosPath = "public/sessions/sessionInfos";

		// Delete documents in 'publicDefaultSessions'
		const defaultSessionsRef = collection(db, publicDefaultSessionsPath);
		const defaultSessionsSnapshot = await getDocs(defaultSessionsRef);
		defaultSessionsSnapshot.forEach(async (doc) => {
			await deleteDoc(doc.ref);
		});

		// Delete documents in 'publicSessionInfos'
		const sessionInfosRef = collection(db, publicSessionInfosPath);
		const sessionInfosSnapshot = await getDocs(sessionInfosRef);
		sessionInfosSnapshot.forEach(async (doc) => {
			await deleteDoc(doc.ref);
		});

		console.log("All session data deleted successfully");
	} catch (error) {
		console.error("Error in deleting session data: ", error);
	}
}

export async function addNewSessionToFirestore(instruments: any[]) {
	instruments.forEach(async (instrument) => {
		try {
			// Step 1: Add a new document to the 'defaultSessions' collection and get the ID
			const defaultSessionsRef = collection(db, publicDefaultSessions);
			const docRef = await addDoc(defaultSessionsRef, instrument);
			const newId = docRef.id; // The generated ID

			// Prepare the session info for the 'sessionInfos' collection
			const sessionInfo = {
				name: instrument.sessionInfo.name,
				category: instrument.sessionInfo.category,
				imageUrl: instrument.sessionInfo.imageUrl,
				// ... other sessionInfo fields
			};

			// Step 2: Add to the 'sessionInfos' collection
			const sessionInfosRef = doc(db, publicSessionInfos, newId);
			await setDoc(sessionInfosRef, sessionInfo);

			console.log(`Document successfully added with ID: ${newId}`);
		} catch (error) {
			console.error("Error in adding new session: ", error);
		}
	});
}
