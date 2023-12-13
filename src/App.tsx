import React, { useEffect, useState } from "react";
import "./App.scss";
import { Emitter, context, start } from "tone";
import SessionContextProvider from "./Session/SessionContextProvider";
import SequencerArea from "./Components/Sequencers/SequenceArea";
import EffectArea from "./Components/Effects/EffectArea";
import DelayEffect from "./Components/Effects/EffectComponents/DelayEffect";
import ConvolverEffect from "./Components/Effects/EffectComponents/ConvolverEffect";
import TapeMachine from "./Components/Audio-routing/Tape/TapeMachine";
import { SequencerChains } from "./Components/Sequencers/SequencerComponents/SequencerComponentInterfaces";
import { InstrumentChain } from "./Components/Instruments/InstrumentComponents/InstrumentComponentInterfaces";
import InstrumentArea from "./Components/Instruments/InstrumentArea";
import Navigation from "./Navigation";
import { EffectChain } from "./Components/Effects/EffectComponents/EffectComponentInterfaces";

/* TEST CHAIN */
import testJson from "./resources/data/test-session.json";
import { SessionData } from "./Session/SessionInterface";
const parsedData: SessionData = testJson as SessionData;

export const globalEmitter = new Emitter();

function App() {
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

	return (
		<SessionContextProvider>
			<div className="App" onClick={startTone}>
				<div className="top-bar-area">
					<Navigation toneStarted={toneStarted} />
				</div>
				<header className="main-area">
					<SequencerArea chains={parsedData.session.sequencerChainData} />
					<InstrumentArea chains={parsedData.session.instrumentChainData} />

					<div className="module-area-wrapper">
						<EffectArea chains={parsedData.session.effectChainData} />
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

export default App;
