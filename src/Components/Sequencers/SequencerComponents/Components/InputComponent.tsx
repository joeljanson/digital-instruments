import React, { useEffect } from "react";
import Keyboard from "../../Helpers/Keyboard";
import { globalEmitter } from "../../../../App";
import { TriggerEvent } from "../../Helpers/Events";
import { InputComponentDef } from "../SequencerComponentInterfaces";

const InputComponent: React.FC<InputComponentDef> = ({
	type,
	...otherProps
}) => {
	useEffect(() => {
		//console.log("sequence area is rerendered?");
		const keys = new Keyboard(async (event: TriggerEvent) => {
			/* console.log("Sends an out event!");
			console.log(`INPUT_${otherProps.index}`); */
			globalEmitter.emit(`INPUT_${otherProps.index}`, event);
		}, type);

		// Cleanup function to remove the event listeners
		return () => {
			document.removeEventListener("keydown", keys.handleKeyDown);
			document.removeEventListener("keyup", keys.handleKeyUp);
		};
	}, [type, otherProps]);

	return <div className="module-area-wrapper">Sequencer Input</div>;
};

export default InputComponent;
