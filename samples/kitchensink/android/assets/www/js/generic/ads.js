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

// Note: Application Developer should get access key,secret key and merchantID by
// registering on www.developer.att.com website
// and creating sample Application.

var accessKey = window.localStorage.getItem("accessKey");
var secretKey = window.localStorage.getItem("secretKey");
var udid = window.localStorage.getItem("merchantID");

/*
 * CALLING ATT Module functions
 */

var ATT = {
	/**
	 * GET ADS
	 * @param options.body Flat object containing parameters for your ads request
	 * @param options.udid Merchant ID obtained through AT&T
	 * @param options.accept Format in which data will be formatted on return
	 */
	getAds: function(category, options, cbData, cbError) {
		
		var adsOptions = $.extend({ Category: category}, options);
		
		phonegap.ATT.Ads.getAds({
			'accept' : 'application/json',
			'udid' : udid,
			'body' : adsOptions
		}, cbData, cbError);
	}

};

require.config({ baseUrl: '../../js/lib' });

define([ "require", "exports", "module", "att" ], function(require, exports,
		module) {

	/*
	 * require att.js in 'phonegap' variable
	 */

	phonegap = require('att');
	var scope = 'ADS'; //window.localStorage.getItem("scopeForAccessToken");

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
