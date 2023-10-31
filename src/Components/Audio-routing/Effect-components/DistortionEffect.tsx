import React, { useEffect } from "react";
import { EffectProps } from "./BaseEffect";
import { Distortion } from "tone";
import { withBaseEffectInterface } from "./BaseEffectInterface";

const DistortionEffect: React.FC<EffectProps> = ({
	effectInput,
	effectOutput,
	input,
	output,
}) => {
	useEffect(() => {
		if (output && input) {
			const distortion = new Distortion(0.6);
			input.chain(distortion, output);
		}
	}, [input, output]);

	return <div>Distortion!{input?.name}</div>;
};

export default withBaseEffectInterface(DistortionEffect);
