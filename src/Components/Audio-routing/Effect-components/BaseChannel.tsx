import { useState, useEffect } from "react";
import { Channel } from "tone";

export interface ChannelProps {
	input: string;
	output: string;
}

// Custom hook for managing audio
export function useChannel(props: ChannelProps) {
	const [input, setInput] = useState<Channel | null>(null);
	const [output, setOutput] = useState<Channel | null>(null);

	useEffect(() => {
		// Setup Channels
		const setupChannels = () => {
			const inputChannel = new Channel();
			inputChannel.receive(`${props.input}`);
			setInput(inputChannel);

			const outputChannel = new Channel();
			outputChannel.send(`${props.output}`);
			setOutput(outputChannel);
		};

		setupChannels();

		// Cleanup
		return () => {
			input?.dispose();
			output?.dispose();
		};
	}, [props]); // Run only when effectIndex changes

	// other audio logic ...

	return { input, output };
}
