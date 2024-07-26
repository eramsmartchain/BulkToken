import React from "react";
import Web3Utils from "web3-utils";
import Form from "react-validation/build/form";
import Textarea from "react-validation/build/textarea";
import { control } from "react-validation";
import { inject, observer } from "mobx-react";
import swal from "sweetalert";
import csvtojson from "csvtojson";
import Select from "react-select";
import CSVReader from "react-csv-reader";
import "../assets/stylesheets/react-select.min.css";

const ownInput = ({ error, isChanged, isUsed, ...props }) => (
  <div>
    {isChanged && isUsed && error}
    <input {...props} />
  </div>
);
const Input = control(ownInput);

const required = (value) => {
  if (!value.toString().trim().length) {
    return <span className="error">required</span>;
  }
};

const isAddress = (value) => {
  if (!Web3Utils.isAddress(value)) {
    return <span className="error">Token address is invalid</span>;
  }
};

@inject("UiStore")
@observer
export class FirstStep extends React.Component {
  constructor(props) {
    super(props);
    this.tokenStore = props.UiStore.tokenStore;
    this.txStore = props.UiStore.txStore;
    this.web3Store = props.UiStore.web3Store;
    this.web3Store.setStartedUrl("#/");
    this.onTokenAddress = this.onTokenAddress.bind(this);
    this.onDecimalsChange = this.onDecimalsChange.bind(this);
    // this.onJsonChange = this.onJsonChange.bind(this);
    this.state = {
      format: "csv",
      placeholder: `
0xCBA5018De6b2b6F89d84A1F5A68953f07554765e,12
0xa6Bf70bd230867c870eF13631D7EFf1AE8Ab85c9,1123.45645
0x00b5F428905DEA1a67940093fFeaCeee58cA91Ae,1.049
0x00fC79F38bAf0dE21E1fee5AC4648Bc885c1d774,14546
`,
      tokenAddress: { label: "", value: null },
      csv: "",
      loading: false,
    };
    // this.onSelectFormat = this.onSelectFormat.bind(this)
    this.onParse = this.onParse.bind(this);
    this.parseCompleted = false;
    // this.list = [];

    this.props.addNextHandler(this.onNext);
  }

  componentDidMount() {
    // this.tokenStore.reset()
    // this.txStore.reset()

    if ("" !== this.tokenStore.tokenAddress) {
      const tokenInfoArray = this.web3Store.userTokens.filter((t) => {
        return t.value === this.tokenStore.tokenAddress;
      });
      if (tokenInfoArray.length > 0) {
        const tokenInfo = tokenInfoArray[0];
        this.setState({ tokenAddress: { ...tokenInfo } });
      }
    }

    if (this.tokenStore.jsonAddresses.length > 0) {
      const csv = this.tokenStore.jsonAddresses.reduce((csv, v) => {
        const addresses = Object.keys(v);
        const val = addresses[0] + "," + v[addresses[0]];
        return csv + val + "\n";
      }, "");
      this.setState({ csv: csv });
    }
  }
  async onTokenAddress(e) {
    this.setState({ loading: true })
    if (!e) {
      this.setState({ tokenAddress: { label: "", value: "" }, loading: false });
      return;
    }
    const address = e.value;
    if (Web3Utils.isAddress(address)) {
      await this.tokenStore.setTokenAddress(address);
      this.setState({ tokenAddress: { label: e.label, value: e.value }, loading: false });
    }
  }
  onDecimalsChange(e) {
    this.tokenStore.setDecimals(e.target.value);
  }

  async onCsvChange(value) {
    return new Promise((res, rej) => {
      let addresses = [];
      csvtojson({ noheader: true })
        .fromString(value)
        .on("csv", (csv) => {
          let el = {};
          if (csv.length === 2 && csv[0] && csv[1]) {
            Object.defineProperty(el, csv[0], {
              value: csv[1],
              writable: true,
              configurable: true,
              enumerable: true,
            });
            addresses.push(el);
          }
        })
        .on("end", () => {
          try {
            this.parseCompleted = true;
            this.tokenStore.setJsonAddresses(addresses);
            res(addresses);
          } catch (e) {
            console.error(e);
            rej(e);
            swal({
              content: "Your CSV is invalid",
              icon: "error",
            });
          }
        });
    });
  }

  onParse(e) {
    // this.list = e.target.value;
    this.setState({ csv: e.target.value });
    // if(this.state.format === 'json') {
    //   this.onJsonChange(e.target.value)
    // }
    if (this.state.format === "csv") {
      this.onCsvChange(e.target.value);
    }
    return;
  }

  onNext = async (wizard) => {
    if ("home" !== wizard.step.id) {
      return;
    }

    try {
      setTimeout(async () => {
        await this.tokenStore.parseAddresses();
      }, 100);
      if (this.tokenStore.jsonAddresses.length === 0) {
        swal({
          title: "The address list is empty.",
          text: "Please make sure you set correct CSV or JSON format in input selector",
          icon: "error",
        });
        return;
      }
      if (this.tokenStore.invalid_addresses.length > 0) {
        swal({
          title:
            "There are invalid eth addresses. If you click Next, it will remove them from the list.",
          text: JSON.stringify(
            this.tokenStore.invalid_addresses.slice(),
            null,
            "\n"
          ),
          icon: "error",
        });
        return;
      }
      wizard.push("inspect");
    } catch (e) {
      console.error(e);
      swal({
        title: "Parsing Error",
        text: e.message,
        icon: "error",
      });
    }
  };

  render() {
    if (this.tokenStore.errors.length > 0) {
      swal("Error!", this.tokenStore.errors.toString(), "error");
    }
    if (this.web3Store.errors.length > 0) {
      swal("Error!", this.web3Store.errors.toString(), "error");
    }
    return (
      <div>
        {/* <div className="description">
          <ol>
            <li>Select Token Address</li>
            <li>Enter comma-separated list of addresses and values to send</li>
            <li>
              Press the <strong>Next</strong> button
            </li>
          </ol>
        </div> */}
        <Form className="form">
          <div className="form-inline">
            <div className="form-inline-i form-inline-i_token-address">
              <label htmlFor="token-address" className="multisend-label">
                Token Address
              </label>
              <Select.Creatable
                isLoading={this.web3Store.loading || this.state.loading}
                name="token-address"
                id="token-address"
                value={this.state.tokenAddress}
                onChange={this.onTokenAddress}
                loadingPlaceholder="Loading your token addresses..."
                placeholder="Please select a token or input the address"
                options={this.web3Store.userTokens.slice()}
              />
            </div>
          </div>

          <div className="form-inline">
            <div className="form-inline-i form-inline-i_token-address-values">
              <label htmlFor="token-address-values" className="multisend-label">
                List of addresses and values (Paste into textarea or upload a
                csv file)
              </label>
              <Textarea
                disabled={this.web3Store.loading}
                name="token-address-values"
                id="token-address-values"
                data-gram
                validations={[required]}
                placeholder={`Example(Address,TokenAmount): ${this.state.placeholder}`}
                value={this.state.csv}
                onBlur={this.onParse}
                id="addresses-with-balances"
                className="multisend-textarea"
              ></Textarea>
              <CSVReader
                onFileLoaded={(data, fileInfo, originalFile) => {
                  if (data && data.length > 0) {
                    this.setState({ csv: data.join("\n") });
                    this.onCsvChange(data.join("\n"));
                  }
                }}
              />
            </div>
          </div>
        </Form>
      </div>
    );
  }
}
