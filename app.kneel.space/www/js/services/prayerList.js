angular.module('PrayerListService', [])

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
});