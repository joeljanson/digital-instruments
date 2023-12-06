import React, { useEffect } from "react";
import { EffectProps } from "./BaseEffect";
import { Chebyshev, Distortion, FrequencyShifter } from "tone";
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
			const cheby = new Chebyshev(11);
			const freqShift = new FrequencyShifter(50);
			input.chain(freqShift, cheby, output);
		}
	}, [input, output]);

	return <div>Distortion!{input?.name}</div>;
};

export default withBaseEffectInterface(DistortionEffect);
