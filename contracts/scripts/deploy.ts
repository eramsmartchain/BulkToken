import { ethers, network, run } from "hardhat";
import { ContractFactory } from "ethers";
import { sleep } from "../sleep";

import * as fs from "fs";

type ContractJson = { abi: any; bytecode: string };
const artifacts: { [name: string]: ContractJson } = {
  // eslint-disable-next-line global-require
  ERAMAirDrop: require("../artifacts/contracts/ERAMAirDrop.sol/ERAMAirDrop.json"),
};

const main = async () => {
  // Compile contracts
  console.log("Compiled contracts.");
  await run("compile");

  const [owner] = await ethers.getSigners();
  const networkName = network.name;
  console.log("owner", owner.address);

  // Sanity checks
  if (networkName === "eramMainnet") {
    if (!process.env.KEY) {
      throw new Error("Missing private key, refer to README 'Deployment' section");
    }
  }

  // Deploy
  console.log("Deploying ERAMAirDrop...");
  let ERAMAirDrop_address = "0xe38a5f6b4B391b552934AaF7FF98E2370Cba12ab";
  let ERAMAirDrop;
  const ERAMAirDrop_Contract = new ContractFactory(
    artifacts.ERAMAirDrop.abi,
    artifacts.ERAMAirDrop.bytecode,
    owner
  );
  if (!ERAMAirDrop_address) {
    ERAMAirDrop = await ERAMAirDrop_Contract.deploy();
    await ERAMAirDrop.waitForDeployment();
    ERAMAirDrop_address = ERAMAirDrop.target.toString();
    console.log("ERAMAirDrop deployed to:", ERAMAirDrop.target);

  } else {
    ERAMAirDrop = new ethers.Contract(ERAMAirDrop_address, artifacts.ERAMAirDrop.abi, owner);
    console.log("ERAMAirDrop deployed to:", ERAMAirDrop.address);
  }

  const contracts = {
    ERAMAirDrop: ERAMAirDrop.target,
  };
  fs.writeFileSync(`./deployments/${networkName}.json`, JSON.stringify(contracts, null, 2));
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
