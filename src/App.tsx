import React, { useEffect, useState } from "react";
import "./App.scss";
import { Emitter, context, start } from "tone";
import SessionContextProvider from "./Session/SessionContextProvider";
import SequencerArea from "./Components/Sequencers/SequenceArea";
import EffectsRack from "./Components/Audio-routing/Effect-components/EffectsRack";
import DelayEffect from "./Components/Audio-routing/Effect-components/DelayEffect";
import ConvolverEffect from "./Components/Audio-routing/Effect-components/ConvolverEffect";
import TapeMachine from "./Components/Audio-routing/Tape/TapeMachine";
import { SequencerChains } from "./Components/Sequencers/SequencerComponents/SequencerComponentInterfaces";
import { InstrumentChain } from "./Components/Instruments/InstrumentComponents/InstrumentComponentInterfaces";
import InstrumentArea from "./Components/Instruments/InstrumentArea";
import Navigation from "./Navigation";
export const globalEmitter = new Emitter();

/* TEST CHAIN */

const sequencerChainData: SequencerChains = [
	[
		{ name: "input", type: "all" }, // This matches InputComponentDef
		{
			name: "chordcreator",
			chords: [
				{ note: 0, voicing: [0, 4, 7] },
				{ note: 4, voicing: [0, 5, 12] },
				{ note: 2, voicing: [0, 3, 7] },
			],
		}, // This matches ChordCreatorDef
		/* { name: "stepsequencer", steps: 8 }, // This matches InputComponentDef */
		{ name: "euclideansequencer", steps: 8 }, // This matches InputComponentDef
		{ name: "output", output: "SEQUENCER_EVENT" }, // This matches InputComponentDef
	],
	// ...additional chains
];

const instrumentChainData: InstrumentChain = [
	/* { name: "testinstrument", usesBuffer: true }, // This matches InputComponentDef */
	/* { name: "grandame", spread: 0 }, // This matches InputComponentDef */
	/* {
		name: "divisions",
		loopDuration: 0,
	}, // This matches InputComponentDef */
	{
		name: "divisions",
		loopDuration: 0,
	}, // This matches InputComponentDef
];
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
					<SequencerArea chains={sequencerChainData} />
					<InstrumentArea chains={instrumentChainData} />

					<div className="module-area-wrapper">
						<EffectsRack receive="effectsRackIn" send="effectsRackOut">
							{[<ConvolverEffect key="2" />, <DelayEffect key="1" />]}
						</EffectsRack>
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
