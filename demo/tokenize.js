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
(async () => {

  // 1. initialize
  const rarepress = new Rareterm()
  await rarepress.init({ host: "https://rinkeby.rarenet.app/v1" })

  // 2. add to rarepress fs
  let cid = await rarepress.fs.add("https://thisartworkdoesnotexist.com")
  const body = await got('https://rinkeby.rarenet.app/ipfs/' + cid).buffer();

  // 3. Print preview
  console.log(await terminalImage.buffer(body));

  try {
    // 4. create token
    let token = await rarepress.token.create({
      type: "ERC721",
      metadata: {
        name: "RRRRRRRRRRRRare",
        description: "Press",
        image: "/ipfs/" + cid
      }
    })
    console.log("token", token)

    // publish rarepress fs files to IPFS
    await rarepress.fs.push(cid)
    await rarepress.fs.push(token.uri)

    let sent = await rarepress.token.send(token)
    console.log("sent", sent)

    let trade = await rarepress.trade.create({
      what: { type: "ERC721", id: token.tokenId, },
      with: { type: "ETH", value: 27 * 100000000000000000 }
    })
    console.log("signed trade", trade)
    let sentTrade = await rarepress.trade.send(trade)
    console.log("sent trade", sentTrade)
  } catch (e) {
    console.log("ERROR", e.toString())
  }
  process.exit()
})();
