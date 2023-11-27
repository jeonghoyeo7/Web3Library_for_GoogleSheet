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
