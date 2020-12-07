var ERC721MintableComplete = artifacts.require('ERC721MintableComplete');
const TruffleAssert = require('truffle-assertions');

contract('TestERC721Mintable', accounts => {

    const account_one = accounts[0];
    const account_two = accounts[1];
    const account_three = accounts[2];

    const Name = "Houses";
    const Symbol = "HOU";
    let owner;
    let instance;

    describe('mintable complete', function () {
        beforeEach(async function () {
            owner = account_one;
            instance = await ERC721MintableComplete.new(Name, Symbol, {from: owner});

            // TODO: mint multiple tokens
            await instance.mint(account_one, 1);
            await instance.mint(account_two, 2);
        })
        it('should return total supply', async function () {
            assert.equal(instance.totalSupply(), 2, "Error: total supply is not two");
        })

        it('should get token balance', async function () {
            assert.equal(instance.balanceOf(account_one), 1, "Error: balance of this owner should be one");
            assert.equal(instance.balanceOf(account_one), 1, "Error: balance of this owner should be one");

        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            assert.equal(instance.tokenUri(1), "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1",
                          "Error: Token Uri is incorrect");
            assert.equal(instance.tokenUri(2), "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2",
                          "Error: Token Uri is incorrect");
        })

        it('should transfer token from one owner to another', async function () {

        })
    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            instance = await ERC721MintableComplete.new({from: account_one});
        })

        it('should fail when minting when address is not contract owner', async function () {

        })

        it('should return contract owner', async function () {

        })

    });

    describe('Ownable.sol Functionality', function () {
        beforeEach(async function () {
            owner = account_one;
            instance = await ERC721MintableComplete.new(Name, Symbol, {from: owner});
        });

        it('Should return Owner', async function() {
            assert.equal(await instance.getOwner.call(), owner, "Owner call does not equal contract owner");
        });

        it('Can transfer ownership', async function() {
            let transfer = await instance.transferOwnership(account_two, {from: owner});
            let newOwner = await instance.getOwner.call();
            assert.equal(newOwner, account_two, "Ownership did not transfer");
            TruffleAssert.eventEmitted(transfer, 'OwnershipTransfer');
        });
    });

    describe('Pausable.sol Functionality', function() {
        beforeEach(async function () {
            owner = account_one;
            instance = await ERC721MintableComplete.new(Name, Symbol, {from: owner});
        });

        it('Contract state can be paused', async function () {
            let pause = await instance.setPaused(true, {from: owner});
            TruffleAssert.eventEmitted(pause, 'Paused');
        })
    })

    describe('ERC721.sol Functionality', function () {
        beforeEach(async function () {
            owner = account_one;
            instance = await ERC721MintableComplete.new(Name, Symbol, {from: owner});
            await instance.mint(account_one, 1);
            await instance.mint(account_two, 2);
        });

        it('Should return token owner', async function () {
            let ownerOfToken = await instance.ownerOf.call(1);
            assert.equal(ownerOfToken, account_one, "Token owner is not correct");
        })

        it('Approve function runs as intended', async function () {
            let approval = await instance.approve(account_two, 1, {from: account_one});
            let check = await instance.getApproved.call(1);

            assert.equal(check, account_two, "approval did not approve account_two");
            TruffleAssert.eventEmitted(approval, 'Approval');
        })

        it('Approve all function runs as intended', async function () {
            await instance.setApprovalForAll(account_two, true, {from: account_one});
            let check = await instance.isApprovedForAll.call(account_one, account_two);
            await instance.approve(account_two, 1, {from: account_three});

            assert.equal(check, true, "Account_two is not approved for all account_one");
        })

        it('Transfer from function works as intended', async function () {
            await instance.approve(account_one, 2, {from: account_two});
            let transfer1 = await instance.transferFrom(account_one, account_three, 1, {from: account_one});
            let newOwner1 = await instance.ownerOf.call(1);

            let transfer2 = await instance.transferFrom(account_two, account_three, 2, {from: account_one});
            let newOwner2 = await instance.ownerOf.call(2);

            assert.equal(newOwner1, account_three, "Transfer1 did not work");
            TruffleAssert.eventEmitted(transfer1, "Transfer");

            assert.equal(newOwner2, account_three, "Transfer2 did not work");
            TruffleAssert.eventEmitted(transfer2, "Transfer");
        })
    })
})
