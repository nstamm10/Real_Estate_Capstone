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

    describe('MintableComplete.sol functionality', function () {
        beforeEach(async function () {
            owner = account_one;
            instance = await ERC721MintableComplete.new(Name, Symbol, {from: owner});

            // TODO: mint multiple tokens
            await instance.mint(account_one, 1, {from: owner});
            await instance.mint(account_two, 2, {from: owner});
        })
        it('should return total supply', async function () {
            assert.equal(await instance.totalSupply.call(), 2, "Error: total supply is not two");
        })

        it('should get token balance', async function () {
            assert.equal(await instance.balanceOf.call(account_one), 1, "Error: balance of this owner should be one");
            assert.equal(await instance.balanceOf.call(account_one), 1, "Error: balance of this owner should be one");

        })

        // token uri should be complete i.e: https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1
        it('should return token uri', async function () {
            assert.equal(await instance.getTokenURI.call(1), "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/1",
                          "Error: Token Uri is incorrect");
            assert.equal(await instance.getTokenURI.call(2), "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/2",
                          "Error: Token Uri is incorrect");
        })

        it('should transfer token from one owner to another', async function () {
            await instance.transferFrom(account_one, account_two, 1, {from: account_one});
            assert.equal(await instance.balanceOf.call(account_one), 0, "Error: Balance of this owner should be zero");
            assert.equal(await instance.balanceOf.call(account_two), 2, "Error: Balance of this owner should be two");
        })
        it('permit account_three to transfer token from owner two to owner one', async function () {
            //give account three permission to transfer all of account_two tokens
            await instance.setApprovalForAll(account_three, true, {from: account_two});
            let approval = await instance.isApprovedForAll.call(account_two, account_three);
            assert.equal(approval, true, "Error with isApprovedForAll function");
            await instance.transferFrom(account_two, account_one, 2, {from: account_three});

            assert.equal(await instance.balanceOf.call(account_one), 2, "Error: Balance of this owner should be two");
            assert.equal(await instance.balanceOf.call(account_two), 0, "Error: Balance of this owner should be zero");
        })

    });

    describe('have ownership properties', function () {
        beforeEach(async function () {
            instance = await ERC721MintableComplete.new(Name, Symbol, {from: owner});
        })

        it('should fail when minting when address is not contract owner', async function () {
            try {
                await instance.mint(account_one, 1, {from: account_two});
                assert.equal(true, false, "Error was not throw.");
            } catch (error) {
                assert.equal(true, true);
            }
        })

        it('should return contract owner', async function () {
            let own = await instance.getOwner.call();
            assert.equal(own, owner, "Error: incorrect owner");
        })

    });

    describe('Metadata.sol functionality', function () {
        beforeEach(async function () {
          instance = await ERC721MintableComplete.new(Name, Symbol, {from: owner});
          await instance.mint(owner, 3, {from: owner} );
        })

        it('test that each of the four getters work in Metadata', async function () {
          //question, what if multiple tokens are minted?
          nombre = await instance.getName.call();
          sym = await instance.getSymbol.call();
          baseUri = await instance.getBaseTokenURI.call();
          tokenUri = await instance.getTokenURI.call(3);

          assert.equal(nombre, Name, "Error: name is incorrect");
          assert.equal(sym, Symbol, "Error: symbol is incorrect");
          assert.equal(baseUri.toString(), "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/", "Error: baseUri is incorrect");
          assert.equal(tokenUri.toString(), "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/3", "Error: tokenUri is incorrect");
        })
    })


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
