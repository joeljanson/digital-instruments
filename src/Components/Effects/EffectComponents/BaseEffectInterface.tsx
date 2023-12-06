import React from "react";
import { EffectProps, useChannels } from "./BaseEffect";
import "../EffectArea.scss";

export function withBaseEffectInterface<T extends EffectProps>(
	WrappedComponent: React.FC<T>
) {
	const BaseEffectInterface: React.FC<T> = (props) => {
		const { input, output, bypass, toggleBypass } = useChannels(props);

		return (
			<div className={`base-effect ${bypass ? "bypassed" : ""}`}>
				<div className="controls">
					<div className="effect-name">{props.name}</div>
					<button
						className={`bypass-button ${bypass ? "bypassed" : ""}`}
						onClick={toggleBypass}
					>
						{""}
					</button>
				</div>
				<div className="effect-area">
					<WrappedComponent {...props} input={input} output={output} />
				</div>
			</div>
		);
	};

	return BaseEffectInterface;
}
