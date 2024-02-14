import { Channel } from "tone";
import ChorusEffect from "./ChorusEffect";
import ConvolverEffect from "./ConvolverEffect";
import DelayEffect from "./DelayEffect";
import DistortionEffect from "./DistortionEffect";

export interface BaseEffectProps {
	name: string;
	displayName: string;
	bypassed: boolean;
	index?: number;
	// ... common properties previously in EffectProps
	effectInput?: string;
	effectOutput?: string;
	input?: Channel | null;
	output?: Channel | null;
}

export interface DelayEffectProps extends BaseEffectProps {
	delayTime: number;
	// Other input-specific properties
}

export interface ConvolverDef extends BaseEffectProps {
	//loopDuration: number;
	// Other input-specific properties
}
export interface ChorusDef extends BaseEffectProps {
	//spread: number;
	// Other input-specific properties
}

export interface DistortionDef extends BaseEffectProps {
	//spread: number;
	// Other input-specific properties
}

export type EffectComponentDef =
	| BaseEffectProps
	| DelayEffectProps
	| ConvolverDef
	| DistortionDef
	| ChorusDef; // | Divisions.. Add other component types as needed;

/* Component mappings */
type EffectComponentMap = {
	[key: string]: React.ComponentType<any>; // You can replace 'any' with a more specific prop type
};

export const effectComponentMap: EffectComponentMap = {
	delay: DelayEffect,
	chorus: ChorusEffect,
	convolver: ConvolverEffect,
	distortion: DistortionEffect,
	// other component mappings
};

/* Chains */
export type EffectChain = EffectComponentDef[];
