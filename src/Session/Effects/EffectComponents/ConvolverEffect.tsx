import React, { useEffect } from "react";
import { Convolver } from "tone";
import { withBaseEffectInterface } from "./BaseEffectInterface";
import { BaseEffectProps } from "./EffectComponentInterfaces";

const ir = require("../../../audio/impulse-responses/ir-test4.wav");

const ConvolverEffect: React.FC<BaseEffectProps> = ({
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
