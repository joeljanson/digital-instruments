import React, { useState, useEffect } from "react";
import "./AudioVideoDropzone.scss";
import AudioVideoDropzone from "./AudioVideoDropzone";
import RadioRecorder from "./RadioRecorder";
import { ToneAudioBuffer } from "tone";
import InputRecorder from "./InputRecorder";
import "./BufferSources.scss";

// Define the props interface
interface AudioVideoDropzoneProps {
	bufferSourceUpdated: (fileUrl: string | ToneAudioBuffer) => void;
}

const BufferSources: React.FC<AudioVideoDropzoneProps> = ({
	bufferSourceUpdated,
}) => {
	return (
		<div className={`buffer-sources submodule-area-wrapper`}>
			<AudioVideoDropzone onFileDrop={bufferSourceUpdated} />
			<RadioRecorder bufferSourceUpdated={bufferSourceUpdated} />
			<InputRecorder bufferSourceUpdated={bufferSourceUpdated} />
			<p>Select a buffer source!</p>
		</div>
	);
};

export default BufferSources;
