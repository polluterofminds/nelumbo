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

export const createCSV = (JSONData, ShowLabel = true) => {
  return new Promise((resolve, reject) => {
    try {
      JSONData.forEach(t => {
        t.CID = t.CID["/"]
      });
      //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
      const arrData =
        typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;

      let CSV = "";

      //This condition will generate the Label/Header
      if (ShowLabel) {
        let row = "";

        //This loop will extract the label from 1st index of on array
        for (let index in arrData[0]) {
          //Now convert each value to string and comma-seprated
          row += index + ",";
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + "\r\n";
      }

      //1st loop is to extract each row
      for (let i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + "\r\n";
      }

      if (CSV == "") {
        alert("Invalid data");
        return;
      }
      var element = document.createElement('a');
      element.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(CSV));
      element.setAttribute('download', "filecoin_explorer");

      element.style.display = 'none';
      document.body.appendChild(element);

      element.click();

      document.body.removeChild(element);
      resolve(CSV);
    } catch (error) {      
      reject(error);
    }
  });
}