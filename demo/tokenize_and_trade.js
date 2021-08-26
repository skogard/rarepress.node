/******************************************************************************
*
* Private Minimal mint + trade app
*
* 1. initizliae with default settings
* 2. add web image to rarepress
* 3. mint NFT
* 4. create a trade order
*
* None of these are published. Only created on Rarepress
*
******************************************************************************/
const Rareterm = require('../index');
(async () => {
  // 1.  Initialize rarepress
  const rarepress = new Rareterm()
  await rarepress.init({ host: "https://rinkeby.rarenet.app/v1" })

  // 2. Add to IPFS
  let cid = await rarepress.fs.add("https://thisartworkdoesnotexist.com")

  // 3. Mint NFT
  let token = await rarepress.token.create({
    type: "ERC721",
    metadata: {
      name: "👺",
      description: "Press",
      image: "/ipfs/" + cid
    }
  })
  console.log("token = ", token)

  // 4. Create a trade position
  let trade = await rarepress.trade.create({
    what: { type: "ERC721", id: token.tokenId, },
    with: { type: "ETH", value: 23* 100000000000000000 }
  })
  console.log("trade = ", trade)
  process.exit()

})();
