/******************************************************************************
*
* 1. add image to rarepress from web URL
* 2. print preview
* 3. mint an NFT
*
******************************************************************************/
const Rarepress = require('../index');
const terminalImage = require('terminal-image');
const got = require('got');
(async () => {

  // 1. initialize
  const rarepress = new Rarepress()
  await rarepress.init({ host: "https://ropsten.rarepress.org/v0" })

  // 2. add to IPFS
  let cid = await rarepress.add("https://thisartworkdoesnotexist.com")
  const body = await got('https://ropsten.rarepress.org/ipfs/' + cid).buffer();

  // 3. Print preview
  console.log(await terminalImage.buffer(body));

  // 4. Mint
  try {
    let token = await rarepress.create({
      metadata: {
        name: "Rare",
        description: "Press",
        image: "/ipfs/" + cid
      }
    })
    console.log("token = ", token)
  } catch (e) {
    console.log("ERROR", e.toString())
  }
})();
