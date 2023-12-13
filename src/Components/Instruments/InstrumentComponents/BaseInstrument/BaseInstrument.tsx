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
	const [bypass, setBypass] = useState(false); // New state

	useEffect(() => {
		// Setup instrument
		const internalOutputChannel = new Channel({
			volume: 0,
			channelCount: 2,
		}).toDestination();
		internalOutputChannel.send("effectsRackIn");
		outputChannelRef.current = internalOutputChannel; // Use ref here
		// Cleanup
		return () => {
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

	return {
		outputChannel: outputChannelRef.current,
		usesBuffer: usesBuffer,
		bypass,
		toggleBypass,
	};
}
