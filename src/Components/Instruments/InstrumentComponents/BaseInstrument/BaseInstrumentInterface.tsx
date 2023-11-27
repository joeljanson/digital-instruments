import React from "react";
import { BaseInstrumentProps, useBaseInstrument } from "./BaseInstrument";
import BufferSources from "../../../Common/BufferSources";
import { TriggerEvent } from "../../../Sequencers/Helpers/Events";

export function withBaseInstrumenttInterface<T extends BaseInstrumentProps>(
	WrappedComponent: React.FC<T>
) {
	const BaseEffectInterface: React.FC<T> = (props) => {
		const { outputChannel, usesBuffer, bufferSourceUpdated } =
			useBaseInstrument(props);
		return (
			<div className="module-area-wrapper instrument">
				<div className="submodule-area-wrapper">
					<div className="instrument-main-area">
						<WrappedComponent {...props} outputChannel={outputChannel} />
					</div>
				</div>
				{usesBuffer ? (
					<BufferSources
						bufferSourceUpdated={bufferSourceUpdated}
					></BufferSources>
				) : null}
			</div>
		);
	};

	return BaseEffectInterface;
}
