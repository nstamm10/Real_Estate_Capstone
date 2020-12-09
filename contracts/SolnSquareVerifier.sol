pragma solidity >=0.4.21 <0.6.0;

import "./ERC721Mintable.sol";
import "openzeppelin-solidity/contracts/drafts/Counters.sol";


// TODO define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
contract Verifier {
  function verifyTx(
                      uint[2] memory a,
                      uint[2][2] memory b,
                      uint[2] memory c, uint[2] memory input
                    )
                      public view returns (bool r);
}


// TODO define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is ERC721MintableComplete {

Verifier ver;
// TODO define a solutions struct that can hold an index & an address
struct Solution {
    uint256 index;
    address sol;
}
// TODO define an array of the above struct
Solution[] solutions;

// TODO define a mapping to store unique solutions submitted
mapping(bytes32 => Solution) submittedSolutions;

// TODO Create an event to emit when a solution is added
event SolutionAdded(uint256 ind, address sol);

// TODO Create a function to add the solutions to the array and emit the event

function addSolution(uint256 ind, address sol) {
    newSolution = Solution ({
      index: ind,
      sol: sol
    });
    solutions.push(newSolution);
    emit SolutionAdded(ind,sol);
}

// TODO Create a function to mint new NFT only after the solution has been verified
//  - make sure the solution is unique (has not been used before)
//  - make sure you handle metadata as well as tokenSuplly
function 

//if verify{
addSolution
mint
}
}
