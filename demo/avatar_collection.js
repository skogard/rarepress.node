/******************************************************************************
*
* 1. add image to rarepress from web URL
* 2. print preview
* 3. mint an NFT
*
******************************************************************************/
const Rareterm = require('../index');
const terminalImage = require('terminal-image');
const fetch = require('node-fetch')
const got = require('got')
const svgToImg = require("svg-to-img");
const rarepress = new Rareterm();
(async () => {
  await rarepress.init({ host: "https://rinkeby.rarenet.app/v1" })

  let cids = []
  const token_total = 100
  const trade_total = 30
  for(let i=0; i<token_total; i++) {
    console.log("adding", i)
    let buf = await fetch(`https://avatars.dicebear.com/api/micah/${i}.svg`).then((res) => { return res.buffer() })
    const image = await svgToImg.from(buf).toPng();
    let cid = await rarepress.fs.add(image)
    cids.push(cid)
  }

  let tokenIds = []
  for(let i=0; i<token_total; i++) {
    console.log("minting", i)
    let token = await rarepress.token.create({
      type: "ERC721",
      metadata: {
        name: ""+ i,
        description: "Avatar #" + i,
        image: "/ipfs/" + cids[i]
      }
    })
    await rarepress.token.save(token)
    tokenIds.push(token.tokenId)
  }

  for(let i=0; i<trade_total; i++) {
    let val = Math.floor(Math.random() * trade_total)
    let index = Math.floor(Math.random() * token_total)
    let tokenId = tokenIds[index]
    console.log("tokenId", tokenId)
    let token = await rarepress.token.queryOne({
      where: { tokenId: tokenId }
    })
    console.log("token", token)
    let trade = await rarepress.trade.create({
      what: { type: "ERC721", id: tokenId, },
      with: { type: "ETH", value: val * 100000000000000000 }
    })
    await rarepress.trade.save(trade)
  }
  process.exit()
})();
