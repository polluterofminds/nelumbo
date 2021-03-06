const axios = require("axios");

const postToLotus = async (config) => {
  try {
    const res = await axios(config);
    if (res.error || res.data.error) {
      const message =
        res.data && res.data.error ? res.data.error.message : res.error.message;
      throw new Error(message);
    }
    return res;
  } catch (error) {
    throw error;
  }
};

class LotusClient {
  constructor(props) {
    this.host = props.host;
    this.token = props.token;
    this.config = {
      method: "post",
      url: this.host,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.token}`,
      },
    };
    this.validateConfig = () => {
      if (!props.host) {
        throw new Error(
          "You must provide an API host. e.g. http://127.0.0.1:1234/rpc/v0"
        );
      } else if (!props.token) {
        throw new Error("You must provide a valid Lotus token");
      }
    };
  }

  getChainHead = async () => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.ChainHead",
        params: [],
        id: 3,
      });
      const config = this.config;
      config.data = data;

      const res = await postToLotus(config);
      return res.data;
    } catch (e) {
      throw new Error(e);
    }
  };

  getParentMessages = async (cid) => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.ChainGetParentMessages",
        params: [
          {
            "/": cid,
          },
        ],
        id: 3,
      });

      const config = this.config;
      config.data = data;

      const res = await postToLotus(config);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  getMessages = async (finalBlock, to, from) => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.StateListMessages",
        params: [
          {
            To: to, 
            From: from
          },
          null,
          finalBlock,
        ],
        id: 3,
      });

      const config = this.config;
      config.data = data;

      const res = await postToLotus(config);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  getSingleMessage = async (messageCid) => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.ChainGetMessage",
        params: [
          {
            "/": messageCid
          },
        ],
        id: 3,
      });

      const config = this.config;
      config.data = data;

      const res = await postToLotus(config);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  getSyncState = async () => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.SyncState",
        params: null,
        id: 3,
      });

      const config = this.config;
      config.data = data;

      const res = await postToLotus(config);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  listMiners = async () => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.StateListMiners",
        params: [[]],
        id: 3,
      });

      const config = this.config;
      config.data = data;

      const res = await postToLotus(config);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  getMinerInfo = async (minerId) => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.StateMinerInfo",
        params: [minerId, null],
        id: 3,
      });

      const config = this.config;
      config.data = data;

      const res = await postToLotus(config);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  getMinerPower = async (minerId) => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.StateMinerPower",
        params: [minerId, []],
        id: 3,
      });

      const config = this.config;
      config.data = data;

      const res = await postToLotus(config);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  queryAsk = async (minerId, minerPeerId) => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.ClientQueryAsk",
        params: [minerPeerId, minerId],
        id: 3,
      });

      const config = this.config;
      config.data = data;
      config.timeout = 5000; //   If we don't get a response back in 5 seconds, we should timeout

      const res = await postToLotus(config);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  getPaddedPieceSize = async (cid) => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.ClientDealSize",
        params: [{ "/": cid }],
        id: 3,
      });
      const config = this.config;
      config.data = data;

      const res = await postToLotus(config);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  createDeal = async (ipfsHash, contentSize, minerId, price, futureEpoch) => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.ClientStartDeal",
        params: [
          {
            Data: {
              TransferType: "graphsync",
              Root: { "/": ipfsHash },
            },
            Wallet: this.wallet,
            Miner: minerId,
            EpochPrice: price,
            MinBlocksDuration: 518400,
            DealStartEpoch: futureEpoch,
            FastRetrieval: true,
            VerifiedDeal: false, //    When Pinata is a verified client, we will flip this to true
          },
        ],
        id: 3,
      });

      const config = this.config;
      config.data = data;
      //  Setting timeout back to infinity for deal creation because it can take a really long time
      config.timeout = 0;

      const res = await postToLotus(config);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  listDeals = async () => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.ClientListDeals",
        params: null,
        id: 3,
      });
      const config = this.config;
      config.data = data;

      const res = await postToLotus(config);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  getDeal = async (rootCid) => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.ClientGetDealInfo",
        params: [{ "/": rootCid }],
        id: 3,
      });
      const config = this.config;
      config.data = data;

      const res = await postToLotus(config);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  listWallets = async () => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.WalletList",
        params: null,
        id: 3,
      });
      const config = this.config;
      config.data = data;

      const res = await postToLotus(config);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  newWallet = async () => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.WalletNew",
        params: ["bls"],
        id: 3,
      });
      const config = this.config;
      config.data = data;
      const res = await postToLotus(config);
      return res.data;
    } catch (error) {
      throw error;
    }
  };

  walletBalance = async (walletAddress) => {
    try {
      const data = JSON.stringify({
        jsonrpc: "2.0",
        method: "Filecoin.WalletBalance",
        params: [walletAddress],
        id: 3,
      });
      const config = this.config;
      config.data = data;
      const res = await postToLotus(config);
      return res.data;
    } catch (error) {
      throw error;
    }
  };
}

export default LotusClient;
