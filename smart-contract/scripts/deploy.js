const hre = require("hardhat");

async function main() {
  const totalSupply = BigInt(100000000000000000000000000);
  const tokenName = "TT"
  const decimalUnits = 18;
  const tokenSymbol = "T"

  const T = await hre.ethers.getContractFactory("T");
  const t = await T.deploy(totalSupply, tokenName, decimalUnits, tokenSymbol);

  await t.deployed();

  console.log(
    `Deployed to ${t.address}`
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
