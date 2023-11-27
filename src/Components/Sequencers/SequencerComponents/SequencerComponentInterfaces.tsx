import ChordCreatorComponent from "./Components/ChordCreatorComponent";
import EuclideanSequencerComponent from "./Components/EuclideanSequencerComponent";
import InputComponent from "./Components/InputComponent";
import OutputComponent from "./Components/OutputComponent";
import StepSequencerComponent from "./Components/StepSequencerComponent";

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
export interface StepSequencerDef extends BaseComponentDef {
	steps: number;
	// Other chord-creator-specific properties
}
export interface EuclideanSequencerDef extends BaseComponentDef {
	steps: number;
	// Other chord-creator-specific properties
}

export type ComponentDef =
	| InputComponentDef
	| ChordCreatorDef
	| StepSequencerDef
	| EuclideanSequencerDef
	| OutputComponentDef;

type MiddleComponentDef =
	| ChordCreatorDef
	| StepSequencerDef
	| EuclideanSequencerDef; // Add other component types as needed

/* Component mappings */
type ComponentMap = {
	[key: string]: React.ComponentType<any>; // You can replace 'any' with a more specific prop type
};

export const componentMap: ComponentMap = {
	input: InputComponent,
	chordcreator: ChordCreatorComponent,
	stepsequencer: StepSequencerComponent,
	euclideansequencer: EuclideanSequencerComponent,
	output: OutputComponent,
	// other component mappings
};

/* Chains */
type SequencerChain = [
	InputComponentDef,
	...MiddleComponentDef[],
	OutputComponentDef
];
export type SequencerChains = SequencerChain[];
