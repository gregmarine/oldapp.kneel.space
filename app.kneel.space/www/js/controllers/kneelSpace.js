angular.module('KneelSpaceController', [])

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