/******************************************************************************
*
* 1. add image to rarepress from web URL
* 2. print preview
* 3. mint an NFT
*
******************************************************************************/
const Rareterm = require('../index');
const terminalImage = require('terminal-image');
const got = require('got');
const rarepress = new Rareterm();
// We will create a multisig token signed by both alice and bob
// alice: "m'/44'/60'/0'/0/0
// bob: "m'/44'/60'/0'/0/1
(async () => {
  // 1. initialize
  let alice = await rarepress.init({ host: "https://rinkeby.rarenet.app/v1" })
  for(let i=0; i<10; i++) {

    // 2. add file to rarepress fs
    let cid = await rarepress.fs.add("https://thisartworkdoesnotexist.com")
    const body = await got('https://rinkeby.rarenet.app/ipfs/' + cid).buffer();
    console.log(await terminalImage.buffer(body));

    // 3. login with both accounts to get the addresses

    // 3.1. login with account 0 (alice)
    let alice = await rarepress.login("m'/44'/60'/0'/0/0")

    // 3.2. login with ccount 1 (bob)
    let bob = await rarepress.login("m'/44'/60'/0'/0/1")

    // 4. Bob will create a token with bob and alice as creators, and sign it.
    let bobToken = await rarepress.token.create({
      type: "ERC721",
      metadata: {
        name: "Rare #"+ i,
        description: "Press",
        image: "/ipfs/" + cid
      },
      creators: [{
        account: bob,
        value: 5000
      }, {
        account: alice,
        value: 5000
      }]
    })

    console.log("bob signed token", bobToken)

    // 5. login to account 0 (alice)
    await rarepress.login("m'/44'/60'/0'/0/0")

    // 10. sign the bob's signed token with alice's account
    let aliceBobToken = await rarepress.token.sign(bobToken)

    console.log("fully signed", aliceBobToken)

    // 11. publish rarepress fs files to IPFS
    await rarepress.fs.push(cid)
    await rarepress.fs.push(aliceBobToken.uri)

    // 12. send token to marketplace
    let sent = await rarepress.token.send(aliceBobToken)
    console.log("sent", sent)
  }
  process.exit()
})();
