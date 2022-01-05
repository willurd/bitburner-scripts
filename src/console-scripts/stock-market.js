(() => {
  const NUMBER_STRING_FACTORS = [
    ['k', 1e3],
    ['m', 1e6],
    ['b', 1e9],
    ['t', 1e12],
    ['q', 1e15],
  ];

  const getFactorFromNumberString = (numberString) => {
    if (!numberString) {
      return 1;
    }

    for (const [unit, factor] of NUMBER_STRING_FACTORS) {
      if (numberString.endsWith(unit)) {
        return factor;
      }
    }

    return 1;
  };

  const numberStringToNumber = (numberString) => {
    if (!numberString) {
      return 0;
    }

    const factor = getFactorFromNumberString(numberString);
    return parseFloat(numberString.replace(/^\$/, ''), 10) * factor;
  };

  const getCurrentPage = () => {
    const el = document.querySelector('.jss1502');

    if (!el) {
      return 'Unknown';
    }

    return el.textContent;
  };

  const getStatLine = (el) => {
    const container = el.querySelector('.css-1tsvksn');

    if (!container) {
      return {};
    }

    const text = container.textContent;
    const [name, ticker, currentPriceLabel, volatilityLabel, forecastLabel] = text
      .replace(/(\s{2,}|\s+-\s+)/g, '\t')
      .split('\t');
    const price = numberStringToNumber(currentPriceLabel);
    const volatility = parseFloat(volatilityLabel.replace('Volatility: ', ''));
    const forecast = forecastLabel.replace('Price Forecast: ', '');
    const priceIncreased = !!container.querySelector('.css-18ubon4'); // CSS class for "green" stocks.

    return {
      name,
      ticker,
      price,
      volatility,
      forecast,
      priceIncreased,
    };
  };

  const getPosition = (el) => {
    const container = el.querySelector('.css-jltqb6');

    if (!container) {
      return {};
    }

    const [$maxSharesLabel, $askPriceLabel, $bidPriceLabel, $sharesLabel, $averagePriceLabel, $profitLabel] =
      container.querySelectorAll('.css-18ubon4');

    const maxShares = numberStringToNumber($maxSharesLabel.textContent.replace('Max Shares: ', ''));
    const askPrice = numberStringToNumber($askPriceLabel.textContent.replace('Ask Price: ', ''));
    const bidPrice = numberStringToNumber($bidPriceLabel.textContent.replace('Bid Price: ', ''));
    const shares = numberStringToNumber($sharesLabel.textContent.replace('Shares: ', ''));
    const averagePrice = numberStringToNumber(
      $averagePriceLabel.textContent.replace('Average Price: ', '').split(' ')[0],
    );
    const profit = numberStringToNumber($profitLabel.textContent.replace('Profit: ', '').split(' ')[0]);

    return {
      maxShares,
      askPrice,
      bidPrice,
      shares,
      averagePrice,
      profit,
    };
  };

  const getStockElements = () => Array.from(document.body.querySelectorAll('.css-13folgs'));

  const getStocks = () => {
    openAllStocks();

    return getStockElements().map((el) => {
      const statLine = getStatLine(el);
      const position = getPosition(el);

      return {
        el,
        ...statLine,
        ...position,
      };
    });
  };

  const getOwnedStocks = () => {
    const stocks = getStocks();
    return stocks.filter((s) => s.shares > 0);
  };

  const isStockElementOpen = (el) => {
    return !!el.querySelector('.css-jltqb6');
  };

  const openStockElement = (el) => {
    if (isStockElementOpen(el)) {
      return;
    }

    const button = el.querySelector('[role=button]');
    button.click();
  };

  const openAllStocks = () => {
    for (const el of getStockElements()) {
      openStockElement(el);
    }
  };

  const hasPositiveForecast = (stock) => stock.forecast.includes('+');

  const hasNegativeForecast = (stock) => stock.forecast.includes('-');

  const getStockInteractiveElements = (stockElement) => {
    const buttonContainer = stockElement.querySelector('.css-70qvj9');
    const [buyButton, sellButton, buyMaxButton, sellAllButton] = buttonContainer.querySelectorAll('.css-13ak5e0');
    return {
      buyButton,
      sellButton,
      buyMaxButton,
      sellAllButton,
    };
  };

  const sellPosition = (stock) => {
    console.log(`Selling ${stock.ticker} with forecast ${stock.forecast} and volatility ${stock.volatility}`);
    const buttons = getStockInteractiveElements(stock.el);
    buttons.sellAllButton.click();
  };

  const sellBadPositions = () => {
    for (const stock of getOwnedStocks()) {
      if (hasNegativeForecast(stock)) {
        sellPosition(stock);
      }
    }
  };

  const getGoodStocks = () => {
    let stocks = getStocks();

    stocks = stocks.filter(hasPositiveForecast);

    stocks.sort((a, b) => {
      if (a.forecast !== b.forecast) {
        return b.forecast.length - a.forecast.length;
      } else if (a.volatility !== b.volatility) {
        return b.volatility - a.volatility;
      } else {
        return a.price - b.price;
      }
    });

    return stocks;
  };

  const getCachOnHand = () => {
    const el = document.querySelectorAll('.css-1dix92e .jss1048')[1];

    if (!el) {
      return 0;
    }

    const label = el.textContent;
    return numberStringToNumber(label);
  };

  const buyBestStocks = () => {
    const minimumCash = 5e6;
    const cash = getCachOnHand();

    if (cash < minimumCash) {
      return;
    }

    const bestStock = getGoodStocks()[0];

    if (!bestStock) {
      return;
    }

    console.log(
      `Buying ${bestStock.ticker} with forecast ${bestStock.forecast} and volatility ${bestStock.volatility}`,
    );
    const buttons = getStockInteractiveElements(bestStock.el);
    buttons.buyMaxButton.click();
  };

  const tick = () => {
    if (getCurrentPage() !== 'Stock Market') {
      return;
    }

    sellBadPositions();
    buyBestStocks();
  };

  const stop = () => {
    clearInterval(window.bb.sm.tickIntervalId);
    delete window.bb.sm.tickIntervalId;
  };

  const start = () => {
    window.bb.sm.tickIntervalId = setInterval(tick, 3000);
    tick();
  };

  const setup = () => {
    if (window.bb && window.bb.sm) {
      window.bb.sm.stop();
    }

    window.bb = {
      sm: {
        start,
        stop,
      },
    };
  };

  const main = () => {
    setup();
    start();
  };

  main();
})();
