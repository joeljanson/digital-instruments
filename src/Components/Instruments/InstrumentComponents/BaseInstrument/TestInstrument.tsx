import React, { useEffect } from "react";
import { BaseInstrumentProps } from "./BaseInstrument";
import { withBaseInstrumenttInterface } from "./BaseInstrumentInterface";

const TestInstrument: React.FC<BaseInstrumentProps> = ({
	buffer,
	reversedBuffer,
	bufferLoaded,
}) => {
	/* useEffect(() => {
		console.log("This is run multiple times?");
		console.log("TEST INSTRUMENT IS USE EFFECTED AND HAS BUFFER", buffer);
		//const feedback = new FeedbackDelay(0.3, 0.6);
	}, [buffer, reversedBuffer]); */

	useEffect(() => {
		console.log("This is run multiple times?");
		console.log("TEST INSTRUMENT IS USE EFFECTED AND HAS BUFFER", buffer);
		//const feedback = new FeedbackDelay(0.3, 0.6);
	}, [bufferLoaded, buffer, reversedBuffer]);

	return <div>TEST INSTRUMENT!{buffer?.name}</div>;
};

export default withBaseInstrumenttInterface(TestInstrument);
