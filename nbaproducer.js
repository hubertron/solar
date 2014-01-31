var request = require('request');
var cheerio = require('cheerio');
var redis = require("redis");
var async = require('async');

pools = {
    'http://hangtime.blogs.nba.com/?ls=iref:nba:gnav' : '.post h2 a',
    'http://allball.blogs.nba.com/' : '.post h2 a',
    'http://tbt.blogs.nba.com/?ls=iref:nba:gnav' : '.post h2 a',
    'http://espn.go.com/nba/' : '.headlines li a',
    'http://grantland.com/tags/nba/' : '.headline a',
    'http://www.sbnation.com/nba-news-basketball-2013-14' : '.has-section h3 a',
    'http://hardwoodparoxysm.com/' : '.entry-title a',
    'http://hoopspeak.com/' : '.post-headline h2 a',
    'http://hoopchalk.com/' : '.entry-title a',
    'http://ballerball.com/' : '.entry-title a',
    'http://gothicginobili.com/' : '.entry-title a',
    'http://dimemag.com/' : '.post h2 a',
    'http://nba.si.com/' : '.post .inner .body h1 a',
    'http://sports.yahoo.com/blogs/nba-ball-dont-lie/' : '.body .body-wrap h3 a',
    'http://www.basketballinsiders.com/category/nba-draft/' : '.home-title1 a',
    'http://search.espn.go.com/brian-windhorst/' : '.result h3 a'
};

client = redis.createClient(6380, '127.0.0.1', null);

async.each( 
	Object.keys(pools)
	
	,function(url,callback) {
		var tagselector = pools[url];

	    request(url, ( function(tagselector, callback) {

	        return function(err, resp, body) {
	            if (err)
	                throw err;
	            $ = cheerio.load(body);
	            
	            $(tagselector).each(function(post) {
			    	
			    		var newentry = $(this).text().trim() +  " @  " + $(this).attr('href');
	            		client.sadd("newnewsqueue", newentry);
			        	console.log(newentry);
				});

				callback()
	        }
	    })(tagselector, callback));
	}
	
	,function(err) {
		console.log("done! closing connection with redis")
		client.quit() 
	});


