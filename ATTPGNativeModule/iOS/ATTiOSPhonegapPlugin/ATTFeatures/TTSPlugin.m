//
//  SpeechPlugin.m
//  ATTiOSPhonegapPlugin
//
//  Created by Saurav Nagpal on 10/23/12.
//  Copyright (c) 2012 Saurav Nagpal. All rights reserved.
//

#import "NSData+Base64.h"
#import "TTSPlugin.h"

@implementation TTSPlugin

- (id) initWithDelegate:(id)delegate
{
    self = [super init];
    _delegate = delegate;
    return self;
}

- (void) dealloc
{
    _delegate = nil;
    [super dealloc];
}

-(void) textToSpeechWithArgument:(NSMutableDictionary*)options
{
    //.................Intiliaze Local variables......................./
    
    const NSDictionary* audioRequestparameter = options;
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    
    NSString *filePath = /*_filePath = */[NSString stringWithFormat:@"%@",[audioRequestparameter valueForKey:@"filePath"]];
    
    NSUserDefaults * standardUserDefaults = [NSUserDefaults standardUserDefaults];
    
    // saving an NSString
    [standardUserDefaults setObject:filePath forKey:@"filePATH"];

    // synchronize the settings
    [standardUserDefaults synchronize];
    
    NSString *url = [NSString stringWithFormat:@"%@",[audioRequestparameter valueForKey:@"url"]];
    [request setURL:[NSURL URLWithString:url]];
    
    [request setHTTPMethod:@"POST"];
    
    NSString *token = [NSString stringWithFormat:@"%@",[audioRequestparameter valueForKey:@"token"]];
    [request setValue:token forHTTPHeaderField:@"Authorization"];
    
    NSString *contentType = [NSString stringWithFormat:@"%@",[audioRequestparameter valueForKey:@"contentType"]];
    [request setValue:contentType forHTTPHeaderField:@"Content-Type"];
    
    NSString *accept = [NSString stringWithFormat:@"%@",[audioRequestparameter valueForKey:@"accept"]];
    if(accept != nil && 0 < [accept length])
    {
        [request setValue:accept forHTTPHeaderField:@"Accept"];
    }
    
    NSString *xarg = [NSString stringWithFormat:@"%@",[audioRequestparameter valueForKey:@"xarg"]];
    if(xarg != nil && 0 < [xarg length]){
        [request setValue:xarg forHTTPHeaderField:@"X-Arg"];
    }
    
    NSMutableData *body = [NSMutableData data];
    NSString *textBody = [NSString stringWithFormat:@"%@",[audioRequestparameter valueForKey:@"body"]];
    [body appendData:[[NSString stringWithFormat:@"%@",textBody] dataUsingEncoding:NSUTF8StringEncoding]];
    [request setHTTPBody:body];
    
    ATTPluginHTTPRequest* httpRequest = [[ATTPluginHTTPRequest alloc] initRequest:request withDelegate:self];
    [httpRequest autorelease];
    _ReleaseObj(request);
}

#pragma mark -
#pragma mark HTTP Delegate
- (void) httpRequest:(ATTPluginHTTPRequest*)request didCompleteRequestWithData:(NSData*)data
{
    NSUserDefaults *standardUserDefaults = [NSUserDefaults standardUserDefaults];
    // getting an NSString object
    NSString *filePath = [standardUserDefaults stringForKey:@"filePATH"];
    if(nil != filePath){
        if(true == [data writeToFile:filePath atomically:YES]){
            NSData *newData = [filePath dataUsingEncoding:NSUTF8StringEncoding];
            if([_delegate respondsToSelector:@selector(pluginFeature:didCompleteRequestWithData:forRequest:)])
                [_delegate pluginFeature:self didCompleteRequestWithData:newData forRequest:ATT_TTS_REQUEST];
        }else{
            _sendErrorMessageToDelegate(_delegate,@"Error saving data to file",ATT_TTS_REQUEST);
        }
    }
}

- (void) httpRequest:(ATTPluginHTTPRequest*)request didFailWithError:(NSError*)error
{
    _sendErrorMessageToDelegate(_delegate,errorMessage,ATT_TTS_REQUEST);
}

@end