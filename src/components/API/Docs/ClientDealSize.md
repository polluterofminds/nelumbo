## ClientDealSize

This is an important method and the result of it will come in handy when trying to initiate a deal with a miner. Given a file CID, this method will calculate the padded size of the deal. The padded size is simply an inflation of the actual size to accomodate binary calculations required by the Filecoin node. If you remember, when importing a file to your Filecoin node, you are given a `Root` CID. We'll need that

Here is an example request: 

```
curl --location --request POST 'http://localhost:1234/rpc/v0' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "Filecoin.ClientDealSize",
    "params": [
        {
            "/": "bafk2bzacecrkq5irm5tyldfhro3ib2iavg6xp32jqsthgtnajrbw3tfbohheg"
        }
    ],
    "id": 3
}'
```

The response will look like this: 

```
{
    "jsonrpc": "2.0",
    "result": {
        "PayloadSize": 1128,
        "PieceSize": 2048
    },
    "id": 3
}
```