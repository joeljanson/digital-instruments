import { EffectChain } from "../Effects/EffectComponents/EffectComponentInterfaces";
import { InstrumentChain } from "../Instruments/InstrumentComponents/InstrumentComponentInterfaces";
import { SequencerChains } from "../Sequencers/SequencerComponents/SequencerComponentInterfaces";

interface Session {
	sequencerChainData: SequencerChains;
	instrumentChainData: InstrumentChain;
	effectChainData: EffectChain;
}

export interface SessionInfo {
	name: string;
	id: string;
	category: string;
	imageUrl: string;
	// add other properties as needed
}

export interface SessionData {
	sessionInfo: SessionInfo;
	sessionData: Session;
}
