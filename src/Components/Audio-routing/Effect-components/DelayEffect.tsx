import React, { useEffect } from "react";
import { useChannels, EffectProps } from "./BaseEffect";
import { Distortion } from "tone";

const DelayEffect: React.FC<EffectProps> = (props) => {
	const { input, output } = useChannels(props);
	useEffect(() => {
		//const feedback = new FeedbackDelay(0.3, 0.6);
		const feedback = new Distortion(1.0);
		input?.chain(feedback, output!);
	});

	return <div>DELAY!{input?.name}</div>;
};

export default DelayEffect;
