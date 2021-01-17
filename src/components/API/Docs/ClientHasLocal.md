## ClientHasLocal

This is a pretty straight-forward method that simply indicates whether or not your Filecoin node has a file locally already. If you happen to have a file CID, but you can't remember if it's been imported to your node, you can use this method. 

Here's an example request: 

```
curl --location --request POST 'http://localhost:1234/rpc/v0' \
--header 'Authorization: Bearer YOUR ADMIN TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "Filecoin.ClientHasLocal",
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
    "result": true,
    "id": 3
}
```

Of course, if the file isn't available locally on your node, the response result will be false.