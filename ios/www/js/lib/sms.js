/**
 * @author GlobalLogic
 */

/*
 * Sample App using ATT Module exposing the ATT APIs to PhoneGap Mobile.
 */
/*
 * Variables used -
 * phonegap -variable to require att.js module
 */

var phonegap;

//Note: Application Developer should get access key,secret key and shortcode by registering on www.developer.att.com website
//and creating sample Application.

var accessKey =  window.localStorage.getItem("accessKey"); 
var secretKey =  window.localStorage.getItem("secretKey");
var shortcode = window.localStorage.getItem("shortcode"); 

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

	sendSMS : function(number, message, cbData) {
		phonegap.ATT.SMS.sendSMS({
			'accept' : 'application/json',
			'contentType' : 'application/json',
			'body' : {
				"Message" : message,
				"Address" : number
			}
		}, function(data) {
			var smsId = JSON.parse(data).Id;
			cbData(data, smsId);
		}, function(error) {
			console.log('Error invoking sendSMS: ' + error);
			cbData(error);
		});
	},

	/* GET SMS DELIVERY STATUS
	 * @param smsId -SmsId received in sendSMS response - Mandatory
	 */

	getSmsDeliveryStatus : function(messageId, cbData) {
		phonegap.ATT.SMS.getSMSDeliveryStatus({
			'smsId' : messageId,
			'accept' : 'application/json'

		}, function(data) {
			cbData(data);
		}, function(error) {
			console.log('error invoking GetSMSDeliveryStatus : ' + error);
			cbData(error);
		});
	},

	/* GET SMS
	 * @param registrationID -RegistrationID received when application is
	 * registered - Mandatory
	 */

	getSms : function(cbData) {
		phonegap.ATT.SMS.getSMS({
			'accept' : 'application/json',
			'registrationId' : shortcode
		}, function(data) {
			cbData(data);
		}, function(error) {
			console.log('error in get SMS : '+error);
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
	//pass accessKey,secretKey,scope and grantType for authorization
	phonegap.ATT.authorize(accessKey, secretKey, scope, grantType);

});

