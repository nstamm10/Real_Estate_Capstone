var ERC721MintableComplete = artifacts.require('ERC721MintableComplete.sol');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];

    const Name = "Houses";
    const Symbol = "HOU";
    let owner;

    describe('mintable complete', function () {
        beforeEach(async function () {
            owner = account_one;
            this.contract = await ERC721MintableComplete.new({from: owner});

            // TODO: mint multiple tokens
            await this.contract.mint(account_one, 1);
            await this.contract.mint(account_two, 2);


        it('should return total supply', async function () {
            assert.equal(this.contract.totalSupply(), 2, "Error: total supply is not two");
        })

        it('should get token balance', async function () {
            assert.equal(this.contract.balanceOf(account_one), 1, "Error: balance of this owner should be one");
            assert.equal(this.contract.balanceOf(account_one), 1, "Error: balance of this owner should be one");

        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            assert.equal(this.contract.tokenUri(1), "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1",
                          "Error: Token Uri is incorrect");
            assert.equal(this.contract.tokenUri(2), "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2",
                          "Error: Token Uri is incorrect");
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
})
