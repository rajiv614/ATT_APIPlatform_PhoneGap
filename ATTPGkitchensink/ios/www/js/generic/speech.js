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

	speech : function(path, context, language, cbData) {
		
		alert(path);
        var lastindex = path.lastIndexOf("/");
		var fileName = path.substring(lastindex + 1, (path.length));
		var fileExt = fileName.substring(fileName.lastIndexOf('.') + 1,
				(fileName.length));
        alert("fileext");
        alert(fileExt);
		var xargParam,contentlanguage;
		var xargPlatform = "ClientApp=ATTPgKitchenSink,ClientVersion=2.5.0,ClientScreen=Browser,ClientSdk=PhoneGap,DeviceType=SmartPhone,DeviceOs=IOS,";
		if(context == 'TV'){
			xargParam = "Search=true,Lineup=91983,NumResults=1";
		}else if(context == 'Generic'){
			contentlanguage = language;
		}
		
        /*
         * SpeechtoText
         * @param accept - will accept that kind of the response
         * @param contentType - format in which data is to be sent as an audio file
         * @param filePath - filepath where the audio file has to be sent to the api
         * @param xarg - This contains the additional properties of setting the number of results.
         * @param contentLanguage - This parameter has to be filled with the kind of language used in speech input
         * @param xSpeechContext - Th parmater is used to define the type of audio data analysis and respective response related to that category
         */
        
		phonegap.ATT.Speech.speechToText({
			'filePath' : path,
			'accept' : 'application/json',
			'contentType' : 'audio/' + fileExt,
			'xSpeechContext' : context,
			'contentLanguage' : contentlanguage,
			'xarg' : xargPlatform + xargParam

		}, function(data) {
			console.log('SpeechToText Response : ' + data);
            cbData(data);
			window.localStorage.removeItem("fileSelected");
			window.localStorage.removeItem("speechFilePath");
		}, function(error) {
			console.log('Error while converting SpeechToText  : ' + error);
			cbData(error);

		});
	}
};

require.config({
	baseUrl: '../../js/lib'
});

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

	// pass accessKey,secretKey,scope and grantType for authorization
	phonegap.ATT.authorize(accessKey, secretKey, scope, grantType);

});
