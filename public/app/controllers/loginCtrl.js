angular.module('loginCtrl', [])
    .controller('loginController', function($location, $auth){
        var vm = this;
        
        vm.login = function(){
            $auth.login({email: vm.user.email, password: vm.user.password})
                .then(function(res){
                    //redirect to the dashboard
                    //$auth.setToken(res);
                    $location.path('/dashboard');
                })
                .catch(function(){
                    vm.error = true;
                    vm.errorMessage = "Failed to login, please try again."
                });
        };
    
    });