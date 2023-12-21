import { addDoc, collection, doc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../../Database Connections/firebaseService";

// Your session data
const defaultInstrumentOne = {
	sessionInfo: {
		name: "Divisions",
		id: "",
		category: "sampler",
		imageUrl:
			"https://i.pinimg.com/564x/41/ac/d3/41acd30d3e4d4b892e4d87cc01df5061.jpg",
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
					"https://i.pinimg.com/564x/41/ac/d3/41acd30d3e4d4b892e4d87cc01df5061.jpg",
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
			"https://i.pinimg.com/564x/cd/6d/f6/cd6df6ca1ba496f67f7730a65421ffa0.jpg",
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
					"https://i.pinimg.com/564x/cd/6d/f6/cd6df6ca1ba496f67f7730a65421ffa0.jpg",
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
		imageUrl:
			"https://i.pinimg.com/564x/cd/6d/f6/cd6df6ca1ba496f67f7730a65421ffa0.jpg",
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
				imageUrl:
					"https://i.pinimg.com/564x/cd/6d/f6/cd6df6ca1ba496f67f7730a65421ffa0.jpg",
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
			"defaultSessions",
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
	addNewSessionToFirestore([defaultInstrumentThree]);
}

export async function addNewSessionToFirestore(instruments: any[]) {
	instruments.forEach(async (instrument) => {
		try {
			// Step 1: Add a new document to the 'defaultSessions' collection and get the ID
			const defaultSessionsRef = collection(db, "defaultSessions");
			const docRef = await addDoc(defaultSessionsRef, instrument);
			const newId = docRef.id; // The generated ID

			// Prepare the session info for the 'sessionInfos' collection
			const sessionInfo = {
				name: instrument.sessionInfo.name,
				category: instrument.sessionInfo.category,
				// ... other sessionInfo fields
			};

			// Step 2: Add to the 'sessionInfos' collection
			const sessionInfosRef = doc(db, "sessionInfos", newId);
			await setDoc(sessionInfosRef, sessionInfo);

			console.log(`Document successfully added with ID: ${newId}`);
		} catch (error) {
			console.error("Error in adding new session: ", error);
		}
	});
}
