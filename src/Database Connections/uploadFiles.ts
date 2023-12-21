import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseService";
import { getAuth } from "firebase/auth";

// Function to upload an audio file
export const uploadAudioFile = async (
	file: Blob,
	fileName: string
): Promise<string> => {
	const auth = getAuth();
	const user = auth.currentUser;

	if (!user) {
		throw new Error("No user logged in");
	}

	// Create a storage reference
	const filePath = `userData/users/${user.uid}/audio/${fileName}`;
	const storageRef = ref(storage, filePath);

	try {
		// Upload the file
		await uploadBytes(storageRef, file);

		// Get and return the download URL
		const url = await getDownloadURL(storageRef);
		return url;
	} catch (error) {
		throw error;
	}
};

// Example usage
// const file = //... get your file Blob, e.g., from an <input> element
// const fileName = "myAudio.mp3";
// uploadAudioFile(file, fileName)
//   .then(url => console.log("File uploaded, URL:", url))
//   .catch(error => console.error("Error uploading file:", error));
