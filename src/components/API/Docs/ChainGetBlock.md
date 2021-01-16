## ChainGetBlock 

This method will allow you to get information about a specific block in the chain, as identified by its CID. How do you get the CID? This is where chain traversal comes into play. By starting with the ChainHead method, you can traverse the chain backwards. If you use the ChainHead method, you'll see there is a `Parents` array with at least one CID. Grab that CID and you can now get the previous block from the ChainHead. 

Here's an example: 

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

The response should look a lot like the ChainHead response: 

```
{
    "jsonrpc": "2.0",
    "result": {
        "Miner": "t01000",
        "Ticket": {
            "VRFProof": "lWT8wxSWuDpidGD7xV87JBPfZ2kTtFSnjPqt2M23ylVs1knXXmGuaPFGageGhtz1ADgoecSdd/yHCY1AGpK/SU6B8zrGMgQoFLn8QihCjXTcuWWv/opHQqMnA9jZHB0o"
        },
        "ElectionProof": {
            "WinCount": 3,
            "VRFProof": "gzLTCTYn34vQXSiEPJX4z3TjQSNiRXmJb5zmAfLy2Kh0WtEgJ+xffrZxW74OoWCfBnuIfmVqbBzLp+FSml55y96bqlAJKh2oi+/8nIi8hYKxE3UpzIGpGi1X9erYJ7q0"
        },
        "BeaconEntries": null,
        "WinPoStProof": [
            {
                "PoStProof": 0,
                "ProofBytes": "kfLnBEJn27ZsKi8VhSdkKJjAd8HkOSYX6wR9s/Fzw98El1FrQwXbabBPXXBfEOAbkjY28SHL9glK0CRXIuoAUG34VzlH50onsqjX6tvnan4ZmrmOBgLH0r95gSDlggVhDtEQbHuw3LipEUvoKMIMNZPVM4ik3q3tdDhMsmo8ZHLdXpHLzldKVgFHDF89S2zno1nmYlNXYPS4FLGfnSezFecQsSNllhAKkgWmMeMcqQ2b0SugJGXPvQkHRdZ2yxWE"
            }
        ],
        "Parents": [
            {
                "/": "bafy2bzacededaagohmnkh4qpp7q5372tpo4fmgta5ixe4pmrrwetc2j3oksww"
            }
        ],
        "ParentWeight": "5643648",
        "Height": 989,
        "ParentStateRoot": {
            "/": "bafy2bzaceaqytxqdbo2edsj44hvswewpw7tzbjfmumhsixzphqhvh2w4ezliu"
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
        "Timestamp": 1610828399,
        "BlockSig": {
            "Type": 2,
            "Data": "kl545MQM1kDrRqU4gfSzk2Y5paliBdqZ0eMoYDfjQoWRyho3d9ljiUrkHlR6grS2AXMjZ93dIgscFMOh71ghwoXpWSYl67NPq6ya9+FGuhLrssG3QINgb/Pm6CXDI+UD"
        },
        "ForkSignaling": 0,
        "ParentBaseFee": "100"
    },
    "id": 3
}
```