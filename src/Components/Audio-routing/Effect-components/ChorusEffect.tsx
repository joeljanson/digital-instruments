import React, { useEffect } from "react";
import { EffectProps } from "./BaseEffect";
import { Chorus } from "tone";
import { withBaseEffectInterface } from "./BaseEffectInterface";

const ChorusEffect: React.FC<EffectProps> = ({
	effectInput,
	effectOutput,
	input,
	output,
}) => {
	useEffect(() => {
		console.log("This is run multiple times?");
		//const feedback = new FeedbackDelay(0.3, 0.6);
		const chorus = new Chorus(1.2, 4.5, 0.5).start();
		input?.chain(chorus, output!);
	}, [input, output]);

	return <div>Chorus!{input?.name}</div>;
};

export default withBaseEffectInterface(ChorusEffect);
