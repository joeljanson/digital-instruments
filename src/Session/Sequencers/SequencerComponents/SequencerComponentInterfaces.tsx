import ChordCreatorComponent from "./Components/ChordCreatorComponent";
import DrummerSequencerComponent from "./Components/DrummerSequencerComponent";
import EuclideanSequencerComponent from "./Components/EuclideanSequencerComponent";
import InputComponent from "./Components/InputComponent";
import OutputComponent from "./Components/OutputComponent";
import PannerComponent from "./Components/PannerComponent";
import StepSequencerComponent from "./Components/StepSequencerComponent";
import StrummerComponent from "./Components/StrummerComponent";

interface BaseComponentDef {
	name: string;
	index?: number;
	// ... common properties
}

export interface InputComponentDef extends BaseComponentDef {
	type: "all" | "qwerty";
	// Other input-specific properties
}

export interface OutputComponentDef extends BaseComponentDef {
	output: string;
	// Other input-specific properties
}

export interface ChordCreatorDef extends BaseComponentDef {
	chords: { note: number; voicing: number[] }[];
	// Other chord-creator-specific properties
}

export interface StrummerDef extends BaseComponentDef {
	range: number;
	direction?: "up" | "down" | "random";
	// Set a range from 0 to N amount of time in which the strummer will trigger
}

export interface PannerDef extends BaseComponentDef {
	range?: number;
	// Set a range from 0 to N amount of time in which the strummer will trigger
}

export interface StepSequencerDef extends BaseComponentDef {
	steps: number;
	// Other chord-creator-specific properties
}
export interface EuclideanSequencerDef extends BaseComponentDef {
	steps: number;
	// Other chord-creator-specific properties
}
export interface DrummerSequencerDef extends BaseComponentDef {
	length: "1m" | "2m" | "4m" | "8m";
	patterns: { note: string; pattern: { time: string; notes: number[] }[] }[];
	// Other chord-creator-specific properties
}

export type ComponentDef =
	| InputComponentDef
	| ChordCreatorDef
	| StrummerDef
	| PannerDef
	| StepSequencerDef
	| EuclideanSequencerDef
	| DrummerSequencerDef
	| OutputComponentDef;

type MiddleComponentDef =
	| ChordCreatorDef
	| StrummerDef
	| PannerDef
	| StepSequencerDef
	| EuclideanSequencerDef
	| DrummerSequencerDef; // Add other component types as needed, Has to be added above as well

/* Component mappings */
type ComponentMap = {
	[key: string]: React.ComponentType<any>; // You can replace 'any' with a more specific prop type
};

export const componentMap: ComponentMap = {
	input: InputComponent,
	chordcreator: ChordCreatorComponent,
	strummer: StrummerComponent,
	panner: PannerComponent,
	stepsequencer: StepSequencerComponent,
	euclideansequencer: EuclideanSequencerComponent,
	drummersequencer: DrummerSequencerComponent,
	output: OutputComponent,
	// other component mappings
};

/* Chains */
type SequencerChain = [
	InputComponentDef,
	...MiddleComponentDef[],
	OutputComponentDef
];
// Define SequencerChains as an object with keys for each chain
export interface SequencerChains {
	[chainName: string]: SequencerChain;
}
