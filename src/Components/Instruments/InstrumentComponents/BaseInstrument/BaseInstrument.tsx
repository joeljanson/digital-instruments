import { useState, useEffect, useRef } from "react";
import { ToneAudioBuffer } from "tone";

export interface BaseInstrumentProps {
	buffer?: ToneAudioBuffer | null;
	reversedBuffer?: ToneAudioBuffer | null;
	bufferLoaded?: boolean;
}

// Custom hook for managing audio
export function useBaseInstrument({
	buffer,
	reversedBuffer,
}: BaseInstrumentProps) {
	const bufferRef = useRef<ToneAudioBuffer | null>(null);
	const reversedBufferRef = useRef<ToneAudioBuffer | null>(null);
	const [bufferLoaded, setBufferLoaded] = useState<boolean>(false);

	useEffect(() => {
		// Setup instrument

		preloadAudio();
		// Cleanup
		return () => {
			bufferRef.current?.dispose();
			reversedBufferRef.current?.dispose();
		};
	}, [buffer, reversedBuffer]); // Run only when effectIndex changes

	const preloadAudio = () => {
		const fileUrl = process.env.PUBLIC_URL + "/audio/test-audio.mp3";
		const loadedBuffer = new ToneAudioBuffer({
			url: fileUrl,
			onload: () => {
				//console.log("buffer is loaded in the base instrument", loadedBuffer);
				bufferRef.current = loadedBuffer;
				setBufferLoaded(true);
			},
		});

		const reversedBuffer = new ToneAudioBuffer({
			url: fileUrl,
			onload: () => {
				//console.log("buffer is loaded in the base instrument", reversedBuffer);
				reversedBufferRef.current = reversedBuffer;
				setBufferLoaded(true);
			},
		});
	};
	// other audio logic ...

	return {
		buffer: bufferRef.current,
		reversedBuffer: reversedBufferRef.current,
		bufferLoaded: bufferLoaded,
	};
}
