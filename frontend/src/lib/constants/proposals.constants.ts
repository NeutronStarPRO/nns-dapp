import { ProposalRewardStatus, ProposalStatus, Topic } from "@dfinity/nns";

// TODO: suggest to move into the store and add typing
export const DEFAULT_PROPOSALS_FILTERS = {
  topics: [
    Topic.NetworkEconomics,
    Topic.Governance,
    Topic.NodeAdmin,
    Topic.ParticipantManagement,
    Topic.SubnetManagement,
    Topic.NetworkCanisterManagement,
    Topic.NodeProviderRewards,
    Topic.SnsAndCommunityFund,
  ],
  rewards: [
    ProposalRewardStatus.AcceptVotes,
    ProposalRewardStatus.ReadyToSettle,
    ProposalRewardStatus.Settled,
    ProposalRewardStatus.Ineligible,
  ],
  status: [ProposalStatus.Open],
  excludeVotedProposals: false,
  lastAppliedFilter: undefined,
};

export const DEPRECATED_TOPICS = [Topic.SnsDecentralizationSale];

export const PROPOSER_ID_DISPLAY_SPLIT_LENGTH = 5;
