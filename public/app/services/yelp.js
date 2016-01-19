angular.module('yelpService', [])
    .factory('Yelp', function($http){
        var yelpService = {
            getInfo: getInfo
        }
        function randomString(length, chars){
            var randomString= '';
            for(var i = length; i > 0; --i){
                randomString += chars[Math.round(Math.random() * (chars.length - 1))]
            }
            return randomString;
        }
        
        function getInfo(loc,callback){
                    
            //constant api url
            var url = "https://api.yelp.com/v2/search";
                var method = 'GET';
                //location = loc,
                var params = {
                    callback : 'angular.callbacks._0',
                    location: loc,
                    oauth_consumer_key: '1tnDJbzGQ2CuMicDbrGvCQ',
                    oauth_token: 'jihXkq3lrhkS57aMoIcPJVgiNXPpm12_',
                    oauth_signature_method: 'HMAC-SHA1',
                    oauth_timestamp: new Date().getTime(),
                    oauth_nonce: randomString(32,'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'),
                    category_filter: 'nightlife',
                    limit: 20
                };
                var consumerSecret = 'XWdwhCDVnyZMCIeBB0Ft2i96X2w';
                var tokenSecret = 'Lj4IzR5esIh8HYXVbyjPCpWCMlU';
                var signature = oauthSignature.generate(method,url,params,consumerSecret,tokenSecret,{encodedSignature: false});
            
            //add the signature to the params obj
            params['oauth_signature'] = signature;
            
            //make the get request
            $http.jsonp(url, {params:params}).success(callback);
        };
                
        //return the yelp service
        return yelpService;
    });