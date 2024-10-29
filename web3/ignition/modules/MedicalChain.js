// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const ADDRESS = "0x425a9700d783bAC4CD3c9EE8578b9FF8a14EBF96";
const NAME = "ADMIN";
const EMAIL = "example@okmail.com";
const CONTACT = "1234567890";

module.exports = buildModule("MedicalChainModule", (m) => {

  const medicalchain = m.contract(
    "MedicalChain",
    [ADDRESS, NAME, EMAIL, CONTACT]
  );

  return { medicalchain };
});
