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
