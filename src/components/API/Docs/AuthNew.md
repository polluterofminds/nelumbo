## AuthNew

This method allows you to create a new authentication token for your Filecoin node. By default, when setting up your node, a master token is created. It can be found at the following path: 

`${LOTUS_PATH}/token`

CAT that file and you'll see your token. But you may have situations where you need to generate additional access tokens. To do so, you would use this method. 

Here's an example request: 

```
curl --location --request POST 'http://localhost:1234/rpc/v0' \
--header 'Authorization: Bearer YOUR_ADMIN_LOTUS_TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
                "jsonrpc": "2.0",
                "method": "Filecoin.AuthNew",
                "params": [null],
                "id": 3
            }'
```

The result of this request, upon success, is structure like so: 

```
{
    "jsonrpc": "2.0",
    "result": "NEW AUTH TOKEN",
    "id": 3
}
```

The token created is base64 encoded. You'll need to decode it and get the resulting JWT before you can verify it. 

This token can now be used by others who do not have access to your main admin token. You can verify this token and upon verification allow access to whatever methods you so choose. 