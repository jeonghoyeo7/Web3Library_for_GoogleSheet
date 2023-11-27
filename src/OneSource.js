/**
 * Returns the ETH balance of an address in Ethereum Mainnet
 *
 * @param {"Address"} text - The address to check
 * @return {number} The balance of the address in ETH
 * @customfunction
 */
function GET_ETH_BALANCE(address) {
  return new Transaction(NETWORK_ETH).balance(address);
}

/**
 * Returns the erc balance of an address in Ethereum Mainnet
 *
 * @param {"ofToken"} text - The token to check
 * @param {"Address"} text - The address to check
 * @return {number} The balance of the address in USDC
 * @customfunction
 */
function GET_ERC_BALANCE(ofToken, address) {
  var erc;
  switch (ofToken) {
    case "WETH":
      erc = CONTRACT_ADDRESSES.ethereum.weth;
      break;
    case "USDC":
      erc = CONTRACT_ADDRESSES.ethereum.usdc;
      break;
    case "USDT":
      erc = CONTRACT_ADDRESSES.ethereum.usdt;
      break;
    default:
      throw new Error("Unsupported token");
  }

  return new ERC20(NETWORK_ETH, erc).balance(address);
}

/**
 * Returns the token price in USD: "ETH" or "BTC"
 *
 * @param {"ofToken"} text - The token to check
 * @return {number} The token price in USD
 * @customfunction
 */
function GET_PRICE_USD(ofToken) {
  var address;
  switch (ofToken) {
    case "ETH":
      address = Chainlink_ADDRESSES.ethereum.ETHUSD;
      break;
    case "BTC":
      address = Chainlink_ADDRESSES.ethereum.BTCUSD;
      break;
    case "SOL":
      address = Chainlink_ADDRESSES.ethereum.SOLUSD;
      break;
    case "USDC":
      address = Chainlink_ADDRESSES.ethereum.USDCUSD;
      break;
    case "USDT":
      address = Chainlink_ADDRESSES.ethereum.USDTUSD;
      break;
    default:
      throw new Error("Unsupported token");
  }
  return new ChainlinkOracleV3(NETWORK_ETH, address).getPrice();
}

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

class TxData {
  constructor(selector) {
    this.selector = selector;
    this.params = [];
    this.data = "";
    this.arraysData = "";
    this.built = false;
  }

  addArg(data) {
    this.params.push({ type: "simple", data: data });
    return this;
  }

  addArgs(data) {
    this.params.push({ type: "multi", data: data });
    return this;
  }

  build() {
    var gap = 0;
    for (var i = 0; i < this.params.length; i++) {
      if (this.params[i]["type"] == "simple") {
        this.data += this.params[i]["data"];
      } else {
        this.data += xnumber_((this.params.length + gap) * 32);
        gap += this.params[i]["data"].length / 64;
        this.arraysData += this.params[i]["data"];
      }
    }
    return this.selector + this.data + this.arraysData;
  }
}

function xaddress_(address) {
  // Ensure the address starts with '0x' and is 40 characters long (20 bytes)
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
    throw new Error("Invalid Ethereum address format");
  }

  // Pad the address with leading zeros to make it 32 bytes long
  return "0".repeat(24) + address.slice(2).toLowerCase();
}

function xnumber_(number) {
  var hexValue = number.toString(16);
  return "0".repeat(64 - hexValue.length) + hexValue;
}

function decodeHex_(hexString) {
  return hexString
    .split(/\s|,\s?/) // Split into separate values in an array.
    .map((x) => parseInt(x, 16)) // Convert to integer values.
    .map((x) => String.fromCharCode(x)) // Replace integer value with equivalent character
    .join(""); // Put all characters into string
}

function decodeUniqueString_(result) {
  var chunks = result.slice(2).match(/.{64}/g);
  var length = parseInt(chunks[1]);
  var string = "";

  for (var i = 0; i < length; i++) {
    string += decodeHex_(chunks[2].slice(i * 2, i * 2 + 2));
  }
  return string;
}

function decodeArrayOfNumbers_(result) {
  var chunks = result.slice(2).match(/.{64}/g);

  var ids = [];

  for (var i = 2; i < chunks.length; i++) {
    ids.push(parseInt(chunks[i], 16));
  }
  return ids;
}

function decodeAddress_(address) {
  return "0x" + address.slice(address.length - 40);
}

function decodeArrayOfAddresses_(result, offset) {
  if (!offset) {
    offset = 2;
  }
  var chunks = result.slice(2).match(/.{64}/g);

  var addresses = [];

  for (var i = offset; i < chunks.length; i++) {
    addresses.push(decodeAddress_(chunks[i]));
  }
  return addresses;
}

function encodeArrayOfNumbers_(array) {
  var chunks = xnumber_(array.length);
  for (var i = 0; i < array.length; i++) {
    chunks += xnumber_(array[i]);
  }
  return chunks;
}

function encodeArrayOfAddresses_(array) {
  var chunks = xnumber_(array.length);
  for (var i = 0; i < array.length; i++) {
    chunks += xaddress_(array[i]);
  }
  return chunks;
}

function parseHexData(result) {
  // Remove the '0x' prefix
  var data = result.substring(2);

  // Each segment is 64 characters, corresponding to 32 bytes
  var segmentLength = 64;

  // Calculate the number of segments
  var numberOfSegments = data.length / segmentLength;

  var parsedResult = [];

  for (var i = 0; i < numberOfSegments; i++) {
    // Calculate start and end indices for the current segment
    var start = i * segmentLength;
    var end = start + segmentLength;

    // Parse the current segment
    var segmentValue = parseInt(data.substring(start, end), 16);

    // Add the parsed value to the result array
    parsedResult.push(segmentValue);
  }

  return parsedResult;
}

class ERC20 {
  constructor(network, address) {
    this.address = address.toLowerCase();
    this.network = network;
    this.decimals();
    this.symbol();
    this.name();
    this.totalSupply();
  }

  decimals() {
    var result = new Transaction(this.network).call(
      DEFAUT_ADDRESS,
      this.address,
      "0x313ce567",
    );
    this.decimals = parseInt(result);
  }

  symbol() {
    var result = new Transaction(this.network).call(
      DEFAUT_ADDRESS,
      this.address,
      "0x95d89b41",
    );
    this.symbol = decodeUniqueString_(result);
  }

  name() {
    var result = new Transaction(this.network).call(
      DEFAUT_ADDRESS,
      this.address,
      "0x06fdde03",
    );
    this.name = decodeUniqueString_(result);
  }

  balance(address) {
    var data = new TxData("0x70a08231").addArg(xaddress_(address)).build();
    var result = new Transaction(this.network).call(
      DEFAUT_ADDRESS,
      this.address,
      data,
    );
    return parseInt(result);
  }

  totalSupply() {
    var result = new Transaction(this.network).call(
      DEFAUT_ADDRESS,
      this.address,
      "0x18160ddd",
    );
    this.totalSupply = parseInt(result);
  }
}

class ERC721 {
  constructor(network, address) {
    this.address = address.toLowerCase();
    this.network = network;
    this.name();
    this.symbol();
    this.totalSupply();
  }

  symbol() {
    var result = new Transaction(this.network).call(
      DEFAUT_ADDRESS,
      this.address,
      "0x95d89b41",
    );
    this.symbol = decodeUniqueString_(result);
  }

  name() {
    var result = new Transaction(this.network).call(
      DEFAUT_ADDRESS,
      this.address,
      "0x06fdde03",
    );
    this.name = decodeUniqueString_(result);
  }

  balanceOf(address) {
    var data = new TxData("0x70a08231").addArg(xaddress_(address)).build();
    var result = new Transaction(this.network).call(
      DEFAUT_ADDRESS,
      this.address,
      data,
    );
    return parseInt(result);
  }

  ownerOf(tokenId) {
    var data = new TxData("0x6352211e").addArg(xnumber_(tokenId)).build();
    var result = new Transaction(this.network).call(
      DEFAUT_ADDRESS,
      this.address,
      data,
    );
    return decodeAddress_(result);
  }

  totalSupply() {
    var result = new Transaction(this.network).call(
      DEFAUT_ADDRESS,
      this.address,
      "0x18160ddd",
    );
    this.totalSupply = parseInt(result);
  }

  // Additional functions like tokenURI can be added as required
}

class ERC1155 {
  constructor(network, address) {
    this.address = address.toLowerCase();
    this.network = network;
    // Additional properties and initialization as needed
  }

  balanceOf(address, id) {
    var data = new TxData("0x00fdd58e")
      .addArg(xaddress_(address))
      .addArg(xnumber_(id))
      .build();
    var result = new Transaction(this.network).call(
      DEFAUT_ADDRESS,
      this.address,
      data,
    );
    return parseInt(result);
  }

  balanceOfBatch(addresses, ids) {
    // Implement batch balance query as per the ERC1155 standard
  }

  // Additional functions like uri can be added as required
}

const CONTRACT_ADDRESSES = {
  ethereum: {
    usdc: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    usdt: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
    weth: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
  },
  polygon: {
    usdc: "polygon mainnet usdc address",
    usdt: "polygon mainnet usdt address",
    weth: "polygon mainnet weth address",
  },
  // ... other networks
};
function Sha256Hash(value) {
  return BytesToHex(
    Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, value),
  );
}

function BytesToHex(bytes) {
  let hex = [];
  for (let i = 0; i < bytes.length; i++) {
    let b = parseInt(bytes[i]);
    if (b < 0) {
      c = (256 + b).toString(16);
    } else {
      c = b.toString(16);
    }
    if (c.length == 1) {
      hex.push("0" + c);
    } else {
      hex.push(c);
    }
  }
  return hex.join("");
}

// https://docs.chain.link/data-feeds/price-feeds/addresses?network=ethereum&page=1
const Chainlink_ADDRESSES = {
  ethereum: {
    ETHUSD: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
    BTCUSD: "0xF4030086522a5bEEa4988F8cA5B36dbC97BeE88c",
    SOLUSD: "0x4ffC43a60e009B551865A93d232E33Fce9f01507",
    USDCUSD: "0x8fFfFfd4AfB6115b954Bd326cbe7B4BA576818f6",
    USDTUSD: "0x3E7d1eAB13ad0104d2750B8863b489D65364e32D",
  },
};

/**
 * answer: is the answer for the given round
 * answeredInRound: is the round ID of the round in which the answer was computed. (Only some AggregatorV3Interface implementations return meaningful values)
 * roundId: is the round ID from the aggregator for which the data was retrieved combined with a phase to ensure that round IDs get larger as time moves forward.
 * startedAt: is the timestamp when the round was started. (Only some AggregatorV3Interface implementations return meaningful values)
 * updatedAt: is the timestamp when the round last was updated (i.e. answer was last computed)
 *
 * @class ChainlinkOracleV3
 */
class ChainlinkOracleV3 {
  constructor(network, address) {
    this.address = address.toLowerCase();
    this.network = network;
    this.decimals = this.decimals();
  }

  decimals() {
    var result = new Transaction(this.network).call(
      DEFAUT_ADDRESS,
      this.address,
      "0x313ce567",
    );
    return parseInt(result);
  }

  latestAnswer() {
    var result = new Transaction(this.network).call(
      DEFAUT_ADDRESS,
      this.address,
      "0x50d25bcd",
    );
    return parseInt(result);
  }

  getPrice() {
    return this.latestAnswer() / Math.pow(10, this.decimals);
  }

  latestRoundData() {
    var result = new Transaction(this.network).call(
      DEFAUT_ADDRESS,
      this.address,
      "0xfeaf968c",
    );

    var parsedData = parseHexData(result);

    var parsedResult = {
      roundId: parsedData[0],
      answer: parsedData[1],
      startedAt: parsedData[2],
      updatedAt: parsedData[3],
      answeredInRound: parsedData[4],
    };

    return parsedResult;
  }
}
