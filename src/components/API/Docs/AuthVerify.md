## AuthVerify

This method verifies a token you previously generated. It's the best way to ensure anyone accessing your node from the outside should be allowed to interact with your node. 

Here's a simple example of verification: 

```
curl --location --request POST 'http://localhost:1234/rpc/v0' \
--header 'Authorization: Bearer YOUR ADMIN TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
                "jsonrpc": "2.0",
                "method": "Filecoin.AuthVerify",
                "params": ["JWT TO VERIFY"],
                "id": 3
            }'
```

The response to this request is a simple 200 with no real body: 

```
{
    "jsonrpc": "2.0",
    "result": null,
    "id": 3
}
```

