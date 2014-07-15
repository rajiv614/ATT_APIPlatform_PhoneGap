//
//  InAppMessagePlugin.h
//  ATTiOSPhonegapPlugin
//
//  Created by Saurav Nagpal on 10/23/12.
//  Copyright (c) 2013 AT&T. All rights reserved.
//

#import "ATTPluginHTTPRequest.h"
@protocol ATTPluginFeatureHandling;


@interface InAppMessagePlugin : NSObject<ATTPluginHTTPHandling>
{
@private
    id<ATTPluginFeatureHandling>                  _delegate;
}

- (id) initWithDelegate:(id<ATTPluginFeatureHandling>)delegate;
- (void)sendInAppMessageWithArguments:(NSMutableDictionary*)options;

@end
