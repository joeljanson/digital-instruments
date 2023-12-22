// AuthService.ts

import {
	signInWithPopup,
	GoogleAuthProvider,
	linkWithCredential,
	AuthCredential,
	signInAnonymously,
	onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../firebaseService";

export const loginWithGoogle = async () => {
	const provider = new GoogleAuthProvider();

	try {
		const currentUser = auth.currentUser;
		const result = await signInWithPopup(auth, provider);

		// Get credential from the Google auth provider
		const credential = GoogleAuthProvider.credentialFromResult(result);

		// Check if we got a valid credential and if the user is anonymous
		if (credential && currentUser && currentUser.isAnonymous) {
			await linkWithCredential(currentUser, credential as AuthCredential);
			console.log("Anonymous account successfully linked with Google");
		} else {
			console.log("User signed in with Google");
		}
	} catch (error) {
		console.error("Error during Google sign-in", error);
	}
};

// Function to handle anonymous user login
export const loginAnonymously = async () => {
	try {
		const userCredential = await signInAnonymously(auth);
		console.log("User signed in anonymously", userCredential.user);
		return userCredential.user;
	} catch (error) {
		console.error("Error signing in anonymously", error);
	}
};

/* onAuthStateChanged(auth, (user) => {
	if (user) {
		// User is signed in, see docs for a list of available properties
		// https://firebase.google.com/docs/reference/js/firebase.User
		console.log("User is signed in:", user);
	} else {
		// User is signed out
		console.log("User is signed out");
	}
}); */
