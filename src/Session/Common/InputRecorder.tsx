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
	const isRecordingRef = useRef(false);
	const micRef = useRef<Tone.UserMedia | null>(null);
	const recorderRef = useRef<Tone.Recorder | null>(null);

	useEffect(() => {
		// Initialize the recorder and microphone
		recorderRef.current = new Tone.Recorder();
		micRef.current = new Tone.UserMedia();

		// Add a global mouseup listener
		const handleGlobalMouseUp = () => {
			if (isRecordingRef.current) {
				stopRecording();
			}
		};

		window.addEventListener("mouseup", handleGlobalMouseUp);

		// Cleanup function to close the microphone when the component unmounts
		return () => {
			window.removeEventListener("mouseup", handleGlobalMouseUp);
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
		isRecordingRef.current = true;
		setIsRecording(true);
		if (recorderRef.current) {
			recorderRef.current.start();

			// Stop recording after 10 seconds if the user hasn't released the button
			setTimeout(() => {
				console.log("timeout is run");
				if (isRecordingRef.current) {
					stopRecording();
				}
			}, 10000);
		}
	};

	const stopRecording = async () => {
		if (!isRecordingRef.current) {
			return;
		}
		isRecordingRef.current = false;
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
		} else if (!isRecordingRef.current) {
			startRecording();
		}
	};

	return (
		<div>
			<button onMouseDown={handleMouseDown}>
				{micAccessGranted
					? isRecordingRef.current
						? "Recording..."
						: "Start and Hold to Record"
					: "Enable Mic"}
			</button>
		</div>
	);
};

export default InputRecorder;
