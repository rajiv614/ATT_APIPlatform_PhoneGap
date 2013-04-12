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

/*
 * CALLING ATT Module functions
 */

var ATT = {
	/* WAP PUSH
	 'body' :'<wapPushRequest><address>' + number + '</address></wapPushRequest>',
	 var  test = 'address=' + number;
	 urlbody = encodeURI(test);
	 * @param Data - Data which user will push (in XML form) - Mandatory
	 */

	wap : function(number, message, cbData) {
		var xml = "";
		xml += "Content-Disposition: form-data; name=\"PushContent\"\n";
		xml += "Content-Type: text/vnd.wap.si\n";
		xml += "Content-Length: 20\n";
		xml += "X-Wap-Application-Id: x-wap-application:wml.ua\n\n";
		xml += "<?xml version=\"1.0\"?>\n";
		xml += "<!DOCTYPE si PUBLIC \"-//WAPFORUM//DTD SI 1.0//EN\" \"http://www.wapforum.org/DTD/si.dtd\">\n";
		xml += "<si>";
		xml += "<indication href=\"" + "https://api.att.com/"
				+ "\" action=\"signal-medium\" si-id=\"6532\" >\n";
		xml += message + "\n";
		xml += "</indication>\n";
		xml += "</si>\n";

		phonegap.ATT.WAPPush.sendWAPPush({
			'body' : {
				"address" : number
			},
			'data' : xml,
			'contentType' : 'application/json',
			'accept' : 'application/json'

		}, function(data) {
			cbData(data);
			console.log('WAP Response : ' + data);
		}, function(error) {
			console.log('WAP Error : ' + error);
			cbData(JSON.stringify(error));
		});

	}
};

require.config({ baseUrl: '../../js/lib' });

define([ "require", "exports", "module", "att" ], function(require, exports,
		module) {

	/*
	 * require att.js in 'phonegap' variable
	 */

	phonegap = require('att');
	var scope = window.localStorage.getItem("scopeForAccessToken");

	/*
	 * grantType can have three values :
	 * client_credential,refresh_token,authorization_code For grantType =
	 * 'refresh_token',First user needs to send grantType = 'client_credential'.
	 * Once token generated , then only you can refresh Token.
	 */

	var grantType = 'client_credentials';
	// pass accessKey,secretKey,scope and grantType for authorization
	phonegap.ATT.authorize(accessKey, secretKey, scope, grantType);

});
