/**
 * @author GlobalLogic
 */

/*
 * Sample App using ATT Module exposing the ATT APIs to PhoneGap Mobile.
 */
/*
 * Variables used - phonegap -variable to require att.js module
 */

var phonegap;

// Note: Application Developer should get access key,secret key and shortcode by
// registering on www.developer.att.com website
// and creating sample Application.
var accessKey = window.localStorage.getItem("accessKey");
var secretKey = window.localStorage.getItem("secretKey");
var scope = window.localStorage.getItem("scopeForOauthToken");
var redirect_url = window.localStorage.getItem("redirect_url");
var requestedAccuracy = 100, acceptableAccuracy = 20000, tolerance = "DelayTolerant";
/*
 * authorize @param client_id -access key_id received when application is
 * registered - Mandatory @param scope -scope for which authorization token
 * needs to be generated - Mandatory
 */

function authorize(callback) {
	phonegap.ATT.OAuth.obtainEndUserAuthorization({
		'clientId' : accessKey, // 'b845fdc05cf46940c12b648d03def251',
		'scope' : scope
	}, function(data) {
		var url = "https://auth-api.att.com/user/login?client_id=" + accessKey + "&scope=" + scope + "&redirect_url=" + redirect_url;
		document.getElementById("authFrame").src = url;
		$("#oauthcontainer").show();
		$("#authFrame").load(function() {

			var url = this.contentDocument.location.href;
			var vars = [], hash;
			var hashes = url.slice(url.indexOf('?') + 1).split('&');
			for (var i = 0; i < hashes.length; i++) {
				hash = hashes[i].split('=');
				vars.push(hash[0]);
				vars[hash[0]] = hash[1];
			}
			//Cancel Click Handle
			if (url.indexOf('error_reason') != -1) {
				$("#oauthcontainer").hide();
				return;
			}
			if (vars['code'] != undefined) {
				window.localStorage.oauthCode = JSON.stringify(vars['code']);
				var code = JSON.parse(window.localStorage.oauthCode);
				grantType = 'authorization_code';
				phonegap.ATT.authorize(accessKey, secretKey, scope, grantType, code);

				$("#oauthcontainer").hide();
				callback();

			}
		});

	}, function(error) {
		console.log('error in authorizing : ' + error);
	});

}

/*
 * CALLING ATT Module functions
 */

var ATT = {

	/*
	 * LOCATION - First call 'setOauthCode' to generate Oauth Token passing
	 * Oauth Code and grantType = 'authorization_code' as parameters. @param
	 * acceptableAccuracy - Mandatory
	 */

	location : function(cbData) {
		var locationInfo = function() {
			$(".bigButton").hide();
			$("#loader").show();
			phonegap.ATT.Location.getDeviceLocation({
				'requestedAccuracy' : requestedAccuracy,
				'tolerance' : tolerance,
				'acceptableAccuracy' : acceptableAccuracy
			}, function(data) {
				console.log('Device Location success : ' + data);
				cbData(data);
				$("#loader").hide();
				$(".bigButton").show();
			}, function(error) {
				console.log('Error invoking Devicelocation: '+error);
				cbData(error);
				$("#loader").hide();
				$(".bigButton").show();
			});
		};
		authorize(locationInfo);
	}
};

define(["require", "exports", "module", "att"], function(require, exports, module) {

	/*
	 * require att.js in 'phonegap' variable
	 */

	phonegap = require('att');

});
