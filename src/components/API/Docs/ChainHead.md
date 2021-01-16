## ChainHead

This method will simply return the current block information for the Filecoin chain as read by your node. It's a good method for quickly checking how large the chain is or for any future epoch estimations you might need to make. 

Here's an example request: 

```
curl --location --request POST 'http://localhost:1234/rpc/v0' \
--header 'Authorization: Bearer YOUR ADMIN TOKEN' \
--header 'Content-Type: application/json' \
--data-raw '{
                "jsonrpc": "2.0",
                "method": "Filecoin.ChainHead",
                "params": [],
                "id": 3
            }'
```

The response will be one of the more detailed responses from the API, and it should look something like this: 

```
{
    "jsonrpc": "2.0",
    "result": {
        "Cids": [
            {
                "/": "bafy2bzaceaeevjrvidbwzdxvnul7ywb6nlq3db3ruwfxsxt53zn3kmlhfqqoa"
            }
        ],
        "Blocks": [
            {
                "Miner": "t01000",
                "Ticket": {
                    "VRFProof": "poAl41c2z3HDtnO+i/QWhAij70/d+nxkwoo47AiQaVxI1KMpwqBJMz2R9iXGqpKZBfme/dVHAO8vLw3LLGYgBqeQuMwbwH4WnPu0FdWdw2KW6XfdxqwBPsD4dgGdoiCB"
                },
                "ElectionProof": {
                    "WinCount": 3,
                    "VRFProof": "gNRg6WV2azopAIslWAerT+soXQgLv9Y5ALU7KgKN5OXVwopuwUaOgfMnFVtrIqXtEoNLHNH3hsZZNP4pWOdL/BsQU6FjTuQmxUcCpY0TmViLqGT9ZEbAo75MqZE+xH2V"
                },
                "BeaconEntries": null,
                "WinPoStProof": [
                    {
                        "PoStProof": 0,
                        "ProofBytes": "jlFMEaAcqrJt7BYjoHT7UCi6B7wk9ME0oHw9nCJ4FdIjuy1kbUTvNFUuxQWpeOmGqS9k4GCSTOsP2N/23yl3jMhY26tCVhNcc9kgyqA+fKalpEBKx8bN+2d/oZASW4tgAnnHLWUXswfeoLKk/yh02dyh8YBMIhcAQB1TqO2hSFdRravdeGgXESfGegm67qzLkPHQi3TOJYFCBZdPpUf9aUtmDKCTKYGUlvvs1VkqmHQCc46unBPSj1Wz9KHMQOwL"
                    }
                ],
                "Parents": [
                    {
                        "/": "bafy2bzaceb2erd2tehuquedmxd7lddiqpqjt2kycpxkznhobqpk2i5aectik6"
                    }
                ],
                "ParentWeight": "5648640",
                "Height": 990,
                "ParentStateRoot": {
                    "/": "bafy2bzacebvli3nlktfuwbbqdgdwjufic3bepmppexfjo4diobp5ddzqhzdko"
                },
                "ParentMessageReceipts": {
                    "/": "bafy2bzacedswlcz5ddgqnyo3sak3jmhmkxashisnlpq6ujgyhe4mlobzpnhs6"
                },
                "Messages": {
                    "/": "bafy2bzacecmda75ovposbdateg7eyhwij65zklgyijgcjwynlklmqazpwlhba"
                },
                "BLSAggregate": {
                    "Type": 2,
                    "Data": "wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"
                },
                "Timestamp": 1610828403,
                "BlockSig": {
                    "Type": 2,
                    "Data": "j/CMZGpQSIKw4wTJRHq91PsaAUY7T8ZoTNiaKIMYKXXLCDdG9qxWbDGJ7zIw98IBCTE9IUj3v4sFkDq/RxzXwdmfOJzVpAUVi8yidwEBs14myKHuqT8svTnD8gqr9SIN"
                },
                "ForkSignaling": 0,
                "ParentBaseFee": "100"
            }
        ],
        "Height": 990
    },
    "id": 3
}
```

