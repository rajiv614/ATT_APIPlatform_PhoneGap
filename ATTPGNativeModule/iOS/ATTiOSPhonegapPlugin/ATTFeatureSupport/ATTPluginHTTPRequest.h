//
//  ATTPluginHTTPRequest.h
//  ATTiOSPhonegapPlugin
//
//  Created by Global Logic on 10/23/12.
//  Copyright (c) 2012 Global Logic. All rights reserved.
//

@class ATTPluginHTTPRequest;
@protocol ATTPluginHTTPHandling <NSObject>

- (void) httpRequest:(ATTPluginHTTPRequest*)request didCompleteRequestWithData:(NSData*)data;
- (void) httpRequest:(ATTPluginHTTPRequest*)request didFailWithError:(NSError*)error;

@end

@interface ATTPluginHTTPRequest : NSObject
{
@private
    NSMutableData*      _responseData;
    id                  _delegate;
}
@property (nonatomic,readonly)  NSMutableData*    responseData;
@property (nonatomic,assign)  id    delegate;

- (id) initRequest:(NSURLRequest*)request withDelegate:(id)delegate;
- (void) sendMessageWithRequest:(NSURLRequest*)request;
@end
