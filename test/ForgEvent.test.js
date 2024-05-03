const { expect } = require("chai");
const { ethers } = require("hardhat");

const SHA256 = require("crypto-js/sha256");
const utf8 = require("crypto-js/enc-utf8");
const CryptoJs = require("crypto-js");

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
        expect(
          refContract.createEvent(
            "",
            [Date.now() + 1000, Date.now() + 10000],
            [100, 1000],
            [adds[1].address, adds[2].address],
            "{testJson: true}"
          )
        ).to.be.revertedWith("Must have a name");
      });

      it("must create event in the future", async () => {
        expect(
          refContract.createEvent(
            "Test event",
            [Date.now(), Date.now() + 10000],
            [100, 1000],
            [adds[1].address, adds[2].address],
            "{testJson: true}"
          )
        ).to.be.revertedWith("Event must be in future");
      });

      it("shouldn't end event before starting it", async () => {
        expect(
          refContract.createEvent(
            "Test event",
            [Date.now() + 100, Date.now() - 10000],
            [100, 1000],
            [adds[1].address, adds[2].address],
            "{testJson: true}"
          )
        ).to.be.revertedWith("Cannot end event before starting");
      });

      it("must have tickets", async () => {
        expect(
          refContract.createEvent(
            "test event",
            [Date.now() + 1000, Date.now() + 10000],
            [0, 1000],
            [adds[1].address, adds[2].address],
            "{testJson: true}"
          )
        ).to.be.revertedWith("Must have 1 ticket atleast");
      });
    });
    // it("must create an correct event id and map it", async () => {
    //   const currTime = Date.now();
    //   await refContract.createEvent(
    //     "test event",
    //     [currTime + 1000, currTime + 10000],
    //     [100, 1000],
    //     [adds[1].address, adds[2].address],
    //     "{testJson: true}"
    //   );
    //   const abiCoder = new ethers.AbiCoder();
    //   const packedAbi = abiCoder.encode(
    //     ["uint256", "address", "string", "uint256", "uint256", "uint256"],
    //     [
    //       (await ethers.provider.getBlock()).timestamp,
    //       adds[0].address,
    //       "test event",
    //       currTime + 1000,
    //       currTime + 10000,
    //       0,
    //     ]
    //   );
    //   const sha = SHA256(packedAbi).toString();
    //   const expUid = ethers.encodeBytes32String("0x" + sha);
    //   expect(await refContract.forgMapping(expUid)).to.equal("");
    // });

    it("must create an correct event id and map it", async () => {
      const currTime = Date.now();
      await refContract.createEvent(
        "test event",
        [currTime + 1000, currTime + 10000],
        [100, 1000],
        [adds[1].address, adds[2].address],
        "{testJson: true}"
      );
      const abiCoder = new ethers.AbiCoder();
      const calldata = abiCoder.encode(
        ["uint256", "address", "string", "uint256", "uint256", "uint256"],
        [
          (await ethers.provider.getBlock()).timestamp,
          adds[0].address,
          "test event",
          currTime + 1000,
          currTime + 10000,
          0,
        ]
      );
      const expUid = ethers.keccak256(calldata).toString();
      expect((await refContract.forgMapping(expUid))[0]).to.equal("test event");
    });

    it("must emit EventCreated on event creation", async () => {
      expect(
        refContract.createEvent(
          "test event",
          [Date.now() + 1000, Date.now() + 10000],
          [100, 1000],
          [adds[1].address, adds[2].address],
          "{testJson: true}"
        )
      )
        .to.emit(refContract, "EventCreated")
        .withArgs(adds[0].address, "test event", undefined);
    });
  });

  describe("buy tickets", () => {
    beforeEach(async () => {
      const abiCoder = new ethers.AbiCoder();
      globalThis.currTime = Date.now();

      await refContract.createEvent(
        "test event",
        [currTime + 1000, currTime + 10000],
        [100, 1000],
        [adds[1].address, adds[2].address],
        "{testJson: true}"
      );
      const calldata = abiCoder.encode(
        ["uint256", "address", "string", "uint256", "uint256", "uint256"],
        [
          (await ethers.provider.getBlock()).timestamp,
          adds[0].address,
          "test event",
          currTime + 1000,
          currTime + 10000,
          0,
        ]
      );
      globalThis.expUid = ethers.keccak256(calldata).toString();
    });

    describe("checks", async () => {
      it("Event must exsist and that too in future", async () => {
        expect((await refContract.forgMapping(expUid))[0]).to.equal(
          "test event"
        );
        expect((await refContract.forgMapping(expUid))[1]).to.be.greaterThan(
          currTime
        );
      });

      it("must have enough tickets", () => {
        expect(refContract.buyTickets(expUid, 9999)).to.be.revertedWith(
          "tickets not available"
        );
      });

      it("must send enough value", () => {
        expect(
          refContract.buyTickets(expUid, 1, {
            value: ethers.parseEther("0")
          })
        ).to.be.revertedWith("insufficient value");
      });
    });
  });
});
