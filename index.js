const Binance = require("node-binance-api");
const _ = require("lodash");

const binance = new Binance().options({
  APIKEY: process.env.APIKEY,
  APISECRET: process.env.APIKEY,
});

const start = async () => {
    const futuresMarkPrice = await binance.futuresMarkPrice()
    const futuresMarkPriceFilered = _.filter(futuresMarkPrice, ({ symbol }) => symbol !== 'BTCDOMUSDT' && !_.startsWith(symbol, '1000'))
    const futuresMarkPriceSorted = _.orderBy(futuresMarkPriceFilered, ({ lastFundingRate }) => parseFloat(lastFundingRate), ['desc'])
    _.forEach(futuresMarkPriceSorted.slice(0, 1), async (item) => {
        const { symbol, lastFundingRate } = item
        console.log(symbol, _.round(_.multiply(lastFundingRate, 100), 4))    
        const [fprices, sprices] = await Promise.all([binance.futuresQuote(symbol), binance.bookTickers(symbol)])
        console.log('futures ask price', fprices.askPrice)
        console.log('spot bid price', sprices.bidPrice)
    })
}

start()