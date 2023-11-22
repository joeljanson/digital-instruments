import ChordCreatorComponent from "./Components/ChordCreatorComponent";
import InputComponent from "./Components/InputComponent";
import StepSequencerComponent from "./Components/StepSequencerComponent";

interface BaseComponentDef {
	name: string;
	index?: number;
	isLastInChain?: boolean;
	// ... common properties
}

export interface InputComponentDef extends BaseComponentDef {
	type: "all" | "qwerty";
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

export type ComponentDef =
	| InputComponentDef
	| ChordCreatorDef
	| StepSequencerDef;

/* Component mappings */
type ComponentMap = {
	[key: string]: React.ComponentType<any>; // You can replace 'any' with a more specific prop type
};

export const componentMap: ComponentMap = {
	input: InputComponent,
	chordcreator: ChordCreatorComponent,
	stepsequencer: StepSequencerComponent,
	// other component mappings
};

/* Chains */
type Chain = ComponentDef[];
export type Chains = Chain[];
