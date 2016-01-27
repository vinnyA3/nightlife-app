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
	
		function modify(bar){
			var deffered = $q.defer();
			
			$http.put('/auth/bars/' + bar)
				.success(function(data){
					deffered.resolve(data);
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