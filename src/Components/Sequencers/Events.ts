import { Time } from "tone/build/esm/core/type/Units";

export interface TriggerEvent {
	eventType: "noteOn" | "noteOff";
	note: number;
	startTime?: Time;
	duration?: Time;
	velocity?: number;
	promise?: Promise<void>;
	settings?: {
		pan?: number;
		attack?: number;
		decay?: number;
		playbackRate?: number;
	};
}
