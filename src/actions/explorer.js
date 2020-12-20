import { instantiateLotus } from "../utils/helpers";
import { TRANSACTIONS, FILTERED_TRANSACTIONS } from "./types";

export const chainHead = async (token) => {
  try {
    const lotus = instantiateLotus(token);
    const head = await lotus.getChainHead();
    return head;
  } catch (error) {
    throw error;
  }
}

export const getWalletAddress = async (token) => {
  try {
    const lotus = instantiateLotus(token);
    const { result } = await lotus.listWallets();
    return result;
  } catch (error) {
    throw error;
  }
}

export const getMiners = async (token) => {
  try {
    const lotus = instantiateLotus(token);
    const { result } = await lotus.listMiners();
    
    return result;
  } catch (error) {
    throw error;
  }
}

export const getMessages = async (token, height, from, to) => {
  try {
    const lotus = instantiateLotus(token);
    const messages = await lotus.getMessages(null, to, null);
    return messages;
  } catch (error) {
    throw error;
  }
}

export const getSingleMessage = async (token, cid) => {
  try {
    const lotus = instantiateLotus(token);
    const message = await lotus.getSingleMessage(cid);
    return message;
  } catch (error) {
    throw error;
  }
}

export const fetchRecentTransactions = (dispatch) => {
  return async (token) => {
    const { result } = await chainHead(token);
    const { Height } = result;
    // const wallets = await getWalletAddress(token);
    const miners = await getMiners(token);    
    let allMessages = [];

    for(const miner of miners) {
      const { result:res } = await getMessages(token, Height, null, miner.replace('t','f'));
      for(const item of res) {
        allMessages.push(item['/']);
      }      
    }

    let messagesToDisplay = [];

    for(const message of allMessages) {
      const { result:res } = await getSingleMessage(token, message);
      messagesToDisplay.push(res);
    }
    dispatch({
      type: TRANSACTIONS, 
      payload: messagesToDisplay
    })
  }
}

export const filterTransactions = (dispatch) => {
  return (term, transactions) => {
    const filtered = transactions.filter(t => t.CID["/"].includes(term) || t.To.includes(term) || t.From.includes(term))
    dispatch({
      type: FILTERED_TRANSACTIONS, 
      payload: filtered
    })
  }
}