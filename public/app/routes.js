angular.module('appRoutes', ['ui.router','satellizer'])
    .config(function($stateProvider, $urlRouterProvider,$locationProvider){
        $stateProvider
            .state('home',{
                url:'/',
                templateUrl: 'app/views/pages/home.html',
                controller: 'mainController as main'
            })
            .state('login', {
                url:'/login',
                templateUrl: 'app/views/pages/login.html',
                controller: 'loginController as login',
            })
            .state('signup',{
                url:'/signup',
                templateUrl: 'app/views/pages/signup.html',
                controller: 'signupController as signup'
            })
            .state('dashboard', {
                url:'/dashboard',
                templateUrl: 'app/views/pages/dashboard.html',
                controller: 'dashController as dash',
                resolve:{
                    loginRequired: loginRequired
                }
            });
    
            $urlRouterProvider.otherwise('/');
    
            $locationProvider.html5Mode(true);
    
        
        function loginRequired($q,$location,$auth){
            var deffered = $q.defer();
            if($auth.isAuthenticated()){
                deffered.resolve();
            }else{
                $location.path('/login');
            }
            return deffered.promise;
        };
    
    });