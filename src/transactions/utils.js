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
