import { buildStock, loadConfig } from './sm-utils.js';

const getHeldShares = (stock) => stock.position[0];

const getAveragePositionPrice = (stock) => stock.position[1];

const isStockHeld = (stock) => getHeldShares(stock) > 0;

const getHeldStocks = (stocks) => stocks.filter(isStockHeld);

const getPositionValue = (stock) => getHeldShares(stock) * getAveragePositionPrice(stock);

const getMoneyInStocks = async (ns) => {
    if (!ns.stock.has4SDataTIXAPI()) {
        return 0;
    }

    const config = loadConfig(ns);
    const stocks = config.symbols.map((symbol) => buildStock(ns, symbol));
    const heldStocks = getHeldStocks(stocks);
    return heldStocks.reduce((acc, stock) => acc + getPositionValue(stock), 0);
};

/** @param {NS} ns **/
export async function main(ns) {
    /*
        Original script by: u/I_hate_you_wasTaken, (https://www.reddit.com/r/Bitburner/comments/10urhbn/custom_overview_stats_but_better/)
        
        UPDATE 2/25/2023: 

        After the v2.2.2 release was released on 2/21/2023, the findPlayer() method used in the original script for 'globalThis.webpackJsonp.push()' and payload_id, stopped working.
        
        I refactored the script to use ns.getPlayer() and ns.gang.getGangInformation() as well as other methods to build out the previous and some new data fot the HUD. 
        
        The HUD now also shows the following:    
            • City
            • Location
            • Faction
            • Gang Respect
            • Gang Income
            • Scripts Income $/sec
            • Script Experience XP/sec
            • Karma
            • Kills

        This hs been tested on v2.2.2 (d3f9554a), and it is working/stable.    
        - u/DukeNukemDad    
    */

    ns.disableLog("ALL");
    // ns.clearLog();
    // ns.tail();

    const args = ns.flags([["help", false]]);
    if (args.help) {
        ns.tprint("This script will enhance your HUD (Heads up Display) with custom statistics.");
        ns.tprint(`Usage: run ${ns.getScriptName()}`);
        ns.tprint("Example:");
        ns.tprint(`> run ${ns.getScriptName()}`);
        return;
    }

    const doc = eval('document');
    const removeByClassName = (sel) => doc.querySelectorAll(sel).forEach(el => el.remove());
    const colorByClassName = (sel, col) => doc.querySelectorAll(sel).forEach(el => el.style.color = col);
    const hook0 = doc.getElementById('overview-extra-hook-0');
    const hook1 = doc.getElementById('overview-extra-hook-1');

    hook0.innerHTML = '';
    hook1.innerHTML = '';

    const renderStat = (label, value, color, title) => {
      const id = `HUD_${label.split(/\s+/g).join('')}`;
      const headingClassName = `${id}_h`;
      const valueClassName = `${id}_v`;
      hook0.insertAdjacentHTML('beforeend', `<element class="${headingClassName} HUD_el" title="${title}">${label} &nbsp;<br></element>`)
      colorByClassName(`.${headingClassName}`, color)
      hook1.insertAdjacentHTML('beforeend', `<element class="${valueClassName} HUD_el">${value}<br></element>`)
      colorByClassName(`.${valueClassName}`, color)
    };

    while (true) {

        try {
            const theme = ns.ui.getTheme()
            let player = ns.getPlayer();

            var gangInfo = null;
            var gangFaction = "";
            var gangIncome = 0;
            var gangRespect = 0;

            let gangAPI = false;
            try {
                if (ns.gang.getGangInformation() != null) {
                    gangAPI = true;
                }
            } catch {
                ns.print("gangAPI: " + false);
            }

            if (gangAPI != false) {
                gangInfo = ns.gang.getGangInformation();
                gangFaction = gangInfo.faction;
                gangIncome = ns.formatNumber(ns.gang.getGangInformation().moneyGainRate * 5, 2);  // A tick is every 200ms. To get the actual money/sec, multiple moneyGainRate by 5.
                gangRespect = ns.formatNumber(ns.gang.getGangInformation().respect, 5);
            }

            var playerCity = player.city; // city
            var playerLocation = player.location; // location
            var playerKills = player.numPeopleKilled; // numPeopleKilled
            var playerKarma = ns.heart.break();

            let purchased_servers = ns.getPurchasedServers(); // get every bought server if exists, else just create our blank array and add home to it.
            purchased_servers.push("home"); // add home to the array.
            let cumulative = 0;
            for (let pserv of purchased_servers) {
                let gains = 0;
                for (var script of ns.ps(pserv)) {
                    var s = ns.getRunningScript(script.pid)
                    if (s.onlineRunningTime > 0) gains += s.onlineMoneyMade / s.onlineRunningTime
                }
                cumulative += gains;
            }

            const cashOnHand = ns.getServerMoneyAvailable('home');
            const moneyInStocks = await getMoneyInStocks(ns);
            const netWorth = cashOnHand + moneyInStocks;
            var scriptIncome = ns.formatNumber(cumulative, 2); // $/sec
            var scriptXP = ns.formatNumber(ns.getTotalScriptExpGain(), 2); // xp/sec

            // End paramaters, begin CSS: 

            removeByClassName('.HUD_el');
            removeByClassName('.HUD_sep');

            hook0.insertAdjacentHTML('beforebegin', `<hr class="HUD_sep HUD_el">`);
            hook1.insertAdjacentHTML('beforebegin', `<hr class="HUD_sep HUD_el">`);

            if (ns.stock.has4SDataTIXAPI()) {
                renderStat('NetWorth', "$" + ns.formatNumber(netWorth, 2), theme['money'], 'Total money (available + in market).');
                renderStat('Stonks', "$" + ns.formatNumber(moneyInStocks, 2), theme['money'], 'Money in active stock positions.');    
            }

            // renderStat('ScrInc', "$" + scriptIncome + '/sec', theme['money'], 'Money Gain from Scripts per Second.');
            renderStat('ScrExp', scriptXP + ' XP/sec', theme['hack'], 'Gain from Scripts per Second.');
            renderStat('City', playerCity, theme['cha'], 'The name of the City you are currently in.');
            renderStat('Location', playerLocation, theme['cha'], 'Your current location inside the city.');

            if (gangInfo != null) {
                renderStat('GangFac', gangFaction, theme['int'], 'The name of your gang faction.');
                renderStat('GangResp', gangRespect, theme['int'], 'The respect of your gang.');
                renderStat('GangInc', gangIncome, theme['int'], 'The income of your gang.');
            }

            renderStat('Karma', playerKarma, theme['hp'], 'Your karma.');
            renderStat('Kills', playerKills, theme['hp'], 'Your kill count, increases every successful homicide.');
        } catch (err) {
            ns.print("ERROR: Update Skipped: " + String(err));
        }

        ns.atExit(function () { removeByClassName('.HUD_el'); })
        await ns.sleep(200);
    }
}
