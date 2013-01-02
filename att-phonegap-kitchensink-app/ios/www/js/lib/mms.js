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

/*
 * CALLING ATT Module functions
 */

var ATT = {

	/* SEND MMS
	 test = 'Address=' + number + '&' + 'Priority=High' +'&'+ 'Subject=' + subject ;
	 urlbody = encodeURI(test);
	 * Mandatory @param Attachments -Attachments - Mandatory
	 * Developer can pass either filepath or fileObject(base64 urlencoded string) after picking image form gallery.
	 * for accept = application/xml
	 * var mmsId = $(data).attr('id');
	 * for accept =application/json
	 * var mmsId = JSON.parse(data).Id;
	 */

	sendmms : function(number, subject, cbData, imageobject) {
		var fileArray = [];
		var fileName;
		var image;
		for ( i = 0; i < imageobject.length; i++) {
			image = imageobject[i];
			fileName = new Date().getTime() + i + "image.jpeg";
			firstFile = {
				'fileName' : fileName,
				'fileType' : "image/jpeg",
				'fileObject' : image
			};
			fileArray.push(firstFile);

		}
		phonegap.ATT.MMS.sendMMS({
			'accept' : 'application/json',
			'body' : {
				"Address" : number,
				"Subject" : subject,
				"Priority" : "High"
			},
			'contentType' : 'application/json',
			'attachments' : fileArray
		}, function(data) {
			var mmsId = JSON.parse(data).Id;
			cbData(data, mmsId);
            console.log('send MMS response : '+data);
		}, function(error) {
			var response = JSON.stringify(error);
            console.log('send MMS error : '+ response);
			cbData(response);
		});

	},

	/* GET MMS DELIVERY STATUS
	 * @param id -mmsId received in sendMMS response - Mandatory
	 */

	getMmsDeliveryStatus : function(mmsId, cbData) {
		phonegap.ATT.MMS.getMMSDeliveryStatus({
			'id' : mmsId
		}, function(data) {
			cbData(data);
		}, function(error) {
			console.log('Get MMS Delivery Status error : ' + error);
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

