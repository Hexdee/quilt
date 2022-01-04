import { ethers } from "hardhat";

async function main() {
  // KeyStorage
  const KeyStorage = await ethers.getContractFactory("KeyStorage");
  const keyStorage = await KeyStorage.deploy();
  await keyStorage.deployed();

  console.log("KeyStorage deployed to:", keyStorage.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
