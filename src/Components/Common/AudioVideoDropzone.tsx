import React, { useState } from "react";
import "./AudioVideoDropzone.scss";

// Define the props interface
interface AudioVideoDropzoneProps {
	onFileDrop: (file: File, fileUrl: string) => void;
}

const AudioVideoDropzone: React.FC<AudioVideoDropzoneProps> = ({
	onFileDrop,
}) => {
	const [highlighted, setHighlighted] = useState(false);

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setHighlighted(true);
	};

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setHighlighted(false);
	};

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setHighlighted(false);

		const file = e.dataTransfer.files[0];

		if (file) {
			// Create a URL for the dropped file
			const fileUrl = URL.createObjectURL(file);

			// Call the callback function passed as a prop
			onFileDrop(file, fileUrl);

			console.log("File URL:", fileUrl);
		}
	};

	return (
		<div
			className={`dropzone ${highlighted ? "highlighted" : ""}`}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<p>Drag and drop audio/video files here</p>
		</div>
	);
};

export default AudioVideoDropzone;
