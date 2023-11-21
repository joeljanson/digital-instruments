import React, { useEffect } from "react";
/* import Keyboard from "./Keyboard";
import { globalEmitter } from "../../App";
import { TriggerEvent } from "./Events"; */
import {
	Chains,
	ComponentDef,
	componentMap,
} from "./SequencerComponentInterfaces";

// Assuming you're passing this as a prop to your component
interface SequencerModuleProps {
	chains: Chains;
}

function SequencerArea({ chains }: SequencerModuleProps) {
	useEffect(() => {
		console.log("sequence area is rerendered?");

		// Cleanup function to remove the event listeners
		return () => {};
	}, []);

	function renderComponent(
		componentDef: ComponentDef,
		index: number,
		isLastInChain: boolean
	) {
		const Component = componentMap[componentDef.name];

		if (Component) {
			return (
				<Component
					{...componentDef}
					index={index}
					isLastInChain={isLastInChain}
				/>
			);
		}

		return <div>Unknown component: {componentDef.name}</div>;
	}

	return (
		<div className="module-area-wrapper">
			Sequencer area
			{chains.map((chain, chainIndex) => (
				<div key={chainIndex}>
					{chain.map((componentDef, componentIndex) =>
						renderComponent(
							componentDef,
							componentIndex,
							componentIndex === chain.length - 1
						)
					)}
				</div>
			))}
		</div>
	);
}

export default SequencerArea;
