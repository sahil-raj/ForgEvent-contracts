const {expect} = require("chai");
const {ethers} = require('hardhat');

const SHA256 = require("crypto-js/sha256");

describe("ForgEvent Tests", () => {

    let adds = [];
    let ForgEvent, refContract;

    beforeEach(async () => {
        ForgEvent = await ethers.getContractFactory("ForgEvent");
        adds = await ethers.getSigners();
        refContract = await ForgEvent.deploy();
    });

    describe("Deployment", async () => {
        it("should assign the deployer as the owner", async () => {
            expect(await refContract.owner()).to.equal(adds[0].address);
        });
    });

    describe("Create Event", async () => {
        describe("checks", async () => {
            it("should have a name", async () => {
                expect(refContract.createEvent("", [Date.now() + 1000, Date.now() + 10000], [100, 1000], [adds[1].address, adds[2].address], "{testJson: true}")).to.be.revertedWith("Must have a name");
            });
    
            it("must create event in the future", async () => {
                expect(refContract.createEvent("Test event", [Date.now(), Date.now() + 10000], [100, 1000], [adds[1].address, adds[2].address], "{testJson: true}")).to.be.revertedWith("Event must be in future");
            });
    
            it("shouldn't end event before starting it", async () => {
                expect(refContract.createEvent("Test event", [Date.now() + 100, Date.now() - 10000], [100, 1000], [adds[1].address, adds[2].address], "{testJson: true}")).to.be.revertedWith("Cannot end event before starting");
            });
    
            it("must have tickets", async () => {
                expect(refContract.createEvent("test event", [Date.now() + 1000, Date.now() + 10000], [0, 1000], [adds[1].address, adds[2].address], "{testJson: true}")).to.be.revertedWith("Must have 1 ticket atleast");
            });
        });
        it("must emit EventCreated on event creation", async () => {
            expect(refContract.createEvent("test event", [Date.now() + 1000, Date.now() + 10000], [100, 1000], [adds[1].address, adds[2].address], "{testJson: true}")).to.emit(refContract);
        });
    });
});