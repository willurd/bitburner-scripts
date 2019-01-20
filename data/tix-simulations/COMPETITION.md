# Trading Algorithm Competition

NOTE: I am considering running a competition for trading algorithms.
This document represents my current thoughts on what that competition
might look like.

You can use any data in this repo to build your algorithm (or even
produce your own with `tix-api-server` and `sm-simulation-data-daemon.js`),
but here's the catch: **Submissions will be graded against fresh sets
of data, likely two or three datasets each of 1 hour, 4 hours, 8 hours and
24 hours worth of data.**

## TODO

A runner needs to be created that implements the full stock market API
and potentially other APIs.

- TIX API Functions
  - `getStockSymbols() => Array<Symbol>`
  - `getStockPrice(sym) => number`
  - `getStockPosition(sym) => [Shares, AvgPrice, SharesShort, AvgPriceShort]`
  - `buyStock(sym, shares) => Price | 0`
  - `sellStock(sym, shares) => Price | 0`
  - `shortStock(sym, shares) => Price | 0`
  - `sellShort(sym, shares) => Price | 0`
  - `placeOrder(sym, shares, price, type, pos) => boolean`
  - `cancelOrder(sym, shares, price, type, pos) => void`
  - `getOrders() => { [Symbol]: Order }`
  - `getStockVolatility(sym) => number`
  - `getStockForecast(sym) => number`
  - `purchase4SMarketData() => boolean`
  - `purchase4SMarketDataTixApi() => boolean`
- Other Functions
  - `getServerMoneyAvailable('home')`
  - Anything else?

## Rules

- There are no minimum RAM usage requirements.
- Your algorithm must be able to run in under 1 minute on a 24 hour dataset.

## Scenarios

There are multiple scenarios your algorithm will be tested against.
TIX API access is assumed for all scenarios.

- Early Game
  - New Run
    - Cash: \$1 Million
    - 4S API Access: No
    - Shorting: No
    - Limit/Stop Orders: No
  - Up And Comer:
    - You've got TIX API access but no way to tell which way the wind will
      blow. What can you do?
    - Cash: \$50 Million
    - 4S API Access: No
    - Shorting: No
    - Limit/Stop Orders: No
  - In The Know:
    - Scanario: You've got full API access and cash to burn. Go nuts.
    - Cash: \$50 Million
    - 4S API Access: Yes
    - Shorting: No
    - Limit/Stop Orders: No
  - Just Woke Up:
    - Scenario: You have full API access, but you just installed augments.
      What can you do with \$1 Million?
    - Cash: \$1 Million
    - 4S API Access: Yes
    - Shorting: No
    - Limit/Stop Orders: No
- Late Game
  - In The Know:
    - Scanario: You've got full API access and cash to burn. Go nuts.
    - Cash: \$50 Million
    - 4S API Access: Yes
    - Shorting: Yes
    - Limit/Stop Orders: Yes
  - Just Woke Up:
    - Scenario: You have full API access, but you just installed augments.
      What can you do with \$1 Million?
    - Cash: \$1 Million
    - 4S API Access: Yes
    - Shorting: Yes
    - Limit/Stop Orders: Yes

## Run Result Format

| Author                                   | 1h r1                                    | r2                                       | r3                                       | 4h r1                                    | r2                                       | r3                                       | 8h r1                                    | r2                                       | r3                                       | 24h r1                                   | r2                                       | r3                                       |
| ---------------------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- | ---------------------------------------- |
| Winners                                  | [Your Name](https://github.com/yourname) | [Your Name](https://github.com/yourname) | [Your Name](https://github.com/yourname) | [Your Name](https://github.com/yourname) | [Your Name](https://github.com/yourname) | [Your Name](https://github.com/yourname) | [Your Name](https://github.com/yourname) | [Your Name](https://github.com/yourname) | [Your Name](https://github.com/yourname) | [Your Name](https://github.com/yourname) | [Your Name](https://github.com/yourname) | [Your Name](https://github.com/yourname) |
| [Your Name](https://github.com/yourname) | \$7638.32                                | \$7638.32                                | \$7638.32                                | \$7638.32                                | \$7638.32                                | \$7638.32                                | \$7638.32                                | \$7638.32                                | \$7638.32                                | \$7638.32                                | \$7638.32                                | \$7638.32                                |

## Prizes

Fame and prestige! What more could you ask for?
