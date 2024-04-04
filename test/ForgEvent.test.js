const {expect} = require("chai");
const {ethers} = require('hardhat');

describe("ForgEvent Tests", () => {

    let adds = [];
    let ForgEvent, refContract;

    beforeEach(async () => {
        ForgEvent = await ethers.getContractFactory("ForgEvent");
        adds = await ethers.getSigners();
        refContract = await ForgEvent.deploy();
    });

    describe("Deployment", async () => {
    });

    describe("Create Event", async () => {
    });
});