pragma solidity 0.5.0;

import "./ERC721Mintable.sol";
import "openzeppelin-solidity/contracts/drafts/Counters.sol";


// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract Verifier {
    function verifyTx(uint[2] memory a, uint[2][2] memory b, uint[2] memory c, uint[2] memory input)
    public view returns (bool r);
}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete {
    using Counters for Counters.Counter;

    // TODO define a solutions struct that can hold an index & an address
    struct Solution {
        uint256 index;
        address sol;
        bool unique;
    }

    Verifier private verifier;

    //define a counter variable to track the indices of the solutions
    Counters.Counter private indexCount;

    // TODO define an array of the above struct
    Solution[] private solutions;

    // TODO define a mapping to store unique solutions submitted
    mapping(bytes32 => Solution) private submittedSolutions;

    // TODO Create an event to emit when a solution is added
    event SolutionAdded(uint256 ind, address sol);

    //constructor
    constructor(address verifierAdd, string memory name, string memory symbol)
    ERC721MintableComplete(name, symbol) public {
        verifier = Verifier(verifierAdd);
    }
    // TODO Create a function to add the solutions to the array and emit the event

    function addVerifiedSolution(
    uint[2] memory a,
    uint[2][2] memory b,
    uint[2] memory c,
    uint[2] memory input) public {

        bytes32 solutionBytes = keccak256(abi.encodePacked(input[0], input[1]));
        require(submittedSolutions[solutionBytes].sol == address(0), "Solution has already been submitted");

        bool verified = verifier.verifyTx(a, b, c, input);
        require(verified, "Solution cannot be verified.");

        submittedSolutions[solutionBytes] = Solution({index: indexCount.current(), sol: msg.sender, unique: true});
        emit SolutionAdded(indexCount.current(), msg.sender);

        indexCount.increment();
    }

    // TODO Create a function to mint new NFT only after the solution has been verified
    //  - make sure the solution is unique (has not been used before)
    //  - make sure you handle metadata as well as tokenSuplly
    function mintToken(uint256 input1, uint256 input2) public {
        bytes32 solutionBytes = keccak256(abi.encodePacked(input1, input2));
        address owner = super.getOwner();

        require(submittedSolutions[solutionBytes].sol != address(0), "Solution not found");
        require(owner == msg.sender, "Only the owner can mint tokens");
        require(submittedSolutions[solutionBytes].unique, "Solution has already been used");

        uint256 id = submittedSolutions[solutionBytes].index;
        address receiver = submittedSolutions[solutionBytes].sol;

        super.mint(receiver, id);
        submittedSolutions[solutionBytes].unique = false;
    }
}
