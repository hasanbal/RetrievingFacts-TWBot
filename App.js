var Twit = require('twit');

var key = require('./key.json');

let T = new Twit(key)

let our_id=""
let our_username="@retrievingfacts"

var stream = T.stream('statuses/filter', { track: our_username });

stream.on('tweet', tweetEvent);

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

function createMsg(txt){
	var replyText = "";
	const labels = ["wants to be quarantied with you","wants to kill you","is your drinking buddy","is your lost twin","has something to tell you","wants to go on a date with you","waiting for an apology from you","has fantasies about you","desperately in loves with you","really hates you", "jealous about you" , "is your best friend", "is your secret crush"];
	const regex = /@[\w]+/g;
	var usernames = [];
	while ((match = regex.exec(txt)) != null) {
    	if(match[0] != our_username)
    		usernames.push(match[0])
	}
	shuffleArray(labels);
	for(var i=0; i<usernames.length; i++){
		replyText += usernames[i] + " " + labels[i % (labels.length)] + "\n";
	}
	if(replyText == ""){
		replyText = "You should mention someone to learn the facts.";
	}else{
		replyText = "Here are the facts:\n" + replyText;
	}

	console.log(replyText);

	return replyText;
}

function tweetEvent(tweet){
	if(tweet.in_reply_to_status_id != null){
		return;
	}
	T.get("followers/ids",{screen_name:our_username, count:5000, cursor:-1},get_followers);
	function get_followers(err, followers){
		if(err){
			console.log(err.message);
			return;
		}
    	var followersArray = followers.ids;
		var txt = tweet.text
		console.log("txt: " + txt);
		var name = tweet.user.screen_name
		var id = tweet.id_str

		var replyText = "";

		if(followersArray.indexOf(tweet.user.id) == -1){
			replyText = '@'+ name + ' ' + "you have to follow me to retrieve facts :(";
		}else{
			replyText = '@'+ name + ' ' + createMsg(txt);
		}
	    console.log("replyText: ", replyText);

	    T.post('statuses/update', { status: replyText, in_reply_to_status_id: id}, tweeted);

		function tweeted(err, reply) {
		    if (err) {
		      console.log(err.message);
		    } else {
		      console.log('Tweeted: ' + reply.text);
		    }
		}
		
	}
}

function request(url){
	return T.get(url).then( data => {
		return data;
	});
}
