import { useState, useEffect } from "react";
import { Channel } from "tone";

export interface EffectProps {
	effectInput: string;
	effectOutput: string;
}

// Custom hook for managing audio
export function useChannels({ effectInput, effectOutput }: EffectProps) {
	const [input, setInput] = useState<Channel | null>(null);
	const [output, setOutput] = useState<Channel | null>(null);

	useEffect(() => {
		// Setup Channels
		const setupChannels = () => {
			const inputChannel = new Channel();
			inputChannel.receive(`${effectInput}`);
			setInput(inputChannel);

			const outputChannel = new Channel();
			outputChannel.send(`${effectOutput}`);
			setOutput(outputChannel);
		};

		setupChannels();

		// Cleanup
		return () => {
			input?.dispose();
			output?.dispose();
		};
	}, [effectInput, effectOutput]); // Run only when effectIndex changes

	// other audio logic ...

	return { input, output };
}
