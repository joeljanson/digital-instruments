import ChorusEffect from "./ChorusEffect";
import ConvolverEffect from "./ConvolverEffect";
import DelayEffect from "./DelayEffect";

interface BaseEffectDef {
	name: string;
	displayName: string;
	bypassed: boolean;
	index?: number;
	// ... common properties
}

export interface DelayDef extends BaseEffectDef {
	delayTime: number;
	// Other input-specific properties
}

export interface ConvolverDef extends BaseEffectDef {
	//loopDuration: number;
	// Other input-specific properties
}
export interface ChorusDef extends BaseEffectDef {
	//spread: number;
	// Other input-specific properties
}

export type EffectComponentDef =
	| BaseEffectDef
	| DelayDef
	| ConvolverDef
	| ChorusDef; // | Divisions.. Add other component types as needed;

/* Component mappings */
type EffectComponentMap = {
	[key: string]: React.ComponentType<any>; // You can replace 'any' with a more specific prop type
};

export const effectComponentMap: EffectComponentMap = {
	delay: DelayEffect,
	chorus: ChorusEffect,
	convolver: ConvolverEffect,
	// other component mappings
};

/* Chains */
export type EffectChain = EffectComponentDef[];
