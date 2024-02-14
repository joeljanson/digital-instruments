import React, { useEffect } from "react";
import { Reverb } from "tone";
import { withBaseEffectInterface } from "./BaseEffectInterface";
import { BaseEffectProps } from "./EffectComponentInterfaces";

const ReverbEffect: React.FC<BaseEffectProps> = ({
	effectInput,
	effectOutput,
	input,
	output,
}) => {
	useEffect(() => {
		//const feedback = new FeedbackDelay(0.3, 0.6);
		const reverb = new Reverb(10);
		input?.chain(reverb, output!);
	}, [input, output]);

	return <div>Reverb!{input?.name}</div>;
};

export default withBaseEffectInterface(ReverbEffect);
