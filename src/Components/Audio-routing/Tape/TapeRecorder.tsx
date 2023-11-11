import React, { useState, useEffect, useRef } from "react";
import * as Tone from "tone";

import bufferToWav from "audiobuffer-to-wav";

interface ChannelRecorderProps {
	bufferSourceUpdated: (buffer: string | Tone.ToneAudioBuffer) => void;
}

const TapeRecorder: React.FC<ChannelRecorderProps> = ({
	bufferSourceUpdated,
}) => {
	const [isRecording, setIsRecording] = useState(false);
	const recorderRef = useRef<Tone.Recorder | null>(null);
	const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
	const recordedUrl = useRef<string>("");

	useEffect(() => {
		recorderRef.current = new Tone.Recorder();

		return () => {
			if (recordingTimeoutRef.current) {
				clearTimeout(recordingTimeoutRef.current);
			}
		};
	}, []);

	const toggleRecording = async () => {
		// Start Recording
		if (!isRecording) {
			if (recorderRef.current) {
				setIsRecording(true);
				const tapeMachineOutChannel = new Tone.Channel({
					volume: 0,
					channelCount: 2,
				});
				tapeMachineOutChannel.receive("tapeMachineOut");
				tapeMachineOutChannel.connect(recorderRef.current);
				// Assuming tapeMachineOutChannel is somehow receiving audio to record
				// You might need to set up the connection here or somewhere appropriate

				recorderRef.current.start();

				// Set a timeout to stop recording after 5 minutes
				recordingTimeoutRef.current = setTimeout(() => {
					if (isRecording) {
						stopRecording();
					}
				}, 5 * 60 * 1000); // 5 minutes in milliseconds
			}
		}
		// Stop Recording
		else {
			stopRecording();
		}
	};

	const stopRecording = async () => {
		if (!isRecording) {
			return;
		}
		if (recorderRef.current) {
			setIsRecording(false);
			const recording = await recorderRef.current.stop();
			console.log("Recording stopped");
			const url = URL.createObjectURL(recording);
			recordedUrl.current = url;
			//bufferSourceUpdated(url);
			/* const player = new Tone.Player({
				url: url,
				autostart: true,
				loop: true,
			});
			player.toDestination(); */

			if (recordingTimeoutRef.current) {
				clearTimeout(recordingTimeoutRef.current);
			}
		}
	};

	const handleDragStart = (e: React.DragEvent) => {
		// Assuming 'audioBufferUrl' is the state or ref holding your Blob URL
		// You can also pass other types of data as needed
		e.dataTransfer.setData("text/plain", recordedUrl.current);
	};

	const downloadRecording = () => {
		if (recordedUrl.current) {
			const buffer = new Tone.ToneAudioBuffer({
				url: recordedUrl.current,
				onload: (loadedBuffer) => {
					console.log("Loaded for download!");
					const audioBuffer = loadedBuffer!.get();
					if (audioBuffer) {
						const wavBuffer = bufferToWav(audioBuffer);
						const blob = new Blob([wavBuffer], { type: "audio/wav" });
						const url = window.URL.createObjectURL(blob);

						const link = document.createElement("a");
						link.href = url;
						link.download = "recording.wav";
						document.body.appendChild(link);
						link.click();
						document.body.removeChild(link);

						// Cleanup the URL object
						window.URL.revokeObjectURL(url);
					}
				},
			});
		}
	};

	return (
		<div>
			<button onClick={toggleRecording} draggable onDragStart={handleDragStart}>
				{isRecording ? "Stop Recording" : "Start Recording"}
			</button>

			<button onClick={downloadRecording}>Download Recording</button>
		</div>
	);
};

export default TapeRecorder;
