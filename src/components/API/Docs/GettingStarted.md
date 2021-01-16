# Getting Started

Filecoin uses a gRPC API to communicate with your node. It's important to understand how to make use of this API, how it differs from a REST API, and what its limitations are. These docs are not meant to replace the Filecoin documentation. In fact, they are intended to be a high-level overview to get you started. 

### How are requests made

Unlike traditional REST architecture, API requests with gRPC are always `POST` requests. In the body of the request, information about how the API should response is included. For example, instead of something like this: 

```
curl API_ROOT_URI/v1/newToken \
  -h  Bearer API_KEY
```

You would do something like this: 

```
curl API_ROOT_URI/v1/newToken \
  -h  Bearer API_KEY
  -d jsonrpc="2.0" \
  -d method="Filecoin.AuthNew" \
  -d params=[null] \
  -d id="3"
```

Examples from some of the main methods you will use against your Filecoin node will be documented throughout this section of the application. 

### Spotted an Error?

Nelumbo is open source, and these docs are written in Markdown. A simple pull request in the Nelumbo repository will do the trick!
