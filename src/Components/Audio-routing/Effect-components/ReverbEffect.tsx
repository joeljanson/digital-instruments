import React, { useEffect } from "react";
import { useChannels, EffectProps } from "./BaseEffect";
import { Distortion, Reverb } from "tone";

const ReverbEffect: React.FC<EffectProps> = (props) => {
	const { input, output } = useChannels(props);
	useEffect(() => {
		const reverb = new Reverb(10);
		input?.chain(reverb, output!);
	});

	return <div>Reverb!{input?.name}</div>;
};

export default ReverbEffect;
