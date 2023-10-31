import React from "react";
import { EffectProps, useChannels } from "./BaseEffect";

export function withBaseEffectInterface<T extends EffectProps>(
	WrappedComponent: React.FC<T>
) {
	const BaseEffectInterface: React.FC<T> = (props) => {
		const { input, output, bypass, toggleBypass } = useChannels(props);

		return (
			<div>
				<button onClick={toggleBypass}>{bypass ? "Turn On" : "Bypass"}</button>
				<WrappedComponent {...props} input={input} output={output} />
			</div>
		);
	};

	return BaseEffectInterface;
}
