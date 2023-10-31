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
		input?.chain(feedback, output!);
	});

	return <div>Delay!{input?.name}</div>;
};

export default withBaseEffectInterface(DelayEffect);
