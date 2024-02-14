import React, { useEffect } from "react";
import { StereoWidener } from "tone";
import { withBaseEffectInterface } from "./BaseEffectInterface";
import { BaseEffectProps } from "./EffectComponentInterfaces";

const StereoWidenerEffect: React.FC<BaseEffectProps> = ({
	effectInput,
	effectOutput,
	input,
	output,
}) => {
	useEffect(() => {
		const stereoWidth = new StereoWidener(1);
		input?.chain(stereoWidth, output!);
	}, [input, output]);

	return <div>Stereo widener!{input?.name}</div>;
};

export default withBaseEffectInterface(StereoWidenerEffect);
