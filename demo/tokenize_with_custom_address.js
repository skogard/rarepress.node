/******************************************************************************
*
* Tokenizing with a custom address, derived from a derivation path
*
* 1. add image to rarepress from web URL
* 2. print preview
* 3. mint an NFT
*
******************************************************************************/
const Rareterm = require('../index');
const terminalImage = require('terminal-image');
const got = require('got');
(async () => {
  // 1. initialize with custom key derivation path
  const rarepress = new Rareterm()
  await rarepress.init({
    key: "m'/44'/60'/0'/0/1",
    host: "https://rinkeby.rarenet.app/v1"
  })

  // 2. add to IPFS
  let cid = await rarepress.fs.add("https://thisartworkdoesnotexist.com")
  const body = await got('https://rinkeby.rarenet.app/ipfs/' + cid).buffer();

  // 3. Print preview
  console.log(await terminalImage.buffer(body));

  // 4. Mint
  let token = await rarepress.token.create({
    type: "ERC721",
    metadata: {
      name: "Rare",
      description: "Press",
      image: "/ipfs/" + cid
    }
  })
  console.log("token = ", token)

  await rarepress.fs.push(cid)
  await rarepress.fs.push(token.uri)

  let sent = await rarepress.token.send(token)
  console.log("https://rinkeby.rarible.com/token/" + sent.id)
  process.exit()
})();
