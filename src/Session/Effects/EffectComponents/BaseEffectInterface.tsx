import React from "react";
import { useChannels } from "./BaseEffect";
import "../../../CSS/EffectArea.scss";
import "../../../CSS/Areas.scss";
import { BaseEffectProps } from "./EffectComponentInterfaces";

export function withBaseEffectInterface<T extends BaseEffectProps>(
	WrappedComponent: React.FC<T>
) {
	const BaseEffectInterface: React.FC<T> = (props) => {
		const { input, output, bypass, toggleBypass } = useChannels(props);

		return (
			<div className={`base-area ${bypass ? "bypassed" : ""}`}>
				<div className="controls">
					<div className="effect-name">{props.name}</div>
					<button
						className={`bypass-button ${bypass ? "bypassed" : ""}`}
						onClick={toggleBypass}
					>
						{""}
					</button>
				</div>
				<div className="content-area effect-content-area">
					<WrappedComponent {...props} input={input} output={output} />
				</div>
			</div>
		);
	};

	return BaseEffectInterface;
}
