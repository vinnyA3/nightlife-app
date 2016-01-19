angular.module('mainCtrl', ['yelpService'])
    .controller('mainController', function($auth,$location,Yelp){
        var vm = this;
    
        //isAuthenticated function
        vm.isAuthenticated = function(){
            return $auth.isAuthenticated();    
        };
    
        //logout function
        vm.logOut = function(){
            $auth.logout()
                .then(function(){
                    $location.path('/');
                });
        };
    
        //yelp call  function
        vm.callYelp = function(){
          if(!vm.location){
              return;
          }
           Yelp.getInfo(vm.location, function(data){
               console.log(data.businesses);
               vm.nightlifeData = data.businesses;
           });
        };
    
    });