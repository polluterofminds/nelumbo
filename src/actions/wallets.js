import { instantiateLotus } from "../utils/helpers";

export const fetchBalance = async (lotus, wallet) => {
  try {
    const { result } = await lotus.walletBalance(wallet);
    return {wallet, balance: Math.pow(10, -18) * parseInt(result, 10)}
  } catch (error) {
    throw error;
  }
}

export const getWallets = async (token) => {
  try {
    const lotus = instantiateLotus(token);
    const wallets = await lotus.listWallets();
    const results = await Promise.all(wallets.result.map((wallet) => {
      return fetchBalance(lotus, wallet)
    }))    
    return results;
  } catch (error) {
    return error;
  }
};

export const newWallet = async (token) => {
  try {
    const lotus = instantiateLotus(token);
    await lotus.newWallet();
    return true;
  } catch (error) {
    throw error;
  }
}
