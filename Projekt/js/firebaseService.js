

dinnerPlannerApp.factory("UserItemAdd",
function($firebaseObject) {

  return function(username, item, directory) {

    delete item.$promise;
    delete item.$resolved;
    delete item.$$hashKey;

    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");
    var profileRef = ref.child(username).child("current list").child("items - " + directory).child(item.id).set({
      itemInfo: item
    });
  }
}
);


dinnerPlannerApp.factory("UserArchiveList",
function($firebaseObject) {

  return function(username, completelist, date, totCarbon, avgCarbon) {

    for (item in completelist) {
      delete completelist[item].$$hashKey;
    }

    delete item.$promise;
    delete item.$resolved;
    delete item.$$hashKey;

    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");
    var profileRef = ref.child(username).child("saved lists").child(date).set({
      items: completelist,
      totalCO2: totCarbon,
      snittCO2: avgCarbon
    });

  }
}
);


dinnerPlannerApp.factory("UserItemRearrange",
function($firebaseObject, $firebaseArray, UserItemRemove, UserItemAdd) {

  return function(username, item, directoryFrom, directoryTo) {

    delete item.$promise;
    delete item.$resolved;
    delete item.$$hashKey;

    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");
    var movingObject = $firebaseObject(ref.child(username).child("current list").child("items - " + directoryFrom).child(item.id));

    movingObject.$loaded().then(function() {
      UserItemRemove(username, item, directoryFrom);
      UserItemAdd(username, movingObject.itemInfo, directoryTo);
    });


  }
}
);

dinnerPlannerApp.factory("UserItemRemove",
function($firebaseObject) {

  return function(username, item, directory) {
    delete item.$promise;
    delete item.$resolved;
    delete item.$$hashKey;

    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");
    var profileRef = ref.child(username).child("current list").child("items - " + directory).child(item.id).remove();

  }
}
);


dinnerPlannerApp.factory("UserItemClear",
function($firebaseObject) {

  return function(username, directory) {

    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");
    var profileRef = ref.child(username).child("current list").child("items - " + directory).remove();

  }
}
);


dinnerPlannerApp.factory("UserItemModify",
function($firebaseObject, UserItemAdd) {

  return function(username, item, directory) {

    delete item.$promise;
    delete item.$resolved;
    delete item.$$hashKey;

    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");
    var profileRef = ref.child(username).child("modified items").child(item.id).set({
      itemInfo: item
    });

    if (directory != undefined) {
      UserItemAdd(username, item, directory);
    }

  }
}
);


dinnerPlannerApp.factory("Download", ["$firebaseArray",
function($firebaseObject) {
  return function(username, directory) {
    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");
    var profileRef = ref.child(username).child(directory);

    return $firebaseObject(profileRef);
  }
}
]);


dinnerPlannerApp.factory("Auth", ["$firebaseAuth",
function($firebaseAuth) {
  return $firebaseAuth();
}
]);

dinnerPlannerApp.factory("DatabaseOperation", ["$firebaseAuth",
function($firebaseAuth) {
  return $firebaseAuth();
}
]);




















































// FUNKA BRA
// dinnerPlannerApp.factory("UserItems",
// function($firebaseObject) {
//
//   return function(username, item, directory) {
//     console.log("%%% KOMMER IN I USERITEMSUPDATE!")
//
//     delete item.$promise;
//     delete item.$resolved;
//
//     // KOLLA OM AMOUNT OCH UNIT FAKTISKT INTE ÄR UNDEFINED!
//     // OM NÅGON UNDEFINED, ANVÄND AMOUNT ELLER UNIT FRÅN ITEM, DVS SPECIALITEM SOM DU TAR IN.
//     // DET ÄR JU DET AMOUNT/UNIT SOM SATT INNAN.
//     // //
//     // Dinner.Dish.get({ingredient:item.id,amount:amount,unit:unit},function(data){
//     //
//     //   delete data.$promise;
//     //   delete data.$resolved;
//
//       // create a reference to the database node where we will store our data
//       var ref = firebase.database().ref("users");
//       var profileRef = ref.child(username).child("items - " + directory).child(item.id).set({
//         itemInfo: item
//       });
//     //
//     // }, function(data) {
//     //   console.log("Du måste fylla i alla fält för att kunna lägga in en vara i listan!")
//     //   console.log(data)
//     // })
//
//   }
// }
// );

// dinnerPlannerApp.factory("UserItemsAdd",
// function($firebaseObject) {
//
//   return function(username, item) {
//     console.log("%%% KOMMER IN I USERITEMSUPDATE!")
//
//
//     // KOLLA OM AMOUNT OCH UNIT FAKTISKT INTE ÄR UNDEFINED!
//     // OM NÅGON UNDEFINED, ANVÄND AMOUNT ELLER UNIT FRÅN ITEM, DVS SPECIALITEM SOM DU TAR IN.
//     // DET ÄR JU DET AMOUNT/UNIT SOM SATT INNAN.
//     // //
//     // Dinner.Dish.get({ingredient:item.id,amount:amount,unit:unit},function(data){
//     //
//     //   delete data.$promise;
//     //   delete data.$resolved;
//
//       // create a reference to the database node where we will store our data
//       var ref = firebase.database().ref("users");
//       var profileRef = ref.child(username).child("items - updated").child(item.id).set({
//         itemInfo: item
//       });
//     //
//     // }, function(data) {
//     //   console.log("Du måste fylla i alla fält för att kunna lägga in en vara i listan!")
//     //   console.log(data)
//     // })
//
//   }
// }
// );

// dinnerPlannerApp.factory("UserItemsAdd",
// function($firebaseObject, Dinner) {
//
//   return function(username, item) {
//
//     var statusText = document.getElementById('statusText');
//
//     Dinner.Dish.get({ingredient:item,amount:1000,unit:"g"},function(data){
//
//       delete data.$promise;
//       delete data.$resolved;
//
//       var statusCheck = Dinner.updateList(data);
//
//       // create a reference to the database node where we will store our data
//       var ref = firebase.database().ref("users");
//       var profileRef = ref.child(username).child("items - currently added").child(data.id).set({
//         itemInfo: data
//       });
//
//       if (statusCheck) {
//         statusText.style.background = "#5cbc3a";
//         $scope.status = '"' + data.name + '" lades till i listan!'
//         $("#statusText").delay(2000).fadeOut("fast");
//       }
//       else {
//         statusText.style.background = "#f14129";
//         $scope.status = '"' + data.name + '" ligger redan i listan!'
//       }
//
//
//     }, function(data) {
//       console.log("Du måste fylla i alla fält för att kunna lägga in en vara i listan!")
//       console.log(data)
//     })
//
//
//
//
//
//     // KOLLA OM AMOUNT OCH UNIT FAKTISKT INTE ÄR UNDEFINED!
//     // OM NÅGON UNDEFINED, ANVÄND AMOUNT ELLER UNIT FRÅN ITEM, DVS SPECIALITEM SOM DU TAR IN.
//     // DET ÄR JU DET AMOUNT/UNIT SOM SATT INNAN.
//     //
//     // Dinner.Dish.get({ingredient:item.id,amount:amount,unit:unit},function(data){
//     //
//     //   delete data.$promise;
//     //   delete data.$resolved;
//     //
//     //   // create a reference to the database node where we will store our data
//     //   var ref = firebase.database().ref("users");
//     //   var profileRef = ref.child(username).child("items - standard").child(data.id).set({
//     //     itemInfo: data
//     //   });
//     //
//     // }, function(data) {
//     //   console.log("Du måste fylla i alla fält för att kunna lägga in en vara i listan!")
//     //   console.log(data)
//     // })
//
//   }
// }
// );






// FUNKADE FINT
// dinnerPlannerApp.factory("Download", ["$firebaseArray",
// function($firebaseArray) {
//   return function(username) {
//     // create a reference to the database node where we will store our data
//     var ref = firebase.database().ref("users");
//     // console.log("Gustav 2: username")
//     // console.log(username)
//     // console.log("Gustav 2: username")
//
//     var profileRef = ref.child(username).child("items");
//
//     // profileRef.on("value", function(snapshot) {
//     //   var test = snapshot.val();
//     //
//     //   for (var key in test) {
//     //     console.log("¤¤¤¤ HERUUEEEKA MADDAFKKA")
//     //     console.log(test[key].key);
//     //     console.log((test[key]).length);
//     //     for (var obj in test[key]) {
//     //       console.log("?????????????????????????? PLZ")
//     //       console.log(test[key][obj])
//     //   }
//     //   }
//     // })
//     // console.log("Här är profileRef")
//     // console.log(profileRef)
//
//     // return it as a synchronized object
//     return $firebaseArray(profileRef);
//   }
// }
// ]);



























// THREE WAY DATA BINDING, FUNGERANDE FACTORY!!
// THREE WAY DATA BINDING, FUNGERANDE FACTORY!!
// THREE WAY DATA BINDING, FUNGERANDE FACTORY!!
// dinnerPlannerApp.factory("Profile", ["$firebaseObject",
//   function($firebaseObject) {
//     return function(username, item) {
//       // create a reference to the database node where we will store our data
//       var ref = firebase.database().ref("users");
//       console.log("Gustav 2: username")
//       console.log(username)
//       console.log(item)
//       console.log("Gustav 2: username")
//
//       var profileRef = ref.child(username).child("items").child(item.id).push();
//
//
//       // return it as a synchronized object
//       return $firebaseObject(profileRef);
//     }
//   }
// ]);
// THREE WAY DATA BINDING, FUNGERANDE FACTORY!!
// THREE WAY DATA BINDING, FUNGERANDE FACTORY!!
// THREE WAY DATA BINDING, FUNGERANDE FACTORY!!
