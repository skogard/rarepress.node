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
(async () => {
  await rarepress.init({ host: "https://rinkeby.rarenet.app/v1" })
  for(let i=0; i<10; i++) {
    // import files to rarepress fs
    let cid = await rarepress.fs.add("https://thispersondoesnotexist.com/image")
    const body = await got('https://rinkeby.rarenet.app/ipfs/' + cid).buffer();
    console.log(await terminalImage.buffer(body));
    // create token
    let token = await rarepress.token.create({
      type: "ERC721",
      metadata: {
        name: "Rare #"+ i,
        description: "Press",
        image: "/ipfs/" + cid
      }
    })
    // publish to IPFS
    await rarepress.fs.push(cid)
    await rarepress.fs.push(token.uri)
    // publish token to marketplace
    await rarepress.token.send(token)
  }
})();
