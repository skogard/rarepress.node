const Rareterm = require('../index')
const rarepress = new Rareterm();

(async () => {
  // 0. initialize
  await rarepress.init({ host: "https://rinkeby-beta.rarepress.org/v1" })

  // 1. Import a web file to the rarepress file system
  const cid = await rarepress.fs.add("https://thisartworkdoesnotexist.com")

  // 2. Create a signed token (not yet published)
  let signedToken = await rarepress.token.create({
    type: "ERC721",
    metadata: {
      name: "Title goes here",
      description: "Description goes here",
      image: "/ipfs/" + cid,
    },
  })

  // 3. publish to IPFS
  await rarepress.fs.push(cid)
  await rarepress.fs.push(signedToken.uri)

  // 4. Publish the signed token to Rarible
  let sent = await rarepress.token.send(signedToken)
  console.log("published token", sent)

  // 5. Create a trade with the token (not yet published)
  let trade = await rarepress.trade.create({
    what: { type: "ERC721", id: signedToken.tokenId, },
    with: { type: "ETH", value: 7 * 10**18 },
  })

  // 5. Publish the trade to Rarible
  let sentTrade = await rarepress.trade.send(trade)
  console.log("published trade", sentTrade)
})();
