import { EffectChain } from "../Components/Effects/EffectComponents/EffectComponentInterfaces";
import { InstrumentChain } from "../Components/Instruments/InstrumentComponents/InstrumentComponentInterfaces";
import { SequencerChains } from "../Components/Sequencers/SequencerComponents/SequencerComponentInterfaces";

interface Session {
	sequencerChainData: SequencerChains;
	instrumentChainData: InstrumentChain;
	effectChainData: EffectChain;
}

export interface SessionData {
	session: Session;
}
