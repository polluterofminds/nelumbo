## ClientImport  

The primary method for importing data into your Filecoin node is through the `ClientImport` method. The big caveat here is this method is expecting a pathname to a local file. That becomes difficult when you are trying to push a file from some remote source. We'll cover that soon. 

Here's an example request: 

```
curl --location --request POST 'http://localhost:1234/rpc/v0' \
--header 'Authorization: Bearer YOUR ADMIN TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "Filecoin.ClientImport",
    "params": [
        {
            "Path": "/Users/USER_NAME/Downloads/message.txt",
            "IsCAR": false
        }
    ],
    "id": 3
}'
```

You'll note that there is an `IsCAR` flag. A CAR file is the preferred file format for Filecoin. However, if your file is not already in that format, Filecoin nodes will still accept it and eventually convert it before a deal is confirmed on chain. 

The response will look something like this: 

```
{
    "jsonrpc": "2.0",
    "result": {
        "Root": {
            "/": "bafk2bzacecrkq5irm5tyldfhro3ib2iavg6xp32jqsthgtnajrbw3tfbohheg"
        },
        "ImportID": 1
    },
    "id": 3
}
```

All you've done so far is add the file to a datastore your Filecoin  node can access to make deals from. The `Root` property is the content identifier (CID). You'll need this to initiate any deals on chain. 