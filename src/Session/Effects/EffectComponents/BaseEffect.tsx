import { useState, useEffect, useRef } from "react";
import { Channel } from "tone";

export interface EffectProps {
	effectInput?: string;
	effectOutput?: string;
	bypassed?: boolean;
	input?: Channel | null;
	output?: Channel | null;
	name?: string;
}

// Custom hook for managing audio
export function useChannels({
	effectInput,
	effectOutput,
	bypassed,
}: EffectProps) {
	const inputRef = useRef<Channel | null>(null);
	const outputRef = useRef<Channel | null>(null);
	const bypassChannelRef = useRef<Channel | null>(null);
	const [bypass, setBypass] = useState(bypassed); // New state

	const toggleBypass = () => {
		const output = outputRef.current;
		const bypassChannel = bypassChannelRef.current;

		console.log("toggleBypass - Output before:", output?.volume.value);

		if (!output || !bypassChannel) {
			return; // Make sure output and bypassChannel are set
		}

		if (bypass) {
			console.log("Should raise the effect!");
			bypassChannel.volume.linearRampTo(-Infinity, 2.1);
			output.volume.linearRampTo(0, 2.1);
		} else {
			console.log("Should lower the effect!");
			bypassChannel.volume.linearRampTo(0, 2.1);
			output.volume.linearRampTo(-Infinity, 2.1);
		}

		console.log("toggleBypass - Output after:", output?.volume.value);
		setBypass(!bypass);
	};

	useEffect(() => {
		// Setup Channels
		console.log("Sets up channels", effectInput, effectOutput);
		console.log("Sets up channels again?");
		const inputChannel = new Channel({ volume: 0, channelCount: 2 });
		inputChannel.receive(`${effectInput}`);
		inputRef.current = inputChannel; // Use ref here

		const outputChannel = new Channel({ volume: 0, channelCount: 2 });
		outputChannel.send(`${effectOutput}`);
		outputRef.current = outputChannel; // Use ref here

		const bypassChannel = new Channel({ volume: 0, channelCount: 2 });
		bypassChannel.receive(`${effectInput}`);
		bypassChannel.send(`${effectOutput}`);
		bypassChannelRef.current = bypassChannel; // Use ref here

		if (bypass) {
			bypassChannel.volume.value = 0;
			outputChannel.volume.value = -Infinity;
		}

		// Cleanup
		return () => {
			console.log("cleans up");
			inputChannel.dispose();
			outputChannel.dispose();
			bypassChannel.dispose();
			inputRef.current?.dispose();
			outputRef.current?.dispose();
			bypassChannelRef.current?.dispose();
		};
	}, [effectInput, effectOutput]); // Run only when effectIndex changes

	// other audio logic ...

	return {
		input: inputRef.current,
		output: outputRef.current,
		bypass,
		toggleBypass,
	};
}
