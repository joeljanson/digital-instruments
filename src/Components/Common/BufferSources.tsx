import React, { useState, useEffect } from "react";
import "../CSS/AudioVideoDropzone.scss";
import AudioVideoDropzone from "./AudioVideoDropzone";
import RadioRecorder from "./RadioRecorder";
import { ToneAudioBuffer } from "tone";
import InputRecorder from "./InputRecorder";
import "../CSS/BufferSources.scss";

// Define the props interface
interface AudioVideoDropzoneProps {
	bufferSourceUpdated: (fileUrl: string | ToneAudioBuffer) => void;
	parentRef: React.RefObject<HTMLDivElement>;
}

const BufferSources: React.FC<AudioVideoDropzoneProps> = ({
	bufferSourceUpdated,
	parentRef,
}) => {
	return (
		<div className={`buffer-sources submodule-area-wrapper`}>
			<AudioVideoDropzone
				parentRef={parentRef}
				onFileDrop={bufferSourceUpdated}
			/>
			<RadioRecorder bufferSourceUpdated={bufferSourceUpdated} />
			<InputRecorder bufferSourceUpdated={bufferSourceUpdated} />
			<p>Select a buffer source!</p>
		</div>
	);
};

export default BufferSources;
