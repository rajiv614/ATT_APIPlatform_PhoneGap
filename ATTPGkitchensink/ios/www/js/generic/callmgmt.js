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
var shortcode = window.localStorage.getItem("shortcode");

/*
 * CALLING ATT Module functions
 */

var CALL_ATT = {
    
    /**
	 * broadcast
	 * @param options.body JSON object containing parameters od number to message the data, messageText contains the content and feature used is broadcast
	 * @param options.contentType The message content that is passes from application to plugin
	 * @param options.accept Format in which data will be formatted on return
	 */

	broadcast : function(number, message, cbData) {

		phonegap.ATT.CallMgmt.createSession({
			'accept' : 'application/json',
			'contentType' : 'application/json',
			'body' : {
				"numberToDial" : number,
				"messageText"  : message,
				"feature" : "broadcastMsg"
			}
		}, function(data) {
			cbData(data);
		}, function(error) {
			console.log('Error invoking createSession: ' + error);
		});
	},

	conference : function(number, cbData) {
	
		phonegap.ATT.CallMgmt.createSession({
			'accept' : 'application/json',
			'contentType' : 'application/json',
			'body' : {
				"numberToDial" : number,
				"feature" : "makeConf"
			}
		}, function(data) {
			cbData(data);
		}, function(error) {
			alert("Conference Failed due to : " + error);
			console.log('Error invoking createSession: ' + error);
		});
	},
	
	sendsignal : function(sessionId, cbData) {
		
		phonegap.ATT.CallMgmt.sendSignal({
			'accept' : 'application/json',
			'contentType' : 'application/json',
			'cmsId' : sessionId,
			'body' : {
				"signal" : "exit"
			}
		}, function(data) {
			cbData(data);
		}, function(error) {
			alert("send signal Failed due to : " + error);
			console.log('Error invoking createSession: ' + error);
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
	// pass accessKey,secretKey,scope and grantType for authorization
	phonegap.ATT.authorize(accessKey, secretKey, scope, grantType);

});
