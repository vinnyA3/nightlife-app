angular.module('loginCtrl', [])
    .controller('loginController', function($location, $auth){
        var vm = this;
        
        vm.login = function(){
            $auth.login({email: vm.user.email, password: vm.user.password})
                .then(function(res){                    
                    //check for token;
                    if(!res.data.token){
                        vm.error = true;
                        vm.errorMessage = res.data.message;
                    }else{
                        //redirect to the dashboard
                        console.log(res.data.user);
                        $location.path('/dashboard');
                    }    
                })
                .catch(function(){
                    vm.error = true;
                    vm.errorMessage = "Failed to login, please try again."
                });
        };
    
    });