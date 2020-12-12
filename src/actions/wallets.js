import Lotus from '../utils/lotusSdk';
import { LOTUS_HOST } from '../utils/globals';

const instantiateLotus = (token) => {
  const lotus = new Lotus({
    host: LOTUS_HOST, 
    token
  })
}

export const getWallets = async () => {
  try {
    return [];
  } catch (error) {
    return error;
  }
}