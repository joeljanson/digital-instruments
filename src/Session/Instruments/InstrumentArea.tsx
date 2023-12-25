import React, { useEffect } from "react";
import "../../CSS/InstrumentArea.scss";
import {
	InstrumentChain,
	InstrumentComponentDef,
	instrumentComponentMap,
} from "./InstrumentComponents/InstrumentComponentInterfaces";

// Assuming you're passing this as a prop to your component
interface InstrumentModuleProps {
	chains: InstrumentChain;
}

function InstrumentArea({ chains }: InstrumentModuleProps) {
	useEffect(() => {
		console.log("sequence area is rerendered?");

		// Cleanup function to remove the event listeners
		return () => {};
	}, []);

	function renderComponent(
		componentDef: InstrumentComponentDef,
		index: number,
		isLastInChain: boolean
	) {
		const Component = instrumentComponentMap[componentDef.name];

		console.log("Component def is: ", componentDef);
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
		<div className="module-area-wrapper instrument-area">
			Instrument area
			<div className="instrument-wrapper">
				{chains.map((componentDef, componentIndex) =>
					renderComponent(
						componentDef,
						componentIndex,
						componentIndex === chains.length - 1
					)
				)}
			</div>
		</div>
	);
}

export default InstrumentArea;
