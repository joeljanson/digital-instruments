import React, { useEffect } from "react";
import { EffectProps } from "./BaseEffect";
import { Chebyshev, Distortion, Filter, FrequencyShifter, Gate } from "tone";
import { withBaseEffectInterface } from "./BaseEffectInterface";

const DistortionEffect: React.FC<EffectProps> = ({
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
