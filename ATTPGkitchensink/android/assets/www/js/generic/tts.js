/**
 * @author GlobalLogic
 */

/*
 * Sample App using ATT Module exposing the ATT APIs to PhoneGap Mobile.
 */

// Note: Application Developer should get access key,secret key and shortcode by
// registering on www.developer.att.com website
// and creating sample Application.

var accessKey = window.localStorage.getItem("accessKey");
var secretKey = window.localStorage.getItem("secretKey");

/*
 * Variables used - phonegap -variable to require att.js module
 */

var phonegap;

/*
 * CALLING ATT Module functions
 */

var ATT = {
		
		/*
		 * TextToSpeech 
	     * @param body- Will contain FLAT text that has to converted to audio
	     * @param accept - will accept that kind of audio file in response
		 * @param contentType - format in which data is to be sent
	     * @param filePath - filepath where the audio file has to be saved by the plugin
	     * @param xarg - This contains the additional properties of setting the voice, tone, volume etc.
		 */

		textToSpeech: function( text, language, voice, path, successCB,failureCB) {

		var contentType = 'text/plain';
		var filePath    = path + "/tts.wav";
		
		phonegap.ATT.tts.textToSpeech({
			'accept' : 'audio/wav',
			'contentType' : contentType,
			'body':text,
			"filePath" : filePath,
			'xarg' : voice

		}, function(data) {
			console.log('textToSpeech Response : ' + data);
			successCB(data);
		}, function(error) {
			console.log('Error while converting textToSpeech  : ' + error);
		    failureCB(error);
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
	console.log('ATT Required : ' + JSON.stringify(phonegap));
	console.log('Scope : ' + scope);
	// pass accessKey,secretKey,scope and grantType for authorization
	phonegap.ATT.authorize(accessKey, secretKey, scope, grantType);

});
