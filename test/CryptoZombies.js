const CryptoZombies = artifacts.require("CryptoZombies");
const utils = require("./helpers/utils");
const zombieNames = ["Zombie 1", "Zombie 2"];
contract("CryptoZombies", (accounts) => {
    let [alice, bob] = accounts;
    let contractInstance;

    // Hook that runs before each test
    // Creates a new clean instance of the contract before each tests.
    beforeEach(async () => {
        contractInstance = await CryptoZombies.new();
    });

    // Self-destruct contracts after each test
    afterEach(async () => {
        await contractInstance.kill();
    });

    // Test to create a new zombie
    it("should be able to create a new zombie", async () => {
        const result = await contractInstance.createRandomZombie(zombieNames[0], { from: alice });
        assert.equal(result.receipt.status, true);
        assert.equal(result.logs[0].args.name, zombieNames[0]);
    })

    // Test to not create another zombie
    it("should not allow two zombies", async () => {
        await contractInstance.createRandomZombie(zombieNames[0], { from: alice });
        await utils.shouldThrow(contractInstance.createRandomZombie(zombieNames[1], { from: alice }));
    })

    // Scenarios to group tests. (Skip with x)
    context("with the single-step transfer scenario", async () => {
        it("should transfer a zombie", async () => {
            const result = await contractInstance.createRandomZombie(zombieNames[0], { from: alice });
            const zombieId = result.logs[0].args.zombieId.toNumber();
            await contractInstance.transferFrom(alice, bob, zombieId, { from: alice });
            const newOwner = await contractInstance.ownerOf(zombieId);
            assert.equal(newOwner, bob);
        })
    })

    xcontext("with the two-step transfer scenario", async () => {
        it("should approve and then transfer a zombie when the approved address calls transferFrom", async () => {
            // TODO: Test the two-step scenario.  The approved address calls transferFrom
        })
        it("should approve and then transfer a zombie when the owner calls transferFrom", async () => {
            // TODO: Test the two-step scenario.  The owner calls transferFrom
        })
    })
})

