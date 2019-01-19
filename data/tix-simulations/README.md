# Stock Market Data

This folder contains sets of actual Bitburner Stock Market data, 1 hour's
worth of data in each file, pulled off the game using `wget` requests,
passing the data as query string parameters to `/scripts/tix-api-server.js`.
You can use this data optimize your own stock market trading algorithms.
Ticks are roughly 4 seconds apart.

## Format

```js
// https://flow.org/en/docs/getting-started/

type Symbol = string;
type OrgName = string;
type Price = number;
type Volatility = number;
type Forecast = number;
type SymbolTickData = [Price, Volatility, Forecast];
type Tick = {
  time: number, // timestamp in milliseconds
  stocks: { [Symbol]: SymbolTickData },
};

type SimulationJsonFile = {
  symbols: Array<Symbol>,
  names: { [Symbol]: OrgName },
  ticks: Array<Tick>,
};
```

## File Groupings

The datasets in this folder are unorganized. Here are the contiguous
groups of data:

```
2019-01-17 17:44:59
2019-01-17 18:44:55
1 simulation (1 hour)
  - 7570ee52-d5a4-4466-9440-fd76ef222872.json
```

```
2019-01-17 20:09:34
2019-01-17 22:15:16
2 simulations (2 hours)
  - 8d830100-1625-4c09-a9e7-15f2153471f9.json
  - dddd312c-ec71-46c1-932f-800c5c597fcb.json
```

```
2019-01-18 06:33:40
2019-01-18 08:33:54
2 simulations (2 hours)
  - 170199c6-db01-4102-85f7-d75a452d8a13.json
  - 9aff4b68-837d-4f8a-95f0-511daec96a38.json
```

```
2019-01-18 19:14:47
2019-01-19 02:17:59
7 simulations (7 hours)
  - 8cfc27ad-c282-4c70-9751-5590f20a8ef0.json
  - 5a6fe8b8-1d6e-46bd-aed5-e1060c3c0ab4.json
  - f92594d5-37b3-4ba9-a2cd-ac13c249a9b3.json
  - 057d90dd-c587-4526-8552-188297ecd102.json
  - b9c65dc1-75d6-4d46-9c3a-4851d246a7fb.json
  - d9b42f1a-9c67-4877-b1e0-eb082fae68ca.json
  - c519aaa2-5d8d-4eef-8f16-44e2e32aa38a.json
```

You can run `yarn tix-validate` to get this information as well.

## Example Data

```json
{
  "symbols": [
    "ECP",
    "MGCP",
    "BLD",
    "CLRK",
    "OMTK",
    "FSIG",
    "KGI",
    "FLCM",
    "STM",
    "DCOMM",
    "HLS",
    "VITA",
    "ICRS",
    "UNV",
    "AERO",
    "OMN",
    "SLRS",
    "GPH",
    "NVMD",
    "WDS",
    "LXO",
    "RHOC",
    "APHE",
    "SYSC",
    "CTK",
    "NTLK",
    "OMGA",
    "FNS",
    "SGC",
    "JGN",
    "CTYS",
    "MDYN",
    "TITN"
  ],
  "names": {
    "ECP": "ECorp",
    "MGCP": "MegaCorp",
    "BLD": "Blade Industries",
    "CLRK": "Clarke Incorporated",
    "OMTK": "OmniTek Incorporated",
    "FSIG": "Four Sigma",
    "KGI": "KuaiGong International",
    "FLCM": "Fulcrum Technologies",
    "STM": "Storm Technologies",
    "DCOMM": "DefComm",
    "HLS": "Helios Labs",
    "VITA": "VitaLife",
    "ICRS": "Icarus Microsystems",
    "UNV": "Universal Energy",
    "AERO": "AeroCorp",
    "OMN": "Omnia Cybersystems",
    "SLRS": "Solaris Space Systems",
    "GPH": "Global Pharmaceuticals",
    "NVMD": "Nova Medical",
    "WDS": "Watchdog Security",
    "LXO": "LexoCorp",
    "RHOC": "Rho Construction",
    "APHE": "Alpha Enterprises",
    "SYSC": "SysCore Securities",
    "CTK": "CompuTek",
    "NTLK": "NetLink Technologies",
    "OMGA": "Omega Software",
    "FNS": "FoodNStuff",
    "SGC": "Sigma Cosmetics",
    "JGN": "Joes Guns",
    "CTYS": "Catalyst Ventures",
    "MDYN": "Microdyne Technologies",
    "TITN": "Titan Laboratories"
  },
  "ticks": [
    {
      "time": 1547842484014,
      "stocks": {
        "ECP": [238692.242, 0.004, 0.5798708023503035],
        "MGCP": [1450884.279, 0.0043, 0.3809082289629031],
        "BLD": [182116485.15, 0.0074, 0.647103149875954],
        "CLRK": [273820.014, 0.0072, 0.5816210325911356],
        "OMTK": [362762.491, 0.0067, 0.5611196121044952],
        "FSIG": [6003341.376, 0.0104, 0.4332633218892887],
        "KGI": [83900577.752, 0.0076, 0.3295734058145068],
        "FLCM": [1471234.866, 0.0128, 0.5393537161717592],
        "STM": [761847.543, 0.008, 0.4220333124325952],
        "DCOMM": [461037.602, 0.0063, 0.5937286502811774],
        "HLS": [344682.848, 0.0064, 0.5550865285826637],
        "VITA": [38112.554, 0.0078000000000000005, 0.557287638862123],
        "ICRS": [1899380.642, 0.006500000000000001, 0.5707429886245112],
        "UNV": [78047.745, 0.0052, 0.56624767018626],
        "AERO": [72386.71, 0.0062, 0.5677380445307587],
        "OMN": [107999.503, 0.0067, 0.5432752362191919],
        "SLRS": [2754324.987, 0.0070999999999999995, 0.566482699014156],
        "GPH": [2376145.023, 0.0055000000000000005, 0.6917337795651926],
        "NVMD": [15586361.524, 0.0079, 0.6573460887264724],
        "WDS": [3491100.469, 0.025099999999999997, 0.5101377696672629],
        "LXO": [22420.427, 0.012199999999999999, 0.478763761135093],
        "RHOC": [2585.456, 0.0059, 0.4959334606503947],
        "APHE": [21569430.107, 0.018600000000000002, 0.5186537595816064],
        "SYSC": [19412.547, 0.017, 0.5048505566968611],
        "CTK": [10285.179, 0.009300000000000001, 0.5386543616562491],
        "NTLK": [55002647.07, 0.0412, 0.4884230170179791],
        "OMGA": [52762.347, 0.0101, 0.518115560725983],
        "FNS": [6406.03, 0.006999999999999999, 0.4888880538687477],
        "SGC": [2115350.067, 0.0297, 0.4942486274717753],
        "JGN": [49052.517, 0.0366, 0.49042189689948346],
        "CTYS": [1236551.447, 0.0174, 0.5311727691259419],
        "MDYN": [700107.997, 0.0072, 0.3128154723045269],
        "TITN": [106523.489, 0.0053, 0.5518212485076158]
      }
    }
    // ...
  ]
}
```
