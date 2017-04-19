
carbonListApp.factory('Carbon',function ($resource, $cookieStore, $cookies, $firebaseObject, $firebaseAuth, FirebaseAccount) {

  // -------------VARIABLES-------------
  // -------------VARIABLES-------------


  // CARBON PRESENTATION
  var CO2constant =  1;
  var CO2unit = "g";
  var CO2representation = "Koldioxid";

  // LISTS
  var itemList = [];
  var completeList = [];
  var favList = [];

  // USERBASED
  var currentItem;
  var user;



  // -------------SETTERS-------------
  // -------------SETTERS-------------



  this.setCurrentItem = function(itemID) {
    for (i=0; i<(completeList).length; i++) {
      if (completeList[i].id == itemID) {
        currentItem = completeList[i];
      }
    }
    for (i=0; i<(itemList).length; i++) {

      if (itemList[i].id == itemID) {
        currentItem = itemList[i];
      }
    }
    updateCookie_userbased();
  }


  this.setFirebaseUser = function (firebaseUser) {
    if (firebaseUser == null) {
      user = firebaseUser;
    }
    else {
      user = firebaseUser.uid
    }
    updateCookie_userbased();
  }

  this.setCO2values = function(constant, unit, representation) {
    CO2constant = constant;
    CO2unit = unit;
    CO2representation = representation;
  }

  this.setCO2constant = function(CO2value) {
    if (CO2value == "subway") {
      this.setCO2values(0.01282, "km", "Tunnelbana");
    }

    if (CO2value == "tv") {
      this.setCO2values(0.10398, "tim", "Tv-tittande");
    }

    if (CO2value == "laptop") {
      this.setCO2values(0.5, "tim", "Laptopanvändning");

    }

    if (CO2value == "mobile") {
      this.setCO2values(4.23729, "st", "Mobilladdningar");
    }

    if (CO2value == "car") {
      this.setCO2values(0.00578, "km", "Bil");
    }

    if (CO2value == "beer") {
      this.setCO2values(0.00437, "st", "Öl");
    }

    if (CO2value == "co2") {
      this.setCO2values(1, "g", "Koldioxid");
    }
  }


  this.removeItemFromList = function(item, update) {
    for (var k = 0; k < itemList.length; k++) {
      if(itemList[k].name === item.name) {
        itemList.splice(k,1);

        if (!update) {
          updateFirebase_remove(item, "checklist");
        }

      }
    }
  }


  this.emptyChecklist = function() {
    if (itemList.length != 0) {
    itemList = [];
    updateFirebase_clear("checklist");
  }
  }


  this.emptyCompletelist = function() {
    var carbonInfo = this.totalCarbon_completeList();
    if (completeList.length != 0 && !isNaN(carbonInfo[1]) ) {
    updateFirebase_archive(completeList, carbonInfo);

    completeList = [];
    updateFirebase_clear("completelist");
  }
  }


  this.removeItemFromCompleteList = function(item, update) {
    for (var k = 0; k < completeList.length; k++) {
      if(completeList[k].name === item.name) {
        completeList.splice(k,1);

        if (!update) {
          updateFirebase_remove(item, "completelist");
        }

      }
    }
  }


  this.removeItemFromFavouriteList = function(item) {
    for (var k = 0; k < favList.length; k++) {
      if(favList[k].name === item.name) {
        favList.splice(k,1);
        updateFirebase_remove(item, "favouritelist");
      }
    }
  }


  this.undoItem = function(item) {
    this.removeItemFromCompleteList(item, true);
    itemList.push(item);
    updateFirebase_rearrange(item, "completelist", "checklist");
  }


  this.foundItem = function(item) {
    this.removeItemFromList(item, true);
    completeList.push(item);

    updateFirebase_rearrange(item, "checklist", "completelist");
    return true; // KOLLA UPP OM DENNA BEHÖVS, GJ
  }


  this.addOrRemoveItemFromFav = function(item) {
    var inFavList = false;
    for (var k = 0; k < favList.length; k++) {
      if (favList[k].id === item.id) {
        inFavList = true;
      }
    }

    if (inFavList) {
      this.removeItemFromFavouriteList(item);
    }
    else {
      this.updateFavList(item);
    }

    return inFavList;
  }


  this.addItemToFavouriteOrChecklist = function(item, currentPage) {
    var statusCheck;

    if (currentPage == "/search") {
      console.log("currentpage är search :D")
      statusCheck = this.updateList(item);
    }

    if (currentPage == "/favourites") {
      console.log("currentpage är favourites :D")
      statusCheck = this.updateFavList(item);
    }
    return statusCheck;
  }


  // -------------GETTERS-------------
  // -------------GETTERS-------------

  this.updateEditedItemInFirebase = function(fixedData) {

    for (i=0; i<(itemList).length; i++) {
      if ((itemList)[i].id == fixedData.id) {
        this.removeItemFromList(fixedData, true);
        FirebaseAccount.ItemModify(user, fixedData, "checklist"); //FBGJ
        itemList.push(fixedData);
      }
    }

    for (i=0; i<(completeList).length; i++) {
      if ((completeList)[i].id == fixedData.id) {
        this.removeItemFromCompleteList(fixedData, true);
        FirebaseAccount.ItemModify(user, fixedData, "completelist"); //FBGJ
        completeList.push(fixedData);
      }
    }

    this.updateCurrentItem(fixedData);
    // var statusMsg = "Uppdateringen genomförd!"
    //
    // return statusMsg;

  }

  this.updateItemForUser = function(amount, unit, item) {
    var _this = this;
    return _this.APIinfo.get({ingredient:item.id,amount:amount,unit:unit}).$promise.then(function(data) {
      var fixedData = _this.cutNameOfItem(data);

      _this.updateEditedItemInFirebase(fixedData);

    }, function(reason) {
      var updateMissingItem = item;
      updateMissingItem.amount = amount;
      updateMissingItem.unit = unit;


      _this.updateEditedItemInFirebase(updateMissingItem);
    })
  }



  this.getFirebaseUserUID = function () {
    return user;
  }


  this.getCurrentItem = function () {
    return currentItem;
  }

  this.getChartOptions = function () {
    var options = {
      responsive: true,
      cutoutPercentage: 60,

      legend: {
        position: "bottom"

      },

    };
    return options;
  }

  this.getDoughnutChartData = function (type) {
    if (type=="general") {
      var statInfo = this.getStatInfoForCurrentPurchase();
      var list_labels = statInfo[0]; // list with only names.
      var list_data = statInfo[1];
    }

    if (type=="specific") {
      var list_labels = [currentItem.name];
      var list_data = [currentItem.carbon.average, this.getTotalCarbon(currentItem.id)];
    }

    var data = {
      labels: list_labels,
      datasets: [
        {
          data: list_data,
          backgroundColor: [
            "#9BD270",
            "#006400"
          ],
        }],
      };

      return data;
    }


    this.getLineChartData = function (userData) {
      var days = [];
      var totalCO2 = [];
      var avgCO2 = [];

      for (list in userData) {
        if (userData[list].$id !== undefined) {
          // delete userData[list].$priority;
          days.push(userData[list].$id);
          totalCO2.push(userData[list].totalCO2);
          avgCO2.push(userData[list].snittCO2);
        }
      }

      var data = {
        labels: days,
        datasets: [
          {
            label: 'Snitt',
            backgroundColor: "darkgreen",
            data: avgCO2,
          },
          {

            label: 'Total',
            backgroundColor: "#9BD270",
            data: totalCO2,
          }
        ]


      };
      return data;
    }



    this.getBarChartData = function (userData) {
      var tempList = [];
      var accumulatedList = [];

      for (list in userData) {
        if (userData[list].$id !== undefined) {
          // delete userData[list].$priority;
          for (item in userData[list].items) {
            tempList.push((userData[list].items)[item])
          }
        }
      }

      for (object in tempList) {
        var uniqueItem = true;
        for (item in accumulatedList) {
          if (tempList[object].id == accumulatedList[item].id) {
            uniqueItem = false;
            accumulatedList[item].amount += tempList[object].amount;
            accumulatedList[item].carbon.average += tempList[object].carbon.average;
          }
        }
        if (uniqueItem) {
          accumulatedList.push(tempList[object])
        }
      }

      accumulatedList.sort(function(a, b) {
        return b.carbon.average - a.carbon.average;
      })

      var topAccumulatedItems = accumulatedList.slice(0,6);

      var itemNames = [];
      var itemCarbon = [];
      for (editedItem in topAccumulatedItems) {
        itemNames.push(topAccumulatedItems[editedItem].name)
        itemCarbon.push(topAccumulatedItems[editedItem].carbon.average)
      }


      var data = {
        labels: itemNames,
        datasets: [
          {
            label: 'Koldioxid',
            backgroundColor: "darkgreen",
            data: itemCarbon,
          },
        ]

      };

      return data;
    }


    this.createChart = function(ctx, type, userData, specialType) {
      if (type == "line") {
        var data = this.getLineChartData(userData);
      }
      if (type == "bar") {
        var data = this.getBarChartData(userData);
      }
      if (type == "doughnut") {
        var data = this.getDoughnutChartData(specialType);
      }

      var options = this.getChartOptions();

      var myChart = new Chart(ctx, {
        type: type,
        data: data,
        options: options
      });
    }





    // DU KAN MERGA DESSA TVÅ TILL EN! GJ
    // DU KAN MERGA DESSA TVÅ TILL EN! GJ
    this.getTotalCarbon = function(currItem, all) {
      var totalCarbon = 0;

      for (i=0; i<(completeList).length; i++) {
        if (completeList[i].carbon.average != "???" && completeList[i].id != currItem) {
          totalCarbon += completeList[i].carbon.average;
        }
      }

      for (i=0; i<(itemList).length; i++) {
        if (itemList[i].carbon.average != "???" && itemList[i].id != currItem) {
          totalCarbon += itemList[i].carbon.average;
        }
      }

      return totalCarbon;
    }


    this.getTotalCO2 = function() {
      var totalCO2 = 0;
      var amountOfItems = 0;
      for (var k = 0; k<itemList.length;k++) {
        if (typeof itemList[k].carbon.average == "number") {
          totalCO2 += itemList[k].carbon.average;
          amountOfItems += 1;
        }
      }

      for (var k = 0; k<completeList.length;k++) {
        if (typeof completeList[k].carbon.average == "number") {
          totalCO2 += completeList[k].carbon.average;
          amountOfItems += 1;
        }
      }
      return (totalCO2/amountOfItems);
    }


    this.totalCarbon_completeList = function() {
      var totalCarbon = 0;
      var totalItems = 0;

      for (i=0; i<(completeList).length; i++) {
        if (completeList[i].carbon.average != "???") {
          totalCarbon += completeList[i].carbon.average;
          totalItems += 1;
        }
      }

      var avgCarbon = totalCarbon/totalItems;

      return [totalCarbon, avgCarbon];
    }
    // DU KAN MERGA DESSA TVÅ TILL EN! GJ
    // DU KAN MERGA DESSA TVÅ TILL EN! GJ


    this.getCurrentCO2representation = function () {
      return CO2representation;
    }


    this.getPercentCarbon = function(item) {
      var specItemCarbon = item.carbon.average;
      var totalCarbon = this.getTotalCarbon(item.id);
      var percentCarbon = (((specItemCarbon)/(totalCarbon + specItemCarbon))*100).toFixed(0);
      return percentCarbon;
    }

    this.getCO2constant = function() {
      return CO2constant;
    }


    this.getCO2unit = function() {
      return CO2unit;
    }


    this.getCompleteList = function() {
      return completeList;
    }


    this.getFavouriteList = function() {
      return favList;
    }


    this.getCheckList = function() {
      return itemList;
    }


    this.getStatInfoForCurrentPurchase = function() {
      var labels = [];
      var data = [];

      for (var k = 0; k < itemList.length; k++) {
        if (itemList[k].carbon.avgerage !='???') {
          labels.push(itemList[k].name);
          data.push(itemList[k].carbon.average);
        }
      }

      for (var k = 0; k < completeList.length; k++) {
        if (completeList[k].carbon.avgerage !='???') {
          labels.push(completeList[k].name);
          data.push(completeList[k].carbon.average);
        }
      }

      var allStatInfo = [labels, data];
      return allStatInfo
    }


    this.itemAlreadyInFav = function(item) {
      itemInFavList = false;

      for (var k = 0; k < favList.length; k++) {
        if (favList[k].id === item.id) {
          itemInFavList = true;
        }
      }

      return itemInFavList;
    }


    this.favItemAlreadyInList = function(item) {
      favItemInList = false;

      for (var k = 0; k < itemList.length; k++) {
        if (itemList[k].id === item.id) {
          favItemInList = true;
        }
      }

      for (var k = 0; k < completeList.length; k++) {
        if (completeList[k].id === item.id) {
          favItemInList = true;
        }
      }

      return favItemInList;
    }


    this.checkIfCorrectSearch = function(searchword) {
      var checkSearch = /^[a-zA-ZåäöÅÄÖèéêëìíâ\s]+$/.test(searchword);
      return checkSearch;
    }


    this.cutNameOfItem = function(item) {
      if ((item.name).length > 14) {
        var reducedName = (item.name).substring(0,14);
        reducedName += "...";
        item.fixedName = reducedName;
      }
      else {
        item.fixedName = item.name;
      }

      return item;
    }


    this.itemsHistory = function() {
      var userData = FirebaseAccount.Download(user, "saved lists"); //FBGJ
      var tempList = [];
      var accumulatedList = [];
      userData.$loaded().then(function() {

        for (list in userData) {
          if (userData[list].$id !== undefined) {
            // delete userData[list].$priority;
            for (item in userData[list].items) {
              tempList.push((userData[list].items)[item])
            }
          }
        }
        for (object in tempList) {
          var uniqueItem = true;
          for (item in accumulatedList) {
            if (tempList[object].id == accumulatedList[item].id) {
              uniqueItem = false;
              accumulatedList[item].amount += tempList[object].amount;
              accumulatedList[item].carbon.average += tempList[object].carbon.average;
            }
          }
          if (uniqueItem) {
            accumulatedList.push(tempList[object])
          }

        }
      })

      return accumulatedList;
    }



    // -------------SEARCHTOOLS-------------
    // -------------SEARCHTOOLS-------------

    this.checkIfInFirebase = function (userData, searchedItem, amount, unit, ownAmountAndUnitChosen, currentPage) {
      var inFirebaseUpdatelist = false;
      var statusMsg;

      for (item in userData) {
        if (typeof userData[item].itemInfo != "undefined") {

          if ((userData[item].itemInfo).id == searchedItem && !ownAmountAndUnitChosen) {

            var statusCheck = this.addItemToFavouriteOrChecklist(userData[item].itemInfo, currentPage);

            inFirebaseUpdatelist = true;

            if (statusCheck) {
              statusMsg = '"' + userData[item].itemInfo.name + '" lades till i listan!';

            }
            else {
              statusMsg = '"' + userData[item].itemInfo.name + '" ligger redan i listan!';

            }

          }

        }
      }
      return [inFirebaseUpdatelist, statusMsg];
    }

    this.createMissingItem = function (searchword, amount, unit, ownAmountAndUnitChosen, currentPage) {
      var _this = this;
      var userData = FirebaseAccount.Download(user, "modified items");
      return userData.$loaded().then(function() {

        var info = _this.checkIfInFirebase(userData, searchword, amount, unit, ownAmountAndUnitChosen, currentPage);
        var inFirebaseUpdatelist = info[0];
        var statusMsg = info[1];

        if (inFirebaseUpdatelist) {
          return statusMsg;
        }

        if (!inFirebaseUpdatelist) {
          var missingToken = {};
          var statusMsg;

          missingToken.name = searchword;
          missingToken.id = searchword;
          missingToken.amount = amount;
          missingToken.unit = unit;
          missingToken.carbon = {};
          missingToken.carbon.average = "???";

          var statusCheck = _this.addItemToFavouriteOrChecklist(missingToken, currentPage);

          if (statusCheck) {
            statusMsg = '"' + missingToken.name + '" lades till i listan, men finns inte i databasen!';
            if (ownAmountAndUnitChosen) {
              FirebaseAccount.ItemModify(user, _this.cutNameOfItem(missingToken));
            }

          }
          else {
            statusMsg = '"' + missingToken.name + '" ligger redan i listan!';
          }

          return statusMsg;

        }

      })

    }




    this.executeSearch = function (searchword, amount, unit, currentPage) {
      var _this = this;
      var statusMsg;

      if (amount == "" || unit == "" || typeof unit == "undefined" || typeof amount == "undefined") {
        var ownAmountAndUnitChosen = false;
        var amount = 1000;
        var unit = "g";
      }

      else {
        var ownAmountAndUnitChosen = true;
      }


      var finalStatus = this.APIinfoSearch.get({search:searchword}).$promise.then(function(data) {
        if (searchword.toUpperCase() === data.ingredients[0].name.toUpperCase()) {
          var statusMsg = _this.getItemFromFirebaseOrAPI(ownAmountAndUnitChosen, data.ingredients[0].id, amount, unit, currentPage);
        }

        else {
          var status = _this.createMissingItem(searchword, amount, unit, ownAmountAndUnitChosen, currentPage);
          statusMsg = status;
        }

        return statusMsg;

      }, function(reason) {
        var status = _this.createMissingItem(searchword, amount, unit, ownAmountAndUnitChosen, currentPage);
        statusMsg = status;
        return statusMsg;

      })

      return finalStatus;
    }




    this.getItemFromFirebaseOrAPI = function (ownAmountAndUnitChosen, item, amount, unit, currentPage) {
      var _this = this;
      // var statusMsg;
      var userData = FirebaseAccount.Download(user, "modified items");
      return userData.$loaded().then(function() {

        var info = _this.checkIfInFirebase(userData, item, amount, unit, ownAmountAndUnitChosen, currentPage);
        var inFirebaseUpdatelist = info[0];
        var statusMsg = info[1];

        if (inFirebaseUpdatelist) {
          return statusMsg;
        }

        if (!inFirebaseUpdatelist) {
          var statusFromAPI = _this.APIinfo.get({ingredient:item,amount:amount,unit:unit}).$promise.then(function(data) {
            // var statusCheck = _this.updateList(data);
            var statusCheck = _this.addItemToFavouriteOrChecklist(data, currentPage);


            if (statusCheck) {
              statusMsg = '"' + data.name + '" lades till i listan!';

              if (ownAmountAndUnitChosen) {
                FirebaseAccount.ItemModify(user, _this.cutNameOfItem(data));
              }
            }

            else {
              statusMsg = '"' + data.name + '" ligger redan i listan!'
            }

            return statusMsg;
          });

          return statusFromAPI;

        }

      })

    }


    // -------------UPDATES-------------
    // -------------UPDATES-------------



    var updateCookie_userbased = function() {
      var currentItem_cookie;
      var user_cookie;

      currentItem_cookie = currentItem;
      user_cookie = user;

      var expireDate = new Date();
      expireDate.setDate(expireDate.getDate() + 20);

      $cookies.putObject('currentItem_cookie', currentItem_cookie, {'expires': expireDate});
      $cookies.putObject('user_cookie', user_cookie, {'expires': expireDate});
    }


    this.updateFavList = function(item) {
      flag = true;

      if (item.name == "") {
        flag = false;
      }

      for (var k = 0; k < favList.length; k++) {
        if (favList[k].id === item.id) {
          flag = false;
        }
      }

      if (flag) {
        var cutItem = this.cutNameOfItem(item)
        favList.push(cutItem)
        updateFirebase_add(cutItem, "favouritelist");
      }

      return flag;
    }


    this.updateCurrentItem = function(item) {
      currentItem = item;
      updateCookie_userbased();
    }


    this.updateList = function(item) {
      flag = true;

      if (item.name == "") {
        flag = false;
      }

      for (var k = 0; k < itemList.length; k++) {
        if (itemList[k].id === item.id) {
          flag = false;
        }
      }

      for (var k = 0; k < completeList.length; k++) {
        if (completeList[k].id === item.id) {
          flag = false;
        }
      }

      if (flag) {
        var cutItem = this.cutNameOfItem(item)
        itemList.push(cutItem)
        updateFirebase_add(cutItem, "checklist");
      }

      return flag;
    }


    this.addAllFavsToChecklist = function() {
      for (var k = 0; k < favList.length; k++) {
        this.updateList(favList[k]);
      }
    }



    // -------------FIREBASE-------------
    // -------------FIREBASE-------------



    var updateFirebase_add = function(item, directory) {
      FirebaseAccount.ItemAdd(user, item, directory);
    }


    var updateFirebase_remove = function(item, directory) {
      FirebaseAccount.ItemRemove(user, item, directory);
    }


    var updateFirebase_clear = function(directory) {
      FirebaseAccount.ItemClear(user, directory);
    }


    var updateFirebase_rearrange = function(item, directoryFrom, directoryTo) {
      FirebaseAccount.ItemRearrange(user, item, directoryFrom, directoryTo);
    }


    var updateFirebase_archive = function(completelist, carbonInfo) {
      var totalCarbon_completeList = carbonInfo[0];
      var avgCarbon_completeList = carbonInfo[1];

      var rightNow = new Date();
      rightNow.setDate(rightNow.getDate() + 2);
      var todaysDate = rightNow.toISOString().slice(0,10).replace(/-/g,"");

      FirebaseAccount.ArchiveList(user, completelist, todaysDate, totalCarbon_completeList, avgCarbon_completeList);
    }



    // -------------API-------------
    // -------------API-------------



    this.APIinfoSearch = $resource('http://lcafdb.org/api/ingredients',{},{
      get: {
      }
    });


    this.APIinfo = $resource('http://lcafdb.org/api/func/calculate',{},{
      get: {
      }
    });



    // -------------INIT-------------
    // -------------INIT-------------



    var _this = this;
    this.init = function() {
      itemList = [];
      completeList = [];
      favList = [];

      user = $cookies.getObject('user_cookie');
      currentItem = $cookies.getObject('currentItem_cookie');

      if (user !== undefined && user != null) {
        var userData = FirebaseAccount.Download(user, "current list");
        var checklist;
        var completelist;
        var favouritelist;
        console.log(userData)
        userData.$loaded().then(function() {
          for (list in userData) {
            if (userData[list].$id == "items - checklist") {
              delete userData[list].$priority;
              checklist = userData[list];
            }
            if (userData[list].$id == "items - completelist") {
              delete userData[list].$priority;
              completelist = userData[list];
            }
            if (userData[list].$id == "items - favouritelist") {
              delete userData[list].$priority;
              favouritelist = userData[list];
            }
          }

          for (item in checklist) {
            if (typeof checklist[item].itemInfo != "undefined") {
              itemList.push(checklist[item].itemInfo)
            }
          }

          for (item in completelist) {
            if (typeof completelist[item].itemInfo != "undefined") {
              completeList.push(completelist[item].itemInfo)
            }
          }

          for (item in favouritelist) {
            if (typeof favouritelist[item].itemInfo != "undefined") {
              favList.push(favouritelist[item].itemInfo)
            }
          }

        });

        // window.location = '#!/search';
      }
      // else {
      //   window.location = '#!/login';
      //
      //   // If user clears cookies and reloads page
      // }

    }



    // -------------START-------------
    // -------------START-------------



    this.init();
    return this;



  });
















































  // ARKIV
  // ARKIV
  // ARKIV



  // ORGINAL COOKIE FUNKTIONEN, TA INTE BORT!
  // ORGINAL COOKIE FUNKTIONEN, TA INTE BORT!
  // ORGINAL COOKIE FUNKTIONEN, TA INTE BORT!
  // ORGINAL COOKIE FUNKTIONEN, TA INTE BORT!
  // var updateCookie = function() {
  //   // console.log(" *** Kommer in i updateCookie 1")
  //   var itemList_cookies = [];
  //   var completeList_cookies = [];
  //   var currentItem_cookie;
  //   var user_cookie;
  //   // console.log("currentItem_cookie, user_cookie")
  //   // console.log(currentItem_cookie)
  //   // console.log(user_cookie)
  //   // console.log("currentItem samt user och user.id")
  //   // console.log(currentItem)
  //   // console.log(user)
  //   // console.log(user.id)
  //
  //   // console.log(" *** Kommer in i updateCookie 1")
  //
  //
  //   currentItem_cookie = currentItem;
  //   user_cookie = user;
  //
  //   for (var k = 0; k<itemList.length;k++) {
  //     light_item = {};
  //     light_item.name = itemList[k].name
  //     light_item.amount = itemList[k].amount
  //     light_item.unit = itemList[k].unit
  //     light_item.id = itemList[k].id
  //     itemList_cookies.push(light_item);
  //   }
  //
  //
  //   for (var k = 0; k<completeList.length;k++) {
  //     light_item = {};
  //     light_item.name = completeList[k].name
  //     light_item.amount = completeList[k].amount
  //     light_item.unit = completeList[k].unit
  //     light_item.id = completeList[k].id
  //     completeList_cookies.push(light_item);
  //   }
  //
  //   console.log(" *** BÖRJAN :: Kommer in i updateCookie 1");
  //   console.log(" PRINTAR user_cookie:");
  //   console.log(user_cookie);
  //   console.log(" PRINTAR currentItem_cookie:");
  //   console.log(currentItem_cookie);
  //   console.log(" PRINTAR itemList_cookies:");
  //   console.log(itemList_cookies);
  //   console.log(" PRINTAR completeList_cookies:");
  //   console.log(completeList_cookies);
  //
  //   console.log(" *** SLUTET :: Kommer in i updateCookie 2");
  //
  //
  //   var expireDate = new Date();
  //   expireDate.setDate(expireDate.getDate() + 20);
  //
  //   $cookies.putObject('itemList_cookies', itemList_cookies, {'expires': expireDate});
  //   $cookies.putObject('completeList_cookies', completeList_cookies, {'expires': expireDate});
  //   $cookies.putObject('currentItem_cookie', currentItem_cookie, {'expires': expireDate});
  //   $cookies.putObject('user_cookie', user_cookie, {'expires': expireDate});
  // }



  // GAMLA UPDATELIST_COOKIES SOM FUNKAR PERFEKT
  // GAMLA UPDATELIST_COOKIES SOM FUNKAR PERFEKT
  // GAMLA UPDATELIST_COOKIES SOM FUNKAR PERFEKT
  //
  //
  // var updateCookie_lists = function() {
  //
  //   var itemList_cookies = [];
  //   var completeList_cookies = [];
  //
  //   for (var k = 0; k<itemList.length;k++) {
  //     light_item = {};
  //     light_item.name = itemList[k].name
  //     light_item.amount = itemList[k].amount
  //     light_item.unit = itemList[k].unit
  //     light_item.id = itemList[k].id
  //     itemList_cookies.push(light_item);
  //   }
  //
  //
  //   for (var k = 0; k<completeList.length;k++) {
  //     light_item = {};
  //     light_item.name = completeList[k].name
  //     light_item.amount = completeList[k].amount
  //     light_item.unit = completeList[k].unit
  //     light_item.id = completeList[k].id
  //     completeList_cookies.push(light_item);
  //   }
  //
  //   var expireDate = new Date();
  //   expireDate.setDate(expireDate.getDate() + 20);
  //
  //   $cookies.putObject('itemList_cookies', itemList_cookies, {'expires': expireDate});
  //   $cookies.putObject('completeList_cookies', completeList_cookies, {'expires': expireDate});
  // }
