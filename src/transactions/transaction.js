class Transaction {
  constructor(network) {
    this.network = network;
    this.headers = {
      "Content-Type": "application/json",
    };
  }

  call(from, to, data) {
    var payload = {
      jsonrpc: "2.0",
      method: "eth_call",
      params: [
        {
          from: from,
          to: to,
          data: data,
        },
        "pending",
      ],
      id: "1",
    };

    var options = {
      method: "post",
      headers: this.headers,
      payload: JSON.stringify(payload),
    };

    var response = UrlFetchApp.fetch(this.network, options);
    return JSON.parse(response)["result"];
  }

  balance(address) {
    var payload = {
      jsonrpc: "2.0",
      method: "eth_getBalance",
      params: [address.toLowerCase(), "pending"],
      id: "1",
    };

    var options = {
      method: "post",
      headers: this.headers,
      payload: JSON.stringify(payload),
    };

    var response = UrlFetchApp.fetch(this.network, options);
    return parseInt(JSON.parse(response)["result"]) * 10 ** -18;
  }
}
