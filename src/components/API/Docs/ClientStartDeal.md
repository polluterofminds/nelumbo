## ClientStartDeal 

When you're ready to propose a storage deal with a miner, you will use this method. If it's successful, this method will transfer FIL from your wallet, so it's important to make sure you get everything right. 

Here's an example snippet: 

```
curl --location --request POST 'http://localhost:1234/rpc/v0' \
--header 'Authorization: Bearer YOUR ADMIN TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "Filecoin.ClientStartDeal",
    "params": [
        {
            "Data": {
              "TransferType": "graphsync",
              "Root": { "/": "CID" },
            },
            "Wallet": "t3uvxx7f5p6msj2sqkf64xvm2ys7gpgu3gfjkjyljfhvk2h4565nlqak2mq6tn5qbyhxptpbrmnloqwbtpja5q",
            "Miner": "MINER ID",
            "EpochPrice": "price",
            "MinBlocksDuration": 518400,
            "DealStartEpoch": 1001,
            "FastRetrieval": true,
            "VerifiedDeal": false
          }
    ],
    "id": 3
}'
```

There's a lot to unpack with this method's parameters. Let's go line by line. 

The `Data` object includes both a `TransferType` and a `Root` object for handling the serialized CID you plan to store with the miner. You can leave `TransferType` alone, but the `Root` CID should be the CID you received after importing your data into your Filecoin node. 

*A note on IPFS: if you have configured your Filecoin node to pull data from the IPFS network, you can pass in an IPFS hash that has not previously been imported into your Filecoin node.*

The `Wallet` parameter is the wallet associated with your node that you are using to execute the deal. 

The `Miner` parameter is the miner ID that you have decided to propose a deal with. You would have used this same ID when running the `ClientQueryAsk` method. 

The `Epoch` price is where things get tricky. You will need to convert the size of your file into GB. However, you can't use the raw file size of the item you stored. You need to use the result you get from the `ClientDeal` size method. Once you have that, then convert it to gigabytes. Once you have the size in gigabytes, you need to multiply that by the Miner's ask price. 

It is very important to round up whatever value you end up with. You cannot pass in a decimal. The value you pass in for `EpochPrice` must be a stringified whole number. 

The `MinBlocksDuration` parameter should be at least 6 months (the current minimum) as represented by epochs (30 second periods of time). For convenience, you can simply pass in 518400 to get to the standard 6 months time period.

The `DealStartEpoch` is another tricky parameter. You can omit this field, but it's possible that your deal will be rejected as it will try to be executed before the miner can handle it. The best bet here is to find the chain's current epoch and calculate some epoch in the future. 

The `FastRetrieval` field should be set to true unless you do not need to access the content you're storing quickly when you do retrieve it. 

Finally, as mentioned earlier in the documentation, a `VerifiedDeal` is one in which is executed by a wallet address that the governance community has agreed to set as a verified client. When running a local devnet, you should likely always keep this set to `false`.

The response should look like this: 

```
{
    "jsonrpc": "2.0",
    "result": {
        "/": "Proposed Deal CID",       
    },
    "id": 3
}
```

The CID you get back is not the on-chain CID for the deal. It is instead an identifier to refer to up until the point at which the miner accepts the deal and starts transferring the data. 