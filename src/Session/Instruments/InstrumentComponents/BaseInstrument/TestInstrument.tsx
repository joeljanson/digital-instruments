import React, { useEffect, useRef, useState } from "react";
import { BaseInstrumentProps } from "./BaseInstrument";
import { withBaseInstrumenttInterface } from "./BaseInstrumentInterface";
import { globalEmitter } from "../../../Session/Session";
import { TriggerEvent } from "../../../Sequencers/Helpers/Events";
import { Player, now } from "tone";
import { buffer } from "stream/consumers";
import "./TestInstrument.scss";
import CanvasComponent from "../Instrument parts/CanvasComponent";

const TestInstrument: React.FC<BaseInstrumentProps> = ({
	buffer,
	outputChannel,
	bufferLoaded,
}) => {
	const playerMap = useRef<Map<number, Player>>(new Map());

	useEffect(() => {
		console.log("Test instrument!");
	}, []);

	const [rectangleValues, setRectangleValues] = useState<number[]>([]);

	const handleRectangleValuesChange = (newValues: number[]) => {
		setRectangleValues(newValues);
		console.log(newValues);
	};

	return (
		<div className="test-wrapper">
			hejsan
			<div className="test-holder">
				<CanvasComponent onValuesChange={handleRectangleValuesChange} />
			</div>
		</div>
	);
};

export default withBaseInstrumenttInterface(TestInstrument);
