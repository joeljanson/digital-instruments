import React, { useEffect } from "react";
import "./SequencerArea.scss";
import {
	Chains,
	ComponentDef,
	componentMap,
} from "./SequencerComponents/SequencerComponentInterfaces";

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
					key={index}
				/>
			);
		}

		return <div>Unknown component: {componentDef.name}</div>;
	}

	return (
		<div className="module-area-wrapper">
			Sequencer area
			<div className="sequencer-area">
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
		</div>
	);
}

export default SequencerArea;
