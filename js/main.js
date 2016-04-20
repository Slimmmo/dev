/* TODO
test saving and loading of calculator
TESTING
  no percentage in illions
test loading of game saves + for multi profiles
check how it looks when some profiles have 4 worlds and others have 3
update parse script for new manager format and new angel investor format ([11, 2, x]) and baseLevel
add baseLevel to resetPlanet
check upper level calculations (near infinity) for overflows and maybe something else? check post

check mobile view
check chrome
*/

var advApp = angular.module('advApp', ['ui.bootstrap', 'ngAnimate']),
illionsArr = ['', 'Million', 'Billion', 'Trillion', 'Quadrillion', 'Quintillion', 'Sextillion', 'Septillion', 'Octillion', 'Nonillion', 'Decillion', 'Undecillion', 'Duodecillion', 'Tredecillion', 'Quattuordecillion', 'Quindecillion', 'Sexdecillion', 'Septendecillion', 'Octodecillion', 'Novemdecillion', 'Vigintillion', 'Unvigintillion', 'Duovigintillion', 'Tresvigintillion', 'Quattuorvigintillion', 'Quinvigintillion', 'Sexvigintillion', 'Septenvigintillion', 'Octovigintillion', 'Novemvigintillion', 'Trigintillion', 'Untrigintillion', 'Duotrigintillion', 'Tretrigintillion', 'Quattuortrigintillion', 'Quintrigintillion', 'Sextrigintillion', 'Septentrigintillion', 'Octotrigintillion', 'Novemtrigintillion', 'Quadragintillion', 'Unquadragintillion', 'Duoquadragintillion', 'Trequadragintillion', 'Quattuorquadragintillion', 'Quinquadragintillion', 'Sexquadragintillion', 'Septquadragintillion', 'Octoquadragintillion', 'Novemquadragintillion', 'Quinquagintillion', 'Unquinquagintillion', 'Duoquinquagintillion', 'Trequinquagintillion', 'Quattuorquinquagintillion', 'Quinquinquagintillion', 'Sexquinquagintillion', 'Septquinquagintillion', 'Octoquinquagintillion', 'Novemquinquagintillion', 'Sexagintillion', 'Unsexagintillion', 'Duosexagintillion', 'Tresexagintillion', 'Quattuorsexagintillion', 'Quinsexagintillion', 'Sexsexagintillion', 'Septsexagintillion', 'Octosexagintillion', 'Novemsexagintillion', 'Septuagintillion', 'Unseptuagintillion', 'Duoseptuagintillion', 'Treseptuagintillion', 'Quattuorseptuagintillion', 'Quinseptuagintillion', 'Sexseptuagintillion', 'Septseptuagintillion', 'Octoseptuagintillion', 'Novemseptuagintillion', 'Octogintillion', 'Unoctogintillion', 'Duooctogintillion', 'Treoctogintillion', 'Quattuoroctogintillion', 'Quinoctogintillion', 'Sexoctogintillion', 'Septoctogintillion', 'Octooctogintillion', 'Novemoctogintillion', 'Nonagintillion', 'Unnonagintillion', 'Duononagintillion', 'Trenonagintillion', 'Quattuornonagintillion', 'Quinnonagintillion', 'Sexnonagintillion', 'Septnonagintillion', 'Onctononagintillion', 'Novemnonagintillion', 'Centillion', 'Uncentillion'];

function numFilter(input, format) {
  "use strict";
  var out = "",
  mCount = 0,
  e = 6;
  if (input === Infinity) {
    return "Infinity";
  }
  if (input !== null) {
    if (format === 0) {
      while (input >= Number('1e+' + e)) {
        e += 3;
        mCount++;
      }
      if (e !== 6) {
        input /= Number('1e+' + (e - 3));
      }
      if (input < 1000) {
        out = Math.round(input * 1000) / 1000;
      } else {
        out = Math.round(input * 100) / 100;
        out = out.toLocaleString("en-US");
      }
      return out + ((mCount > 0) ? ' ' + illionsArr[mCount] : '');
    } else if (format === 1) {
      return input.toLocaleString("en-US");
    } else {
      return input.toExponential();
    }
  }
}

advApp.filter('capitalize', function() {
  "use strict";
  return function(input) {
    return input ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
  }
});

advApp.filter('num', function() {
  "use strict";
  return function(input, format) {
    return numFilter(input, format);
  };
});

advApp.filter('percentage', function() {
  "use strict";
  return function(input) {
    if (isNaN(input)) {
      return input;
    }
    return Math.floor(input * 1000) / 10 + '%';
  };
});

advApp.filter('rec', ['WorldFactory', function(WorldFactory) {
  "use strict";
  return function(input, name) {
    var retVal = '', i = 0;
    if (input === 'all') {
      retVal = 'All';
    } else if (input[0] === 'level') {
      retVal = WorldFactory.statics[name].investments[input[1]].name;
    } else {
      if (input[0] === 'cash') {
        i = WorldFactory.statics[name].cashUpgrades[input[1]][1];
      } else {
        i = input;
      }
      if (i[0] <= 10) {
        retVal = (i[0] < WorldFactory.statics[name].investments.length) ? WorldFactory.statics[name].investments[i[0]].name : 'All';
        retVal += (i[1] === 0) ? ' Profit x' : ' Speed x';
      } else {
        retVal = 'Angel Investor +';
      }
      retVal += i[2];
    }
    return retVal;
  };
}]);

advApp.filter('time', function() {
  "use strict";
  return function(input, format) {
    if (input === Infinity) {
      return "———";
    }
    var out = (format !== 0) ? numFilter(input, format) + ' s' : '';
    if (format === 0) {
      input = Math.floor(input);
      var s = ("00" + input % 60).slice(-2);
      var m = ("00" + Math.floor(input / 60) % 60).slice(-2);
      var h = ("00" + Math.floor(input / 3600) % 24).slice(-2);
      var d = Math.floor(input / 86400);
      if (d >= 1) {
        out += numFilter(d, 0) + ' d';
        if (d < 100) {
          out += ', ';
        }
      }
      if (d < 100) {
        out += h + ":" + m + ":" + s;
      }
    }
    return out;
  };
});

advApp.factory('FileFactory', ['WorldFactory', function(WorldFactory) {
  "use strict";

  var FileFactory = {};
  
  function closeMatch(newName, oldName) {
    var oNL = oldName.toLowerCase(),
    nNL = newName.toLowerCase(),
    oNSL = oNL.replace(/\s+/g, ''),
    nNSL = nNL.replace(/\s+/g, '');
    return (oNL === nNL || nNL.startsWith(oNL) || nNSL.startsWith(oNSL));
  }

  FileFactory.getJSON = function() { // this is probably terrible, maybe load selectively instead of delete selectively
    var temp = JSON.parse(JSON.stringify(WorldFactory.worlds)),
    p, w, i, num, arr;
    for (p in temp) {
      for (w in temp[p]) {
        delete temp[p][w].angelEffectiveness;
        delete temp[p][w].angelIndicator;
        delete temp[p][w].bestSuit;
        delete temp[p][w].name;
        delete temp[p][w].recTable;
        delete temp[p][w].recommendation;
        delete temp[p][w].suitIndicator;
        delete temp[p][w].totalMoneyPerSecond;
        delete temp[p][w].upgradeCosts;
        num = -1;
        arr = [];
        for (i = 0; i < temp[p][w].angelUpgrades.length; i++) {
          if (num === -1 && temp[p][w].angelUpgrades[i][0] === false) {
            num = i;
          }
          if (num !== -1 && temp[p][w].angelUpgrades[i][0] === true) {
            arr.push(i);
          }
        }
        delete temp[p][w].angelUpgrades;
        temp[p][w].angelUpgradeIndex = num;
        temp[p][w].angelUpgradeBonus = arr;
        num = -1;
        arr = [];
        for (i = 0; i < temp[p][w].cashUpgrades.length; i++) {
          if (num === -1 && temp[p][w].cashUpgrades[i] === false) {
            num = i;
          }
          if (num !== -1 && temp[p][w].cashUpgrades[i] === true) {
            arr.push(i);
          }
        }
        delete temp[p][w].cashUpgrades;
        temp[p][w].cashUpgradeIndex = num;
        temp[p][w].cashUpgradeBonus = arr;
        arr = [];
        for (i = 0; i < temp[p][w].managerUpgrades.length; i++) {
          for (num = 0; num < temp[p][w].managerUpgrades[i].length; num++) {
            if (temp[p][w].managerUpgrades[i][num] === true) {
              arr.push((i * temp[p][w].managerUpgrades[i].length) + num);
            }
          }
        }
        delete temp[p][w].managerUpgrades;
        temp[p][w].managersBought = arr;
        for (i = 0; i < temp[p][w].suits.length; i++) {
          if (temp[p][w].suits[i][0] === true) {
            temp[p][w].selectedSuit = i;
            break;
          }
        }
        delete temp[p][w].suits;
        arr = [];
        for (i = 0; i < temp[p][w].investments.length; i++) {
          arr.push([temp[p][w].investments[i].level, temp[p][w].investments[i].golden]);
        }
        delete temp[p][w].investments;
        temp[p][w].businesses = arr;
      }
    }
    return JSON.stringify(temp);
  };

  function getType(obj) {
    while (true) {
      for (var key in obj) {
        if (typeof obj[key] !== 'object') {
          if ('filters' in obj) {
            return 0;
          } else {
            return 1;
          }
        } else {
          obj = obj[key];
        }
        break;
      }
    }
  }

  function loadCalcSingle(name, obj) {
    var i = 0, j = 0, k = 0;
    for (k in WorldFactory.planets) {
      if (obj.hasOwnProperty(WorldFactory.planets[k][0])) {
        for (i in obj[WorldFactory.planets[k][0]].levels) {
          if (obj[WorldFactory.planets[k][0]].levels.hasOwnProperty(i)) {
            for (j = 0; j < WorldFactory.statics[WorldFactory.planets[k][0]].investments.length; j++) {
              if (closeMatch(WorldFactory.statics[WorldFactory.planets[k][0]].investments[j].name, i)) {
                WorldFactory.worlds[name][WorldFactory.planets[k][0]].investments[j].level = obj[WorldFactory.planets[k][0]].levels[i];
                break;
              }
            }
          }
        }
        WorldFactory.worlds[WorldFactory.planets[k][0]].numAngels = obj[WorldFactory.planets[k][0]].numAngels;
        WorldFactory.worlds[name][WorldFactory.planets[k][0]].viewNumAngels = WorldFactory.worlds[name][WorldFactory.planets[k][0]].numAngels;
        for (i = 0; i < obj[WorldFactory.planets[k][0]].upgradeIndexUpTo; i++) {
          WorldFactory.worlds[name][WorldFactory.planets[k][0]].cashUpgrades[i] = true;
        }
        for (i = 0; i < obj[WorldFactory.planets[k][0]].angelUpgradeIndexUpTo; i++) {
          WorldFactory.worlds[name][WorldFactory.planets[k][0]].angelUpgrades[i][0] = true;
        }
        for (i = 0; i < obj[WorldFactory.planets[k][0]].upgradeIndexBonus.length; i++) {
          WorldFactory.worlds[name][WorldFactory.planets[k][0]].cashUpgrades[obj[WorldFactory.planets[k][0]].upgradeIndexBonus[i]] = true;
        }
        for (i = 0; i < obj[WorldFactory.planets[k][0]].angelUpgradeIndexBonus.length; i++) {
          WorldFactory.worlds[name][WorldFactory.planets[k][0]].angelUpgrades[obj[WorldFactory.planets[k][0]].angelUpgradeIndexBonus[i]][0] = true;
        }
        for (i = 0; i < obj[WorldFactory.planets[k][0]].managersBought.length; i++) {
          WorldFactory.worlds[name][WorldFactory.planets[k][0]].managerUpgrades[Math.floor(obj[WorldFactory.planets[k][0]].managersBought[i] / 2)][obj[WorldFactory.planets[k][0]].managersBought[i] % 2] = true;
        }
        WorldFactory.worlds[name][WorldFactory.planets[k][0]].filters.noSingles = obj[WorldFactory.planets[k][0]].noSingles || false;
        WorldFactory.worlds[name][WorldFactory.planets[k][0]].filters.noTens = obj[WorldFactory.planets[k][0]].noTens || false;
        WorldFactory.worlds[name][WorldFactory.planets[k][0]].triples = obj[WorldFactory.planets[k][0]].triples;
        WorldFactory.worlds[name][WorldFactory.planets[k][0]].flux = obj[WorldFactory.planets[k][0]].flux;
        WorldFactory.worlds[name][WorldFactory.planets[k][0]].bonusAngelEffectiveness = obj[WorldFactory.planets[k][0]].bonusAngelEffectiveness;
        WorldFactory.worlds[name][WorldFactory.planets[k][0]].bonusMultiplier = obj[WorldFactory.planets[k][0]].bonusMultiplier;
        if (angular.isDefined(obj[WorldFactory.planets[k][0]].megaTicket)) {
          for (i = 0; i < obj[WorldFactory.planets[k][0]].megaTicket.length; i++) {
            WorldFactory.worlds[name][WorldFactory.planets[k][0]].investments[obj[WorldFactory.planets[k][0]].megaTicket[i]].golden = true;
          }
        }
      }
      WorldFactory.calc(WorldFactory.worlds[name][WorldFactory.planets[k][0]]);
    }
  }

  FileFactory.loadCalculator = function(input) {
    var obj = JSON.parse(input), name = '', type = getType(obj);
    WorldFactory.worlds = {};
    if (type === 0) {
      for (var p in obj) {
        WorldFactory.loadProfile(p);
        if (name === '') {
          WorldFactory.setProfile(p);
          name = p;
        }
        loadCalcSingle(name, obj);
      }
    } else {
      name = 'Main';
      WorldFactory.loadProfile(name);
      WorldFactory.setProfile(name);
      loadCalcSingle(name, obj);
    }
    return name;
  };

  function lzf_decode(str) {
    var iidx = 0, oidx = 0, oLen = str.length,
    temp = Array.apply(null, new Array(oLen)).map(Number.prototype.valueOf, 0);
    do {
      var ctrl = str.charCodeAt(iidx++);
      if (ctrl < (1 << 5)) {
        ctrl++;
        while (oidx + ctrl > oLen) {
          oLen++;
          temp.push(String.fromCharCode(0));
        }
        do {
          temp[oidx++] = str.charAt(iidx++);
        } while ((--ctrl) != 0);
      } else {
        var len = ctrl >> 5, reference = oidx - ((ctrl & 0x1f) << 8) - 1;
        if (len == 7) {
          len += str.charCodeAt(iidx++);
        }
        reference -= str.charCodeAt(iidx++);
        while (oidx + len + 2 > oLen) {
          oLen++;
          temp.push(String.fromCharCode(0));
        }
        if (reference < 0) {
          console.log('error');
          return 0;
        }
        temp[oidx++] = temp[reference++];
        do {
          temp[oidx++] = temp[reference++];
        } while ((--len) >= 0);
      }
    } while (iidx < str.length);
    return temp.join("");
  }

  FileFactory.loadGame = function(str) {
    var b64 = sanitize(str).substring(1).split("|")[0],
    obj = JSON.parse(lzf_decode(atob(b64))), i, id = 0,
    loc = WorldFactory.getWorldFromName(obj.planetName);
    console.log(obj);
    for (i = 0; i < obj.ventures.length; i++) {
      id = WorldFactory.indexFromID(loc, obj.ventures[i].id);
      loc.investments[id].level = obj.ventures[i].numOwned;
      loc.investments[id].golden = obj.ventures[i].isBoosted;
    }
    var angelID = 0; // how else can we do this without keeping track of the angel_sac_x or swap_x ids?
    for (i = 0; i < obj.upgrades.length; i++) {
      if (obj.upgrades[i].id.indexOf("angel") !== -1 || obj.upgrades[i].id.indexOf("swap") !== -1) {
        loc.angelUpgrades[angelID++][0] = obj.upgrades[i].purchased;
      } else {
        //loc.cashUpgrades[i - angelID] = obj.upgrades[i].purchased;
      }
    }
    for (i = 0; i < obj.managers.length; i++) {
      if (obj.managers[i].id.indexOf("_accountant") !== -1) {
        id = WorldFactory.indexFromID(loc, obj.managers[i].id);
        loc.managerUpgrades[id][(obj.managers[i].id.charAt(obj.managers[i].id.length - 1) != '2') ? 0 : 1][1] = obj.managers[i].purchased;
      }
    }
    loc.lifetimeEarnings = obj.totalCash || obj.sessionCash + obj.totalPreviousCash;
    loc.numAngels = obj.angelInvestors;
    loc.sacAngels = obj.angelInvestorsSpent;
    // how to find gold multipliers, flux, bonus angel effectiveness (kong login etc), suits
    console.log(loc);
  };

  function sanitize(str) {
    var ret = '';
    for (var c = 0; c < str.length; c++) {
      if (str[c] === '.' || str[c] === '+' || str[c] === '/' || str[c] === '=' || str[c] === '|') {
        ret += str[c];
      } else if ((str[c] >= 'a' && str[c] <= 'z') || (str[c] >= 'A' && str[c] <= 'Z')) {
        ret += str[c];
      } else if (str[c] >= '0' && str[c] <= '9') {
        ret += str[c];
      }
    }
    return ret;
  }

  FileFactory.save = function() {
    localStorage.setItem('profiles', FileFactory.getJSON());
  };

  return FileFactory;
}]);

advApp.factory('FilterFactory', function() {
  "use strict";

  var FilterFactory = {};

  function noValue(input) {
    return (!angular.isDefined(input) || input === '');
  }

  FilterFactory.decrement = function(loc, filter) {
    if (noValue(loc.filters[filter])) {
      loc.filters[filter] = 0;
    } else if (loc.filters[filter] > 0) {
      loc.filters[filter]--;
    }
  };

  FilterFactory.filtersMet = function(loc, upg) {
    if (loc.filters.noSingles && upg[0][0] === 'level' && upg[1] - loc.investments[upg[0][1]].level === 1) {
      return false;
    }
    if (loc.filters.noTens && upg[0][0] === 'level' && upg[1] - loc.investments[upg[0][1]].level === 10) {
      return false;
    }
    if (loc.filters.filterTime !== null && loc.filters.filterTime < upg[4]) {
      return false;
    }
    if (loc.filters.cost !== null && loc.filters.cost < upg[3]) {
      return false;
    }
    if (loc.filters.percentage && upg[6] < loc.filters.percentage) {
      return false;
    }
    return true;
  };

  FilterFactory.increment = function(loc, filter) {
    if (noValue(loc.filters[filter])) {
      loc.filters[filter] = 1;
    } else {
      loc.filters[filter]++;
    }
  };

  FilterFactory.updateFilterTime = function(loc) {
    if (noValue(loc.filters.days) && noValue(loc.filters.hours) && noValue(loc.filters.minutes)) {
      loc.filters.filterTime = null;
    } else {
      loc.filters.filterTime = (noValue(loc.filters.days) ? 0 : loc.filters.days * 86400) + (noValue(loc.filters.hours) ? 0 : loc.filters.hours * 3600) + (noValue(loc.filters.minutes) ? 0 : loc.filters.minutes * 60);
      if (loc.filters.filterTime === 0) {
        loc.filters.filterTime = null;
      }
    }
  };

  return FilterFactory;
});

advApp.factory('WorldFactory', ['$filter', 'FilterFactory', function($filter, FilterFactory) {
  "use strict";

  var WorldFactory = {},
  currProfile = 'Main';

  WorldFactory.selectAll = [false, false, false, false];
  WorldFactory.planets = [['earth', 'fa-globe'], ['moon', 'fa-moon-o'], ['mars', 'fa-mars']/*, ['evil', 'fa-money']*/];
  WorldFactory.worlds = {};
  WorldFactory.statics = {};

  WorldFactory.applyRow = function(loc, row) {
    var i = 0;
    if (row[0] === 'all') {
      for (; i < loc.investments.length; i++) {
        if (loc.investments[i].level < row[1]) {
          loc.investments[i].level = row[1];
        }
      }
    } else if (row[0][0] === 'level') {
      loc.investments[row[0][1]].level = row[1];
    } else if (row[0][0] === 'cash') {
      loc.cashUpgrades[row[0][1]] = true;
    }
    WorldFactory.calc(loc);
  };

  WorldFactory.applyTop = function(loc) {
    WorldFactory.applyRow(loc, loc.recTable[0]);
  };

  function applyTuple(loc, tuple) {
    var i = 0;
    if (tuple[1] === 0) {
      if (tuple[0] < loc.investments.length) {
        loc.investments[tuple[0]].cycleIncome *= tuple[2];
      } else {
        for (; i < loc.investments.length; i++) {
          loc.investments[i].cycleIncome *= tuple[2];
        }
      }
    } else if (tuple[1] === 1) {
      if (tuple[0] < loc.investments.length) {
        loc.investments[tuple[0]].cycleTime /= tuple[2];
      } else {
        for (; i < loc.investments.length; i++) {
          loc.investments[i].cycleTime /= tuple[2];
        }
      }
    } else if (tuple[1] === 2) {
      loc.angelEffectiveness += tuple[2];
    }
  }

  WorldFactory.calc = function(loc) {
    WorldFactory.calcState(loc);
    calcAngels(loc);
    calcSuits(loc);
    calcRecommendations(loc);
  };

  function calcAngelCost(numAngels, mul) {
    return (1e+15 * Math.pow(numAngels / mul, 2));
  }

  WorldFactory.calcAngelInvestors = function(loc) {
    loc.angelCosts = [];
    var earnedNumAngels = loc.numAngels + loc.sacAngels, i = 0,
    loopVals = [['10%', 1.1], ['50%', 1.5], ['Doubled w/o Sacrificed', 2], ['Doubled', 2], ['5x', 5], ['10x', 10], ['Custom Multiplier', loc.customAngelMul || 0]];
    for (; i < loopVals.length; i++) {
      loc.angelCosts[i] = [];
      loc.angelCosts[i][0] = loopVals[i][0];
      if (loopVals[i][1] !== 0) {
        if (i !== '2') {
          loc.angelCosts[i][1] = Math.ceil(loopVals[i][1] * earnedNumAngels);
        } else {
          loc.angelCosts[i][1] = Math.ceil((loopVals[i][1] * loc.numAngels) + loc.sacAngels);
        }
        loc.angelCosts[i][2] = calcAngelCost(loc.angelCosts[i][1], WorldFactory.statics[loc.name].angelScale);
        loc.angelCosts[i][3] = Math.max(loc.angelCosts[i][2] - loc.lifetimeEarnings, 0);
        loc.angelCosts[i][4] = loc.angelCosts[i][3] / loc.totalMoneyPerSecond;
      }
    }
  };

  function calcAngels(loc) {
    var i = 0,
    tempPlanet = null;
    loc.angelIndicator = false;
    for (; i < loc.angelUpgrades.length; i++) {
      if (loc.angelUpgrades[i][0] !== true) {
        if (WorldFactory.statics[loc.name].angelUpgrades[i][0] < loc.numAngels) {
          tempPlanet = deepCopy(loc);
          tempPlanet.numAngels -= WorldFactory.statics[loc.name].angelUpgrades[i][0];
          tempPlanet.angelUpgrades[i][0] = true;
          WorldFactory.calcState(tempPlanet);
          var delta = tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond;
          var percent = delta / loc.totalMoneyPerSecond;
          if (delta > 0) {
            loc.angelUpgrades[i][1] = percent;
            loc.angelIndicator = true;
          } else {
            loc.angelUpgrades[i][1] = false;
          }
        } else {
          loc.angelUpgrades[i][1] = false;
        }
      }
    }
  }

  function calcRecommendations(loc) {
    var i = 0, j = 0, inc = [1, 10, 100],
    highestSharedLevel = -1, temp = [],
    tempUnlock = null, tempUnlockTime = null, tempPercentageIncrease = null,
    upgradeScore = 0, tempPlanet = deepCopy(loc);
    loc.recTable = [];
    FilterFactory.updateFilterTime(loc);
    for (; i < loc.investments.length; i++) {
      while (inc.length > 3 - (loc.filters.noSingles ? 1 : 0) - (loc.filters.noTens ? 1 : 0)) {
        inc.pop();
      }
      j = getDifferenceNBonus(loc, i, 1);
      if (j !== null) {
        inc.push(j);
      }
      for (j = 0; j < inc.length; j++) {
        tempPlanet.investments = deepCopy(loc.investments);
        tempPlanet.investments[i].level += inc[j];
        WorldFactory.calcState(tempPlanet);
        tempUnlock = calcUnlockCost(loc, i, loc.investments[i].level, inc[j]);
        tempUnlockTime = tempUnlock / loc.totalMoneyPerSecond;
        tempPercentageIncrease = (tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond) * 100 / loc.totalMoneyPerSecond;
        upgradeScore = calcUpgradeScore(tempPlanet, loc, tempUnlockTime);
        temp = [['level', i], tempPlanet.investments[i].level, upgradeScore, tempUnlock, tempUnlockTime, tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond, tempPercentageIncrease];
        if (FilterFactory.filtersMet(loc, temp)) {
          loc.recTable.push(temp);
        }
      }
    }
    j = -1;
    for (i = 0; i < 22; i++) {
      tempPlanet.investments = deepCopy(loc.investments);
      tempPlanet.angelEffectiveness = loc.angelEffectiveness;
      tempPlanet.cashUpgrades = deepCopy(loc.cashUpgrades);
      j = getNextCashIndex(loc, j);
      if (j !== null) {
        tempPlanet.cashUpgrades[j] = true;
        WorldFactory.calcState(tempPlanet);
        tempUnlockTime = WorldFactory.statics[loc.name].cashUpgrades[j][0] / loc.totalMoneyPerSecond;
        tempPercentageIncrease = (tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond) * 100 / loc.totalMoneyPerSecond;
        upgradeScore = calcUpgradeScore(tempPlanet, loc, tempUnlockTime);
        temp = [['cash', j], null, upgradeScore, WorldFactory.statics[loc.name].cashUpgrades[j][0], tempUnlockTime, tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond, tempPercentageIncrease];
        if (FilterFactory.filtersMet(loc, temp)) {
          loc.recTable.push(temp);
        }
      } else {
        break;
      }
    }
    tempUnlock = 0;
    tempPlanet.investments = deepCopy(loc.investments);
    tempPlanet.cashUpgrades = deepCopy(loc.cashUpgrades);
    highestSharedLevel = getSharedLevel(tempPlanet);
    for (i = 0; i < WorldFactory.statics[loc.name].unlocks[loc.investments.length].length; i++) {
      if (WorldFactory.statics[loc.name].unlocks[loc.investments.length][i][0] > highestSharedLevel) {
        highestSharedLevel = WorldFactory.statics[loc.name].unlocks[loc.investments.length][i][0];
        break;
      }
    }
    for (i = 0; i < tempPlanet.investments.length; i++) {
      if (tempPlanet.investments[i].level < highestSharedLevel) {
        tempUnlock += calcUnlockCost(loc, i, tempPlanet.investments[i].level, highestSharedLevel - tempPlanet.investments[i].level);
        tempPlanet.investments[i].level = highestSharedLevel;
      }
    }
    WorldFactory.calcState(tempPlanet);
    tempUnlockTime = tempUnlock / loc.totalMoneyPerSecond;
    tempPercentageIncrease = (tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond) * 100 / loc.totalMoneyPerSecond;
    upgradeScore = calcUpgradeScore(tempPlanet, loc, tempUnlockTime);
    temp = ['all', highestSharedLevel, upgradeScore, tempUnlock, tempUnlockTime, tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond, tempPercentageIncrease];
    if (FilterFactory.filtersMet(loc, temp)) {
      loc.recTable.push(temp);
    }
  }

  WorldFactory.calcState = function(loc) {
    var i = 0, j = 0,
    highestSharedLevel = getSharedLevel(loc);
    loc.totalMoneyPerSecond = 0;
    loc.angelEffectiveness = 2 + (loc.suits[suitFromName('red')][0] ? WorldFactory.statics.suits[suitFromName('red')][1] : 0) + (loc.suits[suitFromName('green')][0] ? WorldFactory.statics.suits[suitFromName('green')][1] : 0);
    for (; i < loc.investments.length; i++) {
      loc.investments[i].cycleIncome = loc.investments[i].level * WorldFactory.statics[loc.name].investments[i].baseProfit;
      if (loc.triples > 0 || loc.bonusMultiplier > 0 || loc.suits[suitFromName('gold')][0] || loc.suits[suitFromName('blue')][0]) {
        loc.investments[i].cycleIncome *= (3 * loc.triples) + loc.bonusMultiplier + (loc.suits[suitFromName('gold')][0] ? WorldFactory.statics.suits[suitFromName('gold')][1] : 0) + (loc.suits[suitFromName('blue')][0] ? WorldFactory.statics.suits[suitFromName('blue')][1] : 0);
      }
      if (loc.investments[i].golden) {
        loc.investments[i].cycleIncome *= WorldFactory.selectAll[0] ? 17.77 : 7.77;;
      }
      loc.investments[i].cycleTime = WorldFactory.statics[loc.name].investments[i].baseSpeed;
      if (loc.flux > 0) {
        loc.investments[i].cycleTime /= (1 + loc.flux * 1.21);
      }
      if (loc.suits[suitFromName('white')][0]) {
        loc.investments[i].cycleTime /= 2;
      }
      loc.upgradeCosts[i][0] = calcUnlockCost(loc, i, loc.investments[i].level, 1);
      loc.upgradeCosts[i][2] = calcUnlockCost(loc, i, loc.investments[i].level, 10);
      loc.upgradeCosts[i][4] = calcUnlockCost(loc, i, loc.investments[i].level, getDifferenceNBonus(loc, i, 1));
      loc.upgradeCosts[i][6] = calcUnlockCostAll(loc);
    }
    for (i = 0; i < loc.cashUpgrades.length; i++) {
      if (loc.cashUpgrades[i] === true) {
        applyTuple(loc, WorldFactory.statics[loc.name].cashUpgrades[i][1]);
      }
    }
    for (i = 0; i < loc.angelUpgrades.length; i++) {
      if (loc.angelUpgrades[i][0] === true) {
        applyTuple(loc, WorldFactory.statics[loc.name].angelUpgrades[i][1]);
      }
    }
    for (i = 0; i < loc.investments.length; i++) {
      j = 0;
      while (j < WorldFactory.statics[loc.name].unlocks[i].length && loc.investments[i].level >= WorldFactory.statics[loc.name].unlocks[i][j][0]) {
        applyTuple(loc, WorldFactory.statics[loc.name].unlocks[i][j][1]);
        j++;
      }
    }
    j = 0;
    while (j < WorldFactory.statics[loc.name].unlocks[loc.investments.length].length && highestSharedLevel >= WorldFactory.statics[loc.name].unlocks[loc.investments.length][j][0]) {
      applyTuple(loc, WorldFactory.statics[loc.name].unlocks[loc.investments.length][j][1]);
      j++;
    }
    if (loc.bonusAngelEffectiveness > 0) {
      loc.angelEffectiveness += loc.bonusAngelEffectiveness;
    }
    for (i = 0; i < loc.investments.length; i++) {
      loc.investments[i].cycleIncome *= (1 + (loc.angelEffectiveness * loc.numAngels / 100));
      loc.investments[i].income = loc.investments[i].cycleIncome / loc.investments[i].cycleTime;
      loc.totalMoneyPerSecond += loc.investments[i].income;
    }
    for (i = 0; i < loc.investments.length; i++) {
      loc.investments[i].incomePercent = loc.investments[i].income * 100 / loc.totalMoneyPerSecond;
    }
    for (i = 0; i < loc.upgradeCosts.length; i++) {
      loc.upgradeCosts[i][1] = loc.upgradeCosts[i][0] / loc.totalMoneyPerSecond;
      loc.upgradeCosts[i][3] = loc.upgradeCosts[i][2] / loc.totalMoneyPerSecond;
      loc.upgradeCosts[i][5] = loc.upgradeCosts[i][4] / loc.totalMoneyPerSecond;
      loc.upgradeCosts[i][7] = loc.upgradeCosts[i][6] / loc.totalMoneyPerSecond;
    }
  }

  function calcSuits(loc) {
    var i = 0, max = [-1, 0],
    tempPlanet = null;
    loc.suitIndicator = false;
    for (; i < loc.suits.length; i++) {
      if (loc.suits[i][0] === false) {
        tempPlanet = deepCopy(loc);
        tempPlanet.suits[i][0] = true;
        WorldFactory.changeSuits(tempPlanet, i);
        WorldFactory.calcState(tempPlanet);
        var delta = tempPlanet.totalMoneyPerSecond - loc.totalMoneyPerSecond;
        var percent = delta / loc.totalMoneyPerSecond;
        if (delta > 0) {
          loc.suits[i][1] = percent;
          loc.suitIndicator = true;
          if (percent > max[1]) {
            max[0] = i;
            max[1] = percent;
          }
        } else {
          loc.suits[i][1] = false;
        }
      }
    }
    if (max[0] !== -1) {
      loc.bestSuit = max[0];
    } else {
      loc.bestSuit = null;
    }
  };

  function calcUnlockCost(loc, index, fromLevel, numLevels) {
    var i = 0, managerDiscount = 1,
    retVal = (1 - Math.pow(WorldFactory.statics[loc.name].investments[index].basePower, numLevels)) / (1 - WorldFactory.statics[loc.name].investments[index].basePower);
    if (index === 0 && loc.name === 'earth') {
      fromLevel -= 1;
    }
    for (; i < loc.angelUpgrades.length; i++) {
      if (loc.angelUpgrades[i][0] === true) {
        if (WorldFactory.statics[loc.name].angelUpgrades[i][1][1] === 3 && WorldFactory.statics[loc.name].angelUpgrades[i][1][0] === index) {
          fromLevel -= WorldFactory.statics[loc.name].angelUpgrades[i][1][2];
        }
      }
    }
    if (loc.managerUpgrades.length !== 0) {
      for (i = 0; i < loc.managerUpgrades[index].length; i++) {
        if (loc.managerUpgrades[index][i] === true) {
          if (loc.name === 'earth') {
            if (i === 0) {
              managerDiscount = 0.9;
            } else {
              managerDiscount = 0.00001;
            }
          } else {
            managerDiscount = 0.75;
          }
        }
      }
    }
    return WorldFactory.statics[loc.name].investments[index].baseCost * retVal * Math.pow(WorldFactory.statics[loc.name].investments[index].basePower, fromLevel) * managerDiscount;
  }

  function calcUnlockCostAll(loc) {
    var i = 0, j = 0,
    retVal = 0,
    sharedLevel = getSharedLevel(loc);
    while (i < WorldFactory.statics[loc.name].unlocks[loc.investments.length].length && sharedLevel >= WorldFactory.statics[loc.name].unlocks[loc.investments.length][i][0]) {
      i++;
    }
    if (i !== WorldFactory.statics[loc.name].unlocks[loc.investments.length].length) {
      for (; j < loc.investments.length; j++) {
        if (loc.investments[j].level < WorldFactory.statics[loc.name].unlocks[loc.investments.length][i][0]) {
          retVal += calcUnlockCost(loc, j, loc.investments[j].level, WorldFactory.statics[loc.name].unlocks[loc.investments.length][i][0] - loc.investments[j].level);
        }
      }
    } else {
      retVal = null;
    }
    return retVal;
  }

  function calcUpgradeScore(world, loc, unlockCost) {
    var overflowPotential = world.totalMoneyPerSecond * unlockCost,
    divNum = 0,
    retVal = world.totalMoneyPerSecond - loc.totalMoneyPerSecond;
    if (!isFinite(unlockCost)) {
      return 0;
    }
    while (!isFinite(overflowPotential)) {
      divNum += 100;
      overflowPotential = world.totalMoneyPerSecond * (unlockCost / Number('1e+' + divNum));
    }
    retVal *= 1000000000000000000000 / overflowPotential;
    if (divNum !== 0) {
      retVal *= Number('1e+' + divNum);
    }
    return retVal;
  }

  WorldFactory.changeSuits = function(loc, index) {
    for (var i = 0; i < loc.suits.length; i++) {
      if (i !== index) {
        loc.suits[i][0] = false;
      } else {
        loc.suits[i][1] = false;
      }
    }
  };

  WorldFactory.checkAngel = function(loc, index, fillBefore, clearAfter) {
    var i = 0;
    loc.angelUpgrades[index][1] = false;
    if (fillBefore[1] && loc.angelUpgrades[index][0] === true) {
      for (; i < index; i++) {
        loc.angelUpgrades[i][0] = true;
        loc.angelUpgrades[i][1] = false;
      }
    }
    if (clearAfter[1] && loc.angelUpgrades[index][0] === false) {
      for (i = index + 1; i < loc.angelUpgrades.length; i++) {
        loc.angelUpgrades[i][0] = false;
        loc.angelUpgrades[i][1] = false;
      }
    }
  };

  WorldFactory.checkCash = function(loc, index, fillBefore, clearAfter) {
    var i = 0;
    if (fillBefore[0] && loc.cashUpgrades[index] === true) {
      for (; i < index; i++) {
        loc.cashUpgrades[i] = true;
      }
    }
    if (clearAfter[0] && loc.cashUpgrades[index] === false) {
      for (i = index + 1; i < loc.cashUpgrades.length; i++) {
        loc.cashUpgrades[i] = false;
      }
    }
  };

  function deepCopy(input) {
    return JSON.parse(JSON.stringify(input));
  }

  WorldFactory.fullyResetPlanet = function(loc) {
    WorldFactory.worlds[profile][loc.name] = WorldFactory.loadWorld(loc.name);
  };

  WorldFactory.getCurrProfile = function() {
    return currProfile;
  };

  function getDifferenceNBonus(loc, index, n) {
    var i = 0,
    retVal = null;
    for (; i < WorldFactory.statics[loc.name].unlocks[index].length; i++) {
      if (loc.investments[index].level < WorldFactory.statics[loc.name].unlocks[index][i][0]) {
        if (i + n - 1 < WorldFactory.statics[loc.name].unlocks[index].length) {
          retVal = WorldFactory.statics[loc.name].unlocks[index][i + n - 1][0];
          break;
        }
      }
    }
    return (retVal === null) ? null : retVal - loc.investments[index].level;
  }

  function getNextCashIndex(loc, index) {
    index += 1;
    while (index < loc.cashUpgrades.length && loc.cashUpgrades[index]) {
      index++;
    }
    if (index === loc.cashUpgrades.length) {
      index = null;
    }
    return index;
  }

  function getSharedLevel(loc) {
    var i = 1,
    level = loc.investments[i].level;
    for (; i < loc.investments.length; i++) {
      if (loc.investments[i].level < level) {
        level = loc.investments[i].level;
      }
    }
    return level;
  }

  WorldFactory.getWorldFromName = function(name) {
    if (name.toLowerCase() in WorldFactory.worlds[currProfile]) {
      return WorldFactory.worlds[currProfile][name.toLowerCase()];
    } else {
      return WorldFactory.worlds[currProfile][WorldFactory.planets.length - 1];
    }
  };

  WorldFactory.indexFromID = function(loc, id) {
    if (id.indexOf('_') !== -1) {
      id = id.split('_')[0];
    }
    var i = 0;
    if (id === 'global') {
      return WorldFactory.statics[loc.name].investments.length;
    } else if (id === 'angel') {
      return WorldFactory.statics[loc.name].investments.length + 1;
    } else if (id === 'carwash') {
      id = 'car';
    }
    for (; i < WorldFactory.statics[loc.name].investments.length; i++) {
      if (WorldFactory.statics[loc.name].investments[i].id === id) {
        return i;
      }
    }
    return null;
  };

  WorldFactory.load = function() {
    WorldFactory.loadStatics();
    WorldFactory.loadProfile('Main');
  };

  WorldFactory.loadProfile = function(name) {
    var i = 0;
    WorldFactory.worlds[name] = {};
    for (; i < WorldFactory.planets.length; i++) {
      WorldFactory.worlds[name][WorldFactory.planets[i][0]] = WorldFactory.loadWorld(WorldFactory.planets[i][0]);
    }
  };

  WorldFactory.loadStatics = function() {
    WorldFactory.statics.suits = [
      ['Blue', 3],
      ['Gold', 2],
      ['Green', 10],
      ['Red', 2],
      ['White', 2]
    ];
    WorldFactory.statics.earth = {};
    WorldFactory.statics.earth.angelScale = 150;
    WorldFactory.statics.earth.investments = [
      {baseCost: 4, basePower: 1.07, baseProfit: 1, baseSpeed: 0.6, name: 'Lemonade Stand', id: 'lemon'},
      {baseCost: 60, basePower: 1.15, baseProfit: 60, baseSpeed: 3, name: 'Newspaper Delivery', id: 'news'},
      {baseCost: 720, basePower: 1.14, baseProfit: 540, baseSpeed: 6, name: 'Car Wash', id: 'car'},
      {baseCost: 8640, basePower: 1.13, baseProfit: 4320, baseSpeed: 12, name: 'Pizza Delivery', id: 'pizza'},
      {baseCost: 103680, basePower: 1.12, baseProfit: 51840, baseSpeed: 24, name: 'Donut Shop', id: 'donut'},
      {baseCost: 1244160, basePower: 1.11, baseProfit: 622080, baseSpeed: 96, name: 'Shrimp Boat', id: 'shrimp'},
      {baseCost: 14929920, basePower: 1.1, baseProfit: 7464960, baseSpeed: 384, name: 'Hockey Team', id: 'hockey'},
      {baseCost: 179159040, basePower: 1.09, baseProfit: 89579520, baseSpeed: 1536, name: 'Movie Studio', id: 'movie'},
      {baseCost: 2149908480, basePower: 1.08, baseProfit: 1074954240, baseSpeed: 6144, name: 'Bank', id: 'bank'},
      {baseCost: 25798901760, basePower: 1.07, baseProfit: 29668737024, baseSpeed: 36864, name: 'Oil Company', id: 'oil'}
    ];
    WorldFactory.statics.earth.isEvent = false;
    WorldFactory.statics.earth.unlocks = [];
    WorldFactory.statics.earth.unlocks.push([[25, [0, 1, 2]],[50, [0, 1, 2]],[100, [0, 1, 2]],[200, [0, 1, 2]],[300, [0, 1, 2]],[400, [0, 1, 2]],[500, [0, 0, 4]],[600, [0, 0, 4]],[700, [0, 0, 4]],[800, [0, 0, 4]],[900, [0, 0, 4]],[1000, [0, 0, 5]],[1100, [0, 0, 4]],[1200, [0, 0, 4]],[1300, [0, 0, 4]],[1400, [0, 0, 4]],[1500, [0, 0, 4]],[1600, [0, 0, 4]],[1700, [0, 0, 4]],[1800, [0, 0, 4]],[1900, [0, 0, 4]],[2000, [0, 0, 5]],[2250, [0, 0, 2]],[2500, [0, 0, 2]],[2750, [0, 0, 2]],[3000, [0, 0, 5]],[3250, [0, 0, 2]],[3500, [0, 0, 2]],[3750, [0, 0, 2]],[4000, [0, 0, 5]],[4250, [0, 0, 2]],[4500, [0, 0, 2]],[4750, [0, 0, 2]],[5000, [0, 0, 5]],[5250, [0, 0, 3]],[5500, [0, 0, 3]],[5750, [0, 0, 3]],[6000, [0, 0, 5]],[6250, [0, 0, 3]],[6500, [0, 0, 3]],[6750, [0, 0, 3]],[7000, [0, 0, 5]],[7000, [0, 0, 3]],[7250, [0, 0, 3]],[7500, [0, 0, 3]],[7777, [0, 0, 3]],[8000, [0, 0, 3]],[8200, [0, 0, 3]],[8400, [0, 0, 3]],[8600, [0, 0, 3]],[8800, [0, 0, 3]],[9000, [0, 0, 3]],[9100, [0, 0, 3]],[9200, [0, 0, 3]],[9300, [0, 0, 3]],[9400, [0, 0, 3]],[9500, [0, 0, 3]],[9600, [0, 0, 3]],[9700, [0, 0, 3]],[9800, [0, 0, 3]],[9999, [0, 0, 1.9999]],[10000, [0, 0, 5]]]);
    WorldFactory.statics.earth.unlocks.push([[25, [1, 1, 2]],[50, [1, 1, 2]],[100, [1, 1, 2]],[125, [0, 0, 2]],[150, [2, 0, 2]],[175, [3, 0, 2]],[200, [1, 1, 2]],[225, [4, 0, 2]],[250, [0, 0, 3]],[275, [2, 0, 3]],[300, [1, 1, 2]],[325, [3, 0, 3]],[350, [4, 0, 3]],[375, [0, 0, 4]],[400, [1, 1, 2]],[425, [2, 0, 4]],[450, [3, 0, 4]],[475, [4, 0, 4]],[500, [5, 0, 11]],[525, [0, 0, 5]],[550, [2, 0, 5]],[575, [3, 0, 5]],[600, [6, 0, 11]],[625, [4, 0, 5]],[650, [0, 0, 6]],[675, [2, 0, 6]],[700, [7, 0, 11]],[725, [3, 0, 6]],[750, [4, 0, 6]],[775, [0, 0, 3]],[800, [8, 0, 11]],[825, [2, 0, 7]],[850, [3, 0, 7]],[875, [4, 0, 7]],[900, [9, 0, 11]],[925, [5, 0, 7]],[950, [6, 0, 7]],[975, [7, 0, 7]],[1000, [1, 0, 7777777]],[1025, [8, 0, 7]],[1050, [9, 0, 7]],[1075, [2, 0, 8]],[1100, [3, 0, 8]],[1125, [4, 0, 8]],[1150, [5, 0, 8]],[1175, [6, 0, 8]],[1200, [7, 0, 8]],[1225, [8, 0, 8]],[1250, [9, 0, 8]],[1300, [1, 0, 7777]],[1350, [0, 0, 9]],[1400, [2, 0, 9]],[1450, [3, 0, 9]],[1500, [4, 0, 9]],[1550, [5, 0, 9]],[1600, [6, 0, 9]],[1650, [7, 0, 9]],[1700, [8, 0, 9]],[1750, [9, 0, 9]],[1800, [5, 0, 10]],[1850, [6, 0, 10]],[1900, [7, 0, 10]],[1950, [8, 0, 10]],[2000, [1, 0, 7777]],[2100, [2, 0, 15]],[2200, [3, 0, 15]],[2300, [4, 0, 15]],[2400, [5, 0, 15]],[2500, [1, 0, 777]],[2600, [7, 0, 15]],[2700, [8, 0, 15]],[2800, [9, 0, 15]],[2900, [0, 0, 15]],[3000, [1, 0, 777]],[3100, [2, 0, 20]],[3200, [6, 0, 20]],[3300, [8, 0, 20]],[3400, [9, 0, 20]],[3500, [1, 0, 777]],[3600, [6, 0, 25]],[3700, [7, 0, 25]],[3800, [8, 0, 25]],[3900, [9, 0, 25]],[4000, [1, 0, 30]],[4100, [0, 0, 30]],[4200, [2, 0, 30]],[4300, [3, 0, 30]],[4400, [4, 0, 30]],[4500, [5, 0, 30]],[4600, [6, 0, 30]],[4700, [7, 0, 30]],[4800, [8, 0, 30]],[4900, [9, 0, 30]],[5000, [1, 0, 50]],[5100, [1, 0, 50]],[5200, [1, 0, 50]],[5300, [1, 0, 50]],[5400, [1, 0, 50]]]);
    WorldFactory.statics.earth.unlocks.push([[25, [2, 1, 2]],[50, [2, 1, 2]],[100, [2, 1, 2]],[200, [2, 1, 2]],[300, [2, 1, 2]],[400, [2, 1, 2]],[500, [2, 0, 2]],[600, [2, 0, 2]],[700, [2, 0, 2]],[800, [2, 0, 2]],[900, [2, 0, 2]],[1000, [2, 0, 3]],[1100, [2, 0, 2]],[1200, [2, 0, 2]],[1300, [2, 0, 2]],[1400, [2, 0, 2]],[1500, [2, 0, 2]],[1600, [2, 0, 2]],[1700, [2, 0, 2]],[1800, [2, 0, 2]],[1900, [2, 0, 2]],[2000, [2, 0, 5]],[2100, [2, 0, 3]],[2200, [2, 0, 3]],[2300, [2, 0, 3]],[2400, [2, 0, 3]],[2500, [2, 0, 3]],[2600, [2, 0, 3]],[2700, [2, 0, 3]],[2800, [2, 0, 3]],[2900, [2, 0, 3]],[3000, [2, 0, 3]],[3100, [2, 0, 3]],[3200, [2, 0, 3]],[3300, [2, 0, 3]],[3400, [2, 0, 3]],[3500, [2, 0, 3]],[3600, [2, 0, 3]],[3700, [2, 0, 3]],[3800, [2, 0, 3]],[3900, [2, 0, 3]],[4000, [2, 0, 5]],[4100, [2, 0, 3]],[4200, [2, 0, 3]],[4300, [2, 0, 3]],[4400, [2, 0, 3]],[4500, [2, 0, 3]],[4600, [2, 0, 3]],[4700, [2, 0, 3]],[4800, [2, 0, 3]],[4900, [2, 0, 3]],[5000, [2, 0, 5]],[5250, [2, 0, 3]],[5500, [2, 0, 3]]]);
    WorldFactory.statics.earth.unlocks.push([[25, [3, 1, 2]],[50, [3, 1, 2]],[100, [3, 1, 2]],[200, [3, 1, 2]],[300, [3, 1, 2]],[400, [3, 1, 2]],[500, [3, 0, 2]],[600, [3, 0, 2]],[700, [3, 0, 2]],[800, [3, 0, 2]],[900, [3, 0, 2]],[1000, [3, 0, 3]],[1100, [3, 0, 2]],[1200, [3, 0, 2]],[1300, [3, 0, 2]],[1400, [3, 0, 2]],[1500, [3, 0, 2]],[1600, [3, 0, 2]],[1700, [3, 0, 2]],[1800, [3, 0, 2]],[1900, [3, 0, 2]],[2000, [3, 0, 5]],[2100, [3, 0, 3]],[2200, [3, 0, 3]],[2300, [3, 0, 3]],[2400, [3, 0, 3]],[2500, [3, 0, 3]],[2600, [3, 0, 3]],[2700, [3, 0, 3]],[2800, [3, 0, 3]],[2900, [3, 0, 3]],[3000, [3, 0, 3]],[3100, [3, 0, 3]],[3200, [3, 0, 3]],[3300, [3, 0, 3]],[3400, [3, 0, 3]],[3500, [3, 0, 3]],[3600, [3, 0, 3]],[3700, [3, 0, 3]],[3800, [3, 0, 5]],[3900, [3, 0, 3]],[4000, [3, 0, 5]],[4100, [3, 0, 3]],[4200, [3, 0, 3]],[4300, [3, 0, 3]],[4400, [3, 0, 3]],[4500, [3, 0, 3]],[4600, [3, 0, 3]],[4700, [3, 0, 3]],[4800, [3, 0, 3]],[4900, [3, 0, 3]],[5000, [3, 0, 5]],[5250, [3, 0, 3]],[5500, [3, 0, 3]],[5750, [3, 0, 3]]]);
    WorldFactory.statics.earth.unlocks.push([[25, [4, 1, 2]],[50, [4, 1, 2]],[100, [4, 1, 2]],[200, [4, 1, 2]],[300, [4, 1, 2]],[400, [4, 1, 2]],[500, [4, 0, 2]],[600, [4, 0, 2]],[700, [4, 0, 2]],[800, [4, 0, 2]],[900, [4, 0, 2]],[1000, [4, 0, 3]],[1100, [4, 0, 2]],[1200, [4, 0, 2]],[1300, [4, 0, 2]],[1400, [4, 0, 2]],[1500, [4, 0, 2]],[1600, [4, 0, 2]],[1700, [4, 0, 2]],[1800, [4, 0, 2]],[1900, [4, 0, 2]],[2000, [4, 0, 5]],[2100, [4, 0, 3]],[2200, [4, 0, 3]],[2300, [4, 0, 3]],[2400, [4, 0, 3]],[2500, [4, 0, 3]],[2600, [4, 0, 3]],[2700, [4, 0, 3]],[2800, [4, 0, 3]],[2900, [4, 0, 3]],[3000, [4, 0, 3]],[3100, [4, 0, 3]],[3200, [4, 0, 3]],[3300, [4, 0, 3]],[3400, [4, 0, 3]],[3500, [4, 0, 3]],[3600, [4, 0, 3]],[3700, [4, 0, 3]],[3800, [4, 0, 3]],[3900, [4, 0, 3]],[4000, [4, 0, 3]],[4100, [4, 0, 3]],[4200, [4, 0, 3]],[4300, [4, 0, 3]],[4400, [4, 0, 3]],[4500, [4, 0, 3]],[4750, [4, 0, 3]],[5000, [4, 0, 3]],[5250, [4, 0, 3]],[5500, [4, 0, 3]],[5750, [4, 0, 3]],[6000, [4, 0, 3]],[6250, [4, 0, 3]]]);
    WorldFactory.statics.earth.unlocks.push([[25, [5, 1, 2]],[50, [5, 1, 2]],[100, [5, 1, 2]],[200, [5, 1, 2]],[300, [5, 1, 2]],[400, [5, 1, 2]],[500, [5, 0, 2]],[600, [5, 0, 2]],[700, [5, 0, 2]],[800, [5, 0, 2]],[900, [5, 0, 2]],[1000, [5, 0, 3]],[1100, [5, 0, 2]],[1200, [5, 0, 2]],[1300, [5, 0, 2]],[1400, [5, 0, 2]],[1500, [5, 0, 2]],[1600, [5, 0, 2]],[1700, [5, 0, 2]],[1800, [5, 0, 2]],[1900, [5, 0, 2]],[2000, [5, 0, 5]],[2100, [5, 0, 3]],[2200, [5, 0, 3]],[2300, [5, 0, 3]],[2400, [5, 0, 3]],[2500, [5, 0, 3]],[2600, [5, 0, 3]],[2700, [5, 0, 3]],[2800, [5, 0, 3]],[2900, [5, 0, 3]],[3000, [5, 0, 3]],[3250, [5, 0, 5]],[3500, [5, 0, 5]],[3750, [5, 0, 3]],[4000, [5, 0, 5]],[4250, [5, 0, 3]],[4500, [5, 0, 5]],[4750, [5, 0, 3]],[5000, [5, 0, 5]],[5250, [5, 0, 3]],[5500, [5, 0, 3]],[5750, [5, 0, 3]],[6000, [5, 0, 5]],[6250, [5, 0, 3]],[6500, [5, 0, 5]]]);
    WorldFactory.statics.earth.unlocks.push([[25, [6, 1, 2]],[50, [6, 1, 2]],[100, [6, 1, 2]],[200, [6, 1, 2]],[300, [6, 1, 2]],[400, [6, 1, 2]],[500, [6, 0, 2]],[600, [6, 0, 2]],[700, [6, 0, 2]],[800, [6, 0, 2]],[900, [6, 0, 2]],[1000, [6, 0, 3]],[1100, [6, 0, 2]],[1200, [6, 0, 2]],[1300, [6, 0, 2]],[1400, [6, 0, 2]],[1500, [6, 0, 2]],[1600, [6, 0, 2]],[1700, [6, 0, 2]],[1800, [6, 0, 2]],[1900, [6, 0, 2]],[2000, [6, 0, 5]],[2100, [6, 1, 2]],[2200, [6, 0, 3]],[2300, [6, 1, 2]],[2400, [6, 0, 3]],[2500, [6, 1, 2]],[2600, [6, 0, 3]],[2700, [6, 1, 2]],[2800, [6, 0, 3]],[2900, [6, 0, 3]],[3000, [6, 0, 3]],[3250, [6, 0, 3]],[3500, [6, 0, 3]],[3750, [6, 0, 3]],[4000, [6, 0, 5]],[4250, [6, 0, 3]],[4500, [6, 0, 3]],[4750, [6, 0, 3]],[5000, [6, 0, 7]],[5250, [6, 0, 3]],[5500, [6, 0, 3]],[5750, [6, 0, 3]],[6000, [6, 0, 7]],[6250, [6, 0, 3]],[6500, [6, 0, 3]],[6750, [6, 0, 3]],[7000, [6, 0, 7]]]);
    WorldFactory.statics.earth.unlocks.push([[25, [7, 1, 2]],[50, [7, 1, 2]],[100, [7, 1, 2]],[200, [7, 1, 2]],[300, [7, 1, 2]],[400, [7, 1, 2]],[500, [7, 0, 2]],[600, [7, 0, 2]],[700, [7, 0, 2]],[800, [7, 0, 2]],[900, [7, 0, 2]],[1000, [7, 0, 3]],[1100, [7, 0, 2]],[1200, [7, 0, 2]],[1300, [7, 0, 2]],[1400, [7, 0, 2]],[1500, [7, 0, 2]],[1600, [7, 0, 2]],[1700, [7, 0, 2]],[1800, [7, 0, 2]],[1900, [7, 0, 2]],[2000, [7, 0, 5]],[2100, [7, 1, 2]],[2200, [7, 0, 2]],[2300, [7, 1, 2]],[2400, [7, 0, 2]],[2500, [7, 1, 2]],[2600, [7, 0, 2]],[2700, [7, 1, 2]],[2800, [7, 0, 2]],[2900, [7, 0, 2]],[3000, [7, 0, 2]],[3250, [7, 1, 2]],[3500, [7, 0, 2]],[3750, [7, 0, 2]],[4000, [7, 0, 2]],[4250, [7, 0, 3]],[4500, [7, 0, 3]],[4750, [7, 0, 3]],[5000, [7, 0, 5]],[5250, [7, 0, 3]],[5500, [7, 0, 3]],[5750, [7, 0, 3]],[6000, [7, 0, 9]],[6250, [7, 0, 3]],[6500, [7, 0, 3]],[6750, [7, 0, 3]],[7000, [7, 0, 9]],[7250, [7, 0, 3]],[7500, [7, 0, 3]],[7750, [7, 0, 3]]]);
    WorldFactory.statics.earth.unlocks.push([[25, [8, 1, 2]],[50, [8, 1, 2]],[100, [8, 1, 2]],[200, [8, 1, 2]],[300, [8, 1, 2]],[400, [8, 1, 2]],[500, [8, 0, 2]],[600, [8, 0, 2]],[700, [8, 0, 2]],[800, [8, 0, 2]],[900, [8, 0, 2]],[1000, [8, 0, 3]],[1100, [8, 0, 2]],[1200, [8, 0, 2]],[1300, [8, 0, 2]],[1400, [8, 0, 2]],[1500, [8, 0, 2]],[1600, [8, 0, 2]],[1700, [8, 0, 2]],[1800, [8, 0, 2]],[1900, [8, 0, 2]],[2000, [8, 0, 5]],[2250, [8, 1, 2]],[2500, [8, 1, 2]],[2750, [8, 1, 2]],[3000, [8, 1, 2]],[3250, [8, 1, 2]],[3500, [8, 1, 2]],[3750, [8, 1, 2]],[4000, [8, 1, 2]],[4250, [8, 0, 3]],[4500, [8, 0, 3]],[4750, [8, 0, 3]],[5000, [8, 0, 5]],[5250, [8, 0, 5]],[5500, [8, 0, 3]],[5750, [8, 0, 3]],[6000, [8, 0, 5]],[6250, [8, 0, 3]],[6500, [8, 0, 3]],[6750, [8, 0, 3]],[7000, [8, 0, 5]],[7250, [8, 0, 3]],[7500, [8, 0, 3]],[7750, [8, 0, 3]],[8000, [8, 0, 5]],[8250, [8, 0, 3]],[8500, [8, 0, 3]]]);
    WorldFactory.statics.earth.unlocks.push([[25, [9, 1, 2]],[50, [9, 1, 2]],[100, [9, 1, 2]],[200, [9, 1, 2]],[300, [9, 1, 2]],[400, [9, 1, 2]],[500, [9, 0, 2]],[600, [9, 0, 2]],[700, [9, 0, 2]],[800, [9, 0, 2]],[900, [9, 0, 2]],[1000, [9, 0, 3]],[1100, [9, 0, 2]],[1200, [9, 0, 2]],[1300, [9, 0, 2]],[1400, [9, 0, 2]],[1500, [9, 0, 2]],[1600, [9, 0, 2]],[1700, [9, 0, 2]],[1800, [9, 0, 2]],[1900, [9, 0, 2]],[2000, [9, 0, 5]],[2250, [9, 1, 2]],[2500, [9, 1, 2]],[2750, [9, 1, 2]],[3000, [9, 1, 2]],[3250, [9, 1, 2]],[3500, [9, 1, 2]],[3750, [9, 1, 2]],[4000, [9, 1, 2]],[4250, [9, 1, 2]],[4500, [9, 1, 2]],[4750, [9, 1, 2]],[5000, [9, 1, 2]],[5250, [9, 0, 3]],[5500, [9, 0, 3]],[5750, [9, 0, 3]],[6000, [9, 0, 5]],[6250, [9, 0, 3]],[6500, [9, 0, 3]],[6750, [9, 0, 3]],[7000, [9, 0, 7]],[7250, [9, 0, 3]],[7500, [9, 0, 3]],[7750, [9, 0, 3]],[8000, [9, 0, 3]],[8250, [9, 0, 3]],[8500, [9, 0, 3]],[8750, [9, 0, 3]],[9000, [9, 0, 7]],[9250, [9, 0, 3]],[9500, [9, 0, 3]],[9750, [9, 0, 3]]]);
    WorldFactory.statics.earth.unlocks.push([[25, [10, 1, 2]],[50, [10, 1, 2]],[100, [10, 1, 2]],[200, [10, 1, 2]],[300, [10, 1, 2]],[400, [10, 1, 2]],[500, [10, 0, 2]],[600, [10, 0, 2]],[666, [10, 0, 2]],[700, [10, 0, 2]],[777, [10, 0, 2]],[800, [10, 0, 2]],[900, [10, 0, 2]],[1000, [10, 0, 2]],[1100, [10, 0, 2]],[1111, [10, 0, 2]],[1200, [10, 0, 2]],[1300, [10, 0, 2]],[1400, [10, 0, 2]],[1500, [10, 0, 2]],[1600, [10, 0, 2]],[1700, [10, 0, 2]],[1800, [10, 0, 2]],[1900, [10, 0, 2]],[2000, [10, 0, 2]],[2100, [10, 0, 2]],[2200, [10, 0, 2]],[2222, [10, 0, 2]],[2300, [10, 0, 2]],[2400, [10, 0, 2]],[2500, [10, 0, 2]],[2600, [10, 0, 2]],[2700, [10, 0, 2]],[2800, [10, 0, 2]],[2900, [10, 0, 2]],[3000, [10, 0, 2]],[3100, [10, 0, 2]],[3200, [10, 0, 2]],[3300, [10, 0, 2]],[3333, [10, 0, 2]],[3400, [10, 0, 2]],[3500, [10, 0, 2]],[3600, [10, 0, 2]],[3700, [10, 0, 2]],[3800, [10, 0, 2]],[3900, [10, 0, 2]],[4000, [10, 0, 2]],[4100, [10, 0, 2]],[4200, [10, 0, 2]],[4300, [10, 0, 2]],[4400, [10, 0, 2]],[4500, [10, 0, 2]],[4600, [10, 0, 2]],[4700, [10, 0, 2]],[4800, [10, 0, 2]],[4900, [10, 0, 2]],[5000, [10, 0, 2]]]);
    WorldFactory.statics.earth.cashUpgrades = [[250000, [0, 0, 3]],[500000, [1, 0, 3]],[1000000, [2, 0, 3]],[5000000, [3, 0, 3]],[10000000, [4, 0, 3]],[25000000, [5, 0, 3]],[500000000, [6, 0, 3]],[10000000000, [7, 0, 3]],[50000000000, [8, 0, 3]],[250000000000, [9, 0, 3]],[1000000000000, [10, 0, 3]],[20000000000000, [0, 0, 3]],[50000000000000, [1, 0, 3]],[100000000000000, [2, 0, 3]],[500000000000000, [3, 0, 3]],[1E+15, [4, 0, 3]],[2E+15, [5, 0, 3]],[5E+15, [6, 0, 3]],[7E+15, [7, 0, 3]],[1E+16, [8, 0, 3]],[2E+16, [9, 0, 3]],[5E+16, [10, 0, 3]],[1E+17, [11, 2, 1]],[2E+18, [0, 0, 3]],[5E+18, [1, 0, 3]],[7E+18, [2, 0, 3]],[1E+19, [3, 0, 3]],[2E+19, [4, 0, 3]],[3.5E+19, [5, 0, 3]],[5E+19, [6, 0, 3]],[7.5E+19, [7, 0, 3]],[1E+20, [8, 0, 3]],[2E+20, [9, 0, 3]],[5E+20, [10, 0, 3]],[1E+21, [11, 2, 1]],[2.5E+22, [0, 0, 3]],[5E+22, [1, 0, 3]],[1E+23, [2, 0, 3]],[2E+23, [3, 0, 3]],[3E+23, [4, 0, 3]],[4E+23, [5, 0, 3]],[5E+23, [6, 0, 3]],[6E+23, [7, 0, 3]],[7E+23, [8, 0, 3]],[8E+23, [9, 0, 3]],[9E+23, [10, 0, 3]],[1E+25, [11, 2, 2]],[1E+27, [0, 0, 7]],[5E+27, [1, 0, 7]],[2.5E+28, [2, 0, 7]],[1E+29, [3, 0, 7]],[2.5E+29, [4, 0, 7]],[5E+29, [5, 0, 7]],[1E+30, [6, 0, 7]],[5E+30, [7, 0, 7]],[2.5E+31, [8, 0, 7]],[5E+31, [9, 0, 7]],[1E+42, [10, 0, 7]],[5E+42, [1, 0, 3]],[2.5E+43, [2, 0, 3]],[5E+43, [3, 0, 3]],[1E+44, [4, 0, 3]],[2.5E+44, [5, 0, 3]],[5E+44, [6, 0, 3]],[1E+45, [7, 0, 3]],[5E+45, [8, 0, 3]],[1E+46, [9, 0, 3]],[2.5E+46, [0, 0, 3]],[1E+47, [10, 0, 3]],[2.5E+47, [1, 0, 3]],[5E+47, [2, 0, 3]],[7.5E+47, [3, 0, 3]],[1E+48, [4, 0, 3]],[5E+48, [5, 0, 3]],[1.5E+49, [6, 0, 3]],[5E+49, [7, 0, 3]],[1E+50, [8, 0, 3]],[2.5E+50, [9, 0, 3]],[5E+50, [0, 0, 3]],[1E+51, [10, 0, 7]],[1E+54, [10, 0, 5]],[1E+60, [10, 0, 7]],[1E+61, [1, 0, 3]],[1E+62, [2, 0, 3]],[1E+66, [10, 0, 9]],[1E+67, [3, 0, 3]],[1E+68, [4, 0, 3]],[1E+72, [10, 0, 11]],[1E+73, [5, 0, 3]],[1E+74, [6, 0, 3]],[1E+75, [10, 0, 13]],[1E+76, [7, 0, 3]],[1E+77, [8, 0, 3]],[1E+78, [10, 0, 15]],[1E+79, [9, 0, 3]],[1E+80, [0, 0, 3]],[1E+84, [10, 0, 3]],[3E+87, [10, 0, 3.1415926]],[1E+90, [1, 0, 3]],[5E+90, [2, 0, 3]],[2.5E+91, [3, 0, 3]],[5E+91, [4, 0, 3]],[1E+92, [5, 0, 3]],[2.5E+92, [6, 0, 3]],[5E+92, [7, 0, 3]],[1E+93, [8, 0, 3]],[5E+93, [9, 0, 3]],[1E+94, [0, 0, 3]],[5E+95, [10, 0, 2]],[2E+96, [1, 0, 2]],[1.1E+97, [2, 0, 2]],[6.6E+97, [3, 0, 2]],[2.3E+98, [4, 0, 2]],[4E+98, [5, 0, 2]],[7E+98, [6, 0, 2]],[4E+99, [7, 0, 2]],[1E+100, [10, 0, 3]],[2E+100, [10, 0, 6]],[2.9E+100, [8, 0, 2]],[1.45E+101, [9, 0, 2]],[3E+101, [0, 0, 2]],[5E+101, [10, 0, 2]],[1E+102, [10, 0, 5]],[5E+102, [2, 0, 3]],[1.5E+104, [2, 0, 3]],[4E+104, [2, 0, 3]],[9E+104, [3, 0, 3]],[6E+105, [3, 0, 3]],[1.5E+106, [3, 0, 3]],[6E+106, [4, 0, 2]],[1.85E+107, [4, 0, 3]],[5E+107, [4, 0, 3]],[6E+107, [10, 0, 3]],[7.5E+107, [5, 0, 2]],[5E+108, [5, 0, 3]],[4.5E+109, [5, 0, 3]],[1.25E+110, [6, 0, 3]],[3E+110, [6, 0, 3]],[9E+110, [6, 0, 3]],[1E+111, [10, 0, 3]],[5E+111, [7, 0, 2]],[7E+112, [7, 0, 3]],[2.5E+113, [7, 0, 3]],[5E+113, [8, 0, 3]],[9E+113, [8, 0, 3]],[3E+114, [8, 0, 3]],[1.5E+115, [9, 0, 3]],[7.5E+115, [9, 0, 3]],[4E+116, [9, 0, 3]],[4.5E+116, [10, 0, 3]],[5E+116, [0, 0, 3]],[7.5E+116, [0, 0, 3]],[1E+117, [0, 0, 3]],[2E+117, [1, 0, 3]],[2E+118, [1, 0, 3]],[1.5E+119, [1, 0, 3]],[3.5E+119, [10, 0, 5]],[5E+119, [10, 0, 3]],[7E+119, [1, 0, 3]],[9.5E+119, [2, 0, 3]],[4E+120, [3, 0, 3]],[9E+120, [4, 0, 3]],[2.4E+121, [5, 0, 3]],[1.11E+122, [6, 0, 3]],[2.22E+122, [7, 0, 3]],[3.33E+122, [8, 0, 3]],[4.44E+122, [9, 0, 3]],[5.55E+122, [0, 0, 3]],[6.66E+122, [10, 0, 6.66]],[1E+123, [10, 0, 3]],[3E+123, [1, 0, 3]],[6E+123, [2, 0, 3]],[1.2E+124, [3, 0, 3]],[2.4E+124, [4, 0, 3]],[4.8E+124, [5, 0, 3]],[9.6E+124, [6, 0, 3]],[1.92E+125, [7, 0, 3]],[3.84E+125, [8, 0, 3]],[7.68E+125, [9, 0, 3]],[1E+126, [0, 0, 3]],[1E+127, [10, 0, 5]],[2E+129, [2, 0, 3]],[5E+129, [8, 0, 3]],[1.3E+130, [3, 0, 3]],[2.9E+130, [9, 0, 3]],[7.1E+130, [0, 0, 3]],[1.77E+131, [6, 0, 3]],[2.5E+131, [1, 0, 3]],[3.1E+131, [7, 0, 3]],[5.55E+131, [4, 0, 3]],[7.36E+131, [5, 0, 3]],[9E+131, [10, 0, 2]],[5E+132, [1, 0, 2]],[9.5E+133, [2, 0, 2]],[2.13E+134, [3, 0, 2]],[4E+134, [4, 0, 2]],[9.85E+134, [5, 0, 2]],[8E+135, [6, 0, 2]],[2.9E+136, [7, 0, 2]],[2.22E+137, [8, 0, 2]],[5E+137, [9, 0, 2]],[9E+137, [0, 0, 2]],[5E+138, [10, 0, 3]],[1.36E+140, [1, 0, 3]],[7E+140, [2, 0, 3]],[9.25E+140, [3, 0, 3]],[3E+141, [10, 0, 3]],[2.1E+142, [4, 0, 3]],[5.5E+142, [5, 0, 3]],[1.11E+143, [6, 0, 3]],[2.23E+143, [7, 0, 3]],[3.93E+143, [8, 0, 3]],[6E+143, [9, 0, 3]],[7.99E+143, [0, 0, 3]],[2E+144, [10, 0, 3]],[3E+144, [1, 0, 3]],[6E+144, [2, 0, 3]],[9E+144, [3, 0, 3]],[2.1E+145, [4, 0, 3]],[4.4E+145, [5, 0, 3]],[8.9E+145, [6, 0, 3]],[1.29E+146, [7, 0, 3]],[1.8E+146, [8, 0, 3]],[2.1E+146, [9, 0, 3]],[3E+146, [0, 0, 3]],[4.5E+146, [10, 0, 2.71828]],[5E+147, [5, 0, 5]],[3E+148, [1, 0, 5]],[1.8E+149, [2, 0, 5]],[9E+149, [8, 0, 5]],[5E+150, [3, 0, 5]],[2E+151, [9, 0, 5]],[8E+151, [4, 0, 5]],[2.4E+152, [0, 0, 5]],[7.2E+152, [6, 0, 5]],[2.1E+154, [7, 0, 5]],[5E+155, [10, 0, 4.4444444444444446]],[7.77E+155, [5, 0, 2]],[8.88E+155, [1, 0, 2]],[9.99E+155, [2, 0, 2]],[2E+156, [8, 0, 2]],[4E+156, [3, 0, 2]],[8E+156, [9, 0, 2]],[1.6E+157, [4, 0, 2]],[3.2E+157, [0, 0, 2]],[6.4E+157, [6, 0, 2]],[1.28E+158, [7, 0, 2]],[5.14E+158, [10, 0, 2.99792458]],[1E+159, [5, 0, 3]],[1E+160, [1, 0, 3]],[2.5E+160, [2, 0, 3]],[5E+160, [8, 0, 3]],[7.5E+160, [3, 0, 3]],[1E+161, [9, 0, 3]],[1.5E+161, [4, 0, 3]],[2E+161, [0, 0, 3]],[3E+161, [6, 0, 3]],[4E+161, [7, 0, 3]],[9E+161, [10, 0, 2.35711]],[1E+162, [7, 0, 24]],[2.5E+164, [10, 0, 2]],[5E+164, [1, 0, 22]],[7.5E+164, [10, 0, 2]],[1E+165, [2, 0, 20]],[2.5E+167, [10, 0, 2]],[5E+167, [8, 0, 18]],[7.5E+167, [10, 0, 2]],[1E+168, [5, 0, 16]],[2.5E+170, [10, 0, 2]],[5E+170, [6, 0, 14]],[7.5E+170, [10, 0, 2]],[1E+171, [9, 0, 12]],[2.5E+173, [10, 0, 2]],[5E+173, [0, 0, 10]],[7.5E+173, [10, 0, 2]],[1E+174, [3, 0, 8]],[2.5E+176, [10, 0, 2]],[5E+176, [4, 0, 4]],[1E+177, [10, 0, 9]],[5E+183, [10, 0, 9.87654321]],[5E+189, [10, 0, 5]],[2.7E+193, [10, 0, 3]],[1.3E+196, [10, 0, 4]],[2E+198, [10, 0, 5]],[1E+201, [0, 0, 3]],[1.4E+202, [1, 0, 3]],[9.6E+202, [2, 0, 3]],[1.98E+203, [3, 0, 3]],[3.22E+203, [4, 0, 3]],[6.79E+203, [5, 0, 3]],[8.88E+203, [6, 0, 3]],[1.9E+205, [7, 0, 3]],[8.1E+205, [8, 0, 3]],[1.99E+206, [9, 0, 3]],[2.33E+206, [0, 0, 3]],[4.21E+206, [1, 0, 3]],[6.07E+206, [2, 0, 3]],[7.77E+206, [3, 0, 3]],[9.1E+206, [4, 0, 3]],[2E+207, [5, 0, 3]],[9E+207, [6, 0, 3]],[4.5E+208, [7, 0, 3]],[2E+209, [8, 0, 3]],[3.28E+209, [9, 0, 3]],[6E+209, [10, 0, 5]],[1E+214, [0, 0, 11]],[1E+214, [1, 0, 11]],[1E+214, [2, 0, 11]],[1E+214, [3, 0, 11]],[1E+214, [4, 0, 11]],[1E+214, [5, 0, 11]],[1E+214, [6, 0, 11]],[1E+214, [7, 0, 11]],[1E+214, [8, 0, 11]],[1E+214, [9, 0, 11]],[1.5E+215, [0, 0, 3]],[1.66E+215, [1, 0, 3]],[1.93E+215, [2, 0, 3]],[4.1E+215, [3, 0, 3]],[6.78E+215, [4, 0, 3]],[9E+215, [5, 0, 3]],[1.2E+217, [6, 0, 3]],[6.7E+217, [7, 0, 3]],[1.23E+218, [8, 0, 3]],[3.21E+218, [9, 0, 3]],[5.55E+218, [10, 0, 5]],[8E+218, [0, 0, 3]],[9E+218, [1, 0, 3]],[8E+218, [2, 0, 3]],[9E+218, [3, 0, 3]],[3E+219, [4, 0, 3]],[4E+219, [5, 0, 3]],[5E+219, [6, 0, 3]],[6E+219, [7, 0, 3]],[3E+221, [8, 0, 3]],[4.21E+221, [9, 0, 3]],[6E+221, [0, 0, 3]],[7.89E+221, [1, 0, 3]],[8.45E+221, [2, 0, 3]],[2E+222, [3, 0, 3]],[5E+222, [4, 0, 3]],[1.4E+223, [5, 0, 3]],[5.4E+223, [6, 0, 3]],[1.08E+224, [7, 0, 3]],[2.19E+224, [8, 0, 3]],[4.68E+224, [9, 0, 3]],[1E+228, [0, 0, 7]],[1E+228, [1, 0, 7]],[1E+228, [2, 0, 7]],[1E+228, [3, 0, 7]],[1E+228, [4, 0, 7]],[1E+228, [5, 0, 7]],[1E+228, [6, 0, 7]],[1E+228, [7, 0, 7]],[1E+228, [8, 0, 7]],[1E+228, [9, 0, 7]],[1E+230, [10, 0, 5]],[3E+231, [0, 0, 3]],[8E+231, [1, 0, 3]],[6.9E+232, [2, 0, 3]],[1.88E+233, [3, 0, 3]],[2.39E+233, [4, 0, 3]],[4.11E+233, [5, 0, 3]],[7E+233, [6, 0, 3]],[9.12E+233, [7, 0, 3]],[1.2E+235, [8, 0, 3]],[2.4E+235, [9, 0, 3]],[6.3E+235, [0, 0, 3]],[1.99E+236, [1, 0, 3]],[3.98E+236, [2, 0, 3]],[5.66E+236, [3, 0, 3]],[7E+236, [4, 0, 3]],[8E+236, [5, 0, 3]],[9E+236, [6, 0, 3]],[1.2E+238, [7, 0, 3]],[2.5E+238, [8, 0, 3]],[5E+238, [9, 0, 3]],[1E+240, [0, 0, 2]],[5E+240, [1, 0, 2]],[9E+240, [2, 0, 2]],[2.1E+241, [3, 0, 2]],[4.5E+241, [4, 0, 2]],[8.9E+241, [5, 0, 2]],[1.53E+242, [6, 0, 2]],[2.99E+242, [7, 0, 2]],[5.77E+242, [8, 0, 2]],[8.13E+242, [9, 0, 2]],[2E+243, [0, 0, 2]],[2.2E+244, [1, 0, 2]],[4.4E+244, [2, 0, 2]],[6.6E+244, [3, 0, 2]],[8.8E+244, [4, 0, 2]],[1.11E+245, [5, 0, 2]],[2.22E+245, [6, 0, 2]],[3.33E+245, [7, 0, 2]],[4.44E+245, [8, 0, 2]],[5.55E+245, [9, 0, 2]],[1E+252, [10, 0, 5]],[1E+253, [0, 0, 3]],[1E+253, [1, 0, 3]],[1E+253, [2, 0, 3]],[1E+253, [3, 0, 3]],[1E+253, [4, 0, 3]],[1E+253, [5, 0, 3]],[1E+253, [6, 0, 3]],[1E+253, [7, 0, 3]],[1E+253, [8, 0, 3]],[1E+253, [9, 0, 3]],[5E+253, [0, 0, 9]],[7.5E+253, [1, 0, 9]],[1.25E+254, [2, 0, 9]],[6.25E+254, [3, 0, 9]],[3E+255, [4, 0, 9]],[1.5E+256, [5, 0, 9]],[7.5E+256, [6, 0, 9]],[3.75E+257, [7, 0, 9]],[1E+258, [8, 0, 9]],[8E+257, [9, 0, 9]],[2.5E+258, [10, 0, 2]],[6.4E+258, [0, 0, 3]],[1.22E+259, [1, 0, 3]],[2.33E+260, [2, 0, 3]],[3.99E+260, [3, 0, 3]],[7.66E+260, [4, 0, 3]],[1E+261, [5, 0, 3]],[1.9E+262, [6, 0, 3]],[9.8E+262, [7, 0, 3]],[2.6E+263, [8, 0, 3]],[5.44E+263, [9, 0, 3]],[7E+263, [0, 0, 3]],[1E+264, [1, 0, 3]],[4.5E+265, [2, 0, 3]],[6.9E+265, [3, 0, 3]],[8.9E+265, [4, 0, 3]],[1.89E+266, [5, 0, 3]],[2.89E+266, [6, 0, 3]],[4.48E+266, [7, 0, 3]],[9E+266, [8, 0, 3]],[5E+267, [9, 0, 3]],[1E+270, [10, 0, 5]],[1E+273, [0, 0, 7]],[2E+273, [1, 0, 7]],[3E+273, [2, 0, 7]],[6E+273, [3, 0, 7]],[2.5E+274, [4, 0, 7]],[2E+275, [5, 0, 7]],[6E+275, [6, 0, 7]],[9.99E+275, [7, 0, 7]],[1.5E+277, [8, 0, 7]],[3E+277, [9, 0, 7]],[1E+285, [1, 0, 13]],[1E+285, [2, 0, 13]],[1E+285, [3, 0, 13]],[1E+285, [4, 0, 13]],[1E+285, [5, 0, 13]],[1E+285, [6, 0, 13]],[1E+285, [7, 0, 13]],[1E+285, [8, 0, 13]],[1E+285, [9, 0, 13]]];
    WorldFactory.statics.earth.angelUpgrades = [[10000, [10, 0, 3]],[100000, [11, 2, 2]],[100000000, [11, 2, 2]],[1000000000, [10, 0, 5]],[100000000000, [10, 0, 9]],[25000000, [1, 3, 10]],[25000000, [2, 3, 10]],[25000000, [3, 3, 10]],[25000000, [4, 3, 10]],[250000000, [1, 3, 50]],[250000000, [2, 3, 50]],[250000000, [3, 3, 50]],[250000000, [4, 3, 50]],[25000000000, [1, 3, 50]],[25000000000, [2, 3, 50]],[25000000000, [3, 3, 50]],[25000000000, [4, 3, 50]],[1000000000000, [10, 0, 11]],[250000000000000, [1, 0, 3]],[750000000000000, [2, 0, 3]],[2E+15, [3, 0, 3]],[5E+15, [4, 0, 3]],[1E+16, [5, 0, 3]],[2.5E+16, [6, 0, 3]],[7.5E+16, [7, 0, 3]],[2E+17, [8, 0, 3]],[4E+17, [9, 0, 3]],[1E+18, [0, 0, 3]],[1E+21, [10, 0, 15]],[1E+22, [1, 3, 75]],[1E+22, [2, 3, 75]],[1E+22, [3, 3, 75]],[1E+22, [4, 3, 75]],[1E+22, [5, 3, 75]],[1E+23, [1, 3, 75]],[1E+23, [2, 3, 75]],[1E+23, [3, 3, 75]],[1E+23, [4, 3, 75]],[1E+23, [5, 3, 75]],[1E+31, [1, 3, 100]],[1E+32, [2, 3, 100]],[1E+33, [11, 2, 10]],[1E+34, [10, 0, 15]],[1E+36, [10, 0, 3]],[1E+40, [10, 0, 5]],[1E+42, [10, 0, 5]],[2E+42, [1, 3, 50]],[1E+47, [2, 0, 4]],[2E+47, [3, 0, 6]],[7E+47, [4, 0, 3]],[2E+48, [5, 0, 3]],[2.5E+49, [6, 0, 3]],[5E+50, [7, 0, 3]],[2E+52, [8, 0, 3]],[8E+52, [9, 0, 3]],[1.5E+53, [0, 0, 3]],[3E+53, [1, 0, 3]],[5E+53, [11, 2, 10]],[1E+54, [1, 0, 3]],[4E+54, [2, 0, 3]],[9E+54, [3, 0, 3]],[2.5E+55, [4, 0, 3]],[7.5E+55, [5, 0, 3]],[1.77E+56, [6, 0, 3]],[3E+56, [7, 0, 3]],[5E+56, [8, 0, 3]],[8E+56, [9, 0, 3]],[1E+57, [0, 0, 3]],[3E+61, [1, 3, 30]],[3E+61, [2, 3, 30]],[3E+61, [3, 3, 30]],[3E+61, [4, 3, 30]],[3E+61, [6, 3, 30]],[1E+62, [10, 0, 5]],[2E+63, [1, 0, 3]],[2E+63, [2, 0, 3]],[2E+63, [3, 0, 3]],[2E+63, [4, 0, 3]],[2E+63, [5, 0, 3]],[2E+63, [6, 0, 3]],[2E+63, [7, 0, 3]],[2E+63, [8, 0, 3]],[2E+63, [9, 0, 3]],[2E+63, [0, 0, 3]],[1E+65, [10, 0, 7]],[1E+66, [1, 0, 3]],[4E+66, [2, 0, 3]],[1.3E+67, [3, 0, 3]],[2E+67, [4, 0, 3]],[2.9E+67, [5, 0, 3]],[3.8E+67, [6, 0, 3]],[5.2E+67, [7, 0, 3]],[6.7E+67, [8, 0, 3]],[7.2E+67, [9, 0, 3]],[9.6E+67, [0, 0, 3]],[1.25E+68, [1, 3, 50]],[7.77E+68, [10, 0, 7.777777]],[5E+69, [1, 3, 10]],[5E+69, [2, 3, 10]],[5E+69, [3, 3, 10]],[5E+69, [4, 3, 10]],[5E+69, [5, 3, 10]],[5E+69, [6, 3, 10]],[5E+69, [7, 3, 10]],[5E+69, [8, 3, 10]],[5E+69, [9, 3, 10]],[5E+69, [0, 3, 10]],[1E+72, [1, 0, 3]],[5E+72, [2, 0, 3]],[2.2E+73, [3, 0, 3]],[4.4E+73, [4, 0, 3]],[1.11E+74, [5, 0, 3]],[2.22E+74, [6, 0, 3]],[3.33E+74, [7, 0, 3]],[4.44E+74, [8, 0, 3]],[5.55E+74, [9, 0, 3]],[6.66E+74, [0, 0, 3]],[2.5E+76, [2, 3, 25]],[2.5E+76, [1, 3, 25]],[2.5E+76, [3, 3, 25]],[2.5E+76, [4, 3, 25]],[2.5E+76, [5, 3, 25]],[2.5E+76, [6, 3, 25]],[2.5E+76, [7, 3, 25]],[2.5E+76, [8, 3, 25]],[2.5E+76, [9, 3, 25]],[2.5E+76, [0, 3, 25]],[1.1E+79, [1, 0, 3]],[2.7E+79, [2, 0, 3]],[4.3E+79, [3, 0, 3]],[8.7E+79, [4, 0, 3]],[1.9E+80, [5, 0, 3]],[3.21E+80, [6, 0, 3]],[4.95E+80, [7, 0, 3]],[6E+80, [8, 0, 3]],[7.25E+80, [9, 0, 3]],[8.98E+80, [0, 0, 3]],[3E+84, [10, 0, 13.11]],[1.3E+88, [10, 0, 5]],[3E+90, [10, 0, 3]],[1.3E+94, [10, 0, 4]],[2.4E+97, [10, 0, 5]],[1E+102, [1, 3, 25]],[1E+102, [2, 3, 25]],[1E+102, [3, 3, 25]],[1E+102, [4, 3, 25]],[1E+102, [5, 3, 25]],[1E+102, [6, 3, 25]],[1E+102, [7, 3, 25]],[1E+102, [8, 3, 25]],[1E+102, [9, 3, 25]],[1E+102, [0, 3, 25]],[3.33E+110, [10, 0, 3]],[1E+114, [1, 0, 3]],[2E+115, [2, 0, 3]],[5E+115, [3, 0, 3]],[1E+116, [4, 0, 3]],[2E+116, [5, 0, 3]],[3E+116, [6, 0, 3]],[4E+116, [7, 0, 3]],[5E+116, [8, 0, 3]],[7.5E+116, [9, 0, 3]],[2E+117, [0, 0, 3]],[1E+129, [1, 3, 25]],[1E+129, [2, 3, 25]],[1E+129, [3, 3, 25]],[1E+129, [4, 3, 25]],[1E+129, [5, 3, 25]],[1E+129, [6, 3, 25]],[1E+129, [7, 3, 25]],[1E+129, [8, 3, 25]],[1E+129, [9, 3, 25]],[1E+129, [0, 3, 25]],[1E+138, [1, 0, 3]],[4E+138, [2, 0, 3]],[1.6E+139, [3, 0, 3]],[5.6E+139, [4, 0, 3]],[1E+140, [5, 0, 3]],[2.11E+140, [6, 0, 3]],[3.49E+140, [7, 0, 3]],[4.43E+140, [8, 0, 3]],[5.67E+140, [9, 0, 3]],[7.01E+140, [0, 0, 3]],[9E+140, [1, 3, 25]],[9E+140, [2, 3, 25]],[9E+140, [3, 3, 25]],[9E+140, [4, 3, 25]],[9E+140, [5, 3, 25]],[9E+140, [6, 3, 25]],[9E+140, [7, 3, 25]],[9E+140, [8, 3, 25]],[9E+140, [9, 3, 25]],[9E+140, [0, 3, 25]],[1E+140, [10, 0, 19]]];
    WorldFactory.statics.earth.managerUpgrades = [[10000000000,9E+126],[1000000000,1E+103],[100000000,3E+120],[10000000,1E+113],[1000000,3E+117],[100000,7.5E+119],[9999,7.5E+106],[1000,2.5E+110],[100,5E+115],[10,3.3E+124]];
    WorldFactory.statics.moon = {};
    WorldFactory.statics.moon.angelScale = 165;
    WorldFactory.statics.moon.investments = [
      {baseCost: 5, basePower: 1.05, baseProfit: 1, baseSpeed: 2, name: 'Moon Shoe', id: 'shoes'},
      {baseCost: 105, basePower: 1.21, baseProfit: 21, baseSpeed: 7, name: 'Gravity Booth', id: 'booths'},
      {baseCost: 2929, basePower: 1.07, baseProfit: 2001, baseSpeed: 28, name: 'Payday Clone', id: 'clones'},
      {baseCost: 42525, basePower: 1.19, baseProfit: 376, baseSpeed: 2, name: 'Moon Express', id: 'express'},
      {baseCost: 493025, basePower: 1.09, baseProfit: 98820, baseSpeed: 45, name: 'Oxygen Bar', id: 'bars'},
      {baseCost: 18753525, basePower: 1.15, baseProfit: 1976400, baseSpeed: 180, name: 'Helium-3 Farm', id: 'farms'},
      {baseCost: 393824025, basePower: 1.13, baseProfit: 32940000, baseSpeed: 600, name: 'Cheese Mine', id: 'mines'},
      {baseCost: 8270304525, basePower: 1.17, baseProfit: 1152900000, baseSpeed: 3000, name: 'Amusement Park', id: 'park'},
      {baseCost: 173676395025, basePower: 1.11, baseProfit: 11067840000, baseSpeed: 14400, name: 'Werewolf Colony', id: 'colony'},
      {baseCost: 1000000000000, basePower: 1.5, baseProfit: 332035000000, baseSpeed: 86400, name: 'Giant Laser', id: 'laser'}
    ];
    WorldFactory.statics.moon.isEvent = false;
    WorldFactory.statics.moon.unlocks = [];
    WorldFactory.statics.moon.unlocks.push([[10, [0, 0, 3.5]],[20, [0, 0, 4]],[40, [0, 0, 4.5]],[80, [0, 0, 5]],[160, [0, 0, 5.5]],[320, [0, 0, 6]],[640, [0, 0, 6.5]],[1280, [0, 0, 7]],[2560, [0, 0, 7.5]],[5120, [0, 0, 999999999]],[10000, [0, 0, 3.5]]]);
    WorldFactory.statics.moon.unlocks.push([[30, [1, 0, 1.5]],[60, [1, 0, 1.75]],[90, [1, 0, 2]],[120, [1, 0, 2.25]],[160, [1, 0, 2.5]],[200, [1, 0, 2.75]],[240, [1, 0, 3]],[280, [1, 0, 3.25]],[330, [1, 0, 3.5]],[380, [1, 0, 3.75]],[430, [1, 0, 4]],[480, [1, 0, 4.25]],[540, [1, 0, 4.5]],[600, [1, 0, 4.75]],[660, [1, 0, 5]],[720, [1, 0, 5.5]],[790, [1, 0, 5.75]],[860, [1, 0, 6]],[940, [1, 0, 6.25]],[1020, [1, 0, 6.5]],[1110, [1, 0, 6.75]],[1200, [1, 0, 7]],[1400, [1, 0, 7.25]],[1600, [1, 0, 7.5]],[1800, [1, 0, 7.75]],[2000, [1, 0, 999999999]],[2400, [1, 0, 8.5]]]);
    WorldFactory.statics.moon.unlocks.push([[10, [2, 0, 3]],[20, [2, 0, 3]],[40, [2, 0, 3]],[60, [2, 0, 3]],[80, [2, 0, 3]],[100, [2, 0, 3]],[120, [2, 0, 3]],[240, [2, 0, 3]],[360, [5, 0, 3]],[480, [2, 0, 3]],[600, [2, 0, 3]],[840, [6, 0, 3]],[1080, [2, 0, 3]],[1320, [2, 0, 3]],[1560, [9, 0, 3]],[1800, [2, 0, 3]],[2160, [2, 0, 3]],[2520, [2, 0, 3]],[2880, [2, 0, 3]],[3240, [2, 0, 33]],[3600, [2, 0, 33]],[4000, [2, 0, 33]],[4400, [2, 0, 33]],[4800, [2, 0, 33]],[5200, [2, 0, 3333]],[5600, [2, 0, 3333]],[6000, [2, 0, 3333]],[6666, [2, 0, 3333]]]);
    WorldFactory.statics.moon.unlocks.push([[25, [3, 0, 3]],[50, [3, 0, 3]],[75, [3, 0, 3]],[100, [3, 0, 3]],[150, [3, 0, 6]],[200, [3, 0, 6]],[250, [3, 0, 6]],[300, [3, 0, 6]],[350, [3, 0, 6]],[400, [3, 0, 6]],[450, [3, 0, 6]],[500, [3, 0, 12]],[700, [3, 0, 24]],[900, [3, 0, 36]],[1100, [3, 0, 48]],[1300, [3, 0, 60]],[1500, [3, 0, 72]],[1700, [3, 0, 84]],[1900, [3, 0, 96]],[2100, [3, 0, 108]],[2300, [3, 0, 120]],[2500, [3, 0, 144]]]);
    WorldFactory.statics.moon.unlocks.push([[20, [4, 0, 12]],[50, [4, 0, 12]],[90, [4, 0, 12]],[180, [4, 0, 22]],[360, [4, 0, 333]],[720, [4, 0, 4444]],[1440, [4, 0, 55555]],[2880, [4, 0, 666666]],[5720, [4, 0, 7777777]]]);
    WorldFactory.statics.moon.unlocks.push([[50, [5, 0, 7]],[100, [5, 0, 7]],[200, [5, 0, 7]],[300, [5, 0, 7]],[400, [5, 0, 7]],[500, [5, 0, 7]],[600, [5, 0, 7]],[700, [5, 0, 7]],[800, [5, 0, 7]],[900, [5, 0, 7]],[1000, [5, 0, 7]],[1200, [5, 0, 7]],[1400, [5, 0, 7]],[1600, [5, 0, 7]],[1800, [5, 0, 7]],[2000, [5, 0, 7]],[2200, [5, 0, 777]],[2400, [5, 0, 777]],[2600, [5, 0, 777]],[2800, [5, 0, 777]],[3000, [5, 0, 777]]]);
    WorldFactory.statics.moon.unlocks.push([[8, [6, 0, 5]],[16, [6, 0, 5]],[32, [6, 0, 5]],[64, [6, 0, 5]],[128, [6, 0, 5]],[256, [6, 0, 5]],[512, [6, 0, 5]],[1024, [6, 0, 5]],[2048, [6, 0, 88888888]],[4096, [6, 0, 88888888]]]);
    WorldFactory.statics.moon.unlocks.push([[80, [7, 0, 8]],[160, [7, 0, 8]],[240, [7, 0, 8]],[320, [7, 0, 8]],[480, [7, 0, 8]],[640, [7, 0, 8]],[800, [7, 0, 8]],[960, [7, 0, 8]],[1200, [7, 0, 8]],[1440, [7, 0, 888]],[1680, [7, 0, 888]],[1920, [7, 0, 888]],[2160, [7, 0, 888]],[2300, [7, 0, 888]],[2540, [7, 0, 888]],[2780, [7, 0, 888]],[3000, [7, 0, 888]]]);
    WorldFactory.statics.moon.unlocks.push([[25, [8, 0, 3]],[50, [8, 0, 3]],[75, [8, 0, 3]],[100, [8, 0, 3]],[150, [8, 0, 3]],[200, [8, 0, 3]],[250, [8, 0, 3]],[300, [8, 0, 3]],[350, [8, 0, 3]],[400, [8, 0, 3]],[450, [8, 0, 3]],[500, [8, 0, 3]],[600, [8, 0, 3]],[700, [8, 0, 3]],[800, [8, 0, 3]],[900, [8, 0, 3]],[1000, [8, 0, 3]],[1200, [8, 0, 3]],[1400, [8, 0, 3]],[1600, [8, 0, 3]],[1800, [8, 0, 3]],[2000, [8, 0, 3]],[2300, [8, 0, 3]],[2600, [8, 0, 3]],[2900, [8, 0, 33]],[3200, [8, 0, 33]],[3500, [8, 0, 9876543210]],[3800, [8, 0, 33]],[4100, [8, 0, 33]]]);
    WorldFactory.statics.moon.unlocks.push([[50, [9, 0, 75]],[100, [9, 0, 75]],[200, [9, 0, 75]],[300, [9, 0, 75]],[400, [9, 0, 75]],[500, [9, 0, 75]],[600, [9, 0, 75]],[700, [9, 0, 75]],[800, [9, 0, 75]],[900, [9, 0, 75]],[1000, [9, 0, 75]],[1111, [9, 0, 75]]]);
    WorldFactory.statics.moon.unlocks.push([[1, [10, 1, 2]],[5, [10, 1, 2]],[25, [10, 1, 2]],[50, [10, 1, 2]],[75, [10, 1, 2]],[100, [10, 1, 2]],[150, [10, 1, 2]],[200, [10, 1, 2]],[250, [10, 1, 2]],[300, [10, 1, 2]],[350, [10, 1, 2]],[400, [10, 1, 2]],[450, [10, 1, 2]],[500, [10, 1, 2]],[600, [10, 1, 2]],[700, [10, 1, 2]],[800, [10, 1, 2]],[900, [10, 1, 2]],[1000, [10, 1, 2]],[1111, [10, 1, 2]]]);
    WorldFactory.statics.moon.cashUpgrades = [[332500, [0, 0, 3]],[665000, [1, 0, 3]],[1330000, [2, 0, 3]],[6650000, [3, 0, 3]],[13300000, [4, 0, 3]],[33250000, [5, 0, 3]],[1665000000, [6, 0, 3]],[133000000000, [7, 0, 3]],[665000000000, [8, 0, 3]],[3300000000000, [9, 0, 3]],[10000000000000, [10, 0, 9]],[30000000000000, [0, 0, 3]],[70000000000000, [1, 0, 3]],[150000000000000, [2, 0, 3]],[266000000000000, [3, 0, 3]],[275000000000000, [4, 0, 3]],[433000000000000, [5, 0, 3]],[665000000000000, [6, 0, 3]],[931000000000000, [7, 0, 3]],[2E+15, [8, 0, 3]],[3E+15, [9, 0, 3]],[7E+15, [10, 0, 9]],[1.3E+16, [11, 2, 1]],[5E+20, [10, 0, 9]],[2.6E+22, [0, 0, 3]],[6.7E+22, [1, 0, 3]],[9.3E+22, [2, 0, 3]],[1.33E+23, [3, 0, 3]],[2.66E+23, [4, 0, 3]],[4.65E+23, [5, 0, 3]],[6.65E+23, [6, 0, 3]],[9.97E+23, [7, 0, 3]],[2E+24, [8, 0, 3]],[3E+24, [9, 0, 3]],[1E+25, [10, 0, 9]],[2E+25, [11, 2, 1]],[5E+30, [0, 0, 3]],[1E+31, [1, 0, 3]],[2E+31, [2, 0, 3]],[4E+31, [3, 0, 3]],[1.6E+32, [4, 0, 3]],[2.8E+32, [5, 0, 3]],[5E+32, [6, 0, 3]],[6.9E+32, [7, 0, 3]],[7.25E+32, [8, 0, 3]],[8.33E+32, [9, 0, 3]],[9.75E+32, [10, 0, 9]],[4E+33, [11, 2, 1]],[9E+33, [0, 0, 3]],[2E+34, [1, 0, 3]],[1E+35, [2, 0, 3]],[2E+35, [3, 0, 3]],[4.21E+35, [4, 0, 3]],[6.55E+35, [5, 0, 3]],[8.25E+35, [6, 0, 3]],[5E+36, [7, 0, 3]],[2.5E+37, [8, 0, 3]],[5E+37, [9, 0, 3]],[1E+38, [10, 0, 9]],[7.5E+40, [0, 0, 5]],[2.1E+41, [1, 0, 5]],[3.53E+41, [2, 0, 5]],[6.35E+41, [3, 0, 5]],[9E+41, [4, 0, 5]],[9E+42, [5, 0, 5]],[2.2E+43, [6, 0, 5]],[6E+43, [7, 0, 5]],[1.32E+44, [8, 0, 5]],[3.67E+44, [9, 0, 5]],[1E+45, [10, 0, 9]],[1E+51, [10, 0, 9]],[1E+54, [11, 2, 3]],[1.8E+55, [0, 0, 3]],[6E+54, [1, 0, 3]],[7.9E+55, [2, 0, 3]],[1.1E+56, [3, 0, 3]],[2.2E+56, [4, 0, 3]],[3.99E+56, [5, 0, 3]],[6.66E+56, [6, 0, 3]],[9.11E+56, [7, 0, 3]],[4E+60, [8, 0, 3]],[2.5E+61, [9, 0, 3]],[1.12E+62, [10, 0, 9]],[2E+62, [0, 0, 3]],[3.56E+62, [1, 0, 3]],[5.18E+62, [2, 0, 3]],[7.66E+62, [3, 0, 3]],[3E+69, [4, 0, 3]],[6E+69, [5, 0, 3]],[1.2E+70, [6, 0, 3]],[5E+70, [7, 0, 3]],[2.12E+71, [8, 0, 3]],[3.67E+71, [9, 0, 3]],[1E+72, [10, 0, 9]],[2.5E+76, [0, 0, 3]],[6E+76, [1, 0, 3]],[1.77E+77, [2, 0, 3]],[2.39E+77, [3, 0, 3]],[4.32E+77, [4, 0, 3]],[8.01E+77, [5, 0, 3]],[2E+78, [6, 0, 3]],[8E+78, [7, 0, 3]],[2.2E+79, [8, 0, 3]],[5.9E+79, [9, 0, 3]],[4.44E+80, [10, 0, 9]],[3E+81, [11, 2, 3]],[1.2E+85, [0, 0, 3]],[2.4E+85, [1, 0, 3]],[4.8E+85, [2, 0, 3]],[9.6E+85, [3, 0, 3]],[1.92E+86, [4, 0, 3]],[3.84E+86, [5, 0, 3]],[9.68E+86, [6, 0, 3]],[1.5E+88, [7, 0, 3]],[3.5E+88, [8, 0, 3]],[1E+89, [9, 0, 3]],[1E+90, [10, 0, 9]],[1E+92, [0, 0, 5]],[2E+92, [1, 0, 5]],[3E+92, [2, 0, 5]],[4E+92, [3, 0, 5]],[5E+92, [4, 0, 5]],[6E+92, [5, 0, 5]],[7E+92, [6, 0, 5]],[8E+92, [7, 0, 5]],[9E+92, [8, 0, 5]],[9.99E+92, [9, 0, 5]],[5E+93, [10, 0, 9]],[1E+94, [0, 0, 3]],[2E+94, [1, 0, 3]],[5.5E+94, [2, 0, 3]],[9E+94, [3, 0, 3]],[1.8E+95, [4, 0, 3]],[4E+95, [5, 0, 3]],[7.5E+95, [6, 0, 3]],[2E+96, [7, 0, 3]],[4E+96, [8, 0, 3]],[1.4E+97, [9, 0, 3]],[5E+97, [10, 0, 9]],[4E+98, [0, 0, 3]],[7E+98, [1, 0, 3]],[1E+99, [2, 0, 3]],[3E+99, [3, 0, 3]],[1.9E+100, [4, 0, 3]],[5.5E+100, [5, 0, 3]],[1.23E+101, [6, 0, 3]],[2E+101, [7, 0, 3]],[6E+101, [8, 0, 3]],[8.88E+101, [9, 0, 3]],[1E+102, [10, 0, 9]],[5E+102, [0, 0, 3]],[2.5E+103, [1, 0, 3]],[1.25E+104, [2, 0, 3]],[6.25E+104, [3, 0, 3]],[3E+105, [4, 0, 3]],[5E+105, [5, 0, 3]],[6.5E+106, [6, 0, 3]],[2.46E+107, [7, 0, 3]],[5E+107, [8, 0, 3]],[8.08E+107, [9, 0, 3]],[1E+108, [10, 0, 9]],[2E+108, [0, 0, 3]],[4E+108, [1, 0, 3]],[8E+108, [2, 0, 3]],[1.6E+109, [3, 0, 3]],[3.2E+109, [4, 0, 3]],[6.4E+109, [5, 0, 3]],[1.28E+110, [6, 0, 3]],[2.56E+110, [7, 0, 3]],[5.12E+110, [8, 0, 3]],[1E+111, [9, 0, 3]],[1E+113, [10, 0, 9]],[1.25E+113, [0, 0, 3]],[1.5E+113, [1, 0, 3]],[1.75E+113, [2, 0, 3]],[2E+113, [3, 0, 3]],[2.25E+113, [4, 0, 3]],[2.5E+113, [5, 0, 3]],[2.75E+113, [6, 0, 3]],[3E+113, [7, 0, 3]],[3.5E+113, [8, 0, 3]],[4E+113, [9, 0, 3]],[5E+113, [10, 0, 9]],[1E+114, [0, 0, 11]],[1E+115, [1, 0, 11]],[1E+116, [2, 0, 11]],[1E+117, [3, 0, 11]],[1E+118, [4, 0, 11]],[1E+119, [5, 0, 11]],[1E+120, [6, 0, 11]],[1E+121, [7, 0, 11]],[1E+122, [8, 0, 11]],[1E+123, [9, 0, 11]],[1E+124, [10, 0, 15]],[1E+126, [0, 0, 3]],[7E+126, [1, 0, 3]],[2.9E+127, [2, 0, 3]],[6.6E+127, [3, 0, 3]],[1.29E+128, [4, 0, 3]],[2.33E+128, [5, 0, 3]],[5.55E+128, [6, 0, 3]],[9E+128, [7, 0, 3]],[3E+129, [8, 0, 3]],[2E+130, [9, 0, 3]],[1.11E+131, [10, 0, 9]],[1E+135, [10, 0, 9]],[1E+138, [0, 0, 3]],[2E+138, [1, 0, 3]],[3E+138, [2, 0, 3]],[4E+138, [3, 0, 3]],[5E+138, [4, 0, 3]],[6E+138, [5, 0, 3]],[7E+138, [6, 0, 3]],[8E+138, [7, 0, 3]],[9E+138, [8, 0, 3]],[1E+139, [9, 0, 3]],[1E+140, [10, 0, 9]],[1E+141, [0, 0, 3]],[3E+141, [1, 0, 3]],[7E+141, [2, 0, 3]],[2.5E+142, [3, 0, 3]],[7.5E+142, [4, 0, 3]],[1.51E+143, [5, 0, 3]],[4E+143, [6, 0, 3]],[6E+143, [7, 0, 3]],[9E+143, [8, 0, 3]],[2E+144, [9, 0, 3]],[6E+144, [10, 0, 9]],[1.9E+145, [0, 0, 3]],[6.6E+145, [1, 0, 3]],[1.23E+146, [2, 0, 3]],[2.99E+146, [3, 0, 3]],[6.67E+146, [4, 0, 3]],[9.01E+146, [5, 0, 3]],[2E+147, [6, 0, 3]],[5.3E+148, [7, 0, 3]],[2E+149, [8, 0, 3]],[5E+149, [9, 0, 3]],[1E+150, [10, 0, 9]],[1E+156, [0, 0, 3]],[2E+156, [1, 0, 3]],[4E+156, [2, 0, 3]],[8E+156, [3, 0, 3]],[1.6E+157, [4, 0, 3]],[3.2E+157, [5, 0, 3]],[6.4E+157, [6, 0, 3]],[1.28E+158, [7, 0, 3]],[2.56E+158, [8, 0, 3]],[5.12E+158, [9, 0, 3]],[1E+159, [10, 0, 9]],[2E+162, [0, 0, 5]],[5E+162, [1, 0, 5]],[1.1E+163, [2, 0, 5]],[2.3E+163, [3, 0, 5]],[4.7E+163, [4, 0, 5]],[9.5E+163, [5, 0, 5]],[1.91E+164, [6, 0, 5]],[3.83E+164, [7, 0, 5]],[7.67E+164, [8, 0, 5]],[5E+165, [9, 0, 5]],[1.25E+167, [10, 0, 9]],[1E+168, [10, 0, 9]],[1E+171, [0, 0, 3]],[1.4E+172, [1, 0, 3]],[1.14E+173, [2, 0, 3]],[2.34E+173, [3, 0, 3]],[4.44E+173, [4, 0, 3]],[8.88E+173, [5, 0, 3]],[2.3E+175, [6, 0, 3]],[9.9E+175, [7, 0, 3]],[4.23E+176, [8, 0, 3]],[5.67E+176, [9, 0, 3]],[8.99E+176, [10, 0, 9]],[1E+180, [0, 0, 3]],[3E+180, [1, 0, 3]],[9E+180, [2, 0, 3]],[2.7E+181, [3, 0, 3]],[8.1E+181, [4, 0, 3]],[2.34E+182, [5, 0, 3]],[3.56E+182, [6, 0, 3]],[4.32E+182, [7, 0, 3]],[5.67E+182, [8, 0, 3]],[8.36E+182, [9, 0, 3]],[1E+183, [10, 0, 9]],[1E+187, [0, 0, 15]],[1E+188, [1, 0, 15]],[1E+189, [2, 0, 15]],[1E+190, [3, 0, 15]],[1E+191, [4, 0, 15]],[1E+192, [5, 0, 15]],[1E+193, [6, 0, 15]],[1E+194, [7, 0, 15]],[1E+195, [8, 0, 15]],[1E+196, [9, 0, 15]],[1E+197, [10, 0, 999]]];
    WorldFactory.statics.moon.angelUpgrades = [[11111, [10, 0, 3]],[222222, [0, 0, 3]],[3333333, [1, 0, 3]],[4444444, [2, 0, 3]],[55555555, [3, 0, 3]],[666666666, [4, 0, 3]],[7777777777, [5, 0, 3]],[88888888888, [6, 0, 3]],[999999999999, [7, 0, 3]],[1010101010101, [8, 0, 3]],[11111111111111, [9, 0, 3]],[123000000000000, [10, 0, 3]],[5E+19, [1, 3, 10]],[5E+19, [3, 3, 10]],[5E+19, [5, 3, 10]],[5E+19, [7, 3, 10]],[5E+19, [9, 3, 10]],[1E+21, [0, 0, 3]],[9E+21, [1, 0, 3]],[2.7E+22, [2, 0, 3]],[9.9E+22, [3, 0, 3]],[1.8E+23, [4, 0, 3]],[2.22E+23, [5, 0, 3]],[3.43E+23, [6, 0, 3]],[4.77E+23, [7, 0, 3]],[5.69E+23, [8, 0, 3]],[7.89E+23, [9, 0, 3]],[1E+24, [10, 0, 3]],[2.5E+28, [1, 3, 10]],[2.5E+28, [3, 3, 10]],[2.5E+28, [5, 3, 10]],[2.5E+28, [7, 3, 10]],[2.5E+28, [9, 3, 10]],[1E+30, [0, 0, 3]],[1.4E+31, [1, 0, 3]],[5.5E+31, [2, 0, 3]],[1E+32, [3, 0, 3]],[1.89E+32, [4, 0, 3]],[2.67E+32, [5, 0, 3]],[4.04E+32, [6, 0, 3]],[6.91E+32, [7, 0, 3]],[7.77E+32, [8, 0, 3]],[9.1E+32, [9, 0, 3]],[2E+33, [10, 0, 3]],[1E+35, [1, 3, 10]],[1E+35, [3, 3, 10]],[1E+35, [5, 3, 10]],[1E+35, [7, 3, 10]],[1E+35, [9, 3, 10]],[5E+36, [0, 0, 3]],[1.9E+37, [1, 0, 3]],[8.8E+37, [2, 0, 3]],[1.44E+38, [3, 0, 3]],[2.01E+38, [4, 0, 3]],[3.33E+38, [5, 0, 3]],[4E+38, [6, 0, 3]],[5.88E+38, [7, 0, 3]],[7.01E+38, [8, 0, 3]],[9.11E+38, [9, 0, 3]],[5E+40, [10, 0, 9]],[5E+42, [1, 3, 10]],[5E+42, [3, 3, 10]],[5E+42, [5, 3, 10]],[5E+42, [7, 3, 10]],[5E+42, [9, 3, 10]],[3E+45, [0, 0, 5]],[6E+45, [1, 0, 5]],[1.2E+46, [2, 0, 5]],[2.4E+46, [3, 0, 5]],[4.8E+46, [4, 0, 5]],[9.6E+46, [5, 0, 5]],[1.92E+47, [6, 0, 5]],[3.84E+47, [7, 0, 5]],[7.68E+47, [8, 0, 5]],[1.4E+49, [9, 0, 5]],[5E+50, [10, 0, 9]],[1E+53, [10, 0, 9]],[5E+54, [0, 3, 50]],[5E+54, [1, 3, 50]],[5E+54, [2, 3, 50]],[5E+54, [3, 3, 50]],[5E+54, [4, 3, 50]],[5E+54, [5, 3, 50]],[5E+54, [6, 3, 50]],[5E+54, [7, 3, 50]],[5E+54, [7, 3, 50]],[5E+54, [9, 3, 50]],[1E+56, [0, 0, 3]],[2E+56, [1, 0, 3]],[3E+56, [2, 0, 3]],[4E+56, [3, 0, 3]],[5E+56, [4, 0, 3]],[6E+56, [5, 0, 3]],[7E+56, [6, 0, 3]],[8E+56, [7, 0, 3]],[9E+56, [8, 0, 3]],[1E+57, [9, 0, 3]],[3.16E+59, [10, 0, 3]],[1E+60, [10, 0, 9]],[1E+65, [0, 3, 75]],[1E+65, [1, 3, 75]],[1E+65, [2, 3, 75]],[1E+65, [3, 3, 75]],[1E+65, [4, 3, 75]],[1E+65, [5, 3, 75]],[1E+65, [6, 3, 75]],[1E+65, [7, 3, 75]],[1E+65, [8, 3, 75]],[1E+65, [9, 3, 75]],[1E+66, [10, 0, 3]],[1E+69, [0, 0, 3]],[2E+69, [1, 0, 3]],[4E+69, [2, 0, 3]],[8E+69, [3, 0, 3]],[1.6E+70, [4, 0, 3]],[3.2E+70, [5, 0, 3]],[6.4E+70, [6, 0, 3]],[1.28E+71, [7, 0, 3]],[2.56E+71, [8, 0, 3]],[5.12E+71, [9, 0, 3]],[1E+72, [10, 0, 9]],[5E+75, [1, 3, 50]],[5E+75, [3, 3, 50]],[5E+75, [4, 3, 100]],[5E+75, [6, 3, 100]],[5E+75, [9, 3, 25]],[1E+77, [0, 0, 7]],[2E+77, [1, 0, 7]],[4E+77, [2, 0, 7]],[8E+77, [3, 0, 7]],[1.6E+79, [4, 0, 7]],[3.2E+79, [5, 0, 7]],[6.4E+79, [6, 0, 7]],[1.28E+80, [7, 0, 7]],[2.56E+80, [8, 0, 7]],[5.12E+80, [9, 0, 7]],[1E+81, [10, 0, 7]],[1E+86, [3, 3, 100]],[2E+86, [4, 3, 200]],[3E+86, [6, 3, 300]],[1E+87, [0, 0, 3]],[9E+87, [1, 0, 3]],[1.8E+88, [2, 0, 3]],[2.7E+88, [3, 0, 3]],[3.6E+88, [4, 0, 3]],[4.5E+88, [5, 0, 3]],[5.4E+88, [6, 0, 3]],[6.3E+88, [7, 0, 3]],[7.2E+88, [8, 0, 3]],[8.1E+88, [9, 0, 3]],[1E+90, [10, 0, 5]]];
    WorldFactory.statics.moon.managerUpgrades = [[1E+100],[1E+100],[1E+100],[1E+100],[1E+100],[1E+100],[1E+100],[1E+100],[1E+100],[1E+100]];
    WorldFactory.statics.mars = {};
    WorldFactory.statics.mars.angelScale = 300;
    WorldFactory.statics.mars.investments = [
      {baseCost: 0.05, basePower: 1.01, baseProfit: 0.011, baseSpeed: 0.5, name: 'Red Dirt', id: 'reddirt'},
      {baseCost: 1, basePower: 1.03, baseProfit: 1, baseSpeed: 3, name: 'Marsies', id: 'marsies'},
      {baseCost: 1234, basePower: 1.05, baseProfit: 4321, baseSpeed: 9, name: 'Men', id: 'men'},
      {baseCost: 23000000, basePower: 1.07, baseProfit: 4007310, baseSpeed: 32, name: 'Buggles', id: 'buggles'},
      {baseCost: 49000000000, basePower: 1.11, baseProfit: 518783295, baseSpeed: 64, name: 'Heck Portal', id: 'portals'},
      {baseCost: 77000000000000, basePower: 1.04, baseProfit: 500634321, baseSpeed: 4, name: 'Ambassadors', id: 'ambassadors'},
      {baseCost: 5E+15, basePower: 1.07, baseProfit: 7543177325, baseSpeed: 18, name: 'Brain-cation', id: 'braincations'},
      {baseCost: 1E+18, basePower: 1.09, baseProfit: 69263532485, baseSpeed: 42, name: 'LiFE Pod', id: 'lifepod'},
      {baseCost: 1.3E+25, basePower: 1.25, baseProfit: 9.97602739164825E+16, baseSpeed: 43200, name: 'Terrorformer', id: 'terriformer'}
    ];
    WorldFactory.statics.mars.isEvent = false;
    WorldFactory.statics.mars.unlocks = [];
    WorldFactory.statics.mars.unlocks.push([[200, [0, 0, 3]],[400, [0, 0, 3]],[600, [0, 0, 3]],[800, [0, 0, 3]],[1000, [0, 1, 2]],[1200, [0, 0, 3]],[1400, [0, 0, 3]],[1600, [0, 0, 3]],[1800, [0, 0, 3]],[2000, [0, 1, 2]],[2200, [0, 0, 3]],[2400, [0, 0, 3]],[2600, [0, 0, 3]],[2800, [0, 0, 3]],[3000, [0, 1, 2]],[3200, [0, 0, 3]],[3400, [0, 0, 3]],[3600, [0, 0, 3]],[3800, [0, 0, 3]],[4000, [0, 0, 3]],[4300, [0, 0, 3]],[4600, [0, 0, 3]],[4900, [0, 0, 3]],[5200, [0, 0, 3]],[5500, [0, 0, 3]],[5800, [0, 0, 3]],[6100, [0, 0, 3]],[6400, [0, 0, 3]],[6700, [0, 0, 3]],[7000, [0, 1, 2]],[7300, [0, 0, 3]],[7600, [0, 0, 3]],[7900, [0, 0, 3]],[8200, [0, 0, 3]],[8500, [0, 1, 2]],[8800, [0, 0, 3]],[9100, [0, 0, 3]],[9400, [0, 0, 3]],[9700, [0, 0, 3]],[10000, [0, 0, 3]],[10500, [0, 0, 3]],[11000, [0, 0, 3]],[11500, [0, 0, 3]],[12000, [0, 0, 3]],[12500, [0, 0, 3]],[13000, [0, 0, 13]],[13500, [0, 0, 3]],[14000, [0, 0, 3]],[14500, [0, 0, 3]],[15000, [0, 0, 3]],[15500, [0, 0, 3]],[16000, [0, 0, 3]],[16500, [0, 0, 3]],[17000, [0, 0, 3]],[17500, [0, 0, 3]],[18000, [0, 0, 3]],[18500, [0, 0, 3]],[19000, [0, 0, 3]],[19500, [0, 0, 3]],[20000, [0, 0, 3]],[20500, [0, 0, 3]],[21500, [0, 0, 3]],[22000, [0, 0, 3]],[22500, [0, 0, 3]],[23000, [0, 0, 3]],[23500, [0, 0, 3]],[24000, [0, 0, 3]],[24500, [0, 0, 3]],[25000, [0, 0, 3]],[25500, [0, 0, 3]],[26000, [0, 0, 3]],[26500, [0, 0, 3]],[27000, [0, 0, 3]],[27500, [0, 0, 3]],[28000, [0, 0, 3]],[28500, [0, 0, 3]],[29000, [0, 0, 3]],[29500, [0, 0, 3]],[30000, [0, 0, 3]],[30500, [0, 0, 3]],[31000, [0, 0, 3]],[31500, [0, 0, 3]],[32000, [0, 0, 3]],[32500, [0, 0, 3]],[33000, [0, 0, 3]],[33500, [0, 0, 3]],[34000, [0, 0, 3]],[34500, [0, 0, 3]],[35000, [0, 0, 3]],[35500, [0, 0, 3]],[36000, [0, 0, 3]],[36500, [0, 0, 3]],[37000, [0, 0, 3]],[37500, [0, 0, 3]],[38000, [0, 0, 3]],[38500, [0, 0, 3]],[39000, [0, 0, 3]],[39500, [0, 0, 3]],[40000, [0, 0, 3]],[40500, [0, 0, 3]],[41000, [0, 0, 3]],[41500, [0, 0, 3]],[42000, [0, 0, 3]],[42500, [0, 0, 3]],[43000, [0, 0, 3]],[43500, [0, 0, 3]],[44000, [0, 0, 3]],[44500, [0, 0, 3]],[45000, [0, 0, 3]],[45500, [0, 0, 3]],[46000, [0, 0, 3]],[46500, [0, 0, 3]],[47000, [0, 0, 3]],[47500, [0, 0, 3]],[48000, [0, 0, 3]],[48500, [0, 0, 3]],[49000, [0, 0, 3]],[49500, [0, 0, 3]],[50000, [0, 0, 3]],[50500, [0, 0, 3]],[51000, [0, 0, 3]],[51500, [0, 0, 3]],[52000, [0, 0, 3]],[52500, [0, 0, 3]],[53000, [0, 0, 3]],[53500, [0, 0, 3]],[54000, [0, 0, 3]],[54500, [0, 0, 3]],[55000, [0, 0, 3]],[55555, [0, 0, 5]],[56000, [0, 0, 3]]]);
    WorldFactory.statics.mars.unlocks.push([[75, [1, 0, 3.33]],[150, [1, 0, 3.33]],[225, [1, 0, 3.33]],[300, [1, 1, 2]],[375, [1, 0, 3.33]],[450, [1, 0, 3.33]],[525, [1, 0, 3.33]],[600, [1, 1, 2]],[675, [1, 0, 3.33]],[750, [1, 0, 3.33]],[825, [1, 0, 3.33]],[900, [1, 1, 2]],[975, [1, 0, 3.33]],[1050, [1, 0, 3.33]],[1125, [1, 0, 3.33]],[1200, [1, 1, 2]],[1275, [1, 0, 3.33]],[1350, [1, 0, 3.33]],[1425, [1, 0, 3.33]],[1500, [1, 1, 2]],[1575, [1, 0, 3.33]],[1650, [1, 0, 3.33]],[1725, [1, 0, 3.33]],[1800, [1, 1, 2]],[1875, [1, 0, 3.33]],[1950, [1, 0, 3.33]],[2025, [1, 0, 3.33]],[2100, [1, 0, 3.33]],[2275, [1, 0, 3.33]],[2450, [1, 0, 3.33]],[2625, [1, 0, 3.33]],[2800, [1, 0, 3.33]],[2975, [1, 0, 3.33]],[3150, [1, 0, 3.33]],[3325, [1, 0, 3.33]],[3500, [1, 0, 3.33]],[3675, [1, 0, 3.33]],[3850, [1, 0, 3.33]],[4025, [1, 0, 3.33]],[4200, [1, 0, 3.33]],[4375, [1, 0, 3.33]],[4550, [1, 0, 3.33]],[4725, [1, 0, 3.33]],[4900, [1, 0, 3.33]],[5075, [1, 0, 3.33]],[5250, [1, 0, 3.33]],[5425, [1, 0, 3.33]],[5600, [1, 0, 3.33]],[5775, [1, 0, 3.33]],[5950, [1, 0, 3.33]],[6125, [1, 0, 3.33]],[6300, [1, 0, 3.33]],[6475, [1, 0, 3.33]],[6650, [1, 0, 3.33]],[6825, [1, 0, 3.33]],[7000, [1, 0, 3.33]],[7175, [1, 0, 3.33]],[7350, [1, 0, 3.33]],[7525, [1, 0, 3.33]],[7700, [1, 0, 3.33]],[7875, [1, 0, 3.33]],[8050, [1, 0, 3.33]],[8225, [1, 0, 3.33]],[8400, [1, 0, 3.33]],[8575, [1, 0, 3.33]],[8750, [1, 0, 3.33]],[8925, [1, 0, 3.33]],[9100, [1, 0, 3.33]],[9275, [1, 0, 3.33]],[9450, [1, 0, 3.33]],[9625, [1, 0, 3.33]],[9800, [1, 0, 3.33]],[9975, [1, 0, 3.33]],[10150, [1, 0, 3.33]],[10325, [1, 0, 3.33]],[10500, [1, 0, 3.33]],[10675, [1, 0, 3.33]],[10850, [1, 0, 3.33]],[11025, [1, 0, 3.33]],[11200, [1, 0, 3.33]],[11375, [1, 0, 3.33]],[11550, [1, 0, 3.33]],[11725, [1, 0, 3.33]],[11900, [1, 0, 3.33]],[12075, [1, 0, 3.33]],[12250, [1, 0, 3.33]],[12425, [1, 0, 3.33]],[12600, [1, 0, 3.33]],[12775, [1, 0, 3.33]],[12950, [1, 0, 3.33]],[13125, [1, 0, 3.33]],[13300, [1, 0, 3.33]],[13475, [1, 0, 3.33]],[13650, [1, 0, 3.33]],[13825, [1, 0, 3.33]],[14000, [1, 0, 3.33]],[14175, [1, 0, 3.33]],[14350, [1, 0, 3.33]],[14525, [1, 0, 3.33]],[14700, [1, 0, 3.33]],[14875, [1, 0, 3.33]],[15050, [1, 0, 3.33]],[15225, [1, 0, 3.33]],[15400, [1, 0, 3.33]],[15575, [1, 0, 3.33]],[15750, [1, 0, 3.33]],[15925, [1, 0, 3.33]],[16100, [1, 0, 3.33]],[16275, [1, 0, 3.33]],[16450, [1, 0, 3.33]],[16625, [1, 0, 3.33]],[16800, [1, 0, 3.33]],[16975, [1, 0, 3.33]],[17150, [1, 0, 3.33]],[17325, [1, 0, 3.33]],[17500, [1, 0, 3.33]]]);
    WorldFactory.statics.mars.unlocks.push([[100, [2, 0, 5]],[200, [2, 0, 5]],[300, [2, 0, 5]],[400, [2, 0, 5]],[500, [2, 1, 5]],[600, [2, 0, 6]],[700, [2, 0, 9]],[800, [2, 0, 9]],[900, [2, 0, 9]],[1000, [2, 1, 5]],[1100, [2, 0, 9]],[1200, [2, 0, 9]],[1300, [2, 0, 9]],[1400, [2, 0, 9]],[1500, [2, 0, 9]],[1600, [2, 0, 9]],[1700, [2, 0, 9]],[1800, [2, 0, 9]],[1900, [2, 0, 9]],[2000, [2, 0, 9]],[2200, [2, 0, 9]],[2400, [2, 0, 9]],[2600, [2, 0, 9]],[2800, [2, 0, 9]],[3000, [2, 0, 9]],[3200, [2, 0, 9]],[3400, [2, 0, 9]],[3600, [2, 0, 9]],[3800, [2, 0, 9]],[4000, [2, 0, 9]],[4200, [2, 0, 9]],[4400, [2, 0, 9]],[4600, [2, 0, 9]],[4800, [2, 0, 9]],[5000, [2, 0, 999]],[5200, [2, 0, 9]],[5400, [2, 0, 9]],[5600, [2, 0, 9]],[5800, [2, 0, 9]],[6000, [2, 0, 9]],[6200, [2, 0, 9]],[6400, [2, 0, 9]],[6600, [2, 0, 9]],[6800, [2, 0, 9]],[7000, [2, 0, 9]],[7200, [2, 0, 9]],[7400, [2, 0, 9]],[7600, [2, 0, 9]],[7800, [2, 0, 9]],[8000, [2, 0, 9]],[8200, [2, 0, 9]],[8400, [2, 0, 9]],[8600, [2, 0, 9]],[8800, [2, 0, 9]],[9000, [2, 0, 9]],[9200, [2, 0, 9]],[9400, [2, 0, 9]],[9600, [2, 0, 9]],[9800, [2, 0, 9]],[10000, [2, 0, 9]],[10200, [2, 0, 9]],[10400, [2, 0, 9]],[10600, [2, 0, 9]],[10800, [2, 0, 9]],[11000, [2, 0, 9]],[11200, [2, 0, 9]],[11400, [2, 0, 9]],[11600, [2, 0, 9]],[11800, [2, 0, 9]],[12000, [2, 0, 9]]]);
    WorldFactory.statics.mars.unlocks.push([[10, [3, 0, 2]],[20, [3, 0, 2]],[40, [3, 0, 2]],[80, [3, 0, 2]],[100, [3, 1, 2]],[150, [3, 0, 2]],[200, [3, 0, 2]],[250, [3, 0, 2]],[300, [3, 1, 2]],[350, [3, 0, 2]],[400, [3, 0, 2]],[450, [3, 0, 2]],[500, [3, 1, 2]],[600, [3, 0, 2]],[700, [3, 0, 2]],[777, [3, 0, 77777]],[800, [3, 0, 2]],[900, [3, 0, 2]],[1000, [3, 0, 77]],[1100, [3, 0, 5]],[1200, [3, 0, 5]],[1300, [3, 0, 5]],[1400, [3, 0, 5]],[1500, [3, 1, 2]],[1600, [3, 0, 5]],[1700, [3, 0, 5]],[1800, [3, 0, 5]],[1900, [3, 0, 5]],[2000, [3, 0, 5]],[2100, [3, 0, 5]],[2200, [3, 0, 5]],[2300, [3, 0, 5]],[2400, [3, 0, 5]],[2500, [3, 1, 2]],[2600, [3, 0, 5]],[2700, [3, 0, 5]],[2800, [3, 0, 5]],[2900, [3, 0, 5]],[3000, [3, 0, 5]],[3100, [3, 0, 5]],[3200, [3, 0, 5]],[3300, [3, 0, 5]],[3400, [3, 0, 5]],[3500, [3, 0, 5]],[3600, [3, 0, 5]],[3700, [3, 0, 5]],[3800, [3, 0, 5]],[3900, [3, 0, 5]],[4000, [3, 0, 5]],[4100, [3, 0, 5]],[4200, [3, 0, 5]],[4300, [3, 0, 5]],[4400, [3, 0, 5]],[4500, [3, 0, 5]],[4600, [3, 0, 5]],[4700, [3, 0, 5]],[4800, [3, 0, 5]],[4900, [3, 0, 5]],[5000, [3, 0, 5]],[5100, [3, 0, 5]],[5200, [3, 0, 5]],[5300, [3, 0, 5]],[5400, [3, 0, 5]],[5500, [3, 0, 5]],[5600, [3, 0, 5]],[5700, [3, 0, 5]],[5800, [3, 0, 5]],[5900, [3, 0, 5]],[6000, [3, 0, 5]],[6100, [3, 0, 5]],[6200, [3, 0, 5]],[6300, [3, 0, 5]],[6400, [3, 0, 5]],[6500, [3, 0, 5]],[6600, [3, 0, 5]],[6700, [3, 0, 5]],[6800, [3, 0, 5]],[6900, [3, 0, 5]],[7000, [3, 0, 5]],[7100, [3, 0, 5]],[7200, [3, 0, 5]],[7300, [3, 0, 5]],[7400, [3, 0, 5]],[7500, [3, 0, 5]],[7600, [3, 0, 5]],[7700, [3, 0, 5]],[7800, [3, 0, 5]],[7900, [3, 0, 5]],[8000, [3, 0, 5]]]);
    WorldFactory.statics.mars.unlocks.push([[25, [4, 0, 7]],[50, [4, 0, 7]],[100, [4, 0, 7]],[200, [4, 0, 7]],[300, [4, 1, 2]],[400, [4, 0, 7]],[500, [4, 0, 7]],[600, [4, 0, 7]],[666, [4, 0, 666]],[800, [4, 0, 666]],[900, [4, 0, 666]],[1000, [4, 0, 666]],[1250, [4, 0, 666]],[1500, [4, 0, 666]],[1750, [4, 0, 666]],[2000, [4, 0, 666]],[2250, [4, 0, 666]],[2500, [4, 0, 666]],[2750, [4, 0, 666]],[3000, [4, 0, 666]],[3250, [4, 0, 666]],[3500, [4, 0, 666]],[3725, [4, 0, 666]],[4000, [4, 0, 666]],[4250, [4, 0, 666]],[4500, [4, 0, 666]],[4750, [4, 0, 666]],[5000, [4, 0, 666]]]);
    WorldFactory.statics.mars.unlocks.push([[10, [5, 0, 6]],[50, [5, 0, 6]],[100, [5, 0, 6]],[200, [5, 0, 6]],[400, [5, 0, 6]],[600, [5, 0, 6]],[800, [5, 0, 6]],[1000, [5, 1, 2]],[1200, [5, 0, 6]],[1400, [5, 0, 6]],[1600, [5, 0, 6]],[1800, [5, 0, 6]],[2000, [5, 0, 6]],[2200, [5, 0, 6]],[2400, [5, 0, 6]],[2600, [5, 0, 6]],[2800, [5, 0, 6]],[3000, [5, 0, 6]],[3200, [5, 0, 6]],[3400, [5, 0, 6]],[3600, [5, 0, 6]],[3800, [5, 0, 6]],[4000, [5, 0, 6]],[4200, [5, 0, 6]],[4400, [5, 0, 6]],[4600, [5, 0, 6]],[4800, [5, 0, 6]],[5000, [5, 0, 6]],[5200, [5, 0, 6]],[5400, [5, 0, 6]],[5600, [5, 0, 6]],[5800, [5, 0, 6]],[6000, [5, 0, 6]],[6200, [5, 0, 6]],[6400, [5, 0, 6]],[6600, [5, 0, 6]],[6800, [5, 0, 6]],[7000, [5, 0, 6]],[7200, [5, 0, 6]],[7400, [5, 0, 6]],[7600, [5, 0, 6]],[7800, [5, 0, 6]],[8000, [5, 0, 6]],[8200, [5, 0, 6]],[8400, [5, 0, 6]],[8600, [5, 0, 6]],[8800, [5, 0, 6]],[9000, [5, 0, 6]],[9200, [5, 0, 6]],[9400, [5, 0, 6]],[9600, [5, 0, 6]],[9800, [5, 0, 6]],[10000, [5, 0, 6]],[10200, [5, 0, 6]],[10400, [5, 0, 6]],[10600, [5, 0, 6]],[10800, [5, 0, 6]],[11000, [5, 0, 6]],[11200, [5, 0, 6]],[11400, [5, 0, 6]],[11600, [5, 0, 6]],[11800, [5, 0, 6]],[12000, [5, 0, 6]],[12200, [5, 0, 6]],[12400, [5, 0, 6]],[12600, [5, 0, 6]],[12800, [5, 0, 6]],[13000, [5, 0, 6]],[13200, [5, 0, 6]],[13400, [5, 0, 6]],[13600, [5, 0, 6]],[13800, [5, 0, 6]],[14000, [5, 0, 6]]]);
    WorldFactory.statics.mars.unlocks.push([[25, [6, 0, 3]],[50, [6, 0, 3]],[75, [6, 0, 3]],[100, [6, 0, 3]],[150, [6, 0, 3]],[200, [6, 0, 3]],[250, [6, 0, 3]],[300, [6, 0, 3]],[350, [6, 0, 3]],[400, [6, 0, 3]],[450, [6, 0, 3]],[500, [6, 1, 2]],[550, [6, 0, 3]],[600, [6, 0, 3]],[650, [6, 0, 3]],[700, [6, 0, 3]],[750, [6, 0, 7]],[800, [6, 0, 3]],[850, [6, 0, 3]],[900, [6, 0, 3]],[950, [6, 0, 3]],[1000, [6, 0, 8]],[1150, [6, 0, 8]],[1300, [6, 0, 8]],[1450, [6, 0, 8]],[1600, [6, 0, 8]],[1750, [6, 0, 8]],[1900, [6, 0, 8]],[2050, [6, 0, 8]],[2200, [6, 0, 8]],[2350, [6, 0, 8]],[2500, [6, 0, 8]],[2650, [6, 0, 8]],[2800, [6, 0, 8]],[2950, [6, 0, 8]],[3100, [6, 0, 8]],[3250, [6, 0, 8]],[3400, [6, 0, 8]],[3550, [6, 0, 8]],[3700, [6, 0, 8]],[3850, [6, 0, 8]],[4000, [6, 0, 8]],[4150, [6, 0, 8]],[4300, [6, 0, 8]],[4450, [6, 0, 8]],[4600, [6, 0, 8]],[4750, [6, 0, 8]],[4900, [6, 0, 8]],[5050, [6, 0, 8]],[5200, [6, 0, 8]],[5350, [6, 0, 8]],[5500, [6, 0, 8]],[5650, [6, 0, 8]],[5800, [6, 0, 8]],[5950, [6, 0, 8]],[6100, [6, 0, 8]],[6250, [6, 0, 8]],[6400, [6, 0, 8]],[6550, [6, 0, 8]],[6700, [6, 0, 8]],[6850, [6, 0, 8]],[7000, [6, 0, 8]],[7150, [6, 0, 8]],[7300, [6, 0, 8]],[7450, [6, 0, 8]],[7600, [6, 0, 8]]]);
    WorldFactory.statics.mars.unlocks.push([[100, [7, 0, 15]],[200, [7, 0, 15]],[300, [7, 0, 15]],[400, [7, 0, 15]],[500, [7, 1, 2]],[700, [7, 0, 50]],[900, [7, 0, 50]],[1100, [7, 0, 50]],[1300, [7, 0, 50]],[1500, [7, 0, 5050]],[1700, [7, 0, 50]],[1900, [7, 0, 50]],[2100, [7, 0, 50]],[2300, [7, 0, 50]],[2500, [7, 0, 50]],[2700, [7, 0, 50]],[2900, [7, 0, 50]],[3100, [7, 0, 50]],[3300, [7, 0, 50]],[3500, [7, 0, 50]],[3700, [7, 0, 50]],[3900, [7, 0, 50]],[4100, [7, 0, 50]],[4300, [7, 0, 50]],[4500, [7, 0, 50]],[4700, [7, 0, 50]],[4900, [7, 0, 50]],[5100, [7, 0, 50]],[5300, [7, 0, 50]],[5500, [7, 0, 50]],[5700, [7, 0, 50]],[5900, [7, 0, 50]],[6000, [7, 0, 50]]]);
    WorldFactory.statics.mars.unlocks.push([[33, [8, 0, 333]],[66, [8, 0, 333]],[99, [8, 0, 333]],[222, [8, 0, 333]],[333, [8, 0, 333]],[444, [8, 0, 333]],[555, [8, 0, 333]],[666, [8, 0, 333]],[777, [8, 0, 333]],[888, [8, 0, 333]],[999, [8, 0, 333]],[1111, [8, 0, 333]],[2222, [8, 0, 333]]]);
    WorldFactory.statics.mars.unlocks.push([[1, [10, 1, 2]],[50, [10, 1, 2]],[100, [10, 1, 2]],[200, [10, 1, 2]],[300, [10, 1, 2]],[400, [10, 1, 2]],[500, [10, 1, 2]],[600, [10, 1, 2]],[700, [10, 1, 2]],[800, [10, 1, 2]],[900, [10, 1, 2]],[1000, [10, 1, 2]],[1200, [10, 1, 2]],[1400, [10, 1, 2]],[1600, [10, 1, 2]],[1800, [10, 1, 2]],[2000, [10, 1, 2]],[2500, [10, 1, 2]]]);
    WorldFactory.statics.mars.cashUpgrades = [[15000000, [0, 0, 33]],[500000000, [1, 0, 33]],[100000000000, [2, 0, 33]],[19000000000000, [3, 0, 33]],[1E+15, [4, 0, 33]],[1.2E+19, [5, 0, 33]],[9E+21, [6, 0, 33]],[6E+23, [7, 0, 33]],[3E+27, [8, 0, 33]],[1E+36, [2, 0, 66]],[5E+39, [3, 0, 66]],[2.5E+43, [4, 0, 66]],[1.3E+47, [5, 0, 66]],[3E+50, [6, 0, 66]],[6E+52, [7, 0, 66]],[1E+55, [8, 0, 66]],[1E+57, [10, 0, 33]],[1E+60, [0, 0, 999]],[7E+62, [1, 0, 999]],[9E+62, [2, 0, 99]],[1E+63, [3, 0, 99]],[5E+66, [4, 0, 99]],[1.7E+67, [5, 0, 99]],[9.9E+67, [6, 0, 99]],[2.31E+68, [7, 0, 99]],[3.33E+68, [8, 0, 99]],[5E+71, [10, 0, 33]],[1.23E+74, [0, 0, 999]],[2.46E+74, [1, 0, 999]],[3.69E+74, [3, 0, 999]],[2E+75, [5, 0, 999]],[3E+75, [6, 0, 999]],[1.2E+76, [7, 0, 999]],[2.3E+76, [8, 0, 999]],[1E+78, [10, 0, 66]],[5E+102, [0, 0, 33]],[1.25E+104, [1, 0, 33]],[4.5E+104, [2, 0, 33]],[6.25E+104, [3, 0, 33]],[3E+105, [5, 0, 33]],[2.5E+106, [6, 0, 33]],[1E+107, [7, 0, 33]],[1E+110, [10, 0, 33]],[1E+111, [0, 0, 77]],[4E+111, [1, 0, 77]],[5.5E+112, [2, 0, 77]],[9E+112, [3, 0, 77]],[2.1E+113, [5, 0, 77]],[4.31E+113, [6, 0, 77]],[7.77E+113, [7, 0, 77]],[5E+116, [10, 0, 777]],[5E+132, [3, 0, 33]],[3.5E+133, [5, 0, 33]],[1.77E+134, [6, 0, 33]],[5.69E+134, [7, 0, 33]],[7.14E+134, [0, 0, 33]],[9.76E+134, [1, 0, 33]],[1E+135, [2, 0, 33]],[5E+136, [10, 0, 33]],[1E+144, [0, 0, 66]],[2E+144, [1, 0, 66]],[6E+144, [2, 0, 66]],[9E+144, [3, 0, 66]],[4.9E+145, [5, 0, 66]],[3E+146, [6, 0, 66]],[7E+146, [7, 0, 66]],[3E+149, [10, 0, 55]],[5E+156, [0, 0, 99]],[1.4E+157, [1, 0, 99]],[6.6E+157, [2, 0, 99]],[8.8E+157, [3, 0, 99]],[2.5E+158, [5, 0, 99]],[4.44E+158, [6, 0, 99]],[6.53E+158, [7, 0, 99]],[1E+162, [10, 0, 15]],[1E+171, [0, 0, 77]],[3E+171, [1, 0, 77]],[9E+171, [2, 0, 77]],[1.9E+172, [3, 0, 77]],[3.6E+172, [5, 0, 77]],[9.9E+172, [6, 0, 77]],[2.79E+173, [7, 0, 77]],[4E+173, [10, 0, 25]],[1E+183, [0, 0, 999]],[5E+183, [1, 0, 999]],[8E+183, [2, 0, 999]],[1E+184, [3, 0, 999]],[6.6E+184, [5, 0, 999]],[1.53E+185, [6, 0, 999]],[3.72E+185, [7, 0, 999]],[5E+185, [8, 0, 999]],[6E+201, [0, 0, 33]],[2.5E+202, [1, 0, 33]],[8E+202, [2, 0, 33]],[1.7E+203, [3, 0, 33]],[4.39E+203, [5, 0, 33]],[6.5E+203, [6, 0, 33]],[9E+203, [7, 0, 33]],[2.5E+205, [8, 0, 33]],[2.5E+206, [10, 0, 9]],[1E+213, [0, 0, 22]],[1.1E+214, [1, 0, 22]],[2.22E+215, [3, 0, 22]],[3.33E+215, [5, 0, 22]],[4.44E+215, [6, 0, 22]],[5.55E+215, [7, 0, 22]],[6.66E+215, [8, 0, 22]],[1E+216, [10, 0, 66]],[1E+223, [0, 0, 44]],[2E+223, [1, 0, 44]],[4E+223, [3, 0, 44]],[6E+223, [5, 0, 44]],[1.5E+224, [6, 0, 44]],[3.56E+224, [7, 0, 44]],[9E+224, [8, 0, 44]],[6E+225, [10, 0, 777]],[1E+228, [0, 0, 999]],[1E+231, [1, 0, 999]],[1E+234, [3, 0, 999]],[1E+237, [5, 0, 999]],[1E+240, [6, 0, 999]],[1E+243, [7, 0, 999]],[1E+246, [8, 0, 999]]];
    WorldFactory.statics.mars.angelUpgrades = [[100000000000, [10, 0, 3]],[1E+17, [10, 0, 3]],[1E+21, [0, 0, 5]],[2E+21, [1, 0, 5]],[4E+21, [2, 0, 5]],[8E+21, [3, 0, 5]],[1.6E+22, [4, 0, 5]],[3.2E+22, [5, 0, 5]],[6.4E+22, [6, 0, 5]],[1.28E+23, [7, 0, 5]],[2.56E+23, [8, 0, 5]],[1E+24, [10, 0, 3]],[1E+30, [0, 0, 7]],[3E+30, [1, 0, 7]],[9E+30, [2, 0, 7]],[2.7E+31, [3, 0, 7]],[1E+32, [4, 0, 7]],[2E+32, [5, 0, 7]],[4E+32, [6, 0, 7]],[6E+32, [7, 0, 7]],[9E+32, [8, 0, 7]],[1E+36, [10, 0, 5]],[1E+42, [10, 0, 3]],[3E+45, [0, 0, 3]],[1.2E+46, [1, 0, 3]],[2.9E+46, [2, 0, 3]],[1.36E+47, [3, 0, 3]],[3.11E+47, [4, 0, 3]],[5.55E+47, [5, 0, 3]],[7.89E+47, [6, 0, 3]],[2.5E+49, [7, 0, 3]],[1E+50, [8, 0, 3]],[1E+56, [10, 0, 5]],[1E+60, [0, 0, 5]],[5E+60, [1, 0, 5]],[4.5E+61, [2, 0, 5]],[6.6E+61, [3, 0, 5]],[9.9E+61, [4, 0, 5]],[1.75E+62, [5, 0, 5]],[2.8E+62, [6, 0, 5]],[4.2E+62, [7, 0, 5]],[7E+62, [8, 0, 5]],[5E+63, [10, 0, 5]],[1E+74, [10, 0, 7]],[1E+78, [0, 0, 9]],[1E+79, [1, 0, 9]],[2E+79, [2, 0, 9]],[1E+80, [3, 0, 9]],[2E+80, [4, 0, 9]],[4E+80, [5, 0, 9]],[8E+80, [6, 0, 9]],[1.6E+82, [7, 0, 9]],[2.22E+83, [8, 0, 9]],[6.66E+83, [10, 0, 9]],[1E+84, [10, 0, 9]],[2E+90, [0, 0, 15]],[1.4E+91, [1, 0, 15]],[5.6E+91, [2, 0, 15]],[1.12E+92, [3, 0, 15]],[1.79E+92, [4, 0, 15]],[2.98E+92, [5, 0, 15]],[4.34E+92, [6, 0, 15]],[6.2E+92, [7, 0, 15]],[8.08E+92, [8, 0, 15]],[1E+93, [10, 0, 15]],[9E+99, [10, 0, 9]],[4E+105, [0, 0, 21]],[6E+105, [1, 0, 21]],[1.2E+106, [2, 0, 21]],[2.4E+106, [3, 0, 21]],[6.9E+106, [4, 0, 21]],[1.05E+107, [5, 0, 21]],[2.14E+107, [6, 0, 21]],[3.33E+107, [7, 0, 21]],[5E+107, [8, 0, 21]],[1E+108, [10, 0, 9]],[7.77E+113, [10, 0, 777]]];
    WorldFactory.statics.mars.managerUpgrades = [];
  };

  WorldFactory.loadWorld = function(worldName) {
    var world = {}, i = 0;
    world.angelIllions = '';
    world.bestSuit = null;
    world.bonusAngelEffectiveness = 0;
    world.bonusMultiplier = 0;
    world.filters = {};
    world.flux = 0;
    world.lifetimeEarnings = 0;
    world.name = worldName;
    world.filters.noSingles = false;
    world.filters.noTens = false;
    world.numAngels = 0;
    world.sacAngels = 0;
    world.sacIllions = '';
    world.suits = [];
    for (i = 0; i < WorldFactory.statics.suits.length; i++) {
      world.suits.push([false, false]);
    }
    world.triples = 0;
    world.viewLifetimeEarnings = 0;
    world.viewNumAngels = 0;
    world.viewSacAngels = 0;
    WorldFactory.resetPlanet(world);
    return world;
  };

  WorldFactory.profileExists = function(name) {
    return (name in WorldFactory.worlds);
  };

  WorldFactory.resetPlanet = function(loc) {
    var i = 0;
    loc.angelEffectiveness = 2;
    loc.angelIndicator = false;
    loc.angelUpgrades = [];
    loc.cashUpgrades = [];
    loc.illions = '';
    loc.investments = [];
    loc.managerUpgrades = [];
    loc.recTable = [];
    loc.recommendation = '';
    loc.suitIndicator = false;
    loc.totalMoneyPerSecond = 0;
    loc.upgradeCosts = [];
    for (; i < WorldFactory.statics[loc.name].investments.length; i++) {
      loc.investments.push({level: 0, golden: false, cycleIncome: 0, cycleTime: 0, income: 0, incomePercent: 0});
      loc.upgradeCosts.push([0, 0, 0, 0, 0, 0, 0, 0]);
    }
    loc.investments[0].level = 1;
    for (i = 0; i < WorldFactory.statics[loc.name].cashUpgrades.length; i++) {
      loc.cashUpgrades.push(false);
    }
    for (i = 0; i < WorldFactory.statics[loc.name].angelUpgrades.length; i++) {
      loc.angelUpgrades.push([false, false]);
    }
    if (WorldFactory.statics[loc.name].managerUpgrades.length > 0) {
      if (WorldFactory.statics[loc.name].managerUpgrades[0].length === 1) {
        for (i = 0; i < WorldFactory.statics[loc.name].managerUpgrades.length; i++) {
          loc.managerUpgrades.push([false]);
        }
      } else {
        for (i = 0; i < WorldFactory.statics[loc.name].managerUpgrades.length; i++) {
          loc.managerUpgrades.push([false, false]);
        }
      }
    }
  };

  WorldFactory.setProfile = function(name) {
    currProfile = name;
  };

  WorldFactory.sortRec = function(loc, i, rev) {
    if (loc.recTable.length > 0) {
      loc.recTable = $filter('orderBy')(loc.recTable, i, rev);
      if (loc.recTable[0][0] === 'all') {
        loc.recommendation = 'Buy all to level ' + loc.recTable[0][1] + '.';
      } else if (loc.recTable[0][0][0] === 'level') {
        loc.recommendation = 'Buy ' + $filter('rec')(loc.recTable[0][0], loc.name) + ' to level ' + loc.recTable[0][1] + '.';
      } else {
        loc.recommendation = 'Buy ' + $filter('rec')(loc.recTable[0][0], loc.name) + ' Cash Upgrade.';
      }
    } else {
      loc.recommendation = '';
    }
  };

  function suitFromName(name) {
    var i = 0;
    for (; i < WorldFactory.statics.suits.length; i++) {
      if (WorldFactory.statics.suits[i][0].toLowerCase() === name) {
        return i;
      }
    }
    return null;
  }

  WorldFactory.updateIllionize = function(loc, varName, viewName, illionsName) {
    if (loc[illionsName] === '') {
      loc[varName] = loc[viewName];
    } else {
      loc[illionsName] = loc[illionsName].trim();
      loc[illionsName] = loc[illionsName].charAt(0).toUpperCase() + loc[illionsName].slice(1).toLowerCase();
      var index = illionsArr.indexOf(loc[illionsName]);
      if (index !== -1) {
        loc[varName] = loc[viewName] * Math.pow(10, 3 + (index * 3));
      }
    }
  };

  WorldFactory.updateIllionizeFilter = function(loc, varName, viewName, illionsName) {
    if (!angular.isDefined(loc.filters[illionsName]) || loc.filters[illionsName] === '') {
      if (!angular.isDefined(loc.filters[viewName]) || loc.filters[viewName] === null) {
        loc.filters[varName] = null;
      } else {
        loc.filters[varName] = loc.filters[viewName];
      }
    } else if (!angular.isDefined(loc.filters[viewName]) || loc.filters[viewName] === null) {
      loc.filters[varName] = null;
    } else {
      loc.filters[illionsName] = loc.filters[illionsName].trim();
      loc.filters[illionsName] = loc.filters[illionsName].charAt(0).toUpperCase() + loc.filters[illionsName].slice(1).toLowerCase();
      var index = illionsArr.indexOf(loc.filters[illionsName]);
      if (index !== -1) {
        loc.filters[varName] = loc.filters[viewName] * Math.pow(10, 3 + (index * 3));
      }
    }
  };

  return WorldFactory;
}]);

advApp.controller('modalController', ['$scope', '$uibModalInstance', 'WorldFactory', function($scope, $uibModalInstance, WorldFactory) {
  "use strict";
  $scope.WorldFactory = WorldFactory;
  $scope.pName = '';
  $scope.pNameInvalid = false;

  $scope.addProfile = function(name) {
    if (!WorldFactory.profileExists(name)) {
      WorldFactory.loadProfile(name);
      WorldFactory.setProfile(name);
      $scope.pName = '';
      $scope.pNameInvalid = false;
    } else {
      $scope.pNameInvalid = true;
    }
  };

  $scope.closeModal = function() {
    $uibModalInstance.dismiss('cancel');
    $scope.pName = '';
    $scope.pNameInvalid = false;
  };

  $scope.deleteProfile = function(name) {
    if (Object.keys(WorldFactory.worlds).length > 1) {
      delete WorldFactory.worlds[name];
      if (WorldFactory.getCurrProfile() === name) {
        $scope.setProfileNext();
      }
    }
  };

  $scope.renameProfile = function(oldP, newP) {
    if (!WorldFactory.profileExists(newP)) {
      WorldFactory.worlds[newP] = WorldFactory.worlds[oldP];
      delete WorldFactory.worlds[oldP];
      $scope.pName = '';
      $scope.pNameInvalid = false;
    } else {
      $scope.pNameInvalid = true;
    }
  };

  $scope.selectProfile = function(name) {
    WorldFactory.setProfile(name);
  };

  $scope.setProfileNext = function() {
    var name;
    for (name in WorldFactory.worlds) {
      break;
    }
    $scope.selectProfile(name);
  };
}]);

advApp.controller('advController', ['$document', '$scope', '$uibModal', 'FileFactory', 'FilterFactory', 'WorldFactory', function($document, $scope, $uibModal, FileFactory, FilterFactory, WorldFactory) {
  "use strict";
  WorldFactory.load();
  $scope.FilterFactory = FilterFactory;
  $scope.WorldFactory = WorldFactory;
  $scope.accOpen = [false, false, false, false, false, false];
  $scope.accOpen2 = [false, false];
  $scope.clearAfter = [false, false];
  $scope.collapse = true;
  $scope.format = 0;
  $scope.fillBefore = [false, false];
  $scope.illionsArray = illionsArr.slice(1);
  $scope.isOpen = false;
  $scope.WorldFactory.planets = WorldFactory.planets;
  $scope.ref = WorldFactory.worlds[WorldFactory.getCurrProfile()].earth;
  $scope.reverse = true;
  $scope.showUpdate = true;
  $scope.sortIndex = 2;

  angular.element(document).ready(function() {
    var fileInputC = document.getElementById('fileInputC'),
    fileInputG = document.getElementById('fileInputG');
    fileInputC.addEventListener('change', function(e) {
      var file = fileInputC.files[0],
      reader = new FileReader();
      reader.onload = function(e) {
        FileFactory.loadCalculator(e.target.result);
        $scope.ref = WorldFactory.worlds['Main']['earth'];
        $scope.$digest();
      }
      reader.readAsText(file);
    });
    fileInputG.addEventListener('change', function(e) {
      var file = fileInputG.files[0],
      reader = new FileReader();
      reader.onload = function(e) {
        FileFactory.loadGame(e.target.result);
        $scope.ref = WorldFactory.worlds['Main']['earth'];
        $scope.$digest();
      }
      reader.readAsText(file);
    });
    var saved = localStorage.getItem('profiles');
    if (saved) {
      localStorage.removeItem('planets');
      FileFactory.loadCalculator(saved);
      $scope.ref = WorldFactory.worlds['Main']['earth'];
      $scope.$digest();
    } else {
      saved = localStorage.getItem('planets');
      if (saved) {
        localStorage.removeItem('planets');
        FileFactory.loadCalculator(saved);
        $scope.ref = WorldFactory.worlds['Main']['earth'];
        $scope.$digest();
      }
    }
    $scope.calc($scope.ref);
  });

  function indexOrder(input) {
    return input[$scope.sortIndex];
  }

  $scope.applyRow = function(loc, row) {
    WorldFactory.applyRow(loc, row);
    WorldFactory.sortRec(loc, indexOrder, $scope.reverse);
  };

  $scope.applyTop = function(loc) {
    WorldFactory.applyTop(loc);
    WorldFactory.sortRec(loc, indexOrder, $scope.reverse);
  };

  $scope.calc = function(loc) {
    $scope.updateAngels();
    $scope.updateEarnings();
    $scope.updateFilterCost();
    $scope.updateSacrificedAngels();
    WorldFactory.calc(loc);
    WorldFactory.sortRec(loc, indexOrder, $scope.reverse);
    FileFactory.save();
  };

  $scope.clickSort = function(loc, index) {
    if (index === $scope.sortIndex) {
      $scope.reverse = !$scope.reverse;
    } else {
      $scope.sortIndex = index;
      if (index === 2 || index >= 5) {
        $scope.reverse = true;
      } else {
        $scope.reverse = false;
      }
    }
    WorldFactory.sortRec(loc, indexOrder, $scope.reverse);
  };

  $scope.export = function () {
    var blob = new Blob([FileFactory.getJSON()], {type: "application/json"});
    var title = "AdvCapCalc.json";
    if (window.navigator.msSaveOrOpenBlob) {
      navigator.msSaveBlob(blob, title);
    } else {
      var downloadLink = angular.element("<a></a>");
      downloadLink.attr("href", window.URL.createObjectURL(blob));
      downloadLink.attr("download", title);
      $document.find("body").append(downloadLink);
      downloadLink[0].click();
      downloadLink.remove();
    }
  };

  $scope.fullyResetPlanet = function(loc) {
    WorldFactory.fullyResetPlanet(loc);
    $scope.ref = WorldFactory.worlds[WorldFactory.getCurrProfile()][loc.name];
    WorldFactory.calc($scope.ref);
  };

  $scope.hasManagers = function(loc) {
    return (WorldFactory.statics[loc.name].managerUpgrades.length !== 0);
  };

  $scope.hideUpdate = function() {
    $scope.showUpdate = false;
  };

  $scope.isEvent = function() {
    return WorldFactory.statics[$scope.ref.name].isEvent;
  };

  $scope.isWorld = function(world) {
    return $scope.ref.name === world;
  };

  $scope.manageProfiles = function() {
    for (var p in WorldFactory.worlds) {
      for (var w in WorldFactory.worlds[p]) {
        WorldFactory.calc(WorldFactory.worlds[p][w]);
      }
    }
    var modalInstance = $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'modal.html',
      controller: 'modalController'
    });
    modalInstance.result.then(null, function () {
      $scope.ref = WorldFactory.worlds[WorldFactory.getCurrProfile()][$scope.ref.name];
    });
  };

  $scope.resetPlanet = function(loc) {
    WorldFactory.resetPlanet(loc);
    WorldFactory.calc(loc);
  };

  $scope.selectedAll = function(loc, index) {
    var i = 0;
    if (index === 0) {
      for (i = 0; i < loc.investments.length; i++) {
        loc.investments[i].golden = WorldFactory.selectAll[0];
      }
    } else if (index === 1) {
      for (i = 0; i < loc.managerUpgrades.length; i++) {
        loc.managerUpgrades[i][0] = WorldFactory.selectAll[1];
        if (WorldFactory.selectAll[1]) {
          loc.managerUpgrades[i][1] = false;
        }
      }
    } else if (index === 2) {
      for (i = 0; i < loc.managerUpgrades.length; i++) {
        loc.managerUpgrades[i][1] = WorldFactory.selectAll[2];
        if (WorldFactory.selectAll[2]) {
          loc.managerUpgrades[i][0] = false;
        }
      }
    } else if (index === 3) {
      for (i = 0; i < loc.managerUpgrades.length; i++) {
        loc.managerUpgrades[i][0] = WorldFactory.selectAll[3];
      }
    }
    if (WorldFactory.selectAll[1] && WorldFactory.selectAll[2]) {
      WorldFactory.selectAll[(index % 2) + 1] = false;
    }
  };

  $scope.setWorld = function(world) {
    $scope.clearAfter = [false, false];
    $scope.fillBefore = [false, false];
    $scope.ref = WorldFactory.worlds[WorldFactory.getCurrProfile()][world];
  };

  $scope.showName = function(loc) {
  };

  $scope.toggleManagers = function(row, index) {
    if ($scope.isWorld('earth')) {
      if (row[index] === true) {
        row[(index + 1) % 2] = false;
      }
    }
  };

  $scope.toggleRaw = function() {
    $scope.format = ($scope.format == 1) ? 0 : 1;
  };

  $scope.toggleScience = function() {
    $scope.format = ($scope.format == 2) ? 0 : 2;
  };

  $scope.updateAngels = function() {
    WorldFactory.updateIllionize($scope.ref, 'numAngels', 'viewNumAngels', 'illions');
  };

  $scope.updateEarnings = function() {
    WorldFactory.updateIllionize($scope.ref, 'lifetimeEarnings', 'viewLifetimeEarnings', 'angelIllions');
  };

  $scope.updateFilterCost = function() {
    WorldFactory.updateIllionizeFilter($scope.ref, 'cost', 'viewCost', 'costIllions');
  };

  $scope.updateSacrificedAngels = function() {
    WorldFactory.updateIllionize($scope.ref, 'sacAngels', 'viewSacAngels', 'sacIllions');
  };
}]);