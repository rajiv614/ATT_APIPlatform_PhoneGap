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
	if(phonegap.ATT.getCachedUserAuthToken()) {
		callback();
		return;
	}
	
	phonegap.ATT.OAuth.obtainEndUserAuthorization({
		'clientId' : accessKey,
		'scope' : scope
	}, function(data) {
		var userConsentUrl = JSON.parse(data).uri;
		
		document.getElementById("authFrame").src = userConsentUrl;
		$("#oauthcontainer").show();
		$("#authFrame").load(function() {
			var url = this.contentDocument.location.href;
			
			//parse query string
			var qsObj = {};
			var qsStringMatch = url.match(/\?([^#]*)/);
			qsStringMatch && qsStringMatch[1].split('&').forEach(function(param) {
	            var paramParts = param.split('=');
	            qsObj[decodeURIComponent(paramParts[0])] = decodeURIComponent(paramParts[1] || '');
	        });
			
			// Cancel Click Handle
			if(qsObj.success === 'false') {
				if(qsObj.error_reason) {
					alert('Consent Error: ' + qsObj.error_reason);
				} else {
					alert('Error during consent');
				}
				$("#oauthcontainer").hide();
			} else if (qsObj.code) {
				var code = qsObj.code;
				var grantType = 'authorization_code';
				phonegap.ATT.authorize(accessKey, secretKey, scope, grantType, code);
				$("#oauthcontainer").hide();
				callback();
			}
		});
	}, function(error) {
		alert(JSON.stringify(error));
		console.log('Error in authorizing : ' + error);
	});

};

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

require.config({
	baseUrl: '../../js/lib'
});

define(["require", "exports", "module", "att"], function(require, exports, module) {

	/*
	 * require att.js in 'phonegap' variable
	 */

	phonegap = require('att');

});
