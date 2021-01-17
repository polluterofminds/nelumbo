## ChainGetMessage

Messages are the equivalent of transactions on other blockchains. The message is the on-chain data, encoded in a format what makes it easier for storing across many node. You will need the message's CID in order to fetch it from the chain. You can get a message CID in the response to `ChainHead` or `ChainGetBlock`.

Here is an example request: 

```
curl --location --request POST 'http://localhost:1234/rpc/v0' \
--header 'Authorization: Bearer YOUR ADMIN TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "method": "Filecoin.ChainGetMessage",
    "params": [
        {
            "/": "bafy2bzaceczlevr6bmjyh72fpr4mtcu5cz4kx6nidalmagu4b7fo6iyczqa5c"
        }
    ],
    "id": 3
}'
```

The response should look like this: 

```
{
    "jsonrpc": "2.0",
    "result": {
        "Version": 0,
        "To": "t01000",
        "From": "t3vmyd662r5jqjc3q2jjh3delpky23b25e4zd6qf4yqsyglnknwkl2gaxcajnm65eomyqd7syprpslefv2cnaq",
        "Nonce": 7,
        "Value": "0",
        "GasLimit": 1074178,
        "GasFeeCap": "1054398615",
        "GasPremium": "101740",
        "Method": 4,
        "Params": "gVgmACQIARIgRjLIvwcaGWO1SMJAt1mI/5NIwh3WqN508FYxA5+9z/s=",
        "CID": {
            "/": "bafy2bzaceczlevr6bmjyh72fpr4mtcu5cz4kx6nidalmagu4b7fo6iyczqa5c"
        }
    },
    "id": 3
}
```