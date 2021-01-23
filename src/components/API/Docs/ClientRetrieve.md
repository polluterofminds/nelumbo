## ClientRetrieve

This method allows you to fetch data you have previously stored on the network. In fact, it allows anyone to fetch data that has been stored by anyone else. You'll need to know the CID for the data, and you'll have to being willing to pay the retrieval price. However, you can set a max retrieval price. 

Here's a simple example: 

```
curl --location --request POST 'http://localhost:1234/rpc/v0' \
--header 'Authorization: Bearer YOUR ADMIN TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "Filecoin.ClientRetrieve",
    "params": [
        {
            "Root": {
                "/": "bafyreic4is7yfrn5h6dzci3pil2wsgtpwqoipwbdh6tb2pqjfifghevnbq"
            },
            "Piece": null,
            "Size": 42,
            "Total": "0",
            "UnsealPrice": "10000000",
            "PaymentInterval": 42,
            "PaymentIntervalIncrease": 42,
            "Client": "t01000",
            "Miner": "t01000",
            "MinerPeer": {
                "Address": "t01000",
                "ID": "12D3KooWGuQafP1HDkE2ixXZnX6q6LLygsUG1uoxaQEtfPAt5ygp",
                "PieceCID": {"/": "bafk2bzacecrkq5irm5tyldfhro3ib2iavg6xp32jqsthgtnajrbw3tfbohheg"}
            }
        },
        {
            "Path": "./DownloadPath",
            "IsCAR": false
        }
    ],
    "id": 3
}'
```

You'll want to experiment with some of the values here, especially the `UnsealPrice`, but this is the basic layout of the request. You can see that the request allows you to specify the `Root` CID. This would be the original CID representing the data. You can then also pass in the `PieceCID` which is the CID you received when the deal was executed on chain. The `IsCAR` property should be set to `false` unless you specifically want to download the file as a CAR type file. 

The response will be a stream of your file content to the file path you indicated. 

