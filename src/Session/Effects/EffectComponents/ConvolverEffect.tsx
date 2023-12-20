import React, { useEffect } from "react";
import { EffectProps } from "./BaseEffect";
import { Convolver } from "tone";
import { withBaseEffectInterface } from "./BaseEffectInterface";

const ir = require("../../../audio/impulse-responses/ir-test4.wav");

const ConvolverEffect: React.FC<EffectProps> = ({
	effectInput,
	effectOutput,
	input,
	output,
}) => {
	useEffect(() => {
		const convolver = new Convolver(ir);
		input?.chain(convolver, output!);
	}, [input, output]);

	return <div>Convolver</div>;
};

export default withBaseEffectInterface(ConvolverEffect);
