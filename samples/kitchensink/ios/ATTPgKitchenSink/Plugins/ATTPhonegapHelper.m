
#import "ATTPhonegapHelper.h"
#import <Cordova/CDV.h>


@implementation ATTPhonegapHelper

@synthesize mmsCallbackID;
@synthesize inAppMessageCallbackID;
@synthesize speechCallbackID;
@synthesize ttsCallbackID;



- (void)sendMMS:(CDVInvokedUrlCommand*)command
{
    self.mmsCallbackID = command.callbackId;
    ///.....................................///
    MMSPlugin* mms = [[MMSPlugin alloc] initWithDelegate:self];
    [mms sendMMSWithArguments:[command.arguments objectAtIndex:0]];
    
}

#pragma mark-
#pragma mark send MOBO Message

- (void)sendMessage:(CDVInvokedUrlCommand*)command
{
    
    //.................Modify Instance variables..................../
    self.inAppMessageCallbackID = command.callbackId;
    ///.....................................///
    InAppMessagePlugin* inApp = [[InAppMessagePlugin alloc] initWithDelegate:self];
    [inApp sendInAppMessageWithArguments:[command.arguments objectAtIndex:0]];
}

- (void)speechToText:(CDVInvokedUrlCommand*)command
{
    
    //.................Modify Instance variables..................../
    self.speechCallbackID = command.callbackId;
    ///.....................................///
    SpeechPlugin* speech = [[SpeechPlugin alloc] initWithDelegate:self];
    [speech speechToTextWithArgument:[command.arguments objectAtIndex:0]];
}

- (void)textToSpeech:(CDVInvokedUrlCommand*)command
{
    
    //.................Modify Instance variables..................../
    self.ttsCallbackID = command.callbackId;
    ///.....................................///
    TTSPlugin* tts = [[TTSPlugin alloc] initWithDelegate:self];
    [tts textToSpeechWithArgument:[command.arguments objectAtIndex:0]];
}

- (void) pluginFeature:(id)plugin didCompleteRequestWithData:(NSData*)data forRequest:(ATT_REQUEST_TYPE)requestType
{
    NSString* callBackId = nil;
    switch (requestType)
    {
        case ATT_MMS_REQUEST:
            callBackId = self.mmsCallbackID;
            break;
        case ATT_INAPP_MESSAGE_REQUEST:
            callBackId = self.inAppMessageCallbackID;
            break;
        case ATT_SPEECH_TEXT_REQUEST:
            callBackId = self.speechCallbackID;
            break;
        case ATT_TTS_REQUEST:
            callBackId = self.ttsCallbackID;
            break;
        case ATT_REQUEST_COUNT:
            break;
        default:
            break;
    }
    NSString *returnString = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:returnString];
    [self writeJavascript: [pluginResult toSuccessCallbackString:callBackId]];
    [returnString release];
}

- (void) pluginFeature:(id)plugin didFailWithErrorString:(const NSString*)error forRequest:(ATT_REQUEST_TYPE)requestType
{
    NSString* callBackId = nil;
    switch (requestType)
    {
        case ATT_MMS_REQUEST:
            callBackId = self.mmsCallbackID;
            break;
        case ATT_INAPP_MESSAGE_REQUEST:
            callBackId = self.inAppMessageCallbackID;
            break;
        case ATT_SPEECH_TEXT_REQUEST:
            callBackId = self.speechCallbackID;
            break;
        case ATT_TTS_REQUEST:
            callBackId = self.ttsCallbackID;
            break;
        case ATT_REQUEST_COUNT:
            break;
        default:
            break;
    }
    CDVPluginResult* pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR messageAsString:(NSString*)error];
    [self writeJavascript: [pluginResult toErrorCallbackString:callBackId]];
}

@end
