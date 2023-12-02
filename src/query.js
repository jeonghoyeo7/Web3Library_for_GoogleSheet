/**
 * Returns the ETH balance of an address in Ethereum Mainnet
 *
 * @param {"Address"} text - The address to check
 * @return {number} The balance of the address in ETH
 * @customfunction
 */
function GET_ETH_BALANCE_블파스_11월30일(address) {
  var balance = new Transaction(NETWORK_ETH).balance(address);
  return balance / 10 ** 18;
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
 * Returns the USDC balance of an address in Ethereum Mainnet
 *
 * @param {*} address
 * @return {*}
 * @customfunction
 */
function GET_USDC_BALANCE(address) {
  var balance = new ERC20(
    NETWORK_ETH,
    CONTRACT_ADDRESSES.ethereum.usdc,
  ).balance(address);
  return balance / 10 ** 6;
}

/**
 * Returns the USDT balance of an address in Ethereum Mainnet
 *
 * @param {*} address
 * @return {*}
 * @customfunction
 */
function GET_USDT_BALANCE(address) {
  var balance = new ERC20(
    NETWORK_ETH,
    CONTRACT_ADDRESSES.ethereum.usdt,
  ).balance(address);
  return balance / 10 ** 6;
}

/**
 * Returns the WETH balance of an address in Ethereum Mainnet
 *
 * @param {*} address
 * @return {*}
 * @customfunction
 */
function GET_WETH_BALANCE(address) {
  var balance = new ERC20(
    NETWORK_ETH,
    CONTRACT_ADDRESSES.ethereum.weth,
  ).balance(address);
  return balance / 10 ** 18;
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
