import React, { useEffect } from "react";
import { Tremolo } from "tone";
import { withBaseEffectInterface } from "./BaseEffectInterface";
import { BaseEffectProps } from "./EffectComponentInterfaces";

const TremoloEffect: React.FC<BaseEffectProps> = ({
	effectInput,
	effectOutput,
	input,
	output,
}) => {
	useEffect(() => {
		const tremolo = new Tremolo(4, 0.75).start();
		input?.connect(tremolo);
		tremolo.connect(output!);
	}, [input, output]);

	return <div>Tremolo effect</div>;
};

export default withBaseEffectInterface(TremoloEffect);
