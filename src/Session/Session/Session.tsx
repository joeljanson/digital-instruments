import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import "../CSS/Session.scss";
import { Emitter, context, start } from "tone";
import SessionContextProvider from "./SessionContextProvider";
import SequencerArea from "../Sequencers/SequenceArea";
import EffectArea from "../Effects/EffectArea";
import TapeMachine from "../Audio-routing/Tape/TapeMachine";
import InstrumentArea from "../Instruments/InstrumentArea";
import Navigation from "../../Navigation";

/* TEST CHAIN */
import testJson from "../../resources/data/test-session.json";
import { SessionData } from "./SessionInterface";
import { fetchSessionData } from "../../Database Connections/getSession";

export const globalEmitter = new Emitter();

function Session() {
	const { sessionId } = useParams();
	const [sessionData, setSessionData] = useState<SessionData | null>(null);

	const [toneStarted, setToneStarted] = useState(false);
	const startTone = async () => {
		await start();
		console.log("Tone started!");
		setToneStarted(true);
	};

	useEffect(() => {
		const state = context.state;
		console.log(`Audio context state: ${state}`);

		if (state === "suspended") {
			// Context is created but not yet playing
			setToneStarted(false);
		} else if (state === "running") {
			// Context is active and playing
			setToneStarted(true);
		} else if (state === "closed") {
			// Context has been closed
			setToneStarted(false);
		}
	}, []);

	useEffect(() => {
		// Call the function to fetch the data
		console.log("Should get data, sessionId: ", sessionId);
		async function loadData() {
			if (sessionId) {
				const fetchedData = await fetchSessionData(sessionId);
				console.log(fetchedData);
				setSessionData(fetchedData);
			}
		}

		loadData();
	}, [sessionId]); // This will fetch session data whenever the sessionId changes

	if (!sessionData) {
		// Render a loading state or return null if the data hasn't been fetched yet
		return <div>Loading...</div>;
	}

	return (
		<SessionContextProvider>
			<div className="App" onClick={startTone}>
				<div className="top-bar-area">
					<Navigation toneStarted={toneStarted} />
				</div>
				<header className="main-area">
					<SequencerArea chains={sessionData.sessionData.sequencerChainData} />
					<InstrumentArea
						chains={sessionData.sessionData.instrumentChainData}
					/>

					<div className="module-area-wrapper">
						<EffectArea chains={sessionData.sessionData.effectChainData} />
						<TapeMachine
							receive="effectsRackOut"
							send="tapeMachineOut"
						></TapeMachine>
					</div>
				</header>
			</div>
		</SessionContextProvider>
	);
}

export default Session;
