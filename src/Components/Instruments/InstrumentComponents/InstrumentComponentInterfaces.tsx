import TestInstrument from "./BaseInstrument/TestInstrument";
import Divisions from "./Divisions";
import GranDame from "./GranDame";

interface BaseInstrumentDef {
	name: string;
	index?: number;
	usesBuffer?: boolean;
	// ... common properties
}

export interface GranDameDef extends BaseInstrumentDef {
	spread: number;
	// Other input-specific properties
}

export interface DivisionsDef extends BaseInstrumentDef {
	loopDuration: number;
	// Other input-specific properties
}
export interface TestInstrumentDef extends BaseInstrumentDef {
	//spread: number;
	// Other input-specific properties
}

export type InstrumentComponentDef =
	| BaseInstrumentDef
	| GranDameDef
	| DivisionsDef
	| TestInstrumentDef; // | Divisions.. Add other component types as needed;

/* Component mappings */
type InstrumentComponentMap = {
	[key: string]: React.ComponentType<any>; // You can replace 'any' with a more specific prop type
};

export const instrumentComponentMap: InstrumentComponentMap = {
	grandame: GranDame,
	divisions: Divisions,
	testinstrument: TestInstrument,
	// other component mappings
};

/* Chains */
export type InstrumentChain = InstrumentComponentDef[];
