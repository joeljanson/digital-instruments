import React, { useState, useEffect } from "react";
import "./AudioVideoDropzone.scss";

// Define the props interface
interface AudioVideoDropzoneProps {
	onFileDrop: (fileUrl: string) => void;
}

const AudioVideoDropzone: React.FC<AudioVideoDropzoneProps> = ({
	onFileDrop,
}) => {
	const [highlighted, setHighlighted] = useState(false);

	// Attach event listeners to the window
	useEffect(() => {
		window.addEventListener("dragover", handleDragOver);
		window.addEventListener("dragleave", handleDragLeave);
		window.addEventListener("drop", handleDrop);

		// Cleanup
		return () => {
			window.removeEventListener("dragover", handleDragOver);
			window.removeEventListener("dragleave", handleDragLeave);
			window.removeEventListener("drop", handleDrop);
		};
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
		<div className={`dropzone ${highlighted ? "highlighted" : ""}`}>
			<p>Drag and drop audio/video files here</p>
		</div>
	);
};

export default AudioVideoDropzone;
