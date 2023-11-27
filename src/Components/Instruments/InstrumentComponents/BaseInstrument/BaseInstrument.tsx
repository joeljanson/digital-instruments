import { useState, useEffect, useRef } from "react";
import { Channel, ToneAudioBuffer } from "tone";

export interface BaseInstrumentProps {
	buffer?: ToneAudioBuffer | null;
	reversedBuffer?: ToneAudioBuffer | null;
	outputChannel?: Channel | null;
	bufferLoaded?: boolean;
	usesBuffer?: boolean;
}

// Custom hook for managing audio
export function useBaseInstrument({
	outputChannel,
	usesBuffer,
}: BaseInstrumentProps) {
	const outputChannelRef = useRef<Channel | null>(null);
	const [bufferLoaded, setBufferLoaded] = useState<boolean>(false);

	useEffect(() => {
		// Setup instrument
		console.log("Sets up instrument");

		const internalOutputChannel = new Channel({ volume: 0, channelCount: 2 });
		internalOutputChannel.send("effectsRackIn");
		outputChannelRef.current = internalOutputChannel; // Use ref here

		preloadAudio();
		// Cleanup
		return () => {
			//bufferRef.current?.dispose();
			//reversedBufferRef.current?.dispose();
		};
	}, [bufferLoaded]); // Run only when effectIndex changes

	const bufferSourceUpdated = (bufferUrl: string | ToneAudioBuffer) => {
		console.log("Received file URL in parent component:", bufferUrl);

		setBufferLoaded(false);
		/* bufferRef.current?.dispose();
		reversedBufferRef.current?.dispose(); */
		const loadedBuffer = new ToneAudioBuffer({
			url: bufferUrl,
			onload: () => {
				console.log("buffer is updated", loadedBuffer);
				/* bufferRef.current = loadedBuffer; */
				const reversedBuffer = new ToneAudioBuffer({
					url: bufferUrl,
					onload: () => {
						console.log("buffer is updated", reversedBuffer);
						/* reversedBufferRef.current = reversedBuffer; */
						setBufferLoaded(true);
					},
				});
			},
		});

		// Do something with the file and URL
	};

	const preloadAudio = () => {
		const fileUrl = process.env.PUBLIC_URL + "/audio/test-audio.mp3";

		const loadedBuffer = new ToneAudioBuffer({
			url: fileUrl,
			onload: () => {
				console.log("buffer is loaded in the base instrument", loadedBuffer);
				/* bufferRef.current = loadedBuffer; */
				const reversedBuffer = new ToneAudioBuffer({
					url: fileUrl,
					onload: () => {
						console.log(
							"buffer is loaded in the base instrument",
							reversedBuffer
						);
						/* reversedBufferRef.current = reversedBuffer; */
						setBufferLoaded(true);
					},
				});
			},
		});
	};
	// other audio logic ...

	return {
		outputChannel: outputChannelRef.current,
		bufferLoaded: bufferLoaded,
		usesBuffer: usesBuffer,
		bufferSourceUpdated,
	};
}
