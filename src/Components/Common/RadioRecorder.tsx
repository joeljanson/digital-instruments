import React, { useRef, useState } from "react";
import * as Tone from "tone";

// Define the props interface
interface AudioVideoDropzoneProps {
	bufferSourceUpdated: (buffer: string | Tone.ToneAudioBuffer) => void;
}

const RadioRecorder: React.FC<AudioVideoDropzoneProps> = ({
	bufferSourceUpdated,
}) => {
	const [isRecording, setIsRecording] = useState(false);
	const audioRef = useRef<HTMLAudioElement | null>(null);

	// Initializes the recorder
	const recorder = new Tone.Recorder();

	const startRecording = async () => {
		await Tone.start(); // Start the Tone.js context
		console.log("Audio context started");

		// Create an <audio> element dynamically and configure it
		const audio = new Audio();
		audio.crossOrigin = "anonymous";
		audio.src = "http://sverigesradio.se/topsy/direkt/srapi/163.mp3";
		audio.autoplay = true; // Start playing the stream immediately
		audio.controls = true; // Add controls for testing, can be removed later
		audio.style.display = "none"; // Hide the audio element
		document.body.appendChild(audio);
		audioRef.current = audio;

		const channel = new Tone.Channel({
			volume: 0,
			channelCount: 2,
		}).toDestination();

		// Connect the audio element to the Tone.js context
		const source = Tone.context.createMediaElementSource(audio);
		Tone.connect(source, recorder);
		Tone.connect(source, channel);
		recorder.start();

		setIsRecording(true);

		// Set a timer to stop the recording after 5 seconds
		setTimeout(async () => {
			const recording = await recorder.stop();
			const url = URL.createObjectURL(recording); // Convert the Blob to a URL

			// Pass the URL to the prop function
			bufferSourceUpdated(url);

			// Clean up: remove the audio element
			audio.remove();
			channel.dispose();
			setIsRecording(false);
		}, 10000);
	};

	return (
		<div className={`buffer-sources`}>
			<button onClick={startRecording} disabled={isRecording}>
				{isRecording ? "Recording..." : "Record from Sveriges Radio P1"}
			</button>
			{/* Audio element is created dynamically */}
		</div>
	);
};

export default RadioRecorder;
