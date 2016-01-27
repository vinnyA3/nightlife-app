angular.module('mainCtrl', ['yelpService','barsService'])
    .controller('mainController', function($auth,$location,Yelp,Bars){
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
    
		//bar's attending field population function
		function attendingPopulation(barsAttended, nightlifeArr){
			//first we need to loop through the array of objects
			barsAttended.forEach(function(bar){
				nightlifeArr.forEach(function(obj){
					//then we need to compare if the name of the bar equals the bar data name returned from the bar api
					if(obj.name == bar.name){
						//if it does, we want to add the attending field from the bar data to the nighlifeData bars object
						obj.attending = bar.attending;
					}
				});
			});
		};
	
        //yelp call  function
        vm.callYelp = function(){
		 //PREVENT API CALL IF THE FORM IS BLANK
          if(!vm.location){
              return;
          }
           Yelp.getInfo(vm.location)
            .then(function(data){
			   
			   //SET OUR DATA WITH THE RETURNED OBJ FROM THE API 
               vm.nightlifeData = data.businesses;
			   //call our get Bar function
			   Bars.getBars(vm.location)
			   		.then(function(data){
				   		//ADD THE BAR'S ATTENDING FIELD TO THE NIGHTLIFE DATA OBJ
				        attendingPopulation(data.bars, vm.nightlifeData);
			   		})
			   		.catch(function(data){
				   		console.log(data);
			   		});
               
           })
           .catch(function(){
                console.log('error');
           });
            
        };

		//attending function
		/*vm.attend = function(venue){
			
			//if we are not already going to the venue ... 
			if(!venue.userGoing && !venue.attending){
			//send the bar name and the search location to the bar service post
					Bars.createBar(vm.location, venue.name)
						.then(function(data){
							//console.log(data);
							//determinant var for check in
							vm.userGoing = true;
							venue.attending = data.bar.bars.attending;
						})
						.catch(function(data){
							console.log('error ....' + data);
						});
		    
			}
			//if we have an attending variable, we need to make sure that the user is not already going
			//if the user is not already going, we want to send a put request and add one to attending in db and view
		};*/
});//end controller