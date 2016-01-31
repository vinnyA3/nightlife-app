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
	
		//authenticate
		vm.authenticate = function(provider){
			$auth.authenticate(provider)
				.then(function(){
					$location.path('/dashboard');
				})
				.catch(function(error){
					if(error.error){
						console.log(error.error);
					}else if(error.data){
						console.log(error.data);
					}
					else{
						console.log(error);
					}
				});
		};
    
    });