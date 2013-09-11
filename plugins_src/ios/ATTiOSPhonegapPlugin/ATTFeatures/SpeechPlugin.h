//
//  SpeechPlugin.h
//  ATTiOSPhonegapPlugin
//
//  Created by Saurav Nagpal on 10/23/12.
//  Copyright (c) 2013 AT&T. All rights reserved.
//

#import "ATTPluginHTTPRequest.h"
@protocol ATTPluginFeatureHandling;


@interface SpeechPlugin : NSObject<ATTPluginHTTPHandling>
{
@private
    id<ATTPluginFeatureHandling>                  _delegate;
}

- (id) initWithDelegate:(id<ATTPluginFeatureHandling>)delegate;
-(void) speechToTextWithArgument:(NSMutableDictionary*)options;
@end
