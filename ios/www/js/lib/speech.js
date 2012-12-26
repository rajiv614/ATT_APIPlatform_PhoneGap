/**
 * @author GlobalLogic
 */

/*
* Sample App using ATT Module exposing the ATT APIs to PhoneGap Mobile.
*/

//Note: Application Developer should get access key,secret key and shortcode by registering on www.developer.att.com website
//and creating sample Application.

var accessKey = window.localStorage.getItem("accessKey");
var secretKey = window.localStorage.getItem("secretKey");

/*
 * Variables used -
 * phonegap -variable to require att.js module
 */

var phonegap;

/*
 * CALLING ATT Module functions
 */

var ATT = {
	/* SEND SMS
	 *@param body- Will contain two values Message and Address
	 *@param contentType- format in which data is to be sent
	 * Example:
	 *  contentType @ application/json
	 'body':{ "Message":"Test AT&T Sms","Address":"tel:+XXXXXXXXXX,tel:XXXXXXXXXX"}
	 * contentType @ application/xml
	 'body':"<SmsRequest><Address>tel:XXXXXXXXXX,tel:XXXXXXXXXX</Address><Message>Test XML</Message></SmsRequest>"
	 * contentType @ application/x-www-form-urlencoded
	 SAMPLE :  test = 'Address=' + number + '&' + 'Message=' +message;
	 urlbody = encodeURI(test);
	 'body':"Address=tel%3AXXXXXXXXXX&Message=URL%20ENCODED"
	 * for accept = application/xml
	 * var smsId = $(data).attr('id');
	 * for accept =application/json
	 * var smsId = JSON.parse(data).Id;
	 */

	speech : function(path, cbData) {
        var lastindex, fileName, fileExt;
		lastindex = path.lastIndexOf("/");
		fileName = path.substring(lastindex + 1, (path.length));
		fileExt = fileName.substring(fileName.lastIndexOf('.') + 1, (fileName.length));
		phonegap.ATT.Speech.speechToText({
			'filePath' : path,
			'accept' : 'application/json',
			'contentType' : 'audio/' + fileExt,
			'xSpeechContext' : 'SMS'

		}, function(data) {
			cbData(data);
            console.log('SpeechToText Response : '+data);
            window.localStorage.removeItem("fileSelected"); 
            window.localStorage.removeItem("speechFilePath");                            
		}, function(error) {
			console.log('Error while converting SpeechToText  : '+error);
			cbData(error);

		});
	}
};

define(["require", "exports", "module", "att"], function(require, exports, module) {

	/*
	 *require att.js in 'phonegap' variable
	 */

	phonegap = require('att');
	var scope = window.localStorage.getItem("scopeForAccessToken");

	/*
	 *grantType can have three values :
	 *client_credential,refresh_token,authorization_code
	 *For grantType = 'refresh_token',First user needs to send grantType = 'client_credential'.
	 *Once token generated , then only you can refresh Token.
	 */

	var grantType = 'client_credentials';
	console.log('ATT Required : ' + JSON.stringify(phonegap));

	//pass accessKey,secretKey,scope and grantType for authorization
	phonegap.ATT.authorize(accessKey, secretKey, scope, grantType);

});

