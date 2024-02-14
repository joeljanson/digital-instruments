import React, { useEffect } from "react";
import { Chebyshev, Distortion, Filter, FrequencyShifter, Gate } from "tone";
import { withBaseEffectInterface } from "./BaseEffectInterface";
import { BaseEffectProps } from "./EffectComponentInterfaces";

const DistortionEffect: React.FC<BaseEffectProps> = ({
	effectInput,
	effectOutput,
	input,
	output,
}) => {
	useEffect(() => {
		if (output && input) {
			console.log("How many effects are created?");
			const filter = new Filter(500, "lowpass");

			const cheby = new Chebyshev(13);
			const chebyTwo = new Chebyshev(22);
			const distortion = new Distortion(0.4);

			input.chain(filter, cheby, chebyTwo, distortion, output);
		}
	}, [input, output]);

	return <div>Distortion!{input?.name}</div>;
};

export default withBaseEffectInterface(DistortionEffect);
