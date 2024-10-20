const { ethers } = require("hardhat");

async function main() {
  console.log("Starting the deployment...");

  const usdcAddress = "0x41e94eb019c0762f9bfcf9fb1e58725bfb0e7582";

  const NotaryPayment = await ethers.getContractFactory("NotaryPayment");
  console.log("Contract factory created.");

  const notaryPayment = await NotaryPayment.deploy(usdcAddress, {
    gasLimit: 6000000,
  });

  console.log("Contract object:", notaryPayment);

  if (notaryPayment.deployTransaction) {
    console.log(
      "Deployment transaction sent:",
      notaryPayment.deployTransaction.hash
    );

    const tx = await notaryPayment.deployTransaction.wait();
    console.log("Contract successfully deployed at:", notaryPayment.address);
    console.log("Transaction details:", tx);
  } else {
    console.error("Deployment failed: No deployTransaction available.");
  }
}

main().catch((error) => {
  console.error("Deployment failed:", error.message || error);
  process.exit(1);
});
