import { ethers } from "hardhat";

const main = async () => {
  // KeyStorage
  const KeyStorage = await ethers.getContractFactory("KeyStorage");
  const keyStorage = await KeyStorage.deploy();
  await keyStorage.deployed();

  console.log(
    "\x1b[36m%s\x1b[0m",
    "KeyStorage contract deployed to:",
    keyStorage.address
  );
};

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
