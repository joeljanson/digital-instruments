import React, { useEffect } from "react";
import "../../CSS/SequencerArea.scss";
import {
	ComponentDef,
	SequencerChains,
	componentMap,
} from "./SequencerComponents/SequencerComponentInterfaces";

// Assuming you're passing this as a prop to your component
interface SequencerModuleProps {
	chains: SequencerChains;
	//onDataChange: (newData: any) => void; // Callback function for data changes
}

function SequencerArea({ chains }: SequencerModuleProps) {
	useEffect(() => {
		console.log("sequence area is rerendered?");

		// Cleanup function to remove the event listeners
		return () => {};
	}, []);

	function handleComponentChange(index: number, newData: any) {
		// Logic to update the specific component's data in 'chains'
		// and then call onDataChange with the updated chains
		//const updatedChains = { ...chains };
		// Update the specific component's data in updatedChains here
		//onDataChange(updatedChains);
	}

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
					onComponentChange={(newData: any) =>
						handleComponentChange(index, newData)
					}
				/>
			);
		}

		return <div>Unknown component: {componentDef.name}</div>;
	}

	return (
		<div className="module-area-wrapper sequencer-area">
			Sequencer area
			<div className="sequencer-wrapper">
				{Object.entries(chains).map(([chainKey, chainValue], chainIndex) => (
					<div key={chainKey}>
						{chainValue.map((componentDef, componentIndex) =>
							renderComponent(
								componentDef,
								componentIndex,
								componentIndex === chainValue.length - 1
							)
						)}
					</div>
				))}
			</div>
		</div>
	);
}

export default SequencerArea;
