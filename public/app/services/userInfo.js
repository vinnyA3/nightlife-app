angular.module('userService', [])
    .factory('User', function($http,$q){
    
        var fac = {getUserInfo: getUserInfo};
    
        function getUserInfo(){
            var deffered = $q.defer();
            
            $http.get('/auth/dashboard', {cache:true})
                .success(function(data){
                    deffered.resolve(data);
                })
                .error(function(){
                    deffered.reject();
                });
            
            //return the promise object
            return deffered.promise;
        };
    
        //return the factory object
        return fac;
    
    });