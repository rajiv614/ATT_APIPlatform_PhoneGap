CONFIGURATION SETTING FOR APPLICATION
------------------------
To configure the application you have to do following steps:

1. Open the application in Xcode.
2. Open the file 'Cordova.plist' (Path:'Resources/Cordova.plist') in Xcode editor.
3. Expand the 'plugin' section.
4. Add the entry for module which wraps ATT API.
	KEY: 'AttPlugin'
	Value: 'ATTPhonegapHelper'
5. Expand the 'ExternalHosts' section.
6. Add the entry 'api.att.com' for AT&T APIs and <payment server domain> for payment API , to make their entry in whitelist.(Alternatively use wild card entry '*').
7. Set the key'OpenAllWhitelistURLsInWebView' to YES.
8. Add following configuration settings in index.html in OnDeviceReady() function. --

    For any API , set accessKey and secretKey of the application which is registered in AT&T account ---
    window.localStorage.setItem("accessKey", "your access key");
    window.localStorage.setItem("secretKey", "your secret key");
    
    For SMS API , set Offline shortCode of the application which is registered in AT&T account.This Offline shortCode is used in sms.js file ---    
    window.localStorage.setItem("shortcode", "Offline short code "); 
    
    For API's , which uses AccessToken for authorization , set scope for that APIs.
    APIs -- SMS,MMS,PAYMENT,SPEECH,WAP 
    window.localStorage.setItem("scopeForAccessToken", "Names of API which needs AccessToken");

    For APIs , which uses OauthToken for authorization,set scope and redirect_url for that APIs.
    APIs -- Device Location , In APP Messaging , Device Capabilities.

    Refer AT&T Documentation for various scope values for different APIs (https://developer.att.com).

    window.localStorage.setItem("scopeForOauthToken", "Names of API which needs OauthToken");
    window.localStorage.setItem("redirect_url", "It can be any html page");

    For Payment API , set notificationURL and MerchantPaymentRedirectUrl which is set at payment server.These two url's are used in notification.html and payment.js
    window.localStorage.setItem("notificationURL", "It can be any .aspx/.java page etc, depends on the language used for payment server");
    window.localStorage.setItem("MerchantPaymentRedirectUrl", "It can be any .aspx/.java page etc, depends on the language used for payment server");


RUN APPLICATION ON SIMULATOR
------------------------

FOR SPEECH API
------------
To test the application in simulator you need to copy the files in application sandbox.

You need to do following steps to copy audio files.
1. Goto the the path '~/library/Application Support/iphone simulator' in your mac.
2. Select the simulator version on which application is build earlier.
3. In selected version go to 'Applications' directory and select your application build directory.
4. In your application build directory go to the 'Documents' directory and paste the required audio files.

Example path:
	'~/Library/Application Support/iPhone Simulator/5.1/Applications/65222A69-085D-47DA-B187-4E9C402E8873/Documents'

FOR MMS & In-App Message API
------------
To test the application in simulator you need to copy the files in simulator photo library.	

You need to do following steps to copy image files.
1. Drag the files in iPhone simulator and it will automatically open the file in simulator browser.
2. You can see the attachment in simulator browser or you can directly browse the image from internet.
3. Hold your tap on image.
4. A popup will appear with options and choose the option 'save image'.
5. It will be saved in photo library. 

Run the application and select the API to test and now you can select your files from simulator.



RUN APPLICATION ON DEVICE
------------------------

FOR SPEECH API
------------
To test the application in device you need to copy the files in application sandbox for device.

DEBUG MODE
-----
You need to do following steps to copy audio files.
1. Open the Application in Xcode and connect the device.
2. Select the option Window->Organizer from the Xcode menu.
3. Select the 'Devices' tab.
4. Select your connected device from the left menu and expand the device options.
5. Select the 'Applications' from the tree option.
5. Select your application from the right pane.
6. In lower pane it will show data in sandbox of the application.
7. You have to upload the data in same format as it is there in app sandbox.
8. To upload the similar format data first download the app sandbox content.
9. Right click on file and select 'show package content'.
10. Add the file in 'Documents' directory.
11. Press 'Upload' option and choose your modified file.

FOR MMS & In-App Message APIs
------------
To test the application in device you need to copy the files in device photo library.	

You need to do following steps to copy image files in photo library.
2. you can directly browse the image from internet.
3. Hold your tap on image.
4. A popup will appear with options and choose the option 'save image'.
5. It will be saved in photo library. 

Run the application and select the API to test and now you can select your files.

