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
