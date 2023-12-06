import React, { useEffect } from "react";
import "./EffectArea.scss";
import {
	EffectChain,
	EffectComponentDef,
	effectComponentMap,
} from "./EffectComponents/EffectComponentInterfaces";
import { Channel } from "tone";

// Assuming you're passing this as a prop to your component
interface EffectModuleProps {
	chains: EffectChain;
}

function EffectArea({ chains }: EffectModuleProps) {
	useEffect(() => {
		console.log("sequence area is rerendered?");
		const sendToFirstEffect = new Channel({ volume: 0, channelCount: 2 });
		sendToFirstEffect.receive("effectsRackIn");
		sendToFirstEffect.send("effectRack-0-in");
		const receiveFromLast = new Channel({ volume: 0, channelCount: 2 });

		receiveFromLast.receive(`effectRack-${chains.length - 1}-out`);
		receiveFromLast.send("effectsRackOut");

		// Cleanup function to remove the event listeners
		return () => {};
	}, []);

	function renderComponent(componentDef: EffectComponentDef, index: number) {
		const Component = effectComponentMap[componentDef.name];
		let inputString = "effectRack-" + (index - 1).toString() + "-out";
		if (index === 0) {
			inputString = "effectRack-0-in";
		}
		const outputString = "effectRack-" + index.toString() + "-out";
		if (Component) {
			return (
				<Component
					{...componentDef}
					index={index}
					effectInput={inputString}
					effectOutput={outputString}
					bypassed={componentDef.bypassed}
					name={componentDef.displayName}
					key={index}
				/>
			);
		}

		return <div>Unknown component: {componentDef.name}</div>;
	}

	return (
		<div className="module-area-wrapper effect-area">
			Effect area
			<div className="effect-wrapper">
				{chains.map((componentDef, componentIndex) =>
					renderComponent(componentDef, componentIndex)
				)}
			</div>
		</div>
	);
}

export default EffectArea;
