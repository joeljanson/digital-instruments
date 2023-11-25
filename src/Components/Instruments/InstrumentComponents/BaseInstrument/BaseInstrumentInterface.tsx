import React from "react";
import { BaseInstrumentProps, useBaseInstrument } from "./BaseInstrument";

export function withBaseInstrumenttInterface<T extends BaseInstrumentProps>(
	WrappedComponent: React.FC<T>
) {
	const BaseEffectInterface: React.FC<T> = (props) => {
		const { buffer, reversedBuffer } = useBaseInstrument(props);

		return (
			<div>
				Test instrument interface
				<WrappedComponent
					{...props}
					buffer={buffer}
					reversedBuffer={reversedBuffer}
				/>
			</div>
		);
	};

	return BaseEffectInterface;
}
