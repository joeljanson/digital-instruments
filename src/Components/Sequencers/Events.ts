export interface TriggerEvent {
	eventType: "noteOn" | "noteOff";
	note: number;
	velocity?: number;
	settings?: {
		pan?: number;
		attack?: number;
		decay?: number;
		playbackRate?: number;
	};
}
