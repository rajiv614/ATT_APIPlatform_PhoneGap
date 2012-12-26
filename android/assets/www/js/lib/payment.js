/**
 * @author GlobalLogic
 */

/*
 * Sample App using ATT Module exposing the ATT APIs to PhoneGap Mobile.
 */

/*
 * Variables used - phonegap -variable to require att.js module scope- variable
 * to define scope of application.
 */

var phonegap;
// Note: Application Developer should get access key,secret key and shortcode by
// registering on www.developer.att.com website
// and creating sample Application.

var accessKey = window.localStorage.getItem("accessKey");
var secretKey = window.localStorage.getItem("secretKey");
var MerchantPaymentRedirectUrl = "http://att.somee.com/ATTNotifications/PaymentSuccess.aspx";
var Amount = "0.99";
var Category = 1;
var Channel = "MOBILE_WEB";
var Description = "Test phonegap";
var IsPurchaseOnNoActiveSubscription = false;
var SubscriptionRecurrences = 99999;
var SubscriptionPeriod = 'MONTHLY';
var SubscriptionPeriodAmount = 1;
/*
 * CALLING ATT Module functions
 */

var ATT = {

	/*
	 * NOTARY SIGN PAYLOAD @param Data -notaryData - Mandatory @param Client_id
	 * -Client_id - Mandatory @param Client_secret -Client_secret - Mandatory
	 */

	notary : function(cbData) {
		var date = new Date(), ticks = date.getTime(), min = 1000000000, max = 9999999999, rnd = Math
				.floor(Math.random() * (max - min + 1))
				+ min;
		window.localStorage.MerchantTransactionId = "skuser" + rnd;
		var notaryData = {
			"Amount" : Amount,
			"Category" : Category,
			"Channel" : Channel,
			"Description" : Description,
			"MerchantTransactionId" : "skuser" + rnd,
			"MerchantProductId" : "l" + rnd,
			"MerchantPaymentRedirectUrl" : MerchantPaymentRedirectUrl,
			"MerchantSubscriptionIdList" : 'ML' + rnd,
			"IsPurchaseOnNoActiveSubscription" : IsPurchaseOnNoActiveSubscription,
			"SubscriptionRecurrences" : SubscriptionRecurrences,
			"SubscriptionPeriod" : SubscriptionPeriod,
			"SubscriptionPeriodAmount" : SubscriptionPeriodAmount
		};

		phonegap.ATT.Notary.signedPayload({
			'data' : notaryData,
			'clientId' : accessKey,
			'clientSecret' : secretKey,
			'contentType' : 'application/json'

		}, function(data) {
			var dataJSON = JSON.parse(data);
			console.log('Notary success :' + data);
			cbData(dataJSON.SignedDocument, dataJSON.Signature);

		}, function(error) {
			console.log('Notary Fail :' + error);
			cbData(error);
		});
	},

	transaction : function(type) {
		if (type === "transaction") {
			ATT.notary(ATT.newTransaction);
		} else if (type === "subscription") {
			ATT.notary(ATT.setSubscription);
		}
	},

	/*
	 * NEW TRANSACTION @param SignedDocument -SignedDocument(received after
	 * calling sign payload)- Mandatory @param Signature -Signature(received
	 * after calling sign payload)- Mandatory @param ClientId - client- id for
	 * which app is registered for payment - Mandatory
	 */

	newTransaction : function(signedDocument, signature) {
		phonegap.ATT.Payment.newTransaction({
			"signedDocument" : signedDocument,
			"signature" : signature,
			"clientId" : accessKey
		}, function(data) {
			document.getElementById("transactionFrame").src = data;
			$("#transactionFrame").load(
					function() {
						$("#iframe").show();
						var url = this.contentDocument.location.href;
						if (url.indexOf('success') !== -1) {
							$("#iframe").hide();
						} else {
							if (url.indexOf('TransactionAuthCode') !== -1) {
								var index = url.indexOf("TransactionAuthCode");
								window.localStorage.TransactionAuthCode = url
										.substr(index + 20, url.length + 1);
								$("#btntransactionstatus").attr("disabled",
										false);
								$("#iframe").hide();
							}
						}
					});

		}, function(error) {
			console.log('New Transaction Failed : ' + JSON.stringify(error));
		});
	},

	/*
	 * GET TRANSACTION STATUS - Status can be check passing one of the following :-
	 * 1)@param TransactionAuthCode -TransactionAuthCode(received after calling
	 * new transaction). 2)@prams MerchantTransactionId -"skuser" + ticks;
	 * 3)@param TransactionId
	 */

	gettransactionstatus : function(OauthCode) {
		phonegap.ATT.Payment
				.getTransactionStatus(
						{
							"transactionAuthCode" : OauthCode
						},
						function(data) {
							var result = JSON.parse(data);
							if (result.TransactionId.length > 19) {
								transacId = result.TransactionId.substring(0,
										18)
										+ '..';
							} else {
								transacId = result.TransactionId;
							}
							var newRow = $("<tr class=\"txrow\" id=\""
									+ result.TransactionId
									+ "\"><td align=\"left\" class=\"txcolleft\">"
									+ transacId
									+ "</td>"
									+ "<td align=\"right\" class=\"txcolright\"><input type=\"radio\" name=\"rdtransaction\"></td></tr>");
							$("#txtable").append(newRow);
							newRow
									.find('td input:radio')
									.click(
											function() {
												window.localStorage.TransactionId = result.TransactionId
												$("#refundtransaction").attr(
														"disabled", false);
											});
							$("#btntransactionstatus").attr("disabled", true);
							console
									.log('GetTransactionStatus Success :'
											+ data);
						},
						function(error) {
							console.log('GetTransactionStatus Error :' + error);
							alert('GetTransactionStatus Error :' + error);
						});

	},

	/*
	 * REFUND TRANSACTION - @param TransactionOperationStatus - value = Refunded -
	 * Mandatory @param RefundReasonCode - Mandatory @param RefundReasonText -
	 * Mandatory @param transactionID - get after calling gettransactionstatus -
	 * Mandatory
	 */

	refundtransaction : function() {
		phonegap.ATT.Payment
				.refundTransaction(
						{
							"body" : "<RefundTransactionRequest><TransactionOperationStatus>Refunded</TransactionOperationStatus><RefundReasonCode>1</RefundReasonCode><RefundReasonText>Customer was unhappy</RefundReasonText></RefundTransactionRequest>",
							"transactionId" : window.localStorage.TransactionId,
							"contentType" : "application/xml",
							"action" : "refund"
						},
						function(data) {

							$("#txtable tr")
									.each(
											function() {
												if (this.id == window.localStorage.TransactionId) {
													$(this).remove();
													window.localStorage
															.removeItem("TransactionId");
													$("#refundtransaction")
															.attr("disabled",
																	"true");
												}
											});
							alert('RefundTransaction Success :' + data);
							console.log('RefundTransaction Success :' + data);
						}, function(error) {
							alert('RefundTransaction Error :' + error);
							console.log('RefundTransaction Error :' + error);
						});

	},

	/*
	 * NEW SUBSCRIPTION @param SignedDocument -SignedDocument(received after
	 * calling sign payload)- Mandatory @param Signature -Signature(received
	 * after calling sign payload)- Mandatory @param ClientId - client- id for
	 * which app is registered for payment - Mandatory
	 */

	setSubscription : function(signedDocument, signature) {
		phonegap.ATT.Payment
				.newSubscription(
						{
							"signedDocument" : signedDocument,
							"signature" : signature,
							'clientId' : accessKey
						},
						function(data) {
							document.getElementById("transactionFrame").src = data;

							$("#transactionFrame")
									.load(
											function() {
												$("#iframe").show();

												var url = this.contentDocument.location.href;
												if (url.indexOf('success') != -1) {
													$("#iframe").hide();
												} else {
													if (url
															.indexOf('SubscriptionAuthCode') !== -1) {
														var index = url
																.indexOf("SubscriptionAuthCode");
														window.localStorage.subscriptionAuthCode = url
																.substr(
																		index + 21,
																		url.length + 1);
														$(
																"#btnsubscriptionstatus")
																.attr(
																		"disabled",
																		false);
														$(
																"#btnsubscriptiondetails")
																.attr(
																		"disabled",
																		false);
														$("#iframe").hide();
													}
												}
											});

						}, function(error) {
							console.log('set Subscription error : ' + error);
						});

	},

	/*
	 * GET SUBSCRIPTION STATUS - Status can be check passing one of the
	 * following :- 1)@param subscriptionAuthCode -SubscriptionAuthCode(received
	 * after calling new Subscription). 2)@prams merchantTransactionId -passed
	 * in payload 3)@param subscriptionId -
	 */

	getSubscriptionStatus : function() {
		phonegap.ATT.Payment
				.getSubscriptionStatus(
						{
							"subscriptionAuthCode" : window.localStorage.subscriptionAuthCode
						},
						function(data) {
							var result = JSON.parse(data);
							if (result.SubscriptionId.length > 19) {
								subscrptnId = result.SubscriptionId.substring(
										0, 18)
										+ '..';
							} else {
								subscrptnId = result.SubscriptionId;
							}
							window.localStorage.MerchantSubscriptionId = result.MerchantSubscriptionId;
							window.localStorage.SubsConsumerId = result.ConsumerId;

							var newRow = $("<tr class=\"txrow\" id=\""
									+ result.SubscriptionId
									+ "\"><td align=\"left\" class=\"txcolleft\">"
									+ subscrptnId
									+ "</td>"
									+ "<td align=\"right\" class=\"txcolright\"><input type=\"radio\" name=\"rdtransaction\"></td></tr>");
							$("#txtable").append(newRow);
							newRow
									.find('td input:radio')
									.click(
											function() {
												window.localStorage.TransactionId = result.SubscriptionId
												$("#refundtransaction").attr(
														"disabled", false);
											});
							$("#btnsubscriptionstatus").attr("disabled", true);
						}, function(error) {
							alert("GetSubscriptionStatus Error :" + error);
							console
									.log("GetSubscriptionStatus Error :"
											+ error);
						});

	},

	/*
	 * GET SUBSCRIPTION DETAILS - @param ConsumerId -ConsumerId(received after
	 * calling getSubscriptionStatus). @prams MerchantSubscriptionId -
	 * MerchantSubscriptionId(received after calling getSubscriptionStatus).
	 */

	getSubscriptionDetails : function() {
		phonegap.ATT.Payment
				.getSubscriptionDetails(
						{
							'consumerId' : window.localStorage.SubsConsumerId,
							'merchantSubscriptionId' : window.localStorage.MerchantSubscriptionId
						},
						function(data) {
							alert("GetSubscriptionDetails Success:" + data);
							console.log("GetSubscriptionDetails Success:"
									+ data);
							$("#btnsubscriptiondetails").attr("disabled", true);
						}, function(error) {
							alert("GetSubscriptionDetails Error:" + error);
							console
									.log("GetSubscriptionDetails Error:"
											+ error);
						});

	},

	/*
	 * GET NOTIFICATION - @param NotificationID - Get NotificationID From App
	 * Hosted Through Tunnlr
	 */

	getNotification : function(notificationId) {
		phonegap.ATT.Payment.getNotification({
			'notificationId' : notificationId
		}, function(data) {
			alert("GetNotification Success" + data);
			console.log("GetNotification Success" + data);
		}, function(error) {
			alert("GetNotification Error" + error);
			console.log("GetNotification Error" + error);
		});

	},

	/*
	 * ACKNOWLEDGE NOTIFICATION - @param NotificationID - Get NotificationID
	 * From App Hosted Through Tunnlr
	 */

	acknowledgeNotification : function(notificationId) {
		phonegap.ATT.Payment.acknowledgeNotification({
			'notificationId' : notificationId
		}, function(data) {
			var result = JSON.parse(data);
			console.log("AcknowleadgeNotification Success" + data);
			alert("AcknowleadgeNotification Success" + data);
			$("#notificationtable tr").each(
					function() {
						if (this.id == notificationId) {
							$(this).remove();
							$("#btngetnotification").attr("disabled", true);
							$("#btnacknowledgeNotification").attr("disabled",
									true);

							var originalList = $("#notificationIdToBeRemoved")
									.val();
							if ($("#notificationIdToBeRemoved").val() != "") {
								var originalList = originalList + ",";
							}
							$("#notificationIdToBeRemoved").val(
									originalList + notificationId);
						}
					});
		}, function(error) {
			console.log("AcknowleadgeNotification Error" + error);
			alert("AcknowleadgeNotification Error" + error);
		});

	}
};

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
	// console.log('ATT Required : ' + JSON.stringify(phonegap));

	// pass accessKey,secretKey,scope and grantType for authorization
	phonegap.ATT.authorize(accessKey, secretKey, scope, grantType);

});
