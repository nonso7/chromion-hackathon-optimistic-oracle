import {
  FullRequestChallengeType,
  FullRequestProposalType,
  FullRequestReviewType,
} from "@/types/Requests";
import { gql } from "urql";
import { Address } from "viem";
import { querySubgraph } from "./urqlClient";

const FetchRequestForProposal = gql`
  query ($id: Bytes) {
    request(id: $id) {
      id
      answerType
      challengeWindow
      context
      createdAt
      isCrossChain
      originAddress
      originChainId
      question
      rewardAmount
      status
      truthMeaning
      scoring {
        final_decision
        score
        heatmap {
          ambiguity
          clarity
          completeness
          logical_consistency
          source_trust
          time_reference
        }
        ratings {
          ambiguity
          clarity
          completeness
          logical_consistency
          source_trust
          time_reference
        }
      }
      proposal {
        createdAt
        answer
        isChallenged
        proposer {
          id
        }
      }
      requester {
        id
      }
    }
  }
`;

const FetchRequestForReview = gql`
  query ($id: Bytes) {
    request(id: $id) {
      id
      answerType
      challengeWindow
      context
      createdAt
      isCrossChain
      originAddress
      originChainId
      question
      rewardAmount
      status
      truthMeaning
      scoring {
        final_decision
        score
        heatmap {
          ambiguity
          clarity
          completeness
          logical_consistency
          source_trust
          time_reference
        }
        ratings {
          ambiguity
          clarity
          completeness
          logical_consistency
          source_trust
          time_reference
        }
      }
      proposal {
        createdAt
        answer
        isChallenged
        proposer {
          id
        }
      }
      challenge {
        createdAt
        answer
        reason
        votesAgainst
        votesFor
        challenger {
          id
        }
      }
      reviews {
        createdAt
        supportsChallenge
        reviewer {
          id
        }
      }
      requester {
        id
      }
    }
  }
`;

export const fetchRequestForProposal = async (address: Address) =>
  querySubgraph<{ request: FullRequestProposalType }>(FetchRequestForProposal, {
    id: address,
  });

export const fetchRequestForChallenge = async (address: Address) =>
  querySubgraph<{ request: FullRequestChallengeType }>(
    FetchRequestForProposal,
    {
      id: address,
    }
  );

export const fetchRequestForReview = async (address: Address) =>
  querySubgraph<{ request: FullRequestReviewType }>(FetchRequestForReview, {
    id: address,
  });
