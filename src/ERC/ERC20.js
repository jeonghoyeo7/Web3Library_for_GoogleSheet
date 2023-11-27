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
