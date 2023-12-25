import React, { useState, useEffect, useRef } from "react";
import "../../CSS/AudioVideoDropzone.scss";
import { DropzoneOverlay } from "./DropzoneOverlay";

// Define the props interface
interface AudioVideoDropzoneProps {
	onFileDrop: (fileUrl: string) => void;
	parentRef: React.RefObject<HTMLDivElement>;
}

const AudioVideoDropzone: React.FC<AudioVideoDropzoneProps> = ({
	onFileDrop,
	parentRef,
}) => {
	const [highlighted, setHighlighted] = useState(false);

	useEffect(() => {
		const parent = parentRef.current; // Get the current element of the ref

		if (parent) {
			// Attach event listeners to the parent component
			parent.addEventListener("dragover", handleDragOver);
			parent.addEventListener("dragleave", handleDragLeave);
			parent.addEventListener("drop", handleDrop);

			// Cleanup
			return () => {
				parent.removeEventListener("dragover", handleDragOver);
				parent.removeEventListener("dragleave", handleDragLeave);
				parent.removeEventListener("drop", handleDrop);
			};
		}
	}, []);

	const handleDragOver = (e: DragEvent) => {
		e.preventDefault();
		setHighlighted(true);
	};

	const handleDragLeave = (e: DragEvent) => {
		e.preventDefault();
		setHighlighted(false);
	};

	const handleDrop = (e: DragEvent) => {
		e.preventDefault();
		setHighlighted(false);

		console.log("receives the data:", e);

		// First, check if there is any text/plain data (URL) being transferred
		const textData = e.dataTransfer?.getData("text/plain");
		if (textData) {
			// This means an audio buffer URL has been dropped
			// Call the callback function with this URL
			onFileDrop(textData);

			console.log("Audio Buffer URL:", textData);
		} else {
			// If no text/plain data, then check for a file
			const file = e.dataTransfer?.files[0];

			if (file) {
				// Create a URL for the dropped file
				const fileUrl = URL.createObjectURL(file);

				// Call the callback function passed as a prop
				onFileDrop(fileUrl);

				console.log("File URL:", fileUrl);
			}
		}
	};

	return (
		<div ref={parentRef} className={`dropzone`}>
			<DropzoneOverlay isVisible={highlighted} />
			<p>Drag and drop audio/video files here</p>
		</div>
	);
};

export default AudioVideoDropzone;
