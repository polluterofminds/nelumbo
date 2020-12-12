import Lotus from './lotusSdk';
import { LOTUS_HOST } from './globals';

export const instantiateLotus = (token) => {
  const lotus = new Lotus({
    host: LOTUS_HOST, 
    token
  });
  if(!lotus) {
    throw "couldn't instatiate lotus"
  }
  return lotus;
}