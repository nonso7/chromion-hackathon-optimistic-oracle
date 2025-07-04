import {
  CreateNFTRequestParams,
  CreateRequestParams,
  generateCreateRequestParams,
  InputCreateRequestParams,
  InputNFTCreateRequestParams,
} from "@/hooks/onchain/useCreateRequest";
import { ActionMap, createContext } from "@/utils/context";
import { isEmpty } from "lodash";
import { PropsWithChildren, useContext, useReducer } from "react";
import { isAddress } from "viem";

export type CreateRequestType = {
  isModalOpen: boolean;
  isModalLoading: boolean;
  isSubmitting: boolean;
  isSubmitEnabled: boolean;
  isCreateTokenWrapperEnabled: boolean;
  params: CreateRequestParams | null;

  nftParams: CreateNFTRequestParams | null;
  tokenName: string | null;
  tokenSymbol: string | null;
  errorNotOwner: boolean;
};

const initialState: CreateRequestType = {
  isModalOpen: false,
  isModalLoading: false,
  isSubmitting: false,
  isSubmitEnabled: false,
  isCreateTokenWrapperEnabled: false,
  params: null,

  nftParams: null,
  tokenName: null,
  tokenSymbol: null,
  errorNotOwner: false,
};

export enum ActionTypes {
  // modal visibility
  OpenModal = "OPEN_MODAL",
  CloseModal = "CLOSE_MODAL",

  // loader
  EnableLoading = "ENABLE_LOADING",
  DisableLoading = "DISABLE_LOADING",

  EnableSubmitting = "ENABLE_SUBMITTING",
  DisableSubmitting = "DISABLE_SUBMITTING",

  UpdateCreateParams = "UPDATE_CREATE_PARAMS",

  UpdateNFTCreateParams = "UPDATE_NFT_CREATE_PARAMS",

  EnableCreateTokenWrapper = "ENABLE_CREATE_TOKEN_WRAPPER",
  DisableCreateTokenWrapper = "DISABLE_CREATE_TOKEN_WRAPPER",

  UpdateLoadedNFTTokenInfo = "UPDATE_LOADED_NFT_TOKEN_INFO",
  ShowErrorNotOwner = "SHOW_ERROR_NOT_OWNER",
  HideErrorNotOwner = "HIDE_ERROR_NOT_OWNER",

  Reset = "RESET",
}

type CreateRequestActionPayloads = {
  [ActionTypes.OpenModal]: undefined;
  [ActionTypes.CloseModal]: undefined;

  [ActionTypes.EnableLoading]: undefined;
  [ActionTypes.DisableLoading]: undefined;

  [ActionTypes.EnableSubmitting]: undefined;
  [ActionTypes.DisableSubmitting]: undefined;

  [ActionTypes.UpdateCreateParams]: InputCreateRequestParams;
  [ActionTypes.UpdateNFTCreateParams]: InputNFTCreateRequestParams;

  [ActionTypes.EnableCreateTokenWrapper]: undefined;
  [ActionTypes.DisableCreateTokenWrapper]: undefined;

  [ActionTypes.UpdateLoadedNFTTokenInfo]: {
    name: string | null;
    symbol: string | null;
  };
  [ActionTypes.ShowErrorNotOwner]: undefined;
  [ActionTypes.HideErrorNotOwner]: undefined;

  [ActionTypes.Reset]: undefined;
};

export type CreateRequestActions =
  ActionMap<CreateRequestActionPayloads>[keyof ActionMap<CreateRequestActionPayloads>];

const reducer = (
  state: CreateRequestType,
  action: CreateRequestActions
): CreateRequestType => {
  switch (action.type) {
    case ActionTypes.OpenModal:
      return { ...state, isModalOpen: true };
    case ActionTypes.CloseModal:
      return { ...state, isModalOpen: false };

    case ActionTypes.EnableLoading:
      return { ...state, isModalLoading: true };
    case ActionTypes.DisableLoading:
      return { ...state, isModalLoading: false };

    case ActionTypes.EnableSubmitting:
      return { ...state, isSubmitting: true };
    case ActionTypes.DisableSubmitting:
      return { ...state, isSubmitting: false };

    case ActionTypes.EnableCreateTokenWrapper:
      return { ...state, isCreateTokenWrapperEnabled: true };
    case ActionTypes.DisableCreateTokenWrapper:
      return { ...state, isCreateTokenWrapperEnabled: false };

    case ActionTypes.UpdateCreateParams:
      const params = generateCreateRequestParams(action.payload);
      const isSubmitEnabled =
        !isEmpty(params.question) &&
        !isEmpty(params.context) &&
        [0, 1].includes(params.answerType) &&
        params.rewardAmount > BigInt(0) &&
        params.challengeWindow > 0;

      return { ...state, params, isSubmitEnabled };

    case ActionTypes.UpdateNFTCreateParams: {
      const { context, originId, originNFT } = action.payload;

      return {
        ...state,
        nftParams: { context, originId, originNFT },
        isSubmitEnabled:
          !!context.trim() &&
          originId > BigInt(0) &&
          isAddress(originNFT, { strict: false }),
      };
    }

    case ActionTypes.UpdateLoadedNFTTokenInfo: {
      return {
        ...state,
        tokenName: action.payload.name,
        tokenSymbol: action.payload.symbol,
      };
    }

    case ActionTypes.ShowErrorNotOwner: {
      return {
        ...state,
        errorNotOwner: true,
      };
    }
    case ActionTypes.HideErrorNotOwner: {
      return {
        ...state,
        errorNotOwner: false,
      };
    }

    case ActionTypes.Reset:
      return { ...initialState };

    default:
      return state;
  }
};

export const CreateRequestContext = createContext<
  CreateRequestType,
  CreateRequestActions
>(initialState);

export const useCreateRequestContext = () => {
  const context = useContext(CreateRequestContext);
  if (context === undefined)
    throw new Error("useCreateRequestContext was used outside of its provider");
  return context;
};

const CreateRequestProvider = function ({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <CreateRequestContext.Provider value={{ state, dispatch }}>
      {children}
    </CreateRequestContext.Provider>
  );
};

export default CreateRequestProvider;
