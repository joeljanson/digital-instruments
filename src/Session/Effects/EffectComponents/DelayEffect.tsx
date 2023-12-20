import React, { useContext, useEffect, useRef } from "react";
import { EffectProps } from "./BaseEffect";
import { FeedbackDelay, Time } from "tone";
import { withBaseEffectInterface } from "./BaseEffectInterface";
import SessionContext from "../../Session/SessionContext";

const DelayEffect: React.FC<EffectProps> = ({
	effectInput,
	effectOutput,
	input,
	output,
}) => {
	const { bpm } = useContext(SessionContext);
	const feedbackDelay = useRef<FeedbackDelay>();

	useEffect(() => {
		// This code will run whenever 'bpm' changes

		if (bpm < 70) {
			feedbackDelay.current?.delayTime.rampTo("8n", 0.1);
		} else {
			feedbackDelay.current?.delayTime.rampTo("4n", 0.1);
		}
		console.log(`The BPM has changed to: ${bpm}`);
		// Here, you can perform any action needed when bpm updates.
		// For instance, updating something in Tone.js related to the new bpm value.
	}, [bpm]);

	useEffect(() => {
		const feedback = new FeedbackDelay("4n", 0.6);
		feedback.wet.value = 0.5;
		input?.chain(feedback, output!);
		feedbackDelay.current = feedback;
	}, [input, output]);

	return <div>Delay effect</div>;
};

export default withBaseEffectInterface(DelayEffect);
