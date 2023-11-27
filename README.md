# Web3 Library for Google Apps Script

## Description

This Web3 library for Google Apps Script enables users to interact with blockchain data directly from Google Sheets. It simplifies the process of querying blockchain information, making it accessible through custom functions in Google Sheets. Ideal for users looking to integrate blockchain data into their spreadsheets without the need for complex coding.

This library is under construction. Any contributions are welcomed.

## Features

- **Blockchain Queries**: Perform real-time queries to Ethereum, Polygon, and other blockchain networks.
- **Google Sheets Integration**: Seamlessly integrate blockchain data into Google Sheets.
- **Support for Multiple Networks**: Compatible with Ethereum Mainnet/Testnet, Polygon Mainnet/Testnet, and more.
- **Customizable Functions**: Tailor the library functions to suit specific data retrieval needs.

## Installation

1. Open your Google Sheets document.
2. Go to `Extensions > Apps Script`.
3. Copy and paste the code from `script.gs` in this repository into the Apps Script editor.
4. Save and close the editor.

## Usage

After installing the library, you can use custom functions to fetch blockchain data. Here are a few examples:

- `=GET_ETH_BALANCE("0x...")`: Fetches the Ethereum balance of a given address.

Replace `"0x..."` with the actual address or transaction hash and `functionName` with the contract function's name.

## Examples

Below are some example use cases for this library:

- Tracking cryptocurrency balances in your portfolio.
- Monitoring the status of transactions.
- Fetching and displaying data from smart contracts.

## Contributing

Contributions are welcome! If you have a feature request, bug report, or a pull request, please open an issue or submit a pull request on GitHub.

## License

This project is licensed under [MIT License](LICENSE). Feel free to use, modify, and distribute the code as per the license terms.

## Disclaimer

This library is provided "as is", and the author bears no responsibility for any misuse or for any indirect damages caused.

## Contact

For any queries or support, please open an issue on the GitHub repository.

## Acknowledgements

Special thanks to all contributors and the open-source community for their ongoing support.
