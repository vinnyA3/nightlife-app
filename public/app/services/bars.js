angular.module('barsService', [])
	.factory('Bars', function($q,$http){
		var barsService = {
			createBar : createBar,
			modifyBar : modify,
			getBars: getBars
		};
	
		function createBar(loc,name){
			var deffered = $q.defer();
			
			//post to bars api
			$http.post('/auth/bars', {location: loc, barname: name})
				.success(function(data){
					deffered.resolve(data);
				})
				.error(function(data){
					deffered.reject(data);
				});
			
			//return the promise object
			return deffered.promise;
		};
	
		function modify(bar,location){
			var deffered = $q.defer();
			//lets set the localStrage variable: determinant to a variable to send to the server
			var determinant = localStorage.getItem('determinant');
			
			$http.put('/auth/bars/' + bar,{location: location,determinant:determinant})
				.success(function(data){
					//set the user's 'going' var in local storage
					if(data.deter == true){
						localStorage.setItem('determinant', true);
						deffered.resolve(data);
					}
					else{
						localStorage.setItem('determinant', false);
						deffered.resolve(data);
					}
				})
				.error(function(){
					deffered.reject();
				});
			
			//return the promise object
			return deffered.promise;
		};
	
		function getBars(location){
			var deffered = $q.defer();
			
			$http.get('/auth/bars/' + location)
				.success(function(data){
					deffered.resolve(data);
				})
				.error(function(data){
					deffered.reject(data);
				});
			//return the promise
			return deffered.promise;
		}
	
		//return barService factory
		return barsService;
	
	});