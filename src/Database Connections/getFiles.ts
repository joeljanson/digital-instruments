import { ref, getDownloadURL } from "firebase/storage";
import { storage } from "./firebaseService";

export const fetchDownloadURL = async (filePath: string) => {
	const storageRef = ref(storage, filePath);
	try {
		const url = await getDownloadURL(storageRef);
		return url;
	} catch (error) {
		throw error;
	}
};
