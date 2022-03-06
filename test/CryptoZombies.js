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
        await contractInstance.createRandomZombie(zombieNames[0], {from: alice});
        await utils.shouldThrow(contractInstance.createRandomZombie(zombieNames[1], {from: alice}));
    })
})

