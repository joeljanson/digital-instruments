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
export const globalEmitter = new Emitter();

/* TEST CHAIN */

const sequencerChainData: SequencerChains = [
	[
		{ name: "input", type: "all" }, // This matches InputComponentDef
		{
			name: "chordcreator",
			chords: [
				{ note: 0, voicing: [0, 4, 7, 11] }, // C major 7
				{ note: 2, voicing: [0, 3, 7, 10] }, // D minor 7
				{ note: 4, voicing: [0, 3, 7, 10] }, // E minor 7
				{ note: 5, voicing: [0, 4, 7, 11] }, // F major 7
				{ note: 7, voicing: [0, 4, 7, 10] }, // G dominant 7
				{ note: 9, voicing: [0, 3, 7, 10] }, // A minor 7
				{ note: 11, voicing: [0, 3, 6, 10] }, // B half-diminished 7
				{ note: 1, voicing: [0, 3, 6, 9] }, // C# diminished 7
				{ note: 3, voicing: [0, 3, 6, 10] }, // D# minor 7 flat 5
				{ note: 6, voicing: [0, 3, 6, 9] }, // F# diminished 7
				{ note: 8, voicing: [0, 3, 7, 10] }, // G# minor 7
				{ note: 10, voicing: [0, 4, 7, 11] }, // A# minor 7
			],
		}, // This matches ChordCreatorDef
		/* { name: "stepsequencer", steps: 8 }, // This matches InputComponentDef */
		{ name: "euclideansequencer", steps: 8 }, // This matches InputComponentDef
		{ name: "output", output: "SEQUENCER_EVENT" }, // This matches InputComponentDef
	],
	/* [
		{ name: "input", type: "all" }, // This matches InputComponentDef
		{ name: "stepsequencer", steps: 8 }, // This matches InputComponentDef
		{ name: "output", output: "SEQUENCER_EVENT" }, // This matches InputComponentDef
	], */
	// ...additional chains
];

const instrumentChainData: InstrumentChain = [
	/* { name: "testinstrument", usesBuffer: true }, // This matches InputComponentDef */
	{ name: "grandame", spread: 0 }, // This matches InputComponentDef
	/* {
		name: "divisions",
		loopDuration: 0,
	}, // This matches InputComponentDef */
	/* {
		name: "divisions",
		loopDuration: 0,
	}, // This matches InputComponentDef */
];

const effectChainData: EffectChain = [
	{ name: "delay", displayName: "Delay", delayTime: 0.5, bypassed: true },
	{ name: "convolver", displayName: "Conputer", bypassed: true },
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
						<EffectArea chains={effectChainData} />
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
