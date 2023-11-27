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
