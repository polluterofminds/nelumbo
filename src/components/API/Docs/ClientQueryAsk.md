## ClientQueryAsk

This is an important method in the lifecycle of a deal on Filecoin. Miners will quote the price they are charging to store data. To use this method, you will need to know which miner address you are querying. You can get a list of miners with the `StateListMiners` method. You will need the miner's peer ID which can be obtained from the `StateMinerInfo` method. 

Here is an example request: 

```
curl --location --request POST 'http://localhost:1234/rpc/v0' \
--header 'Content-Type: application/json' \
--data-raw '{
                "jsonrpc": "2.0",
                "method": "Filecoin.ClientQueryAsk",
                "params": ["12D3KooWEYPczjRJGhbgB2jdQKiLu9pkPyZnJAVBGuQ3KjTQncg2", "t01000"],
                "id": 3
            }'
```

The response will contain information about the asking price from the miner. This information is important and very specific. Let's take a look at an example response and then we'll walk through each property.

```
{
    "jsonrpc": "2.0",
    "result": {
        "Price": "500000000",
        "VerifiedPrice": "50000000",
        "MinPieceSize": 256,
        "MaxPieceSize": 2048,
        "Miner": "t01000",
        "Timestamp": 7,
        "Expiry": 1000007,
        "SeqNo": 0
    },
    "id": 3
}
```

**Price:** This is the price per GB per epoch in AttoFIL, the smallest denomination of Filecoin's native currency, FIL. There are 10^18 AttoFIL in a single FIL.

**VerifiedPrice:** Filecoin has a concept of Verified Deals. These deals are special deals initiated by a storage client who has been approved by the Filecoin governance body in charge of verified clients. Many miners will quote a significanty lower price for Verified Clients since there are additional block rewards for storing Verified Deals. 

**MinPieceSize:** This is the minimum file size the miner will accept, in bytes. 

**MaxPieceSize:**: This is the maximum file size the miner will accept, in bytes. Quick note on running a local dev net. The maximum size is currently very low (2kb), but in the wild, you'll likely be limited to a maximum of 32gb files. 

**Expiry:** This is the time in milliseconds that the offer price from the miner will expiry. The price could change after this time has expired. 