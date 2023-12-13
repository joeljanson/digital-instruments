import React from "react";
import { BaseInstrumentProps, useBaseInstrument } from "./BaseInstrument";
import BufferSources from "../../../Common/BufferSources";

export function withBaseInstrumenttInterface<T extends BaseInstrumentProps>(
	WrappedComponent: React.FC<T>
) {
	const BaseEffectInterface: React.FC<T> = (props) => {
		const { outputChannel, usesBuffer, bypass, toggleBypass } =
			useBaseInstrument(props);
		return (
			<div className="module-area-wrapper instrument">
				<div className="submodule-area-wrapper">
					<div className="controls">
						<div className="effect-name">Instrument name</div>
						<button
							className={`bypass-button ${bypass ? "bypassed" : ""}`}
							onClick={toggleBypass}
						>
							{`bypass-button ${bypass ? "bypassed" : "On"}`}
						</button>
					</div>
					<div className="instrument-main-area">
						<WrappedComponent {...props} outputChannel={outputChannel} />
					</div>
				</div>
				{usesBuffer ? (
					<BufferSources bufferSourceUpdated={() => {}}></BufferSources>
				) : null}
			</div>
		);
	};

	return BaseEffectInterface;
}
