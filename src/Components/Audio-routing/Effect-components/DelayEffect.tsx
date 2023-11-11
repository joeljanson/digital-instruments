import React, { useEffect } from "react";
import { EffectProps } from "./BaseEffect";
import { FeedbackDelay } from "tone";
import { withBaseEffectInterface } from "./BaseEffectInterface";

const DelayEffect: React.FC<EffectProps> = ({
	effectInput,
	effectOutput,
	input,
	output,
}) => {
	useEffect(() => {
		const feedback = new FeedbackDelay(0.3, 0.6);
		feedback.wet.value = 0.5;
		input?.chain(feedback, output!);
	}, [input, output]);

	return <div>Delay effect</div>;
};

export default withBaseEffectInterface(DelayEffect);
