angular.module('signupCtrl', [])
    .controller('signupController', function($auth,$location){
        var vm = this;
    
        vm.signUp = function(){
            $auth.signup({name: vm.user.name, email: vm.user.email, password: vm.user.password})
                .then(function(res){
                
                    if(!res.token){
                        vm.error = true;
                        console.log(res.data);
                        vm.errorMessage = res.data.message;
                    }else{
                        $auth.setToken(res);
                        $location.path('/dashboard');
                    }
                
                })
                .catch(function(){
                    vm.error = true;
                    vm.errorMessage = 'Failed to sign up, please try again';
                });
        };
    
    });