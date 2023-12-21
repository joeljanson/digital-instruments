import { useState, useEffect, useRef } from "react";
import { Channel, ToneAudioBuffer, ToneAudioBuffers } from "tone";
import { fetchDownloadURL } from "../../../../Database Connections/getFiles";
import { BaseInstrumentDef } from "../InstrumentComponentInterfaces";

export interface BaseInstrumentProps extends BaseInstrumentDef {
	buffer?: ToneAudioBuffer | null;
	outputChannel?: Channel | null;
}

// Custom hook for managing audio
export function useBaseInstrument({ usesBuffer }: BaseInstrumentProps) {
	const outputChannelRef = useRef<Channel | null>(null);
	const bufferRef = useRef<ToneAudioBuffer | null>(null);
	const [bypass, setBypass] = useState(false); // New state
	const [buffers, setBuffers] = useState<ToneAudioBuffer | null>(null);

	useEffect(() => {
		// Setup instrument
		const internalOutputChannel = new Channel({
			volume: 0,
			channelCount: 2,
		}).toDestination();
		internalOutputChannel.send("effectsRackIn");
		outputChannelRef.current = internalOutputChannel; // Use ref here
		preloadAudio();
		// Cleanup
		return () => {
			internalOutputChannel.dispose();
			outputChannelRef.current?.dispose();
		};
	}, []); // Run only when effectIndex changes

	const toggleBypass = () => {
		if (bypass) {
			outputChannelRef.current?.volume.linearRampTo(0, 0.1);
		} else {
			outputChannelRef.current?.volume.linearRampTo(-Infinity, 0.1);
		}
		setBypass(!bypass);
	};

	const bufferSourceUpdated = (bufferUrl: string | ToneAudioBuffer) => {
		console.log("Received file URL in parent component:", bufferUrl);

		bufferRef.current?.dispose();
		const loadedBuffer = new ToneAudioBuffer({
			url: bufferUrl,
			onload: () => {
				console.log("buffer is loaded", loadedBuffer);
				bufferRef.current = loadedBuffer;
				setBuffers(bufferRef.current);
				//setBufferUpdates(bufferUpdates + 1);
			},
		});
	};

	const preloadAudio = async () => {
		const filePath = "public/defaultAudio/tombolacello.mp3"; // File path

		try {
			const url = await fetchDownloadURL(filePath);
			const loadedBuffer = new ToneAudioBuffer({
				url: url,
				onload: () => {
					console.log("buffer is loaded", loadedBuffer);
					bufferRef.current = loadedBuffer;
					setBuffers(bufferRef.current);
				},
			});
		} catch (error) {
			console.error("Error fetching audio URL:", error);
		}
		/* const filePath = process.env.PUBLIC_URL + "/audio/4.wav";
		const loadedBuffer = new ToneAudioBuffer({
			url: filePath,
			onload: () => {
				console.log("buffer is loaded", loadedBuffer);
				bufferRef.current = loadedBuffer;
				setBuffers(bufferRef.current);
			},
		}); */
	};

	return {
		outputChannel: outputChannelRef.current,
		usesBuffer: usesBuffer,
		buffer: buffers,
		bypass,
		toggleBypass,
		bufferSourceUpdated,
	};
}
