## ClientGetDealStatus

This is a simple method that will return a more detailed status indication for a deal based on the `State` code. Here's an example: 

```
curl --location --request POST 'http://localhost:1234/rpc/v0' \
--header 'Authorization: Bearer YOUR ADMIN TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "Filecoin.ClientGetDealStatus",
    "params": [
        7
    ],
    "id": 3
}'
```

The response will look something like this: 

```
{
    "jsonrpc": "2.0",
    "result": "StorageDealActive",
    "id": 3
}
```

This makes it a lot easier to identify the current state of your deal. 