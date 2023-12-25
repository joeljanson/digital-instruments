import React, { useRef } from "react";
import { BaseInstrumentProps, useBaseInstrument } from "./BaseInstrument";
import BufferSources from "../../../Common/BufferSources";

import "../../../../CSS/Areas.scss";
import "../../../../CSS/InstrumentArea.scss";

export function withBaseInstrumenttInterface<T extends BaseInstrumentProps>(
	WrappedComponent: React.FC<T>
) {
	const BaseEffectInterface: React.FC<T> = (props) => {
		const dropzoneRef = useRef<HTMLDivElement>(null); // Create the ref here

		const {
			outputChannel,
			usesBuffer,
			buffer,
			bypass,
			toggleBypass,
			bufferSourceUpdated,
		} = useBaseInstrument(props);
		return (
			<div ref={dropzoneRef} className="module-area-wrapper instrument">
				<div
					className={`base-area instrument-wrapper  ${
						bypass ? "bypassed" : ""
					}`}
				>
					<div className="controls">
						<div className="instrument-name">{props.name}</div>
						<button
							className={`bypass-button ${bypass ? "bypassed" : ""}`}
							onClick={toggleBypass}
						>
							{""}
						</button>
					</div>
					<div className="content-area instrument-content-area">
						<WrappedComponent
							{...props}
							outputChannel={outputChannel}
							buffer={buffer}
						/>
					</div>
				</div>
				{usesBuffer ? (
					<BufferSources
						bufferSourceUpdated={bufferSourceUpdated}
						parentRef={dropzoneRef}
					></BufferSources>
				) : null}
			</div>
		);
	};

	return BaseEffectInterface;
}
