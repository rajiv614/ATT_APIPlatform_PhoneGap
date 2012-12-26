
#import "ATTPhonegapHelper.h"


@implementation ATTPhonegapHelper

@synthesize wapPushCallbackID;
@synthesize mmsCallbackID;
@synthesize inAppMessageCallbackID;
@synthesize speechCallbackID;



- (void)sendMMS:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    self.mmsCallbackID = [arguments objectAtIndex:0];
    ///.....................................///
    MMSPlugin* mms = [[MMSPlugin alloc] initWithDelegate:self];
    [mms sendMMSWithArguments:options];
    
}

#pragma mark-
#pragma mark send MOBO Message

- (void)sendMessage:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    
    //.................Modify Instance variables..................../
    self.inAppMessageCallbackID = [arguments objectAtIndex:0];
    ///.....................................///
    InAppMessagePlugin* inApp = [[InAppMessagePlugin alloc] initWithDelegate:self];
    [inApp sendInAppMessageWithArguments:options];
}

#pragma mark-
#pragma mark send Wap Push Message

- (void)sendWAPPush:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    
    //.................Modify Instance variables..................../
    self.wapPushCallbackID = [arguments objectAtIndex:0];
    ///.....................................///
    WapPushPlugin* wapPush = [[WapPushPlugin alloc] initWithDelegate:self];
    [wapPush sendWAPPushWithArgument:options];
}

- (void)speechToText:(NSMutableArray*)arguments withDict:(NSMutableDictionary*)options
{
    
    //.................Modify Instance variables..................../
    self.speechCallbackID = [arguments objectAtIndex:0];
    ///.....................................///
    SpeechPlugin* speech = [[SpeechPlugin alloc] initWithDelegate:self];
    [speech speechToTextWithArgument:options];
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
        case ATT_WAPPUSH_REQUEST:
            callBackId = self.wapPushCallbackID;
            break;
        case ATT_SPEECH_TEXT_REQUEST:
            callBackId = self.speechCallbackID;
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
        case ATT_WAPPUSH_REQUEST:
            callBackId = self.wapPushCallbackID;
            break;
        case ATT_SPEECH_TEXT_REQUEST:
            callBackId = self.speechCallbackID;
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
