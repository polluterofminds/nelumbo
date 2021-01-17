## ClientListImports

If you ever forget what files you've already imported to your Filecoin node, you can use this method. It will return a list of CIDs representing the files you've already imported. 

Here's an example request: 

```
curl --location --request POST 'http://localhost:1234/rpc/v0' \
--header 'Authorization: Bearer YOUR ADMIN TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "Filecoin.ClientListImports",
    "params": null,
    "id": 3
}'
```

The response will look something like this: 

```
{
    "jsonrpc": "2.0",
    "result": [
        {
            "Key": 1,
            "Err": "",
            "Root": {
                "/": "bafk2bzacecrkq5irm5tyldfhro3ib2iavg6xp32jqsthgtnajrbw3tfbohheg"
            },
            "Source": "import",
            "FilePath": "/Users/USER_NAME/Downloads/message.txt"
        }
    ],
    "id": 3
}
```

The `FilePath` property becomes especially useful since you probably won't know what the CID represents if you're using this method. 