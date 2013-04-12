//
//  ATTPluginHTTPRequest.m
//  ATTiOSPhonegapPlugin
//
//  Created by Global Logic on 10/23/12.
//  Copyright (c) 2012 Global Logic. All rights reserved.
//

#import "ATTPluginContant.h"
#import "ATTPluginHTTPRequest.h"

@implementation ATTPluginHTTPRequest
@synthesize responseData = _responseData;
@synthesize delegate = _delegate;

#pragma mark-
#pragma mark Http Request
- (id) initRequest:(NSURLRequest*)request withDelegate:(id)delgate
{
    self = [super init];
    self.delegate =  delgate;
    NSURLConnection* urlConnection = [[[NSURLConnection alloc] initWithRequest:request delegate:self] autorelease];
    [urlConnection start];
    return self;
}
- (void) sendMessageWithRequest:(NSURLRequest*)request
{
    NSURLConnection* urlConnection = [[[NSURLConnection alloc] initWithRequest:request delegate:self] autorelease];
    [urlConnection start];
}
- (void) dealloc
{
    _ReleaseObj(_responseData);
    _delegate = nil;
    [super dealloc];
}
#pragma mark -
#pragma mark connection Delegate

- (void)connection:(NSURLConnection *)connection didFailWithError:(NSError *)error
{
    if([_delegate conformsToProtocol:@protocol(ATTPluginHTTPHandling)])
        [_delegate httpRequest:self didFailWithError:error];
    _ReleaseObj(_responseData);
}
- (void)connection:(NSURLConnection *)connection didReceiveResponse:(NSURLResponse *)response
{
    _ReleaseObj(_responseData);
    _responseData = [[NSMutableData alloc] init];
}

- (void)connection:(NSURLConnection *)connection didReceiveData:(NSData *)data
{
    [_responseData appendData:data];
}

- (void)connectionDidFinishLoading:(NSURLConnection *)connection
{
    if([_delegate conformsToProtocol:@protocol(ATTPluginHTTPHandling)])
        [_delegate httpRequest:self didCompleteRequestWithData:_responseData];
    _ReleaseObj(_responseData);
}

@end
