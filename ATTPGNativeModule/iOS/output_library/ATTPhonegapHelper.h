//
//  ViewController.h
//  MMSTest
//
//  Created by  on 9/4/12.
//  Copyright (c) 2012 __MyCompanyName__. All rights reserved.
//

#import "ATTiOSPhonegapPlugin.h"
#import <Foundation/Foundation.h>
#import <Cordova/CDV.h>

@interface ATTPhonegapHelper : CDVPlugin <NSURLConnectionDelegate,NSURLConnectionDataDelegate,ATTPluginFeatureHandling>
{
    NSString*           mmsCallbackID;
    NSString*           inAppMessageCallbackID;
    NSString*           speechCallbackID;
    NSString*           wapPushCallbackID;
    NSString*           ttsCallbackID;
    
}
@property(nonatomic,copy)NSString* mmsCallbackID;
@property(nonatomic,copy)NSString* inAppMessageCallbackID;
@property(nonatomic,copy)NSString* speechCallbackID;
@property(nonatomic,copy)NSString* wapPushCallbackID;
@property(nonatomic,copy)NSString* ttsCallbackID;

@end