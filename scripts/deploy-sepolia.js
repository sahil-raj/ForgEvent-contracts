const { ethers, upgrades } = require("hardhat");

const main = async () => {
  const forgEvent = await ethers.getContractFactory("ForgEvent");
  const mc = await upgrades.deployProxy(forgEvent);

  console.log("deploying contract...");

  await mc.waitForDeployment();

  console.log(`ForgEvent deployed to: ${await mc.getAddress()}`);
  console.log(`owner of contract: ${await mc.owner()}`);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
