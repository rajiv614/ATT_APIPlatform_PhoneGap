//
//  ATTiOSPhonegapPlugin.h
//  ATTiOSPhonegapPlugin
//
//  Created by Global Logic on 10/23/12.
//  Copyright (c) 2012 Global Logic. All rights reserved.
//

#import "InAppMessagePlugin.h"
#import "MMSPlugin.h"
#import "SpeechPlugin.h"
#import "WapPushPlugin.h"

typedef enum att_request_type_enum
{
    ATT_MMS_REQUEST,
    ATT_INAPP_MESSAGE_REQUEST,
    ATT_WAPPUSH_REQUEST,
    ATT_SPEECH_TEXT_REQUEST,
    ATT_REQUEST_COUNT
}ATT_REQUEST_TYPE;

@protocol ATTPluginFeatureHandling <NSObject>

- (void) pluginFeature:(id)plugin didCompleteRequestWithData:(NSData*)data forRequest:(ATT_REQUEST_TYPE)requestType;
- (void) pluginFeature:(id)plugin didFailWithErrorString:(const NSString*)error forRequest:(ATT_REQUEST_TYPE)requestType;

@end

@interface ATTiOSPhonegapPlugin : NSObject
{
}



@end
