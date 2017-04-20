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











carbonListApp.factory("Auth", ["$firebaseAuth",
function($firebaseAuth) {
  return $firebaseAuth();
}
]);
