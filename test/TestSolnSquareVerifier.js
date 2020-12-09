// define a variable to import the <Verifier> or <renamedVerifier> solidity contract generated by Zokrates
let Verifier = artifacts.require("Verifier");
let SolnSquareVerifier = artifacts.require("SolnSquareVerifier");
const TruffleAssert = require('truffle-assertions');
const Web3 = require("../node_modules/web3-utils/src/index.js");

const proof_file = require("../zokrates/code/square/proof.json");

const proof_json = {
  "proof": {
    "a": [ Web3.toBN(proof_file.proof.a[0]).toString(), Web3.toBN(proof_file.proof.a[1]).toString() ],
    "b": [
        [ Web3.toBN(proof_file.proof.b[0][0]).toString(), Web3.toBN(proof_file.proof.b[0][1]).toString() ],
        [ Web3.toBN(proof_file.proof.b[1][0]).toString(), Web3.toBN(proof_file.proof.b[1][1]).toString() ]
    ],
    "c": [ Web3.toBN(proof_file.proof.c[0]).toString(), Web3.toBN(proof_file.proof.c[1]).toString() ]
    },
    "inputs": [ Web3.toBN(proof_file.inputs[0]).toString(), Web3.toBN(proof_file.inputs[1]).toString()]
}

let instance;
const Name = "Houses";
const Symbol = "HOU";
// Test if a new solution can be added for contract - SolnSquareVerifier
contract("Add solution", accounts => {
    before(async function () {
        let verContract = await Verifier.new();
        instance = await SolnSquareVerifier.new(verContract.address, Name, Symbol, {from: accounts[0]});
    })

    it("Correct Solution can be added", async function () {
        let add = await instance.addVerifiedSolution(
            proof_json.proof.a,
            proof_json.proof.b,
            proof_json.proof.c,
            proof_json.inputs,
            {from: accounts[1]}
        );

        TruffleAssert.eventEmitted(add, "SolutionAdded");
    });

    it("Same solution cannot be added twice", async function () {
        try {
            await instance.addVerifiedSolution(
                proof_json.proof.a,
                proof_json.proof.b,
                proof_json.proof.c,
                proof_json.inputs,
                {from: accounts[2]}
            );
            assert.equal(true, false, "Error was not thrown.");
        } catch (error) {
            assert.equal(true, true, "Correct error was thrown.");
        }
    });

    it("Incorrect Solution cannot be added", async function () {
        instance = await SolnSquareVerifier.new(accounts[0], Name, Symbol, {from: accounts[0]});
        try {
            await instance.addVerifiedSolution(
                proof_json.proof.a,
                proof_json.proof.b,
                proof_json.proof.c,
                [
                  "0x0000000000000000000000000000000000000000000000000000000000000003",
                  "0x0000000000000000000000000000000000000000000000000000000000000007"
                ],
                {from: accounts[1]}
            );
            assert.equal(true, false, "Error was not thrown.");
        } catch (error) {
            assert.equal(true, true, "Correct error was thrown.");
        }
    });
});

// Test if an ERC721 token can be minted for contract - SolnSquareVerifier
contract("Mint token", accounts => {
    before(async function () {
        let verContract = await Verifier.new();
        instance = await SolnSquareVerifier.new(verContract.address, Name, Symbol, {from: accounts[0]});
        await instance.addVerifiedSolution(
            proof_json.proof.a,
            proof_json.proof.b,
            proof_json.proof.c,
            proof_json.inputs,
            {from: accounts[1]}
        );
    })

    it("Token can correctly be minted", async function () {
        let mint = await instance.mintToken(proof_json.inputs[0], proof_json.inputs[1], {from: accounts[0]});

        TruffleAssert.eventEmitted(mint, "Minted");
    })

    it("Same solution cannot be used twice", async function () {
        try {
            await instance.mintToken(proof_json.inputs[0], proof_json.inputs[1], {from: accounts[0]});
            assert.equal(true, false, "Error was not thrown.");
        } catch (error) {
            assert.equal(true, true, "Correct error was thrown.");
        }
    })

    it("Solution must exist before minting", async function () {
        try {
            await instance.mintToken(
                "0x0000000000000000000000000000000000000000000000000000000000000003",
                "0x0000000000000000000000000000000000000000000000000000000000000007",
                {from: accounts[0]});
            assert.equal(true, false, "Error was not thrown.");
        } catch (error) {
            assert.equal(true, true, "Correct error was thrown.");
        }
    })

    it("Owner must call function", async function () {
        let verContract = await Verifier.new();
        instance = await SolnSquareVerifier.new(verContract.address, Name, Symbol, {from: accounts[0]});
        await instance.addVerifiedSolution(
            proof_json.proof.a,
            proof_json.proof.b,
            proof_json.proof.c,
            proof_json.inputs,
            {from: accounts[1]}
        );

        try {
            await instance.mintToken(proof_json.inputs[0], proof_json.inputs[1], {from: accounts[1]});
            assert.equal(true, false, "Error was not thrown.");
        } catch (error) {
            assert.equal(true, true, "Correct error was thrown.");
        }
    })
})
