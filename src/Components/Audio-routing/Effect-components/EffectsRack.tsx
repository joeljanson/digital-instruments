import React, { useEffect, useState } from "react";
import { Channel } from "tone";

type EffectComponent = React.ReactElement<{
	effectIndex?: string;
	lastEffect: boolean;
}>;

const EffectsRack: React.FC<{
	receive: string;
	send: string;
	children: React.ReactNode;
}> = ({ receive, send, children }) => {
	/* 	const { input, output } = useChannel({ input: receive, output: send });
	 */ const [effectComponents, setEffectComponents] = useState<
		EffectComponent[]
	>([]);

	useEffect(() => {
		let trueChildren = children; // Default to children

		// Check if the children are wrapped in a single React.Fragment or div
		if (React.isValidElement(children) && children.props.children) {
			trueChildren = children.props.children;
		}
		const sendToFirstEffect = new Channel({ volume: 0, channelCount: 2 });
		sendToFirstEffect.receive(receive);
		sendToFirstEffect.send("effectRack-0-in");
		const receiveFromLast = new Channel({ volume: 0, channelCount: 2 });
		const numberOfTrueChildren = React.Children.count(trueChildren);

		receiveFromLast.receive(`effectRack-${numberOfTrueChildren - 1}-out`);
		receiveFromLast.send(send);
	}, []);

	useEffect(() => {
		let trueChildren = children; // Default to children

		// Check if the children are wrapped in a single React.Fragment or div
		if (React.isValidElement(children) && children.props.children) {
			trueChildren = children.props.children;
		}

		setEffectComponents(
			React.Children.map(trueChildren, (child, index) => {
				if (
					React.isValidElement<{ effectInput?: string; effectOutput?: string }>(
						child
					)
				) {
					let inputString = "effectRack-" + (index - 1).toString() + "-out";
					if (index === 0) {
						inputString = receive;
					}
					const outputString = "effectRack-" + index.toString() + "-out";
					return React.cloneElement(child, {
						effectInput: inputString,
						effectOutput: outputString,
					});
				}
				return child;
			}) as EffectComponent[]
		);
	}, [children, receive]);

	return <div className="submodule-area-wrapper">{effectComponents}</div>;
};

export default EffectsRack;
