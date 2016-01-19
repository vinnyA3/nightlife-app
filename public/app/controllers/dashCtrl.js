angular.module('dashCtrl', ['userService'])
    .controller('dashController', function(User){
        var vm = this;
    
        vm.getInfo = function(){
            User.getUserInfo()
                .then(function(data){
                    vm.userInfo = data;
                })
                .catch(function(){
                    vm.error = true;
                    vm.errorMessage = "Failed to get user information ..";
                });
        }
         
        vm.getInfo();
    
    });