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
        
		  var searchLocation = localStorage.getItem('location');
		
		  //PREVENT API CALL IF THE FORM IS BLANK OR IF WE DONT HAVE A LOCATION ON LOCAL STORAGE
		  if(!vm.location && (searchLocation == undefined)){
			  return;
		  }
		
		  var loc = vm.location ? vm.location : searchLocation;
		  console.log(loc);
		  
           Yelp.getInfo(loc)
            .then(function(data){
			   
			   //SET OUR DATA WITH THE RETURNED OBJ FROM THE API 
               vm.nightlifeData = data.businesses;
			   //set the location in local storage to persist the search
			   localStorage.setItem('location', loc);
			   //call our get Bar function
			   Bars.getBars(loc)
			   		.then(function(data){
				   		//ADD THE BAR'S ATTENDING FIELD TO THE NIGHTLIFE DATA OBJ
				        attendingPopulation(data.bars, vm.nightlifeData);
			   		})
			   		.catch(function(data){
				   		console.log(data);
			   		});
               
           })
           .catch(function(data){
                console.log('error ... '+data);
           });
            
        };
	
		//attending function
		vm.attend = function(venue){	
			//if we already have an attending variable on the venue obj, then we modify the attending variable
			console.log('name = ' +venue.name);
			if(venue.attending){
				Bars.modifyBar(venue.name,vm.location)
					.then(function(data){
					    console.log(data);
						 venue.attending = (data.deter == true ? venue.attending += 1 : venue.attending -= 1);
						 if(data.deter == false){localStorage.setItem('determinant', true);}
					})
					.catch(function(){
						console.log('failed to modify bar');
					});
			}else{
			//send the bar name and the search location to the bar service post
					Bars.createBar(vm.location, venue.name)
						.then(function(data){
							//console.log(data);
							//determinant var for check in
							localStorage.setItem('determinant',true);
						    console.log(data);
							venue.attending = data.bar.bars[0].attending;
						})
						.catch(function(data){
						$location.path('/login');
							console.log('error ....' + data);
						});
			//if we have an attending variable, we need to make sure that the user is not already going
			//if the user is not already going, we want to send a put request and add one to attending in db and view
			}
			
		};
	
	//call yelp data function
	vm.callYelp();
	
});//end controller