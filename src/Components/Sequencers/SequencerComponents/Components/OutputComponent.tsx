import React, { useEffect } from "react";
import Keyboard from "../../Helpers/Keyboard";
import { globalEmitter } from "../../../../App";
import { TriggerEvent } from "../../Helpers/Events";
import { OutputComponentDef } from "../SequencerComponentInterfaces";

const OutputComponent: React.FC<OutputComponentDef> = ({
	output,
	...otherProps
}) => {
	useEffect(() => {
		const input = `INPUT_${otherProps.index ? otherProps.index - 1 : 0}`;

		const triggerEventHandler = async (event: TriggerEvent) => {
			globalEmitter.emit(output, event);
		};

		console.log(input);
		globalEmitter.on(input, triggerEventHandler);
		return () => {
			globalEmitter.off(input, triggerEventHandler);
		};
	}, [output, otherProps]);

	return <div className="module-area-wrapper">Sequencer Output</div>;
};

export default OutputComponent;
