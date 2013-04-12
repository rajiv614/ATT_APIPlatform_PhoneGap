//
//  MMSPlugin.h
//  ATTiOSPhonegapPlugin
//
//  Created by Global Logic on 10/23/12.
//  Copyright (c) 2012 Global Logic. All rights reserved.
//

#import "ATTPluginHTTPRequest.h"
@protocol ATTPluginFeatureHandling;

@interface MMSPlugin : NSObject<ATTPluginHTTPHandling>
{
@private
    id<ATTPluginFeatureHandling>                _delegate;
}

- (id) initWithDelegate:(id<ATTPluginFeatureHandling>)delegate;
- (void) sendMMSWithArguments:(NSMutableDictionary*)options;
@end
