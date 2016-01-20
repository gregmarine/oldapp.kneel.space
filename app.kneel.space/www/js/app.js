// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('kneelspace', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs).
    // The reason we default this to hidden is that native apps don't usually show an accessory bar, at
    // least on iOS. It's a dead giveaway that an app is using a Web View. However, it's sometimes
    // useful especially with forms, though we would prefer giving the user a little more room
    // to interact with the app.
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // Set the statusbar to use the default style, tweak this to
      // remove the status bar on iOS or change it to use white instead of dark colors.
      StatusBar.styleDefault();
    }
  });
})

/**
 * The Prayer Lists factory handles saving and loading lists
 * from local storage, and also lets us save and load the
 * last active prayer list index.
 */
.factory('PrayerLists', function() {
  return {
    all: function() {
      var prayerListString = window.localStorage['prayerLists'];
      if(prayerListString) {
        return angular.fromJson(prayerListString);
      }
      return [];
    },
    save: function(prayerLists) {
      window.localStorage['prayerLists'] = angular.toJson(prayerLists);
    },
    newPrayerList: function(listTitle) {
      // Add a new list
      return {
        title: listTitle,
        cards: []
      };
    },
    getLastActiveIndex: function() {
      return parseInt(window.localStorage['lastActivePrayerList']) || 0;
    },
    setLastActiveIndex: function(index) {
      window.localStorage['lastActivePrayerList'] = index;
    }
  }
})

.controller('KneelSpaceCtrl', function($scope, $timeout, $ionicModal, PrayerLists, $ionicSideMenuDelegate) {

  // A utility function for creating a new list
  // with the given listTitle
  var createPrayerList = function(listTitle) {
    var newPrayerList = PrayerLists.newPrayerList(listTitle);
    $scope.prayerLists.push(newPrayerList);
    PrayerLists.save($scope.prayerLists);
    $scope.selectPrayerList(newPrayerList, $scope.prayerLists.length-1);
  }
  
  // Load or initialize prayer lists
  $scope.prayerLists = PrayerLists.all();
  
  // Grab the last active, or the first prayer list
  $scope.activePrayerList = $scope.prayerLists[PrayerLists.getLastActiveIndex()];
  
  // Called to create a new prayer list
  $scope.newPrayerList = function() {
    var listTitle = prompt('Prayer List name');
    if(listTitle) {
      createPrayerList(listTitle);
    }
  };
  
  // Called to select the given prayer list
  $scope.selectPrayerList = function(prayerList, index) {
    $scope.activePrayerList = prayerList;
    PrayerLists.setLastActiveIndex(index);
    $ionicSideMenuDelegate.toggleLeft(false);
  };
  
  // Create our modal
  $ionicModal.fromTemplateUrl('new-prayer-card.html', function(modal) {
    $scope.prayerCardModal = modal;
  }, {
    scope: $scope
  });
  
  $scope.createPrayerCard = function(card) {
    if(!$scope.activePrayerList || !card) {
      return;
    }
    $scope.activePrayerList.cards.push({
      title: card.title,
      body: card.body
    });
    $scope.prayerCardModal.hide();

    // Inefficient, but save all the lists
    PrayerLists.save($scope.prayerLists);

    card.title = "";
    card.body = "";
  };
  
  $scope.newPrayerCard = function() {
    $scope.prayerCardModal.show();
  };
  
  $scope.closeNewPrayerCard = function() {
    $scope.prayerCardModal.hide();
  }
  
  $scope.togglePrayerLists = function() {
    $ionicSideMenuDelegate.toggleLeft();
  };
  
  // Try to create the first prayer list, make sure to defer
  // this by using $timeout so everything is initialized
  // properly
  $timeout(function() {
    if($scope.prayerLists.length == 0) {
      while(true) {
        var listTitle = prompt('Your first Prayer List name:');
        if(listTitle) {
          createPrayerList(listTitle);
          break;
        }
      }
    }
  });
});