import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

interface InputRecorderProps {
	bufferSourceUpdated: (buffer: string | Tone.ToneAudioBuffer) => void;
}

const InputRecorder: React.FC<InputRecorderProps> = ({
	bufferSourceUpdated,
}) => {
	const [micAccessGranted, setMicAccessGranted] = useState(false);
	const [isRecording, setIsRecording] = useState(false);
	const micRef = useRef<Tone.UserMedia | null>(null);
	const recorderRef = useRef<Tone.Recorder | null>(null);

	useEffect(() => {
		// Initialize the recorder and microphone
		recorderRef.current = new Tone.Recorder();
		micRef.current = new Tone.UserMedia();

		// Cleanup function to close the microphone when the component unmounts
		return () => {
			if (micRef.current) {
				micRef.current.close();
			}
		};
	}, []);

	const enableMic = async () => {
		await Tone.start(); // Start the Tone.js context
		try {
			if (recorderRef.current && micRef.current) {
				await micRef.current.open(); // Request access to the microphone
				setMicAccessGranted(true);
				micRef.current.connect(recorderRef.current); // Connect the microphone to the recorder
			}
		} catch (e) {
			console.error("Microphone access was not granted", e);
		}
	};

	const startRecording = async () => {
		setIsRecording(true);
		if (recorderRef.current) {
			recorderRef.current.start();

			// Stop recording after 10 seconds if the user hasn't released the button
			setTimeout(() => {
				if (isRecording) {
					stopRecording();
				}
			}, 10000);
		}
	};

	const stopRecording = async () => {
		if (!isRecording) {
			return;
		}
		setIsRecording(false);
		if (recorderRef.current) {
			const recording = await recorderRef.current.stop();
			const url = URL.createObjectURL(recording);
			bufferSourceUpdated(url);
		}
	};

	const handleMouseDown = () => {
		if (!micAccessGranted) {
			enableMic();
		} else if (!isRecording) {
			startRecording();
		}
	};

	const handleMouseUp = () => {
		if (isRecording) {
			stopRecording();
		}
	};

	return (
		<div>
			<button onMouseDown={handleMouseDown} onMouseUp={handleMouseUp}>
				{micAccessGranted
					? isRecording
						? "Recording..."
						: "Start and Hold to Record"
					: "Enable Mic"}
			</button>
		</div>
	);
};

export default InputRecorder;
