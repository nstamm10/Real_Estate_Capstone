var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    const Name = "Houses";
    const Symbol = "HOU";
    let owner;

    describe('match erc721 spec', function () {
        beforeEach(async function () {
            owner = account_one;
            this.contract = await ERC721MintableComplete.new({from: owner});

            // TODO: mint multiple tokens
            await ERC721MintableComplete
        })

        it('should return total supply', async function () {

        })

        it('should get token balance', async function () {

        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {

        })

        it('should transfer token from one owner to another', async function () {

        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            this.contract = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {

        })

        it('should return contract owner', async function () {

        })

    });

    describe('Ownable.sol Functionality', function () {
        beforeEach(async function () {
            owner = account_one;
            let instance = await ERC721MintableComplete.new(Name, Symbol, {from: owner});
        })

        it('Should return Owner', async function() {
            assert.equal(instance.getOwner({from: account_two}, owner, "Owner call does not equal contract owner");
        })

        it('Can transfer ownership', async function() {
            let transfer = instance.transferOwnership(account_two, {from: owner});
            assert.equal(instance.getOwner({from:account_two}), account_two, "Ownership did not transfer");
            TruffleAssert.eventEmitted(transfer, 'OwnershipTransfer');
        })
    })
})
