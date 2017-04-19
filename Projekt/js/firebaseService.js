carbonListApp.factory('FirebaseAccount',function ($resource, $cookieStore, $cookies, $firebaseObject, $firebaseArray, $firebaseAuth) {

  var _this = this;

  this.ItemAdd = function(username, item, directory) {
    console.log("FirebaseAccount.ItemAdd")
    item = this.editItem(item);

    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");
    var profileRef = ref.child(username).child("current list").child("items - " + directory).child(item.id).set({
      itemInfo: item
    });
  };

  this.ArchiveList = function(username, completelist, date, totCarbon, avgCarbon) {
    console.log("FirebaseAccount.ArchiveList")
    for (item in completelist) {
      delete completelist[item].$$hashKey;
    }
    item = this.editItem(item);

    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");
    var profileRef = ref.child(username).child("saved lists").child(date).set({
      items: completelist,
      totalCO2: totCarbon,
      snittCO2: avgCarbon
    });
  };

  this.ItemRearrange = function(username, item, directoryFrom, directoryTo) {
    console.log("FirebaseAccount.ItemRearrange")
    item = this.editItem(item);

    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");
    var movingObject = $firebaseObject(ref.child(username).child("current list").child("items - " + directoryFrom).child(item.id));

    movingObject.$loaded().then(function() {
      _this.ItemRemove(username, item, directoryFrom);
      _this.ItemAdd(username, movingObject.itemInfo, directoryTo);
    });
  };

  this.ItemRemove = function(username, item, directory) {
    console.log("FirebaseAccount.ItemRemove")
    item = this.editItem(item);

    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");
    var profileRef = ref.child(username).child("current list").child("items - " + directory).child(item.id).remove();

  };


  this.ItemClear = function(username, directory) {
    console.log("FirebaseAccount.ItemClear")
    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");
    var profileRef = ref.child(username).child("current list").child("items - " + directory).remove();

  };



  this.ItemModify = function(username, item, directory) {
    console.log("FirebaseAccount.ItemModify")
    item = this.editItem(item);

    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");
    var profileRef = ref.child(username).child("modified items").child(item.id).set({
      itemInfo: item
    });

    if (directory != undefined) {
      _this.ItemAdd(username, item, directory);
    }
  };


  this.Download = function(username, directory) {
    console.log("FirebaseAccount.Download")
    // create a reference to the database node where we will store our data
    var ref = firebase.database().ref("users");
    var profileRef = ref.child(username).child(directory);

    return $firebaseArray(profileRef);
  };


    this.Auth = function() {
      console.log("FirebaseAccount.Auth")
      return $firebaseAuth();
    };


  this.editItem = function(item) {
    console.log("editar detta item")
    delete item.$promise;
    delete item.$resolved;
    delete item.$$hashKey;
    return item;
  };

  return this;
})










//
//
// carbonListApp.factory("UserItemAdd",
// function($firebaseObject) {
//
//   return function(username, item, directory) {
//
//     delete item.$promise;
//     delete item.$resolved;
//     delete item.$$hashKey;
//
//     // create a reference to the database node where we will store our data
//     var ref = firebase.database().ref("users");
//     var profileRef = ref.child(username).child("current list").child("items - " + directory).child(item.id).set({
//       itemInfo: item
//     });
//   }
// }
// );
//
//
// carbonListApp.factory("UserArchiveList",
// function($firebaseObject) {
//
//   return function(username, completelist, date, totCarbon, avgCarbon) {
//
//     for (item in completelist) {
//       delete completelist[item].$$hashKey;
//     }
//
//     delete item.$promise;
//     delete item.$resolved;
//     delete item.$$hashKey;
//
//     // create a reference to the database node where we will store our data
//     var ref = firebase.database().ref("users");
//     var profileRef = ref.child(username).child("saved lists").child(date).set({
//       items: completelist,
//       totalCO2: totCarbon,
//       snittCO2: avgCarbon
//     });
//
//   }
// }
// );
//
//
// carbonListApp.factory("UserItemRearrange",
// function($firebaseObject, $firebaseArray, UserItemRemove, UserItemAdd) {
//
//   return function(username, item, directoryFrom, directoryTo) {
//
//     delete item.$promise;
//     delete item.$resolved;
//     delete item.$$hashKey;
//
//     // create a reference to the database node where we will store our data
//     var ref = firebase.database().ref("users");
//     var movingObject = $firebaseObject(ref.child(username).child("current list").child("items - " + directoryFrom).child(item.id));
//
//     movingObject.$loaded().then(function() {
//       UserItemRemove(username, item, directoryFrom);
//       UserItemAdd(username, movingObject.itemInfo, directoryTo);
//     });
//
//
//   }
// }
// );
//
// carbonListApp.factory("UserItemRemove",
// function($firebaseObject) {
//
//   return function(username, item, directory) {
//     delete item.$promise;
//     delete item.$resolved;
//     delete item.$$hashKey;
//
//     // create a reference to the database node where we will store our data
//     var ref = firebase.database().ref("users");
//     var profileRef = ref.child(username).child("current list").child("items - " + directory).child(item.id).remove();
//
//   }
// }
// );
//
//
// carbonListApp.factory("UserItemClear",
// function($firebaseObject) {
//
//   return function(username, directory) {
//
//     // create a reference to the database node where we will store our data
//     var ref = firebase.database().ref("users");
//     var profileRef = ref.child(username).child("current list").child("items - " + directory).remove();
//
//   }
// }
// );
//
//
// carbonListApp.factory("UserItemModify",
// function($firebaseObject, UserItemAdd) {
//
//   return function(username, item, directory) {
//
//     delete item.$promise;
//     delete item.$resolved;
//     delete item.$$hashKey;
//
//     // create a reference to the database node where we will store our data
//     var ref = firebase.database().ref("users");
//     var profileRef = ref.child(username).child("modified items").child(item.id).set({
//       itemInfo: item
//     });
//
//     if (directory != undefined) {
//       UserItemAdd(username, item, directory);
//     }
//
//   }
// }
// );
//
//
// carbonListApp.factory("Download", ["$firebaseArray",
// function($firebaseObject) {
//   return function(username, directory) {
//     // create a reference to the database node where we will store our data
//     var ref = firebase.database().ref("users");
//     var profileRef = ref.child(username).child(directory);
//
//     return $firebaseObject(profileRef);
//   }
// }
// ]);


carbonListApp.factory("Auth", ["$firebaseAuth",
function($firebaseAuth) {
  return $firebaseAuth();
}
]);





















































// FUNKA BRA
// carbonListApp.factory("UserItems",
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
//     // Carbon.APIinfo.get({ingredient:item.id,amount:amount,unit:unit},function(data){
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

// carbonListApp.factory("UserItemsAdd",
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
//     // Carbon.APIinfo.get({ingredient:item.id,amount:amount,unit:unit},function(data){
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

// carbonListApp.factory("UserItemsAdd",
// function($firebaseObject, Carbon) {
//
//   return function(username, item) {
//
//     var statusText = document.getElementById('statusText');
//
//     Carbon.APIinfo.get({ingredient:item,amount:1000,unit:"g"},function(data){
//
//       delete data.$promise;
//       delete data.$resolved;
//
//       var statusCheck = Carbon.updateList(data);
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
//     // Carbon.APIinfo.get({ingredient:item.id,amount:amount,unit:unit},function(data){
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
// carbonListApp.factory("Download", ["$firebaseArray",
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
// carbonListApp.factory("Profile", ["$firebaseObject",
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
