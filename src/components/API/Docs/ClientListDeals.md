## ClientListDeals

This method will return an array of all your storage deals that have not failed. To find info on individual failed deals, you'll want to use the `ClientGetDealInfo` method. 

Here's an example request: 

```
curl --location --request POST 'http://localhost:1234/rpc/v0' \
--header 'Authorization: Bearer YOUR ADMIN TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "Filecoin.ClientListDeals",
    "params": null,
    "id": 3
}'
```

The response will look like this: 

```
{
    "jsonrpc": "2.0",
    "result": [],
    "id": 3
}
```

Of course, the `result` array will include your deals if you have any. 