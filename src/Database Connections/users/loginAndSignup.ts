// AuthService.ts

import {
	GoogleAuthProvider,
	signInAnonymously,
	linkWithPopup,
	updateProfile,
} from "firebase/auth";
import { auth } from "../firebaseService";

const googleProvider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
	try {
		// Link the anonymous account with Google
		const result = await linkWithPopup(auth.currentUser!, googleProvider);
		console.log(result);
		// Fetch the updated user information
		const updatedUser = auth.currentUser;
		console.log("Linked account:", updatedUser);
		console.log(updatedUser?.providerData[0].displayName);

		if (auth.currentUser) {
			await updateProfile(auth.currentUser, {
				displayName: updatedUser?.providerData[0].displayName,
			});

			console.log("Updated user profile:", auth.currentUser.displayName);
			return auth.currentUser;
		}
		return null;
	} catch (error) {
		console.error("Error during account linking: ", error);
		return null;
	}
};

// Call signInWithGoogle() when the user clicks on Google Sign-In button

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
