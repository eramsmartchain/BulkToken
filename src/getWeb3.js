import Web3 from "web3";

const getAccounts = () => {
  return new Promise(function (resolve, reject) {
    (async () => {
      try {
        // Will open the MetaMask UI
        // You should disable this button while the request is pending!
        const { ethereum } = window;
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        resolve(accounts);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    })();
  });
};

let _web3Config = null;
let _web3Promise = null;
let getWeb3 = () => {
  if (!_web3Promise) {
    _web3Promise = new Promise(function (resolve, reject) {
      if (null !== _web3Config) {
        resolve(_web3Config);
        return;
      }
      // Wait for loading completion to avoid race conditions with ethereum injection timing.
      window.addEventListener("load", function () {
        // Checking if ethereum has been injected by the browser (Mist/MetaMask)
        if (window.hasOwnProperty("ethereum")) {
          // Use Mist/MetaMask's provider.
          let web3 = new Web3(Web3.givenProvider);
          web3.eth.net
            .getId()
            .then((netId) => {
              let netIdName, trustApiName, explorerUrl;
              netId = "" + netId;
              switch (netId) {
                case "1":
                  netIdName = "Mainnet";
                  trustApiName = "api";
                  explorerUrl = "https://etherscan.io";
                  console.log("This is Foundation", netId);
                  break;
                case "3":
                  netIdName = "Ropsten";
                  trustApiName = "ropsten";
                  explorerUrl = "https://ropsten.etherscan.io";
                  console.log("This is Ropsten", netId);
                  break;
                case "4":
                  netIdName = "Rinkeby";
                  trustApiName = "rinkeby";
                  explorerUrl = "https://rinkeby.etherscan.io";
                  console.log("This is Rinkeby", netId);
                  break;
                case "42":
                  netIdName = "Kovan";
                  trustApiName = "kovan";
                  explorerUrl = "https://kovan.etherscan.io";
                  console.log("This is Kovan", netId);
                  break;
                case "99":
                  netIdName = "POA Core";
                  trustApiName = "poa";
                  explorerUrl = "https://poaexplorer.com";
                  console.log("This is Core", netId);
                  break;
                case "77":
                  netIdName = "POA Sokol";
                  trustApiName = "https://trust-sokol.herokuapp.com";
                  explorerUrl = "https://sokol.poaexplorer.com";
                  console.log("This is Sokol", netId);
                  break;
                case "137":
                  netIdName = "Matic";
                  trustApiName = "api";
                  explorerUrl = "https://polygonscan.com";
                  console.log("This is Matic", netId);
                  break;
                case "80001":
                  netIdName = "Mumbai";
                  trustApiName = "mumbai";
                  explorerUrl = "https://mumbai.polygonscan.com";
                  console.log("This is Mumbai", netId);
                  break;
                case "56":
                  netIdName = "BSCMainnet";
                  trustApiName = "https://api.bscscan.com";
                  explorerUrl = "https://bscscan.com";
                  console.log("This is BSC Mainnet", netId);
                  break;
                case "97":
                  netIdName = "BSCTestnet";
                  trustApiName = "https://api-testnet.bscscan.com";
                  explorerUrl = "https://testnet.bscscan.com";
                  console.log("This is BSC Testnet", netId);
                  break;
                case "721529":
                  netIdName = "ERAMSmartChain";
                  trustApiName = "eram";
                  explorerUrl = "https://eramscan.com";
                  break;
                default:
                  netIdName = "Unknown";
                  console.log("This is an unknown network.", netId);
              }
              document.title = `${netIdName} - BulkTokenTransfer`;
              getAccounts()
                .then((accounts) => {
                  const firstAccount = accounts.length > 0 ? accounts[0] : null;
                  var defaultAccount =
                    web3.eth.defaultAccount || firstAccount || null;
                  if (defaultAccount === null) {
                    reject({
                      message:
                        "Please unlock your metamask and refresh the page",
                    });
                    return;
                  }
                  if (
                    web3.eth.estimateGas.__proto__ &&
                    web3.eth.estimateGas.__proto__.call
                  ) {
                    web3.eth.estimateGas.call =
                      web3.eth.estimateGas.__proto__.call;
                  }
                  const results = {
                    web3Instance: web3,
                    netIdName,
                    netId,
                    injectedWeb3: true,
                    defaultAccount,
                    trustApiName,
                    explorerUrl,
                  };
                  _web3Config = results;
                  resolve(_web3Config);
                })
                .catch((err) => {
                  reject(err);
                });
            })
            .catch((err) => {
              reject(err);
            });

          console.log("Injected web3 detected.");

          ethereum.on("chainChanged", (_chainId) => window.location.reload());
          ethereum.on("accountsChanged", (accounts) =>
            window.location.reload()
          );
        } else {
          // Fallback to localhost if no web3 injection.
          const errorMsg = `Metamask is not installed. Please go to
          https://metamask.io and return to this page after you installed it`;
          console.log("No web3 instance injected, using Local web3.");
          console.error("Metamask not found");
          reject({ message: errorMsg });
          return;
        }
      });
    });
  }
  return _web3Promise;
};

export default getWeb3;
