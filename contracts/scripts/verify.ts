import { verifyContract } from "../verify";
import { network, run } from "hardhat";

async function main() {
  const networkName = network.name;

  const Contracts = await import(`../deployments/${networkName}.json`);

  console.log("Verifying ERAMAirDrop...");

  await run(`verify:verify`, {
    address: Contracts.ERAMAirDrop,
    contract: "contracts/ERAMAirDrop.sol:ERAMAirDrop",
    constructorArguments: [],
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
