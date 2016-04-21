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
    obj = JSON.parse(lzf_decode(atob(b64))), i, index = 0,
    loc = WorldFactory.getWorldFromName(obj.planetName);
    for (i = 0; i < obj.ventures.length; i++) {
      index = WorldFactory.indexFromID(loc, obj.ventures[i].id);
      loc.investments[index].level = obj.ventures[i].numOwned;
      loc.investments[index].golden = obj.ventures[i].isBoosted;
    }
    var angelID = 0;
    for (i = 0; i < obj.upgrades.length; i++) {
      if (WorldFactory.upgradeIsAngelic(loc.name, obj.upgrades[i].id)) {
        loc.angelUpgrades[angelID++][0] = obj.upgrades[i].purchased;
      } else {
        loc.cashUpgrades[i - angelID] = obj.upgrades[i].purchased;
      }
    }
    for (i = 0; i < obj.managers.length; i++) {
      if (obj.managers[i].id.indexOf("_accountant") !== -1) {
        index = WorldFactory.indexFromID(loc, obj.managers[i].id);
        loc.managerUpgrades[index][(obj.managers[i].id.charAt(obj.managers[i].id.length - 1) !== '2') ? 0 : 1] = obj.managers[i].purchased;
      }
    }
    loc.lifetimeEarnings = obj.totalCash || obj.sessionCash + obj.totalPreviousCash;
    loc.viewLifetimeEarnings = loc.lifetimeEarnings;
    loc.numAngels = obj.angelInvestors;
    loc.viewNumAngels = loc.numAngels;
    loc.sacAngels = obj.angelInvestorsSpent;
    loc.viewSacAngels = loc.sacAngels;
    // how to find gold multipliers, flux, bonus angel effectiveness (kong login etc), suits
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
    } else if (id === 'oxygenbar') {
      id = 'bars';
    } else if (id === 'amusement') {
      id = 'park';
    } else if (id === 'wolf') {
      id = 'colony';
    }
    for (; i < WorldFactory.statics[loc.name].investments.length; i++) {
      if (WorldFactory.statics[loc.name].investments[i].id === id || WorldFactory.statics[loc.name].investments[i].id === id + 's') {
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
    WorldFactory.statics.earth.unlocks.push([[25,[0,1,2]],[50,[0,1,2]],[100,[0,1,2]],[200,[0,1,2]],[300,[0,1,2]],[400,[0,1,2]],[500,[0,0,4]],[600,[0,0,4]],[700,[0,0,4]],[800,[0,0,4]],[900,[0,0,4]],[1000,[0,0,5]],[1100,[0,0,4]],[1200,[0,0,4]],[1300,[0,0,4]],[1400,[0,0,4]],[1500,[0,0,4]],[1600,[0,0,4]],[1700,[0,0,4]],[1800,[0,0,4]],[1900,[0,0,4]],[2000,[0,0,5]],[2250,[0,0,2]],[2500,[0,0,2]],[2750,[0,0,2]],[3000,[0,0,5]],[3250,[0,0,2]],[3500,[0,0,2]],[3750,[0,0,2]],[4000,[0,0,5]],[4250,[0,0,2]],[4500,[0,0,2]],[4750,[0,0,2]],[5000,[0,0,5]],[5250,[0,0,3]],[5500,[0,0,3]],[5750,[0,0,3]],[6000,[0,0,5]],[6250,[0,0,3]],[6500,[0,0,3]],[6750,[0,0,3]],[7000,[0,0,5]],[7000,[0,0,3]],[7250,[0,0,3]],[7500,[0,0,3]],[7777,[0,0,3]],[8000,[0,0,3]],[8200,[0,0,3]],[8400,[0,0,3]],[8600,[0,0,3]],[8800,[0,0,3]],[9000,[0,0,3]],[9100,[0,0,3]],[9200,[0,0,3]],[9300,[0,0,3]],[9400,[0,0,3]],[9500,[0,0,3]],[9600,[0,0,3]],[9700,[0,0,3]],[9800,[0,0,3]],[9999,[0,0,1.9999]],[10000,[0,0,5]]]);
    WorldFactory.statics.earth.unlocks.push([[25,[1,1,2]],[50,[1,1,2]],[100,[1,1,2]],[125,[0,0,2]],[150,[2,0,2]],[175,[3,0,2]],[200,[1,1,2]],[225,[4,0,2]],[250,[0,0,3]],[275,[2,0,3]],[300,[1,1,2]],[325,[3,0,3]],[350,[4,0,3]],[375,[0,0,4]],[400,[1,1,2]],[425,[2,0,4]],[450,[3,0,4]],[475,[4,0,4]],[500,[5,0,11]],[525,[0,0,5]],[550,[2,0,5]],[575,[3,0,5]],[600,[6,0,11]],[625,[4,0,5]],[650,[0,0,6]],[675,[2,0,6]],[700,[7,0,11]],[725,[3,0,6]],[750,[4,0,6]],[775,[0,0,3]],[800,[8,0,11]],[825,[2,0,7]],[850,[3,0,7]],[875,[4,0,7]],[900,[9,0,11]],[925,[5,0,7]],[950,[6,0,7]],[975,[7,0,7]],[1000,[1,0,7777777]],[1025,[8,0,7]],[1050,[9,0,7]],[1075,[2,0,8]],[1100,[3,0,8]],[1125,[4,0,8]],[1150,[5,0,8]],[1175,[6,0,8]],[1200,[7,0,8]],[1225,[8,0,8]],[1250,[9,0,8]],[1300,[1,0,7777]],[1350,[0,0,9]],[1400,[2,0,9]],[1450,[3,0,9]],[1500,[4,0,9]],[1550,[5,0,9]],[1600,[6,0,9]],[1650,[7,0,9]],[1700,[8,0,9]],[1750,[9,0,9]],[1800,[5,0,10]],[1850,[6,0,10]],[1900,[7,0,10]],[1950,[8,0,10]],[2000,[1,0,7777]],[2100,[2,0,15]],[2200,[3,0,15]],[2300,[4,0,15]],[2400,[5,0,15]],[2500,[1,0,777]],[2600,[7,0,15]],[2700,[8,0,15]],[2800,[9,0,15]],[2900,[0,0,15]],[3000,[1,0,777]],[3100,[2,0,20]],[3200,[6,0,20]],[3300,[8,0,20]],[3400,[9,0,20]],[3500,[1,0,777]],[3600,[6,0,25]],[3700,[7,0,25]],[3800,[8,0,25]],[3900,[9,0,25]],[4000,[1,0,30]],[4100,[0,0,30]],[4200,[2,0,30]],[4300,[3,0,30]],[4400,[4,0,30]],[4500,[5,0,30]],[4600,[6,0,30]],[4700,[7,0,30]],[4800,[8,0,30]],[4900,[9,0,30]],[5000,[1,0,50]],[5100,[1,0,50]],[5200,[1,0,50]],[5300,[1,0,50]],[5400,[1,0,50]]]);
    WorldFactory.statics.earth.unlocks.push([[25,[2,1,2]],[50,[2,1,2]],[100,[2,1,2]],[200,[2,1,2]],[300,[2,1,2]],[400,[2,1,2]],[500,[2,0,2]],[600,[2,0,2]],[700,[2,0,2]],[800,[2,0,2]],[900,[2,0,2]],[1000,[2,0,3]],[1100,[2,0,2]],[1200,[2,0,2]],[1300,[2,0,2]],[1400,[2,0,2]],[1500,[2,0,2]],[1600,[2,0,2]],[1700,[2,0,2]],[1800,[2,0,2]],[1900,[2,0,2]],[2000,[2,0,5]],[2100,[2,0,3]],[2200,[2,0,3]],[2300,[2,0,3]],[2400,[2,0,3]],[2500,[2,0,3]],[2600,[2,0,3]],[2700,[2,0,3]],[2800,[2,0,3]],[2900,[2,0,3]],[3000,[2,0,3]],[3100,[2,0,3]],[3200,[2,0,3]],[3300,[2,0,3]],[3400,[2,0,3]],[3500,[2,0,3]],[3600,[2,0,3]],[3700,[2,0,3]],[3800,[2,0,3]],[3900,[2,0,3]],[4000,[2,0,5]],[4100,[2,0,3]],[4200,[2,0,3]],[4300,[2,0,3]],[4400,[2,0,3]],[4500,[2,0,3]],[4600,[2,0,3]],[4700,[2,0,3]],[4800,[2,0,3]],[4900,[2,0,3]],[5000,[2,0,5]],[5250,[2,0,3]],[5500,[2,0,3]]]);
    WorldFactory.statics.earth.unlocks.push([[25,[3,1,2]],[50,[3,1,2]],[100,[3,1,2]],[200,[3,1,2]],[300,[3,1,2]],[400,[3,1,2]],[500,[3,0,2]],[600,[3,0,2]],[700,[3,0,2]],[800,[3,0,2]],[900,[3,0,2]],[1000,[3,0,3]],[1100,[3,0,2]],[1200,[3,0,2]],[1300,[3,0,2]],[1400,[3,0,2]],[1500,[3,0,2]],[1600,[3,0,2]],[1700,[3,0,2]],[1800,[3,0,2]],[1900,[3,0,2]],[2000,[3,0,5]],[2100,[3,0,3]],[2200,[3,0,3]],[2300,[3,0,3]],[2400,[3,0,3]],[2500,[3,0,3]],[2600,[3,0,3]],[2700,[3,0,3]],[2800,[3,0,3]],[2900,[3,0,3]],[3000,[3,0,3]],[3100,[3,0,3]],[3200,[3,0,3]],[3300,[3,0,3]],[3400,[3,0,3]],[3500,[3,0,3]],[3600,[3,0,3]],[3700,[3,0,3]],[3800,[3,0,5]],[3900,[3,0,3]],[4000,[3,0,5]],[4100,[3,0,3]],[4200,[3,0,3]],[4300,[3,0,3]],[4400,[3,0,3]],[4500,[3,0,3]],[4600,[3,0,3]],[4700,[3,0,3]],[4800,[3,0,3]],[4900,[3,0,3]],[5000,[3,0,5]],[5250,[3,0,3]],[5500,[3,0,3]],[5750,[3,0,3]]]);
    WorldFactory.statics.earth.unlocks.push([[25,[4,1,2]],[50,[4,1,2]],[100,[4,1,2]],[200,[4,1,2]],[300,[4,1,2]],[400,[4,1,2]],[500,[4,0,2]],[600,[4,0,2]],[700,[4,0,2]],[800,[4,0,2]],[900,[4,0,2]],[1000,[4,0,3]],[1100,[4,0,2]],[1200,[4,0,2]],[1300,[4,0,2]],[1400,[4,0,2]],[1500,[4,0,2]],[1600,[4,0,2]],[1700,[4,0,2]],[1800,[4,0,2]],[1900,[4,0,2]],[2000,[4,0,5]],[2100,[4,0,3]],[2200,[4,0,3]],[2300,[4,0,3]],[2400,[4,0,3]],[2500,[4,0,3]],[2600,[4,0,3]],[2700,[4,0,3]],[2800,[4,0,3]],[2900,[4,0,3]],[3000,[4,0,3]],[3100,[4,0,3]],[3200,[4,0,3]],[3300,[4,0,3]],[3400,[4,0,3]],[3500,[4,0,3]],[3600,[4,0,3]],[3700,[4,0,3]],[3800,[4,0,3]],[3900,[4,0,3]],[4000,[4,0,3]],[4100,[4,0,3]],[4200,[4,0,3]],[4300,[4,0,3]],[4400,[4,0,3]],[4500,[4,0,3]],[4750,[4,0,3]],[5000,[4,0,3]],[5250,[4,0,3]],[5500,[4,0,3]],[5750,[4,0,3]],[6000,[4,0,3]],[6250,[4,0,3]]]);
    WorldFactory.statics.earth.unlocks.push([[25,[5,1,2]],[50,[5,1,2]],[100,[5,1,2]],[200,[5,1,2]],[300,[5,1,2]],[400,[5,1,2]],[500,[5,0,2]],[600,[5,0,2]],[700,[5,0,2]],[800,[5,0,2]],[900,[5,0,2]],[1000,[5,0,3]],[1100,[5,0,2]],[1200,[5,0,2]],[1300,[5,0,2]],[1400,[5,0,2]],[1500,[5,0,2]],[1600,[5,0,2]],[1700,[5,0,2]],[1800,[5,0,2]],[1900,[5,0,2]],[2000,[5,0,5]],[2100,[5,0,3]],[2200,[5,0,3]],[2300,[5,0,3]],[2400,[5,0,3]],[2500,[5,0,3]],[2600,[5,0,3]],[2700,[5,0,3]],[2800,[5,0,3]],[2900,[5,0,3]],[3000,[5,0,3]],[3250,[5,0,5]],[3500,[5,0,5]],[3750,[5,0,3]],[4000,[5,0,5]],[4250,[5,0,3]],[4500,[5,0,5]],[4750,[5,0,3]],[5000,[5,0,5]],[5250,[5,0,3]],[5500,[5,0,3]],[5750,[5,0,3]],[6000,[5,0,5]],[6250,[5,0,3]],[6500,[5,0,5]]]);
    WorldFactory.statics.earth.unlocks.push([[25,[6,1,2]],[50,[6,1,2]],[100,[6,1,2]],[200,[6,1,2]],[300,[6,1,2]],[400,[6,1,2]],[500,[6,0,2]],[600,[6,0,2]],[700,[6,0,2]],[800,[6,0,2]],[900,[6,0,2]],[1000,[6,0,3]],[1100,[6,0,2]],[1200,[6,0,2]],[1300,[6,0,2]],[1400,[6,0,2]],[1500,[6,0,2]],[1600,[6,0,2]],[1700,[6,0,2]],[1800,[6,0,2]],[1900,[6,0,2]],[2000,[6,0,5]],[2100,[6,1,2]],[2200,[6,0,3]],[2300,[6,1,2]],[2400,[6,0,3]],[2500,[6,1,2]],[2600,[6,0,3]],[2700,[6,1,2]],[2800,[6,0,3]],[2900,[6,0,3]],[3000,[6,0,3]],[3250,[6,0,3]],[3500,[6,0,3]],[3750,[6,0,3]],[4000,[6,0,5]],[4250,[6,0,3]],[4500,[6,0,3]],[4750,[6,0,3]],[5000,[6,0,7]],[5250,[6,0,3]],[5500,[6,0,3]],[5750,[6,0,3]],[6000,[6,0,7]],[6250,[6,0,3]],[6500,[6,0,3]],[6750,[6,0,3]],[7000,[6,0,7]]]);
    WorldFactory.statics.earth.unlocks.push([[25,[7,1,2]],[50,[7,1,2]],[100,[7,1,2]],[200,[7,1,2]],[300,[7,1,2]],[400,[7,1,2]],[500,[7,0,2]],[600,[7,0,2]],[700,[7,0,2]],[800,[7,0,2]],[900,[7,0,2]],[1000,[7,0,3]],[1100,[7,0,2]],[1200,[7,0,2]],[1300,[7,0,2]],[1400,[7,0,2]],[1500,[7,0,2]],[1600,[7,0,2]],[1700,[7,0,2]],[1800,[7,0,2]],[1900,[7,0,2]],[2000,[7,0,5]],[2100,[7,1,2]],[2200,[7,0,2]],[2300,[7,1,2]],[2400,[7,0,2]],[2500,[7,1,2]],[2600,[7,0,2]],[2700,[7,1,2]],[2800,[7,0,2]],[2900,[7,0,2]],[3000,[7,0,2]],[3250,[7,1,2]],[3500,[7,0,2]],[3750,[7,0,2]],[4000,[7,0,2]],[4250,[7,0,3]],[4500,[7,0,3]],[4750,[7,0,3]],[5000,[7,0,5]],[5250,[7,0,3]],[5500,[7,0,3]],[5750,[7,0,3]],[6000,[7,0,9]],[6250,[7,0,3]],[6500,[7,0,3]],[6750,[7,0,3]],[7000,[7,0,9]],[7250,[7,0,3]],[7500,[7,0,3]],[7750,[7,0,3]]]);
    WorldFactory.statics.earth.unlocks.push([[25,[8,1,2]],[50,[8,1,2]],[100,[8,1,2]],[200,[8,1,2]],[300,[8,1,2]],[400,[8,1,2]],[500,[8,0,2]],[600,[8,0,2]],[700,[8,0,2]],[800,[8,0,2]],[900,[8,0,2]],[1000,[8,0,3]],[1100,[8,0,2]],[1200,[8,0,2]],[1300,[8,0,2]],[1400,[8,0,2]],[1500,[8,0,2]],[1600,[8,0,2]],[1700,[8,0,2]],[1800,[8,0,2]],[1900,[8,0,2]],[2000,[8,0,5]],[2250,[8,1,2]],[2500,[8,1,2]],[2750,[8,1,2]],[3000,[8,1,2]],[3250,[8,1,2]],[3500,[8,1,2]],[3750,[8,1,2]],[4000,[8,1,2]],[4250,[8,0,3]],[4500,[8,0,3]],[4750,[8,0,3]],[5000,[8,0,5]],[5250,[8,0,5]],[5500,[8,0,3]],[5750,[8,0,3]],[6000,[8,0,5]],[6250,[8,0,3]],[6500,[8,0,3]],[6750,[8,0,3]],[7000,[8,0,5]],[7250,[8,0,3]],[7500,[8,0,3]],[7750,[8,0,3]],[8000,[8,0,5]],[8250,[8,0,3]],[8500,[8,0,3]]]);
    WorldFactory.statics.earth.unlocks.push([[25,[9,1,2]],[50,[9,1,2]],[100,[9,1,2]],[200,[9,1,2]],[300,[9,1,2]],[400,[9,1,2]],[500,[9,0,2]],[600,[9,0,2]],[700,[9,0,2]],[800,[9,0,2]],[900,[9,0,2]],[1000,[9,0,3]],[1100,[9,0,2]],[1200,[9,0,2]],[1300,[9,0,2]],[1400,[9,0,2]],[1500,[9,0,2]],[1600,[9,0,2]],[1700,[9,0,2]],[1800,[9,0,2]],[1900,[9,0,2]],[2000,[9,0,5]],[2250,[9,1,2]],[2500,[9,1,2]],[2750,[9,1,2]],[3000,[9,1,2]],[3250,[9,1,2]],[3500,[9,1,2]],[3750,[9,1,2]],[4000,[9,1,2]],[4250,[9,1,2]],[4500,[9,1,2]],[4750,[9,1,2]],[5000,[9,1,2]],[5250,[9,0,3]],[5500,[9,0,3]],[5750,[9,0,3]],[6000,[9,0,5]],[6250,[9,0,3]],[6500,[9,0,3]],[6750,[9,0,3]],[7000,[9,0,7]],[7250,[9,0,3]],[7500,[9,0,3]],[7750,[9,0,3]],[8000,[9,0,3]],[8250,[9,0,3]],[8500,[9,0,3]],[8750,[9,0,3]],[9000,[9,0,7]],[9250,[9,0,3]],[9500,[9,0,3]],[9750,[9,0,3]]]);
    WorldFactory.statics.earth.unlocks.push([[25,[10,1,2]],[50,[10,1,2]],[100,[10,1,2]],[200,[10,1,2]],[300,[10,1,2]],[400,[10,1,2]],[500,[10,0,2]],[600,[10,0,2]],[666,[10,0,2]],[700,[10,0,2]],[777,[10,0,2]],[800,[10,0,2]],[900,[10,0,2]],[1000,[10,0,2]],[1100,[10,0,2]],[1111,[10,0,2]],[1200,[10,0,2]],[1300,[10,0,2]],[1400,[10,0,2]],[1500,[10,0,2]],[1600,[10,0,2]],[1700,[10,0,2]],[1800,[10,0,2]],[1900,[10,0,2]],[2000,[10,0,2]],[2100,[10,0,2]],[2200,[10,0,2]],[2222,[10,0,2]],[2300,[10,0,2]],[2400,[10,0,2]],[2500,[10,0,2]],[2600,[10,0,2]],[2700,[10,0,2]],[2800,[10,0,2]],[2900,[10,0,2]],[3000,[10,0,2]],[3100,[10,0,2]],[3200,[10,0,2]],[3300,[10,0,2]],[3333,[10,0,2]],[3400,[10,0,2]],[3500,[10,0,2]],[3600,[10,0,2]],[3700,[10,0,2]],[3800,[10,0,2]],[3900,[10,0,2]],[4000,[10,0,2]],[4100,[10,0,2]],[4200,[10,0,2]],[4300,[10,0,2]],[4400,[10,0,2]],[4500,[10,0,2]],[4600,[10,0,2]],[4700,[10,0,2]],[4800,[10,0,2]],[4900,[10,0,2]],[5000,[10,0,2]]]);
    WorldFactory.statics.earth.cashUpgrades = [[250000,[0,0,3],'lemon_1'],[500000,[1,0,3],'news_1'],[1000000,[2,0,3],'car_1'],[5000000,[3,0,3],'pizza_1'],[10000000,[4,0,3],'donut_1'],[25000000,[5,0,3],'shrimp_1'],[500000000,[6,0,3],'hockey_1'],[10000000000,[7,0,3],'movie_1'],[50000000000,[8,0,3],'bank_1'],[2.5e+11,[9,0,3],'oil_1'],[1e+12,[10,0,3],'global_1'],[2e+13,[0,0,3],'lemon_2'],[5e+13,[1,0,3],'news_2'],[1e+14,[2,0,3],'car_2'],[5e+14,[3,0,3],'pizza_2'],[1e+15,[4,0,3],'donut_2'],[2e+15,[5,0,3],'shrimp_2'],[5e+15,[6,0,3],'hockey_2'],[7e+15,[7,0,3],'movie_2'],[1e+16,[8,0,3],'bank_2'],[2e+16,[9,0,3],'oil_2'],[5e+16,[10,0,3],'global_2'],[1e+17,[11,2,1],'angel_1'],[2e+18,[0,0,3],'lemon_3'],[5e+18,[1,0,3],'news_3'],[7e+18,[2,0,3],'car_3'],[1e+19,[3,0,3],'pizza_3'],[2e+19,[4,0,3],'donut_3'],[3.5e+19,[5,0,3],'shrimp_3'],[5e+19,[6,0,3],'hockey_3'],[7.5e+19,[7,0,3],'movie_3'],[1e+20,[8,0,3],'bank_3'],[2e+20,[9,0,3],'oil_3'],[5e+20,[10,0,3],'global_3'],[1e+21,[11,2,1],'angel_2'],[2.5e+22,[0,0,3],'lemon_4'],[5e+22,[1,0,3],'news_4'],[1e+23,[2,0,3],'car_4'],[2e+23,[3,0,3],'pizza_4'],[3e+23,[4,0,3],'donut_4'],[4e+23,[5,0,3],'shrimp_4'],[5e+23,[6,0,3],'hockey_4'],[6e+23,[7,0,3],'movie_4'],[7e+23,[8,0,3],'bank_4'],[8e+23,[9,0,3],'oil_4'],[9e+23,[10,0,3],'global_4'],[1e+25,[11,2,2],'angel_3'],[1e+27,[0,0,7],'lemon_5'],[5e+27,[1,0,7],'news_5'],[2.5e+28,[2,0,7],'car_5'],[1e+29,[3,0,7],'pizza_5'],[2.5e+29,[4,0,7],'donut_5'],[5e+29,[5,0,7],'shrimp_5'],[1e+30,[6,0,7],'hockey_5'],[5e+30,[7,0,7],'movie_5'],[2.5e+31,[8,0,7],'bank_5'],[5e+31,[9,0,7],'oil_5'],[1e+42,[10,0,7],'global_5'],[5e+42,[1,0,3],'news_6'],[2.5e+43,[2,0,3],'car_6'],[5e+43,[3,0,3],'pizza_6'],[1e+44,[4,0,3],'donut_6'],[2.5e+44,[5,0,3],'shrimp_6'],[5e+44,[6,0,3],'hockey_6'],[1e+45,[7,0,3],'movie_6'],[5e+45,[8,0,3],'bank_6'],[1e+46,[9,0,3],'oil_6'],[2.5e+46,[0,0,3],'lemon_6'],[1e+47,[10,0,3],'global_6'],[2.5e+47,[1,0,3],'news_8'],[5e+47,[2,0,3],'car_8'],[7.5e+47,[3,0,3],'pizza_8'],[1e+48,[4,0,3],'donut_8'],[5e+48,[5,0,3],'shrimp_8'],[1.5e+49,[6,0,3],'hockey_8'],[5e+49,[7,0,3],'movie_8'],[1e+50,[8,0,3],'bank_8'],[2.5e+5,[9,0,3],'oil_8'],[5e+50,[0,0,3],'lemon_8'],[1e+51,[10,0,7],'global_7'],[1e+54,[10,0,5],'global_9'],[1e+60,[10,0,7],'global_10'],[1e+61,[1,0,3],'news_18'],[1e+62,[2,0,3],'car_18'],[1e+66,[10,0,9],'global_11'],[1e+67,[3,0,3],'pizza_18'],[1e+68,[4,0,3],'donut_18'],[1e+72,[10,0,11],'global_12'],[1e+73,[5,0,3],'shrimp_18'],[1e+74,[6,0,3],'hockey_18'],[1e+75,[10,0,13],'global_13'],[1e+76,[7,0,3],'movie_18'],[1e+77,[8,0,3],'bank_18'],[1e+78,[10,0,15],'global_14'],[1e+79,[9,0,3],'oil_18'],[1e+80,[0,0,3],'lemon_18'],[1e+84,[10,0,3],'global_20'],[3e+87,[10,0,3.1415926],'global_16'],[1e+90,[1,0,3],'news_9'],[5e+90,[2,0,3],'car_9'],[2.5e+91,[3,0,3],'pizza_9'],[5e+91,[4,0,3],'donut_9'],[1e+92,[5,0,3],'shrimp_9'],[2.5e+92,[6,0,3],'hockey_9'],[5e+92,[7,0,3],'movie_9'],[1e+93,[8,0,3],'bank_9'],[5e+93,[9,0,3],'oil_9'],[1e+94,[0,0,3],'lemon_9'],[5e+95,[10,0,2],'global_26'],[2e+96,[1,0,2],'news_14'],[1.1e+97,[2,0,2],'car_14'],[6.6e+97,[3,0,2],'pizza_14'],[2.3e+98,[4,0,2],'donut_14'],[4e+98,[5,0,2],'shrimp_14'],[7e+98,[6,0,2],'hockey_14'],[4e+99,[7,0,2],'movie_14'],[1e+100,[10,0,3],'global_18'],[2e+100,[10,0,6],'global_19'],[2.9e+1,[8,0,2],'bank_14'],[1.45e+101,[9,0,2],'oil_14'],[3e+101,[0,0,2],'lemon_14'],[5e+101,[10,0,2],'global_27'],[1e+102,[10,0,5],'global_23'],[5e+102,[2,0,3],'carwash_10'],[1.5e+104,[2,0,3],'carwash_11'],[4e+104,[2,0,3],'carwash_13'],[9e+104,[3,0,3],'pizza_10'],[6e+105,[3,0,3],'pizza_11'],[1.5e+106,[3,0,3],'pizza_13'],[6e+106,[4,0,2],'donut_10'],[1.85e+107,[4,0,3],'donut_11'],[5e+107,[4,0,3],'donut_13'],[6e+107,[10,0,3],'global_30'],[7.5e+107,[5,0,2],'shrimp_10'],[5e+108,[5,0,3],'shrimp_11'],[4.5e+109,[5,0,3],'shrimp_13'],[1.25e+11,[6,0,3],'hockey_10'],[3e+110,[6,0,3],'hockey_11'],[9e+110,[6,0,3],'hockey_13'],[1e+111,[10,0,3],'global_31'],[5e+111,[7,0,2],'movie_10'],[7e+112,[7,0,3],'movie_11'],[2.5e+113,[7,0,3],'movie_13'],[5e+113,[8,0,3],'bank_10'],[9e+113,[8,0,3],'bank_11'],[3e+114,[8,0,3],'bank_13'],[1.5e+115,[9,0,3],'oil_10'],[7.5e+115,[9,0,3],'oil_11'],[4e+116,[9,0,3],'oil_13'],[4.5e+116,[10,0,3],'global_32'],[5e+116,[0,0,3],'lemon_10'],[7.5e+116,[0,0,3],'lemon_11'],[1e+117,[0,0,3],'lemon_13'],[2e+117,[1,0,3],'news_10'],[2e+118,[1,0,3],'news_11'],[1.5e+119,[1,0,3],'news_13'],[3.5e+119,[10,0,5],'global_24'],[5e+119,[10,0,3],'global_33'],[7e+119,[1,0,3],'news_15'],[9.5e+119,[2,0,3],'car_15'],[4e+120,[3,0,3],'pizza_15'],[9e+120,[4,0,3],'donut_15'],[2.4e+121,[5,0,3],'shrimp_15'],[1.11e+122,[6,0,3],'hockey_15'],[2.22e+122,[7,0,3],'movie_15'],[3.33e+122,[8,0,3],'bank_15'],[4.44e+122,[9,0,3],'oil_15'],[5.55e+122,[0,0,3],'lemon_15'],[6.66e+122,[10,0,6.66],'global_25'],[1e+123,[10,0,3],'global_28'],[3e+123,[1,0,3],'news_16'],[6e+123,[2,0,3],'car_16'],[1.2e+124,[3,0,3],'pizza_16'],[2.4e+124,[4,0,3],'donut_16'],[4.8e+124,[5,0,3],'shrimp_16'],[9.6e+124,[6,0,3],'hockey_16'],[1.92e+125,[7,0,3],'movie_16'],[3.84e+125,[8,0,3],'bank_16'],[7.68e+125,[9,0,3],'oil_16'],[1e+126,[0,0,3],'lemon_16'],[1e+127,[10,0,5],'global_29'],[2e+129,[2,0,3],'car_30'],[5e+129,[8,0,3],'bank_30'],[1.3e+13,[3,0,3],'pizza_30'],[2.9e+13,[9,0,3],'oil_30'],[7.1e+13,[0,0,3],'lemon_30'],[1.77e+131,[6,0,3],'hockey_30'],[2.5e+131,[1,0,3],'news_30'],[3.1e+131,[7,0,3],'movie_30'],[5.55e+131,[4,0,3],'donut_30'],[7.36e+131,[5,0,3],'shrimp_30'],[9e+131,[10,0,2],'global_56'],[5e+132,[1,0,2],'news_20'],[9.5e+133,[2,0,2],'car_20'],[2.13e+134,[3,0,2],'pizza_20'],[4e+134,[4,0,2],'donut_20'],[9.85e+134,[5,0,2],'shrimp_20'],[8e+135,[6,0,2],'hockey_20'],[2.9e+136,[7,0,2],'movie_20'],[2.22e+137,[8,0,2],'bank_20'],[5e+137,[9,0,2],'oil_20'],[9e+137,[0,0,2],'lemon_20'],[5e+138,[10,0,3],'global_34'],[1.36e+14,[1,0,3],'news_21'],[7e+140,[2,0,3],'car_21'],[9.25e+14,[3,0,3],'pizza_21'],[3e+141,[10,0,3],'global_44'],[2.1e+142,[4,0,3],'donut_21'],[5.5e+142,[5,0,3],'shrimp_21'],[1.11e+143,[6,0,3],'hockey_21'],[2.23e+143,[7,0,3],'movie_21'],[3.93e+143,[8,0,3],'bank_21'],[6e+143,[9,0,3],'oil_21'],[7.99e+143,[0,0,3],'lemon_21'],[2e+144,[10,0,3],'global_35'],[3e+144,[1,0,3],'news_22'],[6e+144,[2,0,3],'car_22'],[9e+144,[3,0,3],'pizza_22'],[2.1e+145,[4,0,3],'donut_22'],[4.4e+145,[5,0,3],'shrimp_22'],[8.9e+145,[6,0,3],'hockey_22'],[1.29e+146,[7,0,3],'movie_22'],[1.8e+146,[8,0,3],'bank_22'],[2.1e+146,[9,0,3],'oil_22'],[3e+146,[0,0,3],'lemon_22'],[4.5e+146,[10,0,2.71828],'global_36'],[5e+147,[5,0,5],'shrimp_23'],[3e+148,[1,0,5],'news_23'],[1.8e+149,[2,0,5],'car_23'],[9e+149,[8,0,5],'bank_23'],[5e+150,[3,0,5],'pizza_23'],[2e+151,[9,0,5],'oil_23'],[8e+151,[4,0,5],'donut_23'],[2.4e+152,[0,0,5],'lemon_23'],[7.2e+152,[6,0,5],'hockey_23'],[2.1e+154,[7,0,5],'movie_23'],[5e+155,[10,0,4.44444444444],'global_37'],[7.77e+155,[5,0,2],'shrimp_26'],[8.88e+155,[1,0,2],'news_26'],[9.99e+155,[2,0,2],'car_26'],[2e+156,[8,0,2],'bank_26'],[4e+156,[3,0,2],'pizza_26'],[8e+156,[9,0,2],'oil_26'],[1.6e+157,[4,0,2],'donut_26'],[3.2e+157,[0,0,2],'lemon_26'],[6.4e+157,[6,0,2],'hockey_26'],[1.28e+158,[7,0,2],'movie_26'],[5.14e+158,[10,0,2.99792458],'global_40'],[1e+159,[5,0,3],'shrimp_27'],[1e+160,[1,0,3],'news_27'],[2.5e+16,[2,0,3],'car_27'],[5e+160,[8,0,3],'bank_27'],[7.5e+16,[3,0,3],'pizza_27'],[1e+161,[9,0,3],'oil_27'],[1.5e+161,[4,0,3],'donut_27'],[2e+161,[0,0,3],'lemon_27'],[3e+161,[6,0,3],'hockey_27'],[4e+161,[7,0,3],'movie_27'],[9e+161,[10,0,2.35711],'global_41'],[1e+162,[7,0,24],'movie_28'],[2.5e+164,[10,0,2],'global_45'],[5e+164,[1,0,22],'news_28'],[7.5e+164,[10,0,2],'global_46'],[1e+165,[2,0,20],'car_28'],[2.5e+167,[10,0,2],'global_47'],[5e+167,[8,0,18],'bank_28'],[7.5e+167,[10,0,2],'global_48'],[1e+168,[5,0,16],'shrimp_28'],[2.5e+17,[10,0,2],'global_49'],[5e+170,[6,0,14],'hockey_28'],[7.5e+17,[10,0,2],'global_50'],[1e+171,[9,0,12],'oil_28'],[2.5e+173,[10,0,2],'global_51'],[5e+173,[0,0,10],'lemon_28'],[7.5e+173,[10,0,2],'global_52'],[1e+174,[3,0,8],'pizza_28'],[2.5e+176,[10,0,2],'global_53'],[5e+176,[4,0,4],'donut_28'],[1e+177,[10,0,9],'global_42'],[5e+183,[10,0,9.87654321],'global_54'],[5e+189,[10,0,5],'global_57'],[2.7e+193,[10,0,3],'global_59'],[1.3e+196,[10,0,4],'global_61'],[2e+198,[10,0,5],'global_63'],[1e+201,[0,0,3],'lemon_a'],[1.4e+202,[1,0,3],'news_a'],[9.6e+202,[2,0,3],'car_a'],[1.98e+203,[3,0,3],'pizza_a'],[3.22e+203,[4,0,3],'donut_a'],[6.79e+203,[5,0,3],'shrimp_a'],[8.88e+203,[6,0,3],'hockey_a'],[1.9e+205,[7,0,3],'movie_a'],[8.1e+205,[8,0,3],'bank_a'],[1.99e+206,[9,0,3],'oil_a'],[2.33e+206,[0,0,3],'lemon_b'],[4.21e+206,[1,0,3],'news_b'],[6.07e+206,[2,0,3],'car_b'],[7.77e+206,[3,0,3],'pizza_b'],[9.1e+206,[4,0,3],'donut_b'],[2e+207,[5,0,3],'shrimp_b'],[9e+207,[6,0,3],'hockey_b'],[4.5e+208,[7,0,3],'movie_b'],[2e+209,[8,0,3],'bank_b'],[3.28e+209,[9,0,3],'oil_b'],[6e+209,[10,0,5],'global_a'],[1e+214,[0,0,11],'lemon_c'],[1e+214,[1,0,11],'news_c'],[1e+214,[2,0,11],'car_c'],[1e+214,[3,0,11],'pizza_c'],[1e+214,[4,0,11],'donut_c'],[1e+214,[5,0,11],'shrimp_c'],[1e+214,[6,0,11],'hockey_c'],[1e+214,[7,0,11],'movie_c'],[1e+214,[8,0,11],'bank_c'],[1e+214,[9,0,11],'oil_c'],[1.5e+215,[0,0,3],'lemon_d'],[1.66e+215,[1,0,3],'news_d'],[1.93e+215,[2,0,3],'car_d'],[4.1e+215,[3,0,3],'pizza_d'],[6.78e+215,[4,0,3],'donut_d'],[9e+215,[5,0,3],'shrimp_d'],[1.2e+217,[6,0,3],'hockey_d'],[6.7e+217,[7,0,3],'movie_d'],[1.23e+218,[8,0,3],'bank_d'],[3.21e+218,[9,0,3],'oil_d'],[5.55e+218,[10,0,5],'global_b'],[8e+218,[0,0,3],'lemon_e'],[8e+218,[1,0,3],'news_e'],[8e+218,[2,0,3],'car_e'],[9e+218,[3,0,3],'pizza_e'],[3e+219,[4,0,3],'donut_e'],[4e+219,[5,0,3],'shrimp_e'],[5e+219,[6,0,3],'hockey_e'],[6e+219,[7,0,3],'movie_e'],[3e+221,[8,0,3],'bank_e'],[4.21e+221,[9,0,3],'oil_e'],[6e+221,[0,0,3],'lemon_f'],[7.89e+221,[1,0,3],'news_f'],[8.45e+221,[2,0,3],'car_f'],[2e+222,[3,0,3],'pizza_f'],[5e+222,[4,0,3],'donut_f'],[1.4e+223,[5,0,3],'shrimp_f'],[5.4e+223,[6,0,3],'hockey_f'],[1.08e+224,[7,0,3],'movie_f'],[2.19e+224,[8,0,3],'bank_f'],[4.68e+224,[9,0,3],'oil_f'],[1e+228,[0,0,7],'lemon_g'],[1e+228,[1,0,7],'news_g'],[1e+228,[2,0,7],'car_g'],[1e+228,[3,0,7],'pizza_g'],[1e+228,[4,0,7],'donut_g'],[1e+228,[5,0,7],'shrimp_g'],[1e+228,[6,0,7],'hockey_g'],[1e+228,[7,0,7],'movie_g'],[1e+228,[8,0,7],'bank_g'],[1e+228,[9,0,7],'oil_g'],[1e+230,[10,0,5],'global_c'],[3e+231,[0,0,3],'lemon_h'],[8e+231,[1,0,3],'news_h'],[6.9e+232,[2,0,3],'car_h'],[1.88e+233,[3,0,3],'pizza_h'],[2.39e+233,[4,0,3],'donut_h'],[4.11e+233,[5,0,3],'shrimp_h'],[7e+233,[6,0,3],'hockey_h'],[9.12e+233,[7,0,3],'movie_h'],[1.2e+235,[8,0,3],'bank_h'],[2.4e+235,[9,0,3],'oil_h'],[6.3e+235,[0,0,3],'lemon_i'],[1.99e+236,[1,0,3],'news_i'],[3.98e+236,[2,0,3],'car_i'],[5.66e+236,[3,0,3],'pizza_i'],[7e+236,[4,0,3],'donut_i'],[8e+236,[5,0,3],'shrimp_i'],[9e+236,[6,0,3],'hockey_i'],[1.2e+238,[7,0,3],'movie_i'],[2.5e+238,[8,0,3],'bank_i'],[5e+238,[9,0,3],'oil_i'],[1e+240,[0,0,2],'lemon_j'],[5e+240,[1,0,2],'news_j'],[9e+240,[2,0,2],'car_j'],[2.1e+241,[3,0,2],'pizza_j'],[4.5e+241,[4,0,2],'donut_j'],[8.9e+241,[5,0,2],'shrimp_j'],[1.53e+242,[6,0,2],'hockey_j'],[2.99e+242,[7,0,2],'movie_j'],[5.77e+242,[8,0,2],'bank_j'],[8.13e+242,[9,0,2],'oil_j'],[2e+243,[0,0,2],'lemon_k'],[2.2e+244,[1,0,2],'news_k'],[4.4e+244,[2,0,2],'car_k'],[6.6e+244,[3,0,2],'pizza_k'],[8.8e+244,[4,0,2],'donut_k'],[1.11e+245,[5,0,2],'shrimp_k'],[2.22e+245,[6,0,2],'hockey_k'],[3.33e+245,[7,0,2],'movie_k'],[4.44e+245,[8,0,2],'bank_k'],[5.55e+245,[9,0,2],'oil_k'],[1e+252,[10,0,5],'global_d'],[1e+253,[0,0,3],'lemon_l'],[1e+253,[1,0,3],'news_l'],[1e+253,[2,0,3],'car_l'],[1e+253,[3,0,3],'pizza_l'],[1e+253,[4,0,3],'donut_l'],[1e+253,[5,0,3],'shrimp_l'],[1e+253,[6,0,3],'hockey_l'],[1e+253,[7,0,3],'movie_l'],[1e+253,[8,0,3],'bank_l'],[1e+253,[9,0,3],'oil_l'],[5e+253,[0,0,9],'lemon_m'],[7.5e+253,[1,0,9],'news_m'],[1.25e+254,[2,0,9],'car_m'],[6.25e+254,[3,0,9],'pizza_m'],[3e+255,[4,0,9],'donut_m'],[1.5e+256,[5,0,9],'shrimp_m'],[7.5e+256,[6,0,9],'hockey_m'],[3.75e+257,[7,0,9],'movie_m'],[1e+258,[8,0,9],'bank_m'],[8e+257,[9,0,9],'oil_m'],[2.5e+258,[10,0,2],'global_e'],[6.4e+258,[0,0,3],'lemon_n'],[1.22e+259,[1,0,3],'news_n'],[2.33e+26,[2,0,3],'car_n'],[3.99e+26,[3,0,3],'pizza_n'],[7.66e+26,[4,0,3],'donut_n'],[1e+261,[5,0,3],'shrimp_n'],[1.9e+262,[6,0,3],'hockey_n'],[9.8e+262,[7,0,3],'movie_n'],[2.6e+263,[8,0,3],'bank_n'],[5.44e+263,[9,0,3],'oil_n'],[7e+263,[0,0,3],'lemon_o'],[1e+264,[1,0,3],'news_o'],[4.5e+265,[2,0,3],'car_o'],[6.9e+265,[3,0,3],'pizza_o'],[8.9e+265,[4,0,3],'donut_o'],[1.89e+266,[5,0,3],'shrimp_o'],[2.89e+266,[6,0,3],'hockey_o'],[4.48e+266,[7,0,3],'movie_o'],[9e+266,[8,0,3],'bank_o'],[5e+267,[9,0,3],'oil_o'],[1e+270,[10,0,5],'global_f'],[1e+273,[0,0,7],'lemon_p'],[2e+273,[1,0,7],'news_p'],[3e+273,[2,0,7],'car_p'],[6e+273,[3,0,7],'pizza_p'],[2.5e+274,[4,0,7],'donut_p'],[2e+275,[5,0,7],'shrimp_p'],[6e+275,[6,0,7],'hockey_p'],[9.99e+275,[7,0,7],'movie_p'],[1.5e+277,[8,0,7],'bank_p'],[3e+277,[9,0,7],'oil_p'],[1e+285,[1,0,13],'news_q'],[1e+285,[2,0,13],'car_q'],[1e+285,[3,0,13],'pizza_q'],[1e+285,[4,0,13],'donut_q'],[1e+285,[5,0,13],'shrimp_q'],[1e+285,[6,0,13],'hockey_q'],[1e+285,[7,0,13],'movie_q'],[1e+285,[8,0,13],'bank_q'],[1e+285,[9,0,13],'oil_q']];
    WorldFactory.statics.earth.angelUpgrades = [[10000,[10,0,3],'angel_sac_1'],[100000,[11,2,2],'angel_sac_2'],[100000000,[11,2,2],'angel_sac_3'],[1000000000,[10,0,5],'angel_sac_4'],[1e+11,[10,0,9],'angel_sac_5'],[25000000,[1,0,10],'swap_1'],[25000000,[2,0,10],'swap_2'],[25000000,[3,0,10],'swap_3'],[25000000,[4,0,10],'swap_4'],[250000000,[1,0,50],'swap_5'],[250000000,[2,0,50],'swap_6'],[250000000,[3,0,50],'swap_7'],[250000000,[4,0,50],'swap_8'],[25000000000,[1,0,50],'swap_9'],[25000000000,[2,0,50],'swap_10'],[25000000000,[3,0,50],'swap_11'],[25000000000,[4,0,50],'swap_12'],[1e+12,[10,0,11],'angel_sac_6'],[2.5e+14,[1,0,3],'news_7'],[7.5e+14,[2,0,3],'car_7'],[2e+15,[3,0,3],'pizza_7'],[5e+15,[4,0,3],'donut_7'],[1e+16,[5,0,3],'shrimp_7'],[2.5e+16,[6,0,3],'hockey_7'],[7.5e+16,[7,0,3],'movie_7'],[2e+17,[8,0,3],'bank_7'],[4e+17,[9,0,3],'oil_7'],[1e+18,[0,0,3],'lemon_7'],[1e+21,[10,0,15],'global_8'],[1e+22,[1,0,75],'swap_13'],[1e+22,[2,0,75],'swap_14'],[1e+22,[3,0,75],'swap_15'],[1e+22,[4,0,75],'swap_16'],[1e+22,[5,0,75],'swap_17'],[1e+23,[1,0,75],'swap_18'],[1e+23,[2,0,75],'swap_19'],[1e+23,[3,0,75],'swap_20'],[1e+23,[4,0,75],'swap_21'],[1e+23,[5,0,75],'swap_22'],[1e+31,[1,0,100],'swap_23'],[1e+32,[2,0,100],'swap_24'],[1e+33,[11,2,10],'angel_sac_7'],[1e+34,[10,0,15],'global_15'],[1e+36,[10,0,3],'global_21'],[1e+40,[10,0,5],'global_17'],[1e+42,[10,0,5],'global_22'],[2e+42,[1,0,50],'swap_25'],[1e+47,[2,0,4],'carwash_12'],[2e+47,[3,0,6],'pizza_12'],[7e+47,[4,0,3],'donut_12'],[2e+48,[5,0,3],'shrimp_12'],[2.5e+49,[6,0,3],'hockey_12'],[5e+50,[7,0,3],'movie_12'],[2e+52,[8,0,3],'bank_12'],[8e+52,[9,0,3],'oil_12'],[1.5e+53,[0,0,3],'lemon_12'],[3e+53,[1,0,3],'news_12'],[5e+53,[11,2,10],'angel_sac_8'],[1e+54,[1,0,3],'news_17'],[4e+54,[2,0,3],'car_17'],[9e+54,[3,0,3],'pizza_17'],[2.5e+55,[4,0,3],'donut_17'],[7.5e+55,[5,0,3],'shrimp_17'],[1.77e+56,[6,0,3],'hockey_17'],[3e+56,[7,0,3],'movie_17'],[5e+56,[8,0,3],'bank_17'],[8e+56,[9,0,3],'oil_17'],[1e+57,[0,0,3],'lemon_17'],[3e+61,[1,0,30],'swap_26'],[3e+61,[2,0,30],'swap_28'],[3e+61,[3,0,30],'swap_30'],[3e+61,[4,0,30],'swap_32'],[3e+61,[6,0,30],'swap_34'],[1e+62,[10,0,5],'global_43'],[2e+63,[1,0,3],'news_19'],[2e+63,[2,0,3],'car_19'],[2e+63,[3,0,3],'pizza_19'],[2e+63,[4,0,3],'donut_19'],[2e+63,[5,0,3],'shrimp_19'],[2e+63,[6,0,3],'hockey_19'],[2e+63,[7,0,3],'movie_19'],[2e+63,[8,0,3],'bank_19'],[2e+63,[9,0,3],'oil_19'],[2e+63,[0,0,3],'lemon_19'],[1e+65,[10,0,7],'global_38'],[1e+66,[1,0,3],'news_24'],[4e+66,[2,0,3],'car_24'],[1.3e+67,[3,0,3],'pizza_24'],[2e+67,[4,0,3],'donut_24'],[2.9e+67,[5,0,3],'shrimp_24'],[3.8e+67,[6,0,3],'hockey_24'],[5.2e+67,[7,0,3],'movie_24'],[6.7e+67,[8,0,3],'bank_24'],[7.2e+67,[9,0,3],'oil_24'],[9.6e+67,[0,0,3],'lemon_24'],[1.25e+68,[1,0,50],'swap_36'],[7.77e+68,[10,0,7.777777],'global_39'],[5e+69,[1,0,10],'swap_27'],[5e+69,[2,0,10],'swap_29'],[5e+69,[3,0,10],'swap_31'],[5e+69,[4,0,10],'swap_33'],[5e+69,[5,0,10],'swap_37'],[5e+69,[6,0,10],'swap_35'],[5e+69,[7,0,10],'swap_38'],[5e+69,[8,0,10],'swap_39'],[5e+69,[9,0,10],'swap_40'],[5e+69,[0,0,10],'swap_41'],[1e+72,[1,0,3],'news_25'],[5e+72,[2,0,3],'car_25'],[2.2e+73,[3,0,3],'pizza_25'],[4.4e+73,[4,0,3],'donut_25'],[1.11e+74,[5,0,3],'shrimp_25'],[2.22e+74,[6,0,3],'hockey_25'],[3.33e+74,[7,0,3],'movie_25'],[4.44e+74,[8,0,3],'bank_25'],[5.55e+74,[9,0,3],'oil_25'],[6.66e+74,[0,0,3],'lemon_25'],[2.5e+76,[2,0,25],'swap_42'],[2.5e+76,[1,0,25],'swap_43'],[2.5e+76,[3,0,25],'swap_44'],[2.5e+76,[4,0,25],'swap_45'],[2.5e+76,[5,0,25],'swap_46'],[2.5e+76,[6,0,25],'swap_47'],[2.5e+76,[7,0,25],'swap_48'],[2.5e+76,[8,0,25],'swap_49'],[2.5e+76,[9,0,25],'swap_50'],[2.5e+76,[0,0,25],'swap_51'],[1.1e+79,[1,0,3],'news_29'],[2.7e+79,[2,0,3],'car_29'],[4.3e+79,[3,0,3],'pizza_29'],[8.7e+79,[4,0,3],'donut_29'],[1.9e+8,[5,0,3],'shrimp_29'],[3.21e+8,[6,0,3],'hockey_29'],[4.95e+8,[7,0,3],'movie_29'],[6e+80,[8,0,3],'bank_29'],[7.25e+8,[9,0,3],'oil_29'],[8.98e+8,[0,0,3],'lemon_29'],[3e+84,[10,0,13.11],'global_55'],[1.3e+88,[10,0,5],'global_58'],[3e+90,[10,0,3],'global_60'],[1.3e+94,[10,0,4],'global_62'],[2.4e+97,[10,0,5],'global_64'],[1e+102,[1,0,25],'swap_news_a'],[1e+102,[2,0,25],'swap_car_a'],[1e+102,[3,0,25],'swap__pizza_a'],[1e+102,[4,0,25],'swap__donut_a'],[1e+102,[5,0,25],'swap_shrimp_a'],[1e+102,[6,0,25],'swap_hockey_a'],[1e+102,[7,0,25],'swap_movie_a'],[1e+102,[8,0,25],'swap_bank_a'],[1e+102,[9,0,25],'swap_oil_a'],[1e+102,[0,0,25],'swap_lemon_a'],[3.33e+11,[10,0,3],'angel_everything_a'],[1e+114,[1,0,3],'news_angel_a'],[2e+115,[2,0,3],'car_angel_a'],[5e+115,[3,0,3],'pizza_angel_a'],[1e+116,[4,0,3],'donut_angel_a'],[2e+116,[5,0,3],'shrimp_angel_a'],[3e+116,[6,0,3],'hockey_angel_a'],[4e+116,[7,0,3],'movie_angel_a'],[5e+116,[8,0,3],'bank_angel_a'],[7.5e+116,[9,0,3],'oil_angel_a'],[2e+117,[0,0,3],'lemon_angel_a'],[1e+129,[1,0,25],'swap_news_b'],[1e+129,[2,0,25],'swap_car_b'],[1e+129,[3,0,25],'swap__pizza_b'],[1e+129,[4,0,25],'swap__donut_b'],[1e+129,[5,0,25],'swap_shrimp_b'],[1e+129,[6,0,25],'swap_hockey_b'],[1e+129,[7,0,25],'swap_movie_b'],[1e+129,[8,0,25],'swap_bank_b'],[1e+129,[9,0,25],'swap_oil_b'],[1e+129,[0,0,25],'swap_lemon_b'],[1e+138,[1,0,3],'news_angel_b'],[4e+138,[2,0,3],'car_angel_b'],[1.6e+139,[3,0,3],'pizza_angel_b'],[5.6e+139,[4,0,3],'donut_angel_b'],[1e+140,[5,0,3],'shrimp_angel_b'],[2.11e+14,[6,0,3],'hockey_angel_b'],[3.49e+14,[7,0,3],'movie_angel_b'],[4.43e+14,[8,0,3],'bank_angel_b'],[5.67e+14,[9,0,3],'oil_angel_b'],[7.01e+14,[0,0,3],'lemon_angel_b'],[9e+140,[1,0,25],'swap_news_c'],[9e+140,[2,0,25],'swap_car_c'],[9e+140,[3,0,25],'swap__pizza_c'],[9e+140,[4,0,25],'swap__donut_c'],[9e+140,[5,0,25],'swap_shrimp_c'],[9e+140,[6,0,25],'swap_hockey_c'],[9e+140,[7,0,25],'swap_movie_c'],[9e+140,[8,0,25],'swap_bank_c'],[9e+140,[9,0,25],'swap_oil_c'],[9e+140,[0,0,25],'swap_lemon_c'],[1e+140,[10,0,19],'angel_everything_c']];
    WorldFactory.statics.earth.managerUpgrades = [[[10000000000,false],[9e+126,false]],[[1000000000,false],[1e+103,false]],[[100000000,false],[3e+120,false]],[[10000000,false],[1e+113,false]],[[1000000,false],[3e+117,false]],[[100000,false],[7.5e+119,false]],[[9999,false],[7.5e+106,false]],[[1000,false],[2.5e+11,false]],[[100,false],[5e+115,false]],[[10,false],[3.3e+124,false]]];
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
      {baseCost: 1.73676395025e+11, basePower: 1.11, baseProfit: 11067840000, baseSpeed: 14400, name: 'Werewolf Colony', id: 'colony'},
      {baseCost: 1e+12, basePower: 1.5, baseProfit: 3.32035e+11, baseSpeed: 86400, name: 'Giant Laser', id: 'laser'}
    ];
    WorldFactory.statics.moon.isEvent = false;
    WorldFactory.statics.moon.unlocks = [];
    WorldFactory.statics.moon.unlocks.push([[10,[0,0,3.5]],[20,[0,0,4]],[40,[0,0,4.5]],[80,[0,0,5]],[160,[0,0,5.5]],[320,[0,0,6]],[640,[0,0,6.5]],[1280,[0,0,7]],[2560,[0,0,7.5]],[5120,[0,0,999999999]],[10000,[0,0,3.5]]]);
    WorldFactory.statics.moon.unlocks.push([[30,[1,0,1.5]],[60,[1,0,1.75]],[90,[1,0,2]],[120,[1,0,2.25]],[160,[1,0,2.5]],[200,[1,0,2.75]],[240,[1,0,3]],[280,[1,0,3.25]],[330,[1,0,3.5]],[380,[1,0,3.75]],[430,[1,0,4]],[480,[1,0,4.25]],[540,[1,0,4.5]],[600,[1,0,4.75]],[660,[1,0,5]],[720,[1,0,5.5]],[790,[1,0,5.75]],[860,[1,0,6]],[940,[1,0,6.25]],[1020,[1,0,6.5]],[1110,[1,0,6.75]],[1200,[1,0,7]],[1400,[1,0,7.25]],[1600,[1,0,7.5]],[1800,[1,0,7.75]],[2000,[1,0,999999999]],[2400,[1,0,8.5]]]);
    WorldFactory.statics.moon.unlocks.push([[10,[2,0,3]],[20,[2,0,3]],[40,[2,0,3]],[60,[2,0,3]],[80,[2,0,3]],[100,[2,0,3]],[120,[2,0,3]],[240,[2,0,3]],[360,[5,0,3]],[480,[2,0,3]],[600,[2,0,3]],[840,[6,0,3]],[1080,[2,0,3]],[1320,[2,0,3]],[1560,[9,0,3]],[1800,[2,0,3]],[2160,[2,0,3]],[2520,[2,0,3]],[2880,[2,0,3]],[3240,[2,0,33]],[3600,[2,0,33]],[4000,[2,0,33]],[4400,[2,0,33]],[4800,[2,0,33]],[5200,[2,0,3333]],[5600,[2,0,3333]],[6000,[2,0,3333]],[6666,[2,0,3333]]]);
    WorldFactory.statics.moon.unlocks.push([[25,[3,0,3]],[50,[3,0,3]],[75,[3,0,3]],[100,[3,0,3]],[150,[3,0,6]],[200,[3,0,6]],[250,[3,0,6]],[300,[3,0,6]],[350,[3,0,6]],[400,[3,0,6]],[450,[3,0,6]],[500,[3,0,12]],[700,[3,0,24]],[900,[3,0,36]],[1100,[3,0,48]],[1300,[3,0,60]],[1500,[3,0,72]],[1700,[3,0,84]],[1900,[3,0,96]],[2100,[3,0,108]],[2300,[3,0,120]],[2500,[3,0,144]]]);
    WorldFactory.statics.moon.unlocks.push([[20,[4,0,12]],[50,[4,0,12]],[90,[4,0,12]],[180,[4,0,22]],[360,[4,0,333]],[720,[4,0,4444]],[1440,[4,0,55555]],[2880,[4,0,666666]],[5720,[4,0,7777777]]]);
    WorldFactory.statics.moon.unlocks.push([[50,[5,0,7]],[100,[5,0,7]],[200,[5,0,7]],[300,[5,0,7]],[400,[5,0,7]],[500,[5,0,7]],[600,[5,0,7]],[700,[5,0,7]],[800,[5,0,7]],[900,[5,0,7]],[1000,[5,0,7]],[1200,[5,0,7]],[1400,[5,0,7]],[1600,[5,0,7]],[1800,[5,0,7]],[2000,[5,0,7]],[2200,[5,0,777]],[2400,[5,0,777]],[2600,[5,0,777]],[2800,[5,0,777]],[3000,[5,0,777]]]);
    WorldFactory.statics.moon.unlocks.push([[8,[6,0,5]],[16,[6,0,5]],[32,[6,0,5]],[64,[6,0,5]],[128,[6,0,5]],[256,[6,0,5]],[512,[6,0,5]],[1024,[6,0,5]],[2048,[6,0,88888888]],[4096,[6,0,88888888]]]);
    WorldFactory.statics.moon.unlocks.push([[80,[7,0,8]],[160,[7,0,8]],[240,[7,0,8]],[320,[7,0,8]],[480,[7,0,8]],[640,[7,0,8]],[800,[7,0,8]],[960,[7,0,8]],[1200,[7,0,8]],[1440,[7,0,888]],[1680,[7,0,888]],[1920,[7,0,888]],[2160,[7,0,888]],[2300,[7,0,888]],[2540,[7,0,888]],[2780,[7,0,888]],[3000,[7,0,888]]]);
    WorldFactory.statics.moon.unlocks.push([[25,[8,0,3]],[50,[8,0,3]],[75,[8,0,3]],[100,[8,0,3]],[150,[8,0,3]],[200,[8,0,3]],[250,[8,0,3]],[300,[8,0,3]],[350,[8,0,3]],[400,[8,0,3]],[450,[8,0,3]],[500,[8,0,3]],[600,[8,0,3]],[700,[8,0,3]],[800,[8,0,3]],[900,[8,0,3]],[1000,[8,0,3]],[1200,[8,0,3]],[1400,[8,0,3]],[1600,[8,0,3]],[1800,[8,0,3]],[2000,[8,0,3]],[2300,[8,0,3]],[2600,[8,0,3]],[2900,[8,0,33]],[3200,[8,0,33]],[3500,[8,0,9876543210]],[3800,[8,0,33]],[4100,[8,0,33]]]);
    WorldFactory.statics.moon.unlocks.push([[50,[9,0,75]],[100,[9,0,75]],[200,[9,0,75]],[300,[9,0,75]],[400,[9,0,75]],[500,[9,0,75]],[600,[9,0,75]],[700,[9,0,75]],[800,[9,0,75]],[900,[9,0,75]],[1000,[9,0,75]],[1111,[9,0,75]]]);
    WorldFactory.statics.moon.unlocks.push([[1,[10,1,2]],[5,[10,1,2]],[25,[10,1,2]],[50,[10,1,2]],[75,[10,1,2]],[100,[10,1,2]],[150,[10,1,2]],[200,[10,1,2]],[250,[10,1,2]],[300,[10,1,2]],[350,[10,1,2]],[400,[10,1,2]],[450,[10,1,2]],[500,[10,1,2]],[600,[10,1,2]],[700,[10,1,2]],[800,[10,1,2]],[900,[10,1,2]],[1000,[10,1,2]],[1111,[10,1,2]]]);
    WorldFactory.statics.moon.cashUpgrades = [[332500,[0,0,3],'shoes_1'],[665000,[1,0,3],'booths_1'],[1330000,[2,0,3],'clones_1'],[6650000,[3,0,3],'express_1'],[13300000,[4,0,3],'bars_1'],[33250000,[5,0,3],'farms_1'],[1665000000,[6,0,3],'mines_1'],[1.33e+11,[7,0,3],'parks_1'],[6.65e+11,[8,0,3],'werewolf_1'],[3.3e+12,[9,0,3],'lasers_1'],[1e+13,[10,0,9],'global_1'],[3e+13,[0,0,3],'shoes_2'],[7e+13,[1,0,3],'booths_2'],[1.5e+14,[2,0,3],'clones_2'],[2.66e+14,[3,0,3],'express_2'],[2.75e+14,[4,0,3],'bars_2'],[4.33e+14,[5,0,3],'farms_2'],[6.65e+14,[6,0,3],'mines_2'],[9.31e+14,[7,0,3],'parks_2'],[2e+15,[8,0,3],'werewolf_2'],[3e+15,[9,0,3],'lasers_2'],[7e+15,[10,0,9],'global_2'],[1.3e+16,[11,2,1],'angel_1'],[5e+20,[10,0,9],'global_new_3'],[2.6e+22,[0,0,3],'shoes_3'],[6.7e+22,[1,0,3],'booths_3'],[9.3e+22,[2,0,3],'clones_3'],[1.33e+23,[3,0,3],'express_3'],[2.66e+23,[4,0,3],'bars_3'],[4.65e+23,[5,0,3],'farms_3'],[6.65e+23,[6,0,3],'mines_3'],[9.97e+23,[7,0,3],'parks_3'],[2e+24,[8,0,3],'werewolf_3'],[3e+24,[9,0,3],'lasers_3'],[1e+25,[10,0,9],'global_3'],[2e+25,[11,2,1],'angel_2'],[5e+30,[0,0,3],'shoes_4'],[1e+31,[1,0,3],'booths_4'],[2e+31,[2,0,3],'clones_4'],[4e+31,[3,0,3],'express_4'],[1.6e+32,[4,0,3],'bars_4'],[2.8e+32,[5,0,3],'farms_4'],[5e+32,[6,0,3],'mines_4'],[6.9e+32,[7,0,3],'parks_4'],[7.25e+32,[8,0,3],'werewolf_4'],[8.33e+32,[9,0,3],'lasers_4'],[9.75e+32,[10,0,9],'global_4'],[4e+33,[11,2,1],'angel_3'],[9e+33,[0,0,3],'shoes_5'],[2e+34,[1,0,3],'booths_5'],[1e+35,[2,0,3],'clones_5'],[2e+35,[3,0,3],'express_5'],[4.21e+35,[4,0,3],'bars_5'],[6.55e+35,[5,0,3],'farms_5'],[8.25e+35,[6,0,3],'mines_5'],[5e+36,[7,0,3],'parks_5'],[2.5e+37,[8,0,3],'werewolf_5'],[5e+37,[9,0,3],'lasers_5'],[1e+38,[10,0,9],'global_5'],[7.5e+4,[0,0,5],'shoes_6'],[2.1e+41,[1,0,5],'booths_6'],[3.53e+41,[2,0,5],'clones_6'],[6.35e+41,[3,0,5],'express_6'],[9e+41,[4,0,5],'bars_6'],[9e+42,[5,0,5],'farms_6'],[2.2e+43,[6,0,5],'mines_6'],[6e+43,[7,0,5],'parks_6'],[1.32e+44,[8,0,5],'werewolf_6'],[3.67e+44,[9,0,5],'lasers_6'],[1e+45,[10,0,9],'global_6'],[1e+51,[10,0,9],'global_new_1'],[1e+54,[11,2,3],'angel_4'],[1.8e+55,[0,0,3],'shoes_7'],[6e+54,[1,0,3],'booths_7'],[7.9e+55,[2,0,3],'clones_7'],[1.1e+56,[3,0,3],'express_7'],[2.2e+56,[4,0,3],'bars_7'],[3.99e+56,[5,0,3],'farms_7'],[6.66e+56,[6,0,3],'mines_7'],[9.11e+56,[7,0,3],'parks_7'],[4e+60,[8,0,3],'werewolf_7'],[2.5e+61,[9,0,3],'lasers_7'],[1.12e+62,[10,0,9],'global_7'],[2e+62,[0,0,3],'shoes_8'],[3.56e+62,[1,0,3],'booths_8'],[5.18e+62,[2,0,3],'clones_8'],[7.66e+62,[3,0,3],'express_8'],[3e+69,[4,0,3],'bars_8'],[6e+69,[5,0,3],'farms_8'],[1.2e+7,[6,0,3],'mines_8'],[5e+70,[7,0,3],'parks_8'],[2.12e+71,[8,0,3],'werewolf_8'],[3.67e+71,[9,0,3],'lasers_8'],[1e+72,[10,0,9],'global_8'],[2.5e+76,[0,0,3],'shoes_9'],[6e+76,[1,0,3],'booths_9'],[1.77e+77,[2,0,3],'clones_9'],[2.39e+77,[3,0,3],'express_9'],[4.32e+77,[4,0,3],'bars_9'],[8.01e+77,[5,0,3],'farms_9'],[2e+78,[6,0,3],'mines_9'],[8e+78,[7,0,3],'parks_9'],[2.2e+79,[8,0,3],'werewolf_9'],[5.9e+79,[9,0,3],'lasers_9'],[4.44e+8,[10,0,9],'global_9'],[3e+81,[11,2,3],'angel_5'],[1.2e+85,[0,0,3],'shoes_10'],[2.4e+85,[1,0,3],'booths_10'],[4.8e+85,[2,0,3],'clones_10'],[9.6e+85,[3,0,3],'express_10'],[1.92e+86,[4,0,3],'bars_10'],[3.84e+86,[5,0,3],'farms_10'],[9.68e+86,[6,0,3],'mines_10'],[1.5e+88,[7,0,3],'parks_10'],[3.5e+88,[8,0,3],'werewolf_10'],[1e+89,[9,0,3],'lasers_10'],[1e+90,[10,0,9],'global_10'],[1e+92,[0,0,5],'shoes_a'],[2e+92,[1,0,5],'booths_a'],[3e+92,[2,0,5],'clones_a'],[4e+92,[3,0,5],'express_a'],[5e+92,[4,0,5],'bars_a'],[6e+92,[5,0,5],'farms_a'],[7e+92,[6,0,5],'mines_a'],[8e+92,[7,0,5],'parks_a'],[9e+92,[8,0,5],'werewolf_a'],[9.99e+92,[9,0,5],'lasers_a'],[5e+93,[10,0,9],'global_a'],[1e+94,[0,0,3],'shoes_b'],[2e+94,[1,0,3],'booths_b'],[5.5e+94,[2,0,3],'clones_b'],[9e+94,[3,0,3],'express_b'],[1.8e+95,[4,0,3],'bars_b'],[4e+95,[5,0,3],'farms_b'],[7.5e+95,[6,0,3],'mines_b'],[2e+96,[7,0,3],'parks_b'],[4e+96,[8,0,3],'werewolf_b'],[1.4e+97,[9,0,3],'lasers_b'],[5e+97,[10,0,9],'global_b'],[4e+98,[0,0,3],'shoes_c'],[7e+98,[1,0,3],'booths_c'],[1e+99,[2,0,3],'clones_c'],[3e+99,[3,0,3],'express_c'],[1.9e+1,[4,0,3],'bars_c'],[5.5e+1,[5,0,3],'farms_c'],[1.23e+101,[6,0,3],'mines_c'],[2e+101,[7,0,3],'parks_c'],[6e+101,[8,0,3],'werewolf_c'],[8.88e+101,[9,0,3],'lasers_c'],[1e+102,[10,0,9],'global_c'],[5e+102,[0,0,3],'shoes_d'],[2.5e+103,[1,0,3],'booths_d'],[1.25e+104,[2,0,3],'clones_d'],[6.25e+104,[3,0,3],'express_d'],[3e+105,[4,0,3],'bars_d'],[5e+105,[5,0,3],'farms_d'],[6.5e+106,[6,0,3],'mines_d'],[2.46e+107,[7,0,3],'parks_d'],[5e+107,[8,0,3],'werewolf_d'],[8.08e+107,[9,0,3],'lasers_d'],[1e+108,[10,0,9],'global_d'],[2e+108,[0,0,3],'shoes_e'],[4e+108,[1,0,3],'booths_e'],[8e+108,[2,0,3],'clones_e'],[1.6e+109,[3,0,3],'express_e'],[3.2e+109,[4,0,3],'bars_e'],[6.4e+109,[5,0,3],'farms_e'],[1.28e+11,[6,0,3],'mines_e'],[2.56e+11,[7,0,3],'parks_e'],[5.12e+11,[8,0,3],'werewolf_e'],[1e+111,[9,0,3],'lasers_e'],[1e+113,[10,0,9],'global_e'],[1.25e+113,[0,0,3],'shoes_f'],[1.5e+113,[1,0,3],'booths_f'],[1.75e+113,[2,0,3],'clones_f'],[2e+113,[3,0,3],'express_f'],[2.25e+113,[4,0,3],'bars_f'],[2.5e+113,[5,0,3],'farms_f'],[2.75e+113,[6,0,3],'mines_f'],[3e+113,[7,0,3],'parks_f'],[3.5e+113,[8,0,3],'werewolf_f'],[4e+113,[9,0,3],'lasers_f'],[5e+113,[10,0,9],'global_f'],[1e+114,[0,0,11],'shoes_g'],[1e+115,[1,0,11],'booths_g'],[1e+116,[2,0,11],'clones_g'],[1e+117,[3,0,11],'express_g'],[1e+118,[4,0,11],'bars_g'],[1e+119,[5,0,11],'farms_g'],[1e+120,[6,0,11],'mines_g'],[1e+121,[7,0,11],'parks_g'],[1e+122,[8,0,11],'werewolf_g'],[1e+123,[9,0,11],'lasers_g'],[1e+124,[10,0,15],'global_g'],[1e+126,[0,0,3],'shoes_h'],[7e+126,[1,0,3],'booths_h'],[2.9e+127,[2,0,3],'clones_h'],[6.6e+127,[3,0,3],'express_h'],[1.29e+128,[4,0,3],'bars_h'],[2.33e+128,[5,0,3],'farms_h'],[5.55e+128,[6,0,3],'mines_h'],[9e+128,[7,0,3],'parks_h'],[3e+129,[8,0,3],'werewolf_h'],[2e+130,[9,0,3],'lasers_h'],[1.11e+131,[10,0,9],'global_h'],[1e+135,[10,0,9],'global_new_4'],[1e+138,[0,0,3],'shoes_i'],[2e+138,[1,0,3],'booths_i'],[3e+138,[2,0,3],'clones_i'],[4e+138,[3,0,3],'express_i'],[5e+138,[4,0,3],'bars_i'],[6e+138,[5,0,3],'farms_i'],[7e+138,[6,0,3],'mines_i'],[8e+138,[7,0,3],'parks_i'],[9e+138,[8,0,3],'werewolf_i'],[1e+139,[9,0,3],'lasers_i'],[1e+140,[10,0,9],'global_i'],[1e+141,[0,0,3],'shoes_j'],[3e+141,[1,0,3],'booths_j'],[7e+141,[2,0,3],'clones_j'],[2.5e+142,[3,0,3],'express_j'],[7.5e+142,[4,0,3],'bars_j'],[1.51e+143,[5,0,3],'farms_j'],[4e+143,[6,0,3],'mines_j'],[6e+143,[7,0,3],'parks_j'],[9e+143,[8,0,3],'werewolf_j'],[2e+144,[9,0,3],'lasers_j'],[6e+144,[10,0,9],'global_j'],[1.9e+145,[0,0,3],'shoes_k'],[6.6e+145,[1,0,3],'booths_k'],[1.23e+146,[2,0,3],'clones_k'],[2.99e+146,[3,0,3],'express_k'],[6.67e+146,[4,0,3],'bars_k'],[9.01e+146,[5,0,3],'farms_k'],[2e+147,[6,0,3],'mines_k'],[5.3e+148,[7,0,3],'parks_k'],[2e+149,[8,0,3],'werewolf_k'],[5e+149,[9,0,3],'lasers_k'],[1e+150,[10,0,9],'global_k'],[1e+156,[0,0,3],'shoes_l'],[2e+156,[1,0,3],'booths_l'],[4e+156,[2,0,3],'clones_l'],[8e+156,[3,0,3],'express_l'],[1.6e+157,[4,0,3],'bars_l'],[3.2e+157,[5,0,3],'farms_l'],[6.4e+157,[6,0,3],'mines_l'],[1.28e+158,[7,0,3],'parks_l'],[2.56e+158,[8,0,3],'werewolf_l'],[5.12e+158,[9,0,3],'lasers_l'],[1e+159,[10,0,9],'global_l'],[2e+162,[0,0,5],'shoes_m'],[5e+162,[1,0,5],'booths_m'],[1.1e+163,[2,0,5],'clones_m'],[2.3e+163,[3,0,5],'express_m'],[4.7e+163,[4,0,5],'bars_m'],[9.5e+163,[5,0,5],'farms_m'],[1.91e+164,[6,0,5],'mines_m'],[3.83e+164,[7,0,5],'parks_m'],[7.67e+164,[8,0,5],'werewolf_m'],[5e+165,[9,0,5],'lasers_m'],[1.25e+167,[10,0,9],'global_m'],[1e+168,[10,0,9],'global_new_2'],[1e+171,[0,0,3],'shoes_n'],[1.4e+172,[1,0,3],'booths_n'],[1.14e+173,[2,0,3],'clones_n'],[2.34e+173,[3,0,3],'express_n'],[4.44e+173,[4,0,3],'bars_n'],[8.88e+173,[5,0,3],'farms_n'],[2.3e+175,[6,0,3],'mines_n'],[9.9e+175,[7,0,3],'parks_n'],[4.23e+176,[8,0,3],'werewolf_n'],[5.67e+176,[9,0,3],'lasers_n'],[8.99e+176,[10,0,9],'global_n'],[1e+180,[0,0,3],'shoes_o'],[3e+180,[1,0,3],'booths_o'],[9e+180,[2,0,3],'clones_o'],[2.7e+181,[3,0,3],'express_o'],[8.1e+181,[4,0,3],'bars_o'],[2.34e+182,[5,0,3],'farms_o'],[3.56e+182,[6,0,3],'mines_o'],[4.32e+182,[7,0,3],'parks_o'],[5.67e+182,[8,0,3],'werewolf_o'],[8.36e+182,[9,0,3],'lasers_o'],[1e+183,[10,0,9],'global_o'],[1e+187,[0,0,15],'shoes_p'],[1e+188,[1,0,15],'booths_p'],[1e+189,[2,0,15],'clones_p'],[1e+190,[3,0,15],'express_p'],[1e+191,[4,0,15],'bars_p'],[1e+192,[5,0,15],'farms_p'],[1e+193,[6,0,15],'mines_p'],[1e+194,[7,0,15],'parks_p'],[1e+195,[8,0,15],'werewolf_p'],[1e+196,[9,0,15],'lasers_p'],[1e+197,[10,0,999],'global_p']];
    WorldFactory.statics.moon.angelUpgrades = [[11111,[10,0,3],'angel_sac_1'],[222222,[0,0,3],'angel_shoe_1'],[3333333,[1,0,3],'angel_booth_1'],[4444444,[2,0,3],'angel_clone_1'],[55555555,[3,0,3],'angel_express_1'],[666666666,[4,0,3],'angel_bar_1'],[7777777777,[5,0,3],'angel_farm_1'],[88888888888,[6,0,3],'angel_mine_1'],[9.99999999999e+11,[7,0,3],'angel_park_1'],[1.0101010101e+12,[8,0,3],'angel_wolf_1'],[1.11111111111e+13,[9,0,3],'angel_laser_1'],[1.23e+14,[10,0,3],'angel_sac_2'],[5e+19,[1,0,10],'swap_booth_1'],[5e+19,[3,0,10],'swap_express_1'],[5e+19,[5,0,10],'swap_farm_1'],[5e+19,[7,0,10],'swap_park_1'],[5e+19,[9,0,10],'swap_laser_1'],[1e+21,[0,0,3],'angel_shoe_2'],[9e+21,[1,0,3],'angel_booth_2'],[2.7e+22,[2,0,3],'angel_clone_2'],[9.9e+22,[3,0,3],'angel_express_2'],[1.8e+23,[4,0,3],'angel_bar_2'],[2.22e+23,[5,0,3],'angel_farm_2'],[3.43e+23,[6,0,3],'angel_mine_2'],[4.77e+23,[7,0,3],'angel_park_2'],[5.69e+23,[8,0,3],'angel_wolf_2'],[7.89e+23,[9,0,3],'angel_laser_2'],[1e+24,[10,0,3],'angel_sac_4'],[2.5e+28,[1,0,10],'swap_booth_2'],[2.5e+28,[3,0,10],'swap_express_2'],[2.5e+28,[5,0,10],'swap_farm_2'],[2.5e+28,[7,0,10],'swap_park_2'],[2.5e+28,[9,0,10],'swap_laser_2'],[1e+30,[0,0,3],'angel_shoe_3'],[1.4e+31,[1,0,3],'angel_booth_3'],[5.5e+31,[2,0,3],'angel_clone_3'],[1e+32,[3,0,3],'angel_express_3'],[1.89e+32,[4,0,3],'angel_bar_3'],[2.67e+32,[5,0,3],'angel_farm_3'],[4.04e+32,[6,0,3],'angel_mine_3'],[6.91e+32,[7,0,3],'angel_park_3'],[7.77e+32,[8,0,3],'angel_wolf_3'],[9.1e+32,[9,0,3],'angel_laser_3'],[2e+33,[10,0,3],'angel_sac_5'],[1e+35,[1,0,10],'swap_booth_3'],[1e+35,[3,0,10],'swap_express_3'],[1e+35,[5,0,10],'swap_farm_3'],[1e+35,[7,0,10],'swap_park_3'],[1e+35,[9,0,10],'swap_laser_3'],[5e+36,[0,0,3],'angel_shoe_4'],[1.9e+37,[1,0,3],'angel_booth_4'],[8.8e+37,[2,0,3],'angel_clone_4'],[1.44e+38,[3,0,3],'angel_express_4'],[2.01e+38,[4,0,3],'angel_bar_4'],[3.33e+38,[5,0,3],'angel_farm_4'],[4e+38,[6,0,3],'angel_mine_4'],[5.88e+38,[7,0,3],'angel_park_4'],[7.01e+38,[8,0,3],'angel_wolf_4'],[9.11e+38,[9,0,3],'angel_laser_4'],[5e+40,[10,0,9],'angel_sac_6'],[5e+42,[1,0,10],'swap_booth_4'],[5e+42,[3,0,10],'swap_express_4'],[5e+42,[5,0,10],'swap_farm_4'],[5e+42,[7,0,10],'swap_park_4'],[5e+42,[9,0,10],'swap_laser_4'],[3e+45,[0,0,5],'angel_shoe_5'],[6e+45,[1,0,5],'angel_booth_5'],[1.2e+46,[2,0,5],'angel_clone_5'],[2.4e+46,[3,0,5],'angel_express_5'],[4.8e+46,[4,0,5],'angel_bar_5'],[9.6e+46,[5,0,5],'angel_farm_5'],[1.92e+47,[6,0,5],'angel_mine_5'],[3.84e+47,[7,0,5],'angel_park_5'],[7.68e+47,[8,0,5],'angel_wolf_5'],[1.4e+49,[9,0,5],'angel_laser_5'],[5e+50,[10,0,9],'angel_sac_new_1'],[1e+53,[10,0,9],'angel_sac_7'],[5e+54,[0,0,50],'swap_shoe_a'],[5e+54,[1,0,50],'swap_booth_a'],[5e+54,[2,0,50],'swap_clone_a'],[5e+54,[3,0,50],'swap_express_a'],[5e+54,[4,0,50],'swap_bars_a'],[5e+54,[5,0,50],'swap_farm_a'],[5e+54,[6,0,50],'swap_mine_a'],[5e+54,[7,0,50],'swap_park_a'],[5e+54,[7,0,50],'swap_wolf_a'],[5e+54,[9,0,50],'swap_laser_a'],[1e+56,[0,0,3],'angel_shoe_a'],[2e+56,[1,0,3],'angel_booth_a'],[3e+56,[2,0,3],'angel_clone_a'],[4e+56,[3,0,3],'angel_express_a'],[5e+56,[4,0,3],'angel_bar_a'],[6e+56,[5,0,3],'angel_farm_a'],[7e+56,[6,0,3],'angel_mine_a'],[8e+56,[7,0,3],'angel_park_a'],[9e+56,[8,0,3],'angel_wolf_a'],[1e+57,[9,0,3],'angel_laser_a'],[3.16e+59,[10,0,3],'angel_sac_a'],[1e+60,[10,0,9],'angel_sac_new_2'],[1e+65,[0,0,75],'swap_shoe_b'],[1e+65,[1,0,75],'swap_booth_b'],[1e+65,[2,0,75],'swap_clone_b'],[1e+65,[3,0,75],'swap_express_b'],[1e+65,[4,0,75],'swap_bars_b'],[1e+65,[5,0,75],'swap_farm_b'],[1e+65,[6,0,75],'swap_mine_b'],[1e+65,[7,0,75],'swap_park_b'],[1e+65,[8,0,75],'swap_wolf_b'],[1e+65,[9,0,75],'swap_laser_b'],[1e+66,[10,0,3],'angel_sac_new_3'],[1e+69,[0,0,3],'angel_shoe_b'],[2e+69,[1,0,3],'angel_booth_b'],[4e+69,[2,0,3],'angel_clone_b'],[8e+69,[3,0,3],'angel_express_b'],[1.6e+7,[4,0,3],'angel_bar_b'],[3.2e+7,[5,0,3],'angel_farm_b'],[6.4e+7,[6,0,3],'angel_mine_b'],[1.28e+71,[7,0,3],'angel_park_b'],[2.56e+71,[8,0,3],'angel_wolf_b'],[5.12e+71,[9,0,3],'angel_laser_b'],[1e+72,[10,0,9],'angel_sac_b'],[5e+75,[1,0,50],'swap_booth_c'],[5e+75,[3,0,50],'swap_express_c'],[5e+75,[4,0,100],'swap_bars_c'],[5e+75,[6,0,100],'swap_mine_c'],[5e+75,[9,0,25],'swap_laser_c'],[1e+77,[0,0,7],'angel_shoe_c'],[2e+77,[1,0,7],'angel_booth_c'],[4e+77,[2,0,7],'angel_clone_c'],[8e+77,[3,0,7],'angel_express_c'],[1.6e+79,[4,0,7],'angel_bar_c'],[3.2e+79,[5,0,7],'angel_farm_c'],[6.4e+79,[6,0,7],'angel_mine_c'],[1.28e+8,[7,0,7],'angel_park_c'],[2.56e+8,[8,0,7],'angel_wolf_c'],[5.12e+8,[9,0,7],'angel_laser_c'],[1e+81,[10,0,7],'angel_sac_c'],[1e+86,[3,0,100],'swap_express_d'],[2e+86,[4,0,200],'swap_bars_d'],[3e+86,[6,0,300],'swap_mine_d'],[1e+87,[0,0,3],'angel_shoe_d'],[9e+87,[1,0,3],'angel_booth_d'],[1.8e+88,[2,0,3],'angel_clone_d'],[2.7e+88,[3,0,3],'angel_express_d'],[3.6e+88,[4,0,3],'angel_bar_d'],[4.5e+88,[5,0,3],'angel_farm_d'],[5.4e+88,[6,0,3],'angel_mine_d'],[6.3e+88,[7,0,3],'angel_park_d'],[7.2e+88,[8,0,3],'angel_wolf_d'],[8.1e+88,[9,0,3],'angel_laser_d'],[1e+90,[10,0,5],'angel_sac_d']];
    WorldFactory.statics.moon.managerUpgrades = [[[1e+100,false]],[[1e+100,false]],[[1e+100,false]],[[1e+100,false]],[[1e+100,false]],[[1e+100,false]],[[1e+100,false]],[[1e+100,false]],[[1e+100,false]],[[1e+100,false]]];
    WorldFactory.statics.mars = {};
    WorldFactory.statics.mars.angelScale = 300;
    WorldFactory.statics.mars.investments = [
      {baseCost: 0.05, basePower: 1.01, baseProfit: 0.011, baseSpeed: 0.5, name: 'Red Dirt', id: 'reddirt'},
      {baseCost: 1, basePower: 1.03, baseProfit: 1, baseSpeed: 3, name: 'Marsies', id: 'marsies'},
      {baseCost: 1234, basePower: 1.05, baseProfit: 4321, baseSpeed: 9, name: 'Men', id: 'men'},
      {baseCost: 23000000, basePower: 1.07, baseProfit: 4007310, baseSpeed: 32, name: 'Buggles', id: 'buggles'},
      {baseCost: 49000000000, basePower: 1.11, baseProfit: 518783295, baseSpeed: 64, name: 'Heck Portal', id: 'portals'},
      {baseCost: 7.7e+13, basePower: 1.04, baseProfit: 500634321, baseSpeed: 4, name: 'Ambassadors', id: 'ambassadors'},
      {baseCost: 5e+15, basePower: 1.07, baseProfit: 7543177325, baseSpeed: 18, name: 'Brain-cation', id: 'braincations'},
      {baseCost: 1e+18, basePower: 1.09, baseProfit: 69263532485, baseSpeed: 42, name: 'LiFE Pod', id: 'lifepod'},
      {baseCost: 1.3e+25, basePower: 1.25, baseProfit: 9.97602739165e+16, baseSpeed: 43200, name: 'Terrorformer', id: 'terriformer'}
    ];
    WorldFactory.statics.mars.isEvent = false;
    WorldFactory.statics.mars.unlocks = [];
    WorldFactory.statics.mars.unlocks.push([[200,[0,0,3]],[400,[0,0,3]],[600,[0,0,3]],[800,[0,0,3]],[1000,[0,1,2]],[1200,[0,0,3]],[1400,[0,0,3]],[1600,[0,0,3]],[1800,[0,0,3]],[2000,[0,1,2]],[2200,[0,0,3]],[2400,[0,0,3]],[2600,[0,0,3]],[2800,[0,0,3]],[3000,[0,1,2]],[3200,[0,0,3]],[3400,[0,0,3]],[3600,[0,0,3]],[3800,[0,0,3]],[4000,[0,0,3]],[4300,[0,0,3]],[4600,[0,0,3]],[4900,[0,0,3]],[5200,[0,0,3]],[5500,[0,0,3]],[5800,[0,0,3]],[6100,[0,0,3]],[6400,[0,0,3]],[6700,[0,0,3]],[7000,[0,1,2]],[7300,[0,0,3]],[7600,[0,0,3]],[7900,[0,0,3]],[8200,[0,0,3]],[8500,[0,1,2]],[8800,[0,0,3]],[9100,[0,0,3]],[9400,[0,0,3]],[9700,[0,0,3]],[10000,[0,0,3]],[10500,[0,0,3]],[11000,[0,0,3]],[11500,[0,0,3]],[12000,[0,0,3]],[12500,[0,0,3]],[13000,[0,0,13]],[13500,[0,0,3]],[14000,[0,0,3]],[14500,[0,0,3]],[15000,[0,0,3]],[15500,[0,0,3]],[16000,[0,0,3]],[16500,[0,0,3]],[17000,[0,0,3]],[17500,[0,0,3]],[18000,[0,0,3]],[18500,[0,0,3]],[19000,[0,0,3]],[19500,[0,0,3]],[20000,[0,0,3]],[20500,[0,0,3]],[21500,[0,0,3]],[22000,[0,0,3]],[22500,[0,0,3]],[23000,[0,0,3]],[23500,[0,0,3]],[24000,[0,0,3]],[24500,[0,0,3]],[25000,[0,0,3]],[25500,[0,0,3]],[26000,[0,0,3]],[26500,[0,0,3]],[27000,[0,0,3]],[27500,[0,0,3]],[28000,[0,0,3]],[28500,[0,0,3]],[29000,[0,0,3]],[29500,[0,0,3]],[30000,[0,0,3]],[30500,[0,0,3]],[31000,[0,0,3]],[31500,[0,0,3]],[32000,[0,0,3]],[32500,[0,0,3]],[33000,[0,0,3]],[33500,[0,0,3]],[34000,[0,0,3]],[34500,[0,0,3]],[35000,[0,0,3]],[35500,[0,0,3]],[36000,[0,0,3]],[36500,[0,0,3]],[37000,[0,0,3]],[37500,[0,0,3]],[38000,[0,0,3]],[38500,[0,0,3]],[39000,[0,0,3]],[39500,[0,0,3]],[40000,[0,0,3]],[40500,[0,0,3]],[41000,[0,0,3]],[41500,[0,0,3]],[42000,[0,0,3]],[42500,[0,0,3]],[43000,[0,0,3]],[43500,[0,0,3]],[44000,[0,0,3]],[44500,[0,0,3]],[45000,[0,0,3]],[45500,[0,0,3]],[46000,[0,0,3]],[46500,[0,0,3]],[47000,[0,0,3]],[47500,[0,0,3]],[48000,[0,0,3]],[48500,[0,0,3]],[49000,[0,0,3]],[49500,[0,0,3]],[50000,[0,0,3]],[50500,[0,0,3]],[51000,[0,0,3]],[51500,[0,0,3]],[52000,[0,0,3]],[52500,[0,0,3]],[53000,[0,0,3]],[53500,[0,0,3]],[54000,[0,0,3]],[54500,[0,0,3]],[55000,[0,0,3]],[55555,[0,0,5]],[56000,[0,0,3]]]);
    WorldFactory.statics.mars.unlocks.push([[75,[1,0,3.33]],[150,[1,0,3.33]],[225,[1,0,3.33]],[300,[1,1,2]],[375,[1,0,3.33]],[450,[1,0,3.33]],[525,[1,0,3.33]],[600,[1,1,2]],[675,[1,0,3.33]],[750,[1,0,3.33]],[825,[1,0,3.33]],[900,[1,1,2]],[975,[1,0,3.33]],[1050,[1,0,3.33]],[1125,[1,0,3.33]],[1200,[1,1,2]],[1275,[1,0,3.33]],[1350,[1,0,3.33]],[1425,[1,0,3.33]],[1500,[1,1,2]],[1575,[1,0,3.33]],[1650,[1,0,3.33]],[1725,[1,0,3.33]],[1800,[1,1,2]],[1875,[1,0,3.33]],[1950,[1,0,3.33]],[2025,[1,0,3.33]],[2100,[1,0,3.33]],[2275,[1,0,3.33]],[2450,[1,0,3.33]],[2625,[1,0,3.33]],[2800,[1,0,3.33]],[2975,[1,0,3.33]],[3150,[1,0,3.33]],[3325,[1,0,3.33]],[3500,[1,0,3.33]],[3675,[1,0,3.33]],[3850,[1,0,3.33]],[4025,[1,0,3.33]],[4200,[1,0,3.33]],[4375,[1,0,3.33]],[4550,[1,0,3.33]],[4725,[1,0,3.33]],[4900,[1,0,3.33]],[5075,[1,0,3.33]],[5250,[1,0,3.33]],[5425,[1,0,3.33]],[5600,[1,0,3.33]],[5775,[1,0,3.33]],[5950,[1,0,3.33]],[6125,[1,0,3.33]],[6300,[1,0,3.33]],[6475,[1,0,3.33]],[6650,[1,0,3.33]],[6825,[1,0,3.33]],[7000,[1,0,3.33]],[7175,[1,0,3.33]],[7350,[1,0,3.33]],[7525,[1,0,3.33]],[7700,[1,0,3.33]],[7875,[1,0,3.33]],[8050,[1,0,3.33]],[8225,[1,0,3.33]],[8400,[1,0,3.33]],[8575,[1,0,3.33]],[8750,[1,0,3.33]],[8925,[1,0,3.33]],[9100,[1,0,3.33]],[9275,[1,0,3.33]],[9450,[1,0,3.33]],[9625,[1,0,3.33]],[9800,[1,0,3.33]],[9975,[1,0,3.33]],[10150,[1,0,3.33]],[10325,[1,0,3.33]],[10500,[1,0,3.33]],[10675,[1,0,3.33]],[10850,[1,0,3.33]],[11025,[1,0,3.33]],[11200,[1,0,3.33]],[11375,[1,0,3.33]],[11550,[1,0,3.33]],[11725,[1,0,3.33]],[11900,[1,0,3.33]],[12075,[1,0,3.33]],[12250,[1,0,3.33]],[12425,[1,0,3.33]],[12600,[1,0,3.33]],[12775,[1,0,3.33]],[12950,[1,0,3.33]],[13125,[1,0,3.33]],[13300,[1,0,3.33]],[13475,[1,0,3.33]],[13650,[1,0,3.33]],[13825,[1,0,3.33]],[14000,[1,0,3.33]],[14175,[1,0,3.33]],[14350,[1,0,3.33]],[14525,[1,0,3.33]],[14700,[1,0,3.33]],[14875,[1,0,3.33]],[15050,[1,0,3.33]],[15225,[1,0,3.33]],[15400,[1,0,3.33]],[15575,[1,0,3.33]],[15750,[1,0,3.33]],[15925,[1,0,3.33]],[16100,[1,0,3.33]],[16275,[1,0,3.33]],[16450,[1,0,3.33]],[16625,[1,0,3.33]],[16800,[1,0,3.33]],[16975,[1,0,3.33]],[17150,[1,0,3.33]],[17325,[1,0,3.33]],[17500,[1,0,3.33]]]);
    WorldFactory.statics.mars.unlocks.push([[100,[2,0,5]],[200,[2,0,5]],[300,[2,0,5]],[400,[2,0,5]],[500,[2,1,2]],[600,[2,0,6]],[700,[2,0,9]],[800,[2,0,9]],[900,[2,0,9]],[1000,[2,1,2]],[1100,[2,0,9]],[1200,[2,0,9]],[1300,[2,0,9]],[1400,[2,0,9]],[1500,[2,0,9]],[1600,[2,0,9]],[1700,[2,0,9]],[1800,[2,0,9]],[1900,[2,0,9]],[2000,[2,0,9]],[2200,[2,0,9]],[2400,[2,0,9]],[2600,[2,0,9]],[2800,[2,0,9]],[3000,[2,0,9]],[3200,[2,0,9]],[3400,[2,0,9]],[3600,[2,0,9]],[3800,[2,0,9]],[4000,[2,0,9]],[4200,[2,0,9]],[4400,[2,0,9]],[4600,[2,0,9]],[4800,[2,0,9]],[5000,[2,0,999]],[5200,[2,0,9]],[5400,[2,0,9]],[5600,[2,0,9]],[5800,[2,0,9]],[6000,[2,0,9]],[6200,[2,0,9]],[6400,[2,0,9]],[6600,[2,0,9]],[6800,[2,0,9]],[7000,[2,0,9]],[7200,[2,0,9]],[7400,[2,0,9]],[7600,[2,0,9]],[7800,[2,0,9]],[8000,[2,0,9]],[8200,[2,0,9]],[8400,[2,0,9]],[8600,[2,0,9]],[8800,[2,0,9]],[9000,[2,0,9]],[9200,[2,0,9]],[9400,[2,0,9]],[9600,[2,0,9]],[9800,[2,0,9]],[10000,[2,0,9]],[10200,[2,0,9]],[10400,[2,0,9]],[10600,[2,0,9]],[10800,[2,0,9]],[11000,[2,0,9]],[11200,[2,0,9]],[11400,[2,0,9]],[11600,[2,0,9]],[11800,[2,0,9]],[12000,[2,0,9]]]);
    WorldFactory.statics.mars.unlocks.push([[10,[3,0,2]],[20,[3,0,2]],[40,[3,0,2]],[80,[3,0,2]],[100,[3,1,2]],[150,[3,0,2]],[200,[3,0,2]],[250,[3,0,2]],[300,[3,1,2]],[350,[3,0,2]],[400,[3,0,2]],[450,[3,0,2]],[500,[3,1,2]],[600,[3,0,2]],[700,[3,0,2]],[777,[3,0,77777]],[800,[3,0,2]],[900,[3,0,2]],[1000,[3,0,77]],[1100,[3,0,5]],[1200,[3,0,5]],[1300,[3,0,5]],[1400,[3,0,5]],[1500,[3,1,2]],[1600,[3,0,5]],[1700,[3,0,5]],[1800,[3,0,5]],[1900,[3,0,5]],[2000,[3,0,5]],[2100,[3,0,5]],[2200,[3,0,5]],[2300,[3,0,5]],[2400,[3,0,5]],[2500,[3,1,2]],[2600,[3,0,5]],[2700,[3,0,5]],[2800,[3,0,5]],[2900,[3,0,5]],[3000,[3,0,5]],[3100,[3,0,5]],[3200,[3,0,5]],[3300,[3,0,5]],[3400,[3,0,5]],[3500,[3,0,5]],[3600,[3,0,5]],[3700,[3,0,5]],[3800,[3,0,5]],[3900,[3,0,5]],[4000,[3,0,5]],[4100,[3,0,5]],[4200,[3,0,5]],[4300,[3,0,5]],[4400,[3,0,5]],[4500,[3,0,5]],[4600,[3,0,5]],[4700,[3,0,5]],[4800,[3,0,5]],[4900,[3,0,5]],[5000,[3,0,5]],[5100,[3,0,5]],[5200,[3,0,5]],[5300,[3,0,5]],[5400,[3,0,5]],[5500,[3,0,5]],[5600,[3,0,5]],[5700,[3,0,5]],[5800,[3,0,5]],[5900,[3,0,5]],[6000,[3,0,5]],[6100,[3,0,5]],[6200,[3,0,5]],[6300,[3,0,5]],[6400,[3,0,5]],[6500,[3,0,5]],[6600,[3,0,5]],[6700,[3,0,5]],[6800,[3,0,5]],[6900,[3,0,5]],[7000,[3,0,5]],[7100,[3,0,5]],[7200,[3,0,5]],[7300,[3,0,5]],[7400,[3,0,5]],[7500,[3,0,5]],[7600,[3,0,5]],[7700,[3,0,5]],[7800,[3,0,5]],[7900,[3,0,5]],[8000,[3,0,5]]]);
    WorldFactory.statics.mars.unlocks.push([[25,[4,0,7]],[50,[4,0,7]],[100,[4,0,7]],[200,[4,0,7]],[300,[4,1,2]],[400,[4,0,7]],[500,[4,0,7]],[600,[4,0,7]],[666,[4,0,666]],[800,[4,0,666]],[900,[4,0,666]],[1000,[4,0,666]],[1250,[4,0,666]],[1500,[4,0,666]],[1750,[4,0,666]],[2000,[4,0,666]],[2250,[4,0,666]],[2500,[4,0,666]],[2750,[4,0,666]],[3000,[4,0,666]],[3250,[4,0,666]],[3500,[4,0,666]],[3725,[4,0,666]],[4000,[4,0,666]],[4250,[4,0,666]],[4500,[4,0,666]],[4750,[4,0,666]],[5000,[4,0,666]]]);
    WorldFactory.statics.mars.unlocks.push([[10,[5,0,6]],[50,[5,0,6]],[100,[5,0,6]],[200,[5,0,6]],[400,[5,0,6]],[600,[5,0,6]],[800,[5,0,6]],[1000,[5,1,2]],[1200,[5,0,6]],[1400,[5,0,6]],[1600,[5,0,6]],[1800,[5,0,6]],[2000,[5,0,6]],[2200,[5,0,6]],[2400,[5,0,6]],[2600,[5,0,6]],[2800,[5,0,6]],[3000,[5,0,6]],[3200,[5,0,6]],[3400,[5,0,6]],[3600,[5,0,6]],[3800,[5,0,6]],[4000,[5,0,6]],[4200,[5,0,6]],[4400,[5,0,6]],[4600,[5,0,6]],[4800,[5,0,6]],[5000,[5,0,6]],[5200,[5,0,6]],[5400,[5,0,6]],[5600,[5,0,6]],[5800,[5,0,6]],[6000,[5,0,6]],[6200,[5,0,6]],[6400,[5,0,6]],[6600,[5,0,6]],[6800,[5,0,6]],[7000,[5,0,6]],[7200,[5,0,6]],[7400,[5,0,6]],[7600,[5,0,6]],[7800,[5,0,6]],[8000,[5,0,6]],[8200,[5,0,6]],[8400,[5,0,6]],[8600,[5,0,6]],[8800,[5,0,6]],[9000,[5,0,6]],[9200,[5,0,6]],[9400,[5,0,6]],[9600,[5,0,6]],[9800,[5,0,6]],[10000,[5,0,6]],[10200,[5,0,6]],[10400,[5,0,6]],[10600,[5,0,6]],[10800,[5,0,6]],[11000,[5,0,6]],[11200,[5,0,6]],[11400,[5,0,6]],[11600,[5,0,6]],[11800,[5,0,6]],[12000,[5,0,6]],[12200,[5,0,6]],[12400,[5,0,6]],[12600,[5,0,6]],[12800,[5,0,6]],[13000,[5,0,6]],[13200,[5,0,6]],[13400,[5,0,6]],[13600,[5,0,6]],[13800,[5,0,6]],[14000,[5,0,6]]]);
    WorldFactory.statics.mars.unlocks.push([[25,[6,0,3]],[50,[6,0,3]],[75,[6,0,3]],[100,[6,0,3]],[150,[6,0,3]],[200,[6,0,3]],[250,[6,0,3]],[300,[6,0,3]],[350,[6,0,3]],[400,[6,0,3]],[450,[6,0,3]],[500,[6,1,2]],[550,[6,0,3]],[600,[6,0,3]],[650,[6,0,3]],[700,[6,0,3]],[750,[6,0,7]],[800,[6,0,3]],[850,[6,0,3]],[900,[6,0,3]],[950,[6,0,3]],[1000,[6,0,8]],[1150,[6,0,8]],[1300,[6,0,8]],[1450,[6,0,8]],[1600,[6,0,8]],[1750,[6,0,8]],[1900,[6,0,8]],[2050,[6,0,8]],[2200,[6,0,8]],[2350,[6,0,8]],[2500,[6,0,8]],[2650,[6,0,8]],[2800,[6,0,8]],[2950,[6,0,8]],[3100,[6,0,8]],[3250,[6,0,8]],[3400,[6,0,8]],[3550,[6,0,8]],[3700,[6,0,8]],[3850,[6,0,8]],[4000,[6,0,8]],[4150,[6,0,8]],[4300,[6,0,8]],[4450,[6,0,8]],[4600,[6,0,8]],[4750,[6,0,8]],[4900,[6,0,8]],[5050,[6,0,8]],[5200,[6,0,8]],[5350,[6,0,8]],[5500,[6,0,8]],[5650,[6,0,8]],[5800,[6,0,8]],[5950,[6,0,8]],[6100,[6,0,8]],[6250,[6,0,8]],[6400,[6,0,8]],[6550,[6,0,8]],[6700,[6,0,8]],[6850,[6,0,8]],[7000,[6,0,8]],[7150,[6,0,8]],[7300,[6,0,8]],[7450,[6,0,8]],[7600,[6,0,8]]]);
    WorldFactory.statics.mars.unlocks.push([[100,[7,0,15]],[200,[7,0,15]],[300,[7,0,15]],[400,[7,0,15]],[500,[7,1,2]],[700,[7,0,50]],[900,[7,0,50]],[1100,[7,0,50]],[1300,[7,0,50]],[1500,[7,0,5050]],[1700,[7,0,50]],[1900,[7,0,50]],[2100,[7,0,50]],[2300,[7,0,50]],[2500,[7,0,50]],[2700,[7,0,50]],[2900,[7,0,50]],[3100,[7,0,50]],[3300,[7,0,50]],[3500,[7,0,50]],[3700,[7,0,50]],[3900,[7,0,50]],[4100,[7,0,50]],[4300,[7,0,50]],[4500,[7,0,50]],[4700,[7,0,50]],[4900,[7,0,50]],[5100,[7,0,50]],[5300,[7,0,50]],[5500,[7,0,50]],[5700,[7,0,50]],[5900,[7,0,50]],[6000,[7,0,50]]]);
    WorldFactory.statics.mars.unlocks.push([[33,[8,0,333]],[66,[8,0,333]],[99,[8,0,333]],[222,[8,0,333]],[333,[8,0,333]],[444,[8,0,333]],[555,[8,0,333]],[666,[8,0,333]],[777,[8,0,333]],[888,[8,0,333]],[999,[8,0,333]],[1111,[8,0,333]],[2222,[8,0,333]]]);
    WorldFactory.statics.mars.unlocks.push([[1,[9,1,2]],[50,[9,1,2]],[100,[9,1,2]],[200,[9,1,2]],[300,[9,1,2]],[400,[9,1,2]],[500,[9,1,2]],[600,[9,1,2]],[700,[9,1,2]],[800,[9,1,2]],[900,[9,1,2]],[1000,[9,1,2]],[1200,[9,1,2]],[1400,[9,1,2]],[1600,[9,1,2]],[1800,[9,1,2]],[2000,[9,1,2]],[2500,[9,1,2]]]);
    WorldFactory.statics.mars.cashUpgrades = [[15000000,[0,0,33],'dirt_1'],[500000000,[1,0,33],'fried_1'],[1e+11,[2,0,33],'men_1'],[1.9e+13,[3,0,33],'buggles_1'],[1e+15,[4,0,33],'heck_1'],[1.2e+19,[5,0,33],'ambassador_1'],[9e+21,[6,0,33],'brain_1'],[6e+23,[7,0,33],'pods_1'],[3e+27,[8,0,33],'spiders_1'],[1e+36,[2,0,66],'men_2'],[5e+39,[3,0,66],'buggles_2'],[2.5e+43,[4,0,66],'heck_2'],[1.3e+47,[5,0,66],'ambassador_2'],[3e+50,[6,0,66],'brain_2'],[6e+52,[7,0,66],'pods_2'],[1e+55,[8,0,66],'spiders_2'],[1e+57,[9,0,33],'mars_global_1'],[1e+60,[0,0,999],'dirt_3'],[7e+62,[1,0,999],'fried_3'],[9e+62,[2,0,99],'men_3'],[1e+63,[3,0,99],'buggles_3'],[5e+66,[4,0,99],'heck_3'],[1.7e+67,[5,0,99],'ambassador_3'],[9.9e+67,[6,0,99],'brain_3'],[2.31e+68,[7,0,99],'pods_3'],[3.33e+68,[8,0,99],'spiders_3'],[5e+71,[9,0,33],'mars_global_2'],[1.23e+74,[0,0,999],'dirt_4'],[2.46e+74,[1,0,999],'fried_4'],[3.69e+74,[3,0,999],'buggles_4'],[2e+75,[5,0,999],'ambassador_4'],[3e+75,[6,0,999],'brain_4'],[1.2e+76,[7,0,999],'pods_4'],[2.3e+76,[8,0,999],'spiders_4'],[1e+78,[9,0,66],'mars_global_3'],[5e+102,[0,0,33],'dirt_5'],[1.25e+104,[1,0,33],'fried_5'],[4.5e+104,[2,0,33],'men_5'],[6.25e+104,[3,0,33],'buggles_5'],[3e+105,[5,0,33],'ambassador_5'],[2.5e+106,[6,0,33],'brain_5'],[1e+107,[7,0,33],'pods_5'],[1e+110,[9,0,33],'mars_global_4'],[1e+111,[0,0,77],'dirt_6'],[4e+111,[1,0,77],'fried_6'],[5.5e+112,[2,0,77],'men_6'],[9e+112,[3,0,77],'buggles_6'],[2.1e+113,[5,0,77],'ambassador_6'],[4.31e+113,[6,0,77],'brain_6'],[7.77e+113,[7,0,77],'pods_6'],[5e+116,[9,0,777],'mars_global_5'],[5e+132,[3,0,33],'buggles_7'],[3.5e+133,[5,0,33],'ambassador_7'],[1.77e+134,[6,0,33],'brain_7'],[5.69e+134,[7,0,33],'pods_7'],[7.14e+134,[0,0,33],'dirt_7'],[9.76e+134,[1,0,33],'fried_7'],[1e+135,[2,0,33],'men_7'],[5e+136,[9,0,33],'mars_global_6'],[1e+144,[0,0,66],'dirt_8'],[2e+144,[1,0,66],'fried_8'],[6e+144,[2,0,66],'men_8'],[9e+144,[3,0,66],'buggles_8'],[4.9e+145,[5,0,66],'ambassador_8'],[3e+146,[6,0,66],'brain_8'],[7e+146,[7,0,66],'pods_8'],[3e+149,[9,0,55],'mars_global_7'],[5e+156,[0,0,99],'dirt_9'],[1.4e+157,[1,0,99],'fried_9'],[6.6e+157,[2,0,99],'men_9'],[8.8e+157,[3,0,99],'buggles_9'],[2.5e+158,[5,0,99],'ambassador_9'],[4.44e+158,[6,0,99],'brain_9'],[6.53e+158,[7,0,99],'pods_9'],[1e+162,[9,0,15],'mars_global_8'],[1e+171,[0,0,77],'dirt_10'],[3e+171,[1,0,77],'fried_10'],[9e+171,[2,0,77],'men_10'],[1.9e+172,[3,0,77],'buggles_10'],[3.6e+172,[5,0,77],'ambassador_10'],[9.9e+172,[6,0,77],'brain_10'],[2.79e+173,[7,0,77],'pods_10'],[4e+173,[9,0,25],'mars_global_9'],[1e+183,[0,0,999],'dirt_11'],[5e+183,[1,0,999],'fried_11'],[8e+183,[2,0,999],'men_11'],[1e+184,[3,0,999],'buggles_11'],[6.6e+184,[5,0,999],'ambassador_11'],[1.53e+185,[6,0,999],'brain_11'],[3.72e+185,[7,0,999],'pods_11'],[5e+185,[8,0,999],'spiders_11'],[6e+201,[0,0,33],'dirt_12'],[2.5e+202,[1,0,33],'fried_12'],[8e+202,[2,0,33],'men_12'],[1.7e+203,[3,0,33],'buggles_12'],[4.39e+203,[5,0,33],'ambassador_12'],[6.5e+203,[6,0,33],'brain_12'],[9e+203,[7,0,33],'pods_12'],[2.5e+205,[8,0,33],'spiders_12'],[2.5e+206,[9,0,9],'mars_global_11'],[1e+213,[0,0,22],'dirt_13'],[1.1e+214,[1,0,22],'fried_13'],[2.22e+215,[3,0,22],'buggles_13'],[3.33e+215,[5,0,22],'ambassador_13'],[4.44e+215,[6,0,22],'brain_13'],[5.55e+215,[7,0,22],'pods_13'],[6.66e+215,[8,0,22],'spiders_13'],[1e+216,[9,0,66],'mars_global_12'],[1e+223,[0,0,44],'dirt_14'],[2e+223,[1,0,44],'fried_14'],[4e+223,[3,0,44],'buggles_14'],[6e+223,[5,0,44],'ambassador_14'],[1.5e+224,[6,0,44],'brain_14'],[3.56e+224,[7,0,44],'pods_14'],[9e+224,[8,0,44],'spiders_14'],[6e+225,[9,0,777],'mars_global_13'],[1e+228,[0,0,999],'dirt_15'],[1e+231,[1,0,999],'fried_15'],[1e+234,[3,0,999],'buggles_15'],[1e+237,[5,0,999],'ambassador_15'],[1e+240,[6,0,999],'brain_15'],[1e+243,[7,0,999],'pods_15'],[1e+246,[8,0,999],'spiders_15']];
    WorldFactory.statics.mars.angelUpgrades = [[1e+11,[9,0,3],'mars_global_angel_1'],[1e+17,[9,0,3],'mars_global_angel_2'],[1e+21,[0,0,5],'dirt_angel_1'],[2e+21,[1,0,5],'fried_angel_1'],[4e+21,[2,0,5],'men_angel_1'],[8e+21,[3,0,5],'buggles_angel_1'],[1.6e+22,[4,0,5],'heck_angel_1'],[3.2e+22,[5,0,5],'ambassador_angel_1'],[6.4e+22,[6,0,5],'brain_angel_1'],[1.28e+23,[7,0,5],'pods_angel_1'],[2.56e+23,[8,0,5],'spiders_angel_1'],[1e+24,[9,0,3],'mars_global_angel_3'],[1e+30,[0,0,7],'dirt_angel_2'],[3e+30,[1,0,7],'fried_angel_2'],[9e+30,[2,0,7],'men_angel_2'],[2.7e+31,[3,0,7],'buggles_angel_2'],[1e+32,[4,0,7],'heck_angel_2'],[2e+32,[5,0,7],'ambassador_angel_2'],[4e+32,[6,0,7],'brain_angel_2'],[6e+32,[7,0,7],'pods_angel_2'],[9e+32,[8,0,7],'spiders_angel_2'],[1e+36,[9,0,5],'mars_global_angel_3'],[1e+42,[9,0,3],'mars_global_angel_4'],[3e+45,[0,0,3],'dirt_angel_3'],[1.2e+46,[1,0,3],'fried_angel_3'],[2.9e+46,[2,0,3],'men_angel_3'],[1.36e+47,[3,0,3],'buggles_angel_3'],[3.11e+47,[4,0,3],'heck_angel_3'],[5.55e+47,[5,0,3],'ambassador_angel_3'],[7.89e+47,[6,0,3],'brain_angel_3'],[2.5e+49,[7,0,3],'pods_angel_3'],[1e+50,[8,0,3],'spiders_angel_3'],[1e+56,[9,0,5],'mars_global_angel_5'],[1e+60,[0,0,5],'dirt_angel_4'],[5e+60,[1,0,5],'fried_angel_4'],[4.5e+61,[2,0,5],'men_angel_4'],[6.6e+61,[3,0,5],'buggles_angel_4'],[9.9e+61,[4,0,5],'heck_angel_4'],[1.75e+62,[5,0,5],'ambassador_angel_4'],[2.8e+62,[6,0,5],'brain_angel_4'],[4.2e+62,[7,0,5],'pods_angel_4'],[7e+62,[8,0,5],'spiders_angel_4'],[5e+63,[9,0,5],'mars_global_angel_6'],[1e+74,[9,0,7],'mars_global_angel_7'],[1e+78,[0,0,9],'dirt_angel_6'],[1e+79,[1,0,9],'fried_angel_6'],[2e+79,[2,0,9],'men_angel_6'],[1e+80,[3,0,9],'buggles_angel_6'],[2e+80,[4,0,9],'heck_angel_6'],[4e+80,[5,0,9],'ambassador_angel_6'],[8e+80,[6,0,9],'brain_angel_6'],[1.6e+82,[7,0,9],'pods_angel_6'],[2.22e+83,[8,0,9],'spiders_angel_6'],[6.66e+83,[9,0,9],'mars_global_angel_8'],[1e+84,[9,0,9],'mars_global_angel_9'],[2e+90,[0,0,15],'dirt_angel_7'],[1.4e+91,[1,0,15],'fried_angel_7'],[5.6e+91,[2,0,15],'men_angel_7'],[1.12e+92,[3,0,15],'buggles_angel_7'],[1.79e+92,[4,0,15],'heck_angel_7'],[2.98e+92,[5,0,15],'ambassador_angel_7'],[4.34e+92,[6,0,15],'brain_angel_7'],[6.2e+92,[7,0,15],'pods_angel_7'],[8.08e+92,[8,0,15],'spiders_angel_7'],[1e+93,[9,0,15],'mars_global_angel_10'],[9e+99,[9,0,9],'mars_global_angel_11'],[4e+105,[0,0,21],'dirt_angel_8'],[6e+105,[1,0,21],'fried_angel_8'],[1.2e+106,[2,0,21],'men_angel_8'],[2.4e+106,[3,0,21],'buggles_angel_8'],[6.9e+106,[4,0,21],'heck_angel_8'],[1.05e+107,[5,0,21],'ambassador_angel_8'],[2.14e+107,[6,0,21],'brain_angel_8'],[3.33e+107,[7,0,21],'pods_angel_8'],[5e+107,[8,0,21],'spiders_angel_8'],[1e+108,[9,0,9],'mars_global_angel_12'],[7.77e+113,[9,0,777],'mars_global_angel_13']];
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

  WorldFactory.upgradeIsAngelic = function(planet, id) {
    for (var i = 0; i < WorldFactory.statics[planet].angelUpgrades.length; i++) {
      if (WorldFactory.statics[planet].angelUpgrades[i][2] === id) {
        return true;
      }
    }
    return false;
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
        $scope.calc($scope.ref);
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
        $scope.calc($scope.ref);
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