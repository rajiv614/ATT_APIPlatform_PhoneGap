//
//  MMSPlugin.m
//  ATTiOSPhonegapPlugin
//
//  Created by Global Logic on 10/23/12.
//  Copyright (c) 2013 AT&T. All rights reserved.
//

#import "NSData+Base64.h"
#import "MMSPlugin.h"

@interface  MMSPlugin(PRIVATEMETHODS)
- (void) sendErrorMessage:(const NSString*)message;
@end

@implementation MMSPlugin

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

- (void) sendMMSWithArguments:(NSMutableDictionary*)options
{
    ///.....................................///
    
    //.................Intiliaze Local variables......................./
    const NSDictionary* mmsRequestparameter = options;
    NSMutableURLRequest *request = [[NSMutableURLRequest alloc] init];
    NSMutableData *body = [NSMutableData data];
    NSString *contentTypeHeader = nil;
    NSString *paramValue= nil;
    NSString *subject = nil;
    NSString*        contentType = nil;
    NSUInteger       contentValue;
    ///.....................................///

    //.................Procedure......................./
    //Set Header of request
    [request setHTTPMethod:REQUESTMETHOD];
    _setRequiredParamAndCheckFailure(mmsRequestparameter,KEYURL,paramValue,errorMessage);
    [request setURL:[NSURL URLWithString:paramValue]];
    _setRequiredParamAndCheckFailure(mmsRequestparameter,KEYTOKEN,paramValue,errorMessage);
    [request setValue:paramValue forHTTPHeaderField:@"Authorization"];
    _setOptionalParam(mmsRequestparameter,KEYACCEPTTYPE,paramValue);
    [request setValue:paramValue forHTTPHeaderField:@"Accept"];
    //    acceptType = ([paramValue isEqualToString:CONTENTTYPEXML] == TRUE) ? CONTENTXML : CONTENTJSON;
    
    //.. check and set content type
    _setOptionalParam(mmsRequestparameter,KEYCONTENTTYPE,contentType);
    (([contentType isEqualToString:CONTENTTYPEXML] == TRUE) ? (contentValue = CONTENTXML) : ([contentType isEqualToString:CONTENTTYPEURLENCODED] == TRUE) ?
     (contentValue = CONTENTURLENCODED) : (contentValue = CONTENTJSON));
    contentTypeHeader =  [NSString stringWithFormat:@"multipart/form-data; type=\"%@\"; start=\"<startpart>\"; boundary=\"%@\"",contentType,requestBoundry];
    [request addValue:contentTypeHeader forHTTPHeaderField: @"Content-Type"];
    
    //Set body of request set recipent address
    [body appendData:[[NSString stringWithFormat:@"--%@\r\n",requestBoundry] dataUsingEncoding:NSUTF8StringEncoding]];
    [body appendData:[[NSString stringWithFormat:@"Content-Type:%@\r\n",contentType] dataUsingEncoding:NSUTF8StringEncoding]];
    [body appendData:[[NSString stringWithFormat:@"Content-ID:<startpart>\r\n"] dataUsingEncoding:NSUTF8StringEncoding]];
    [body appendData:[[NSString stringWithFormat:@"Content-Disposition:form-data; name=\"root-fields\"\r\n\r\n"] dataUsingEncoding:NSUTF8StringEncoding]];
#ifdef BODYHASTOBECREATED
    NSString *txtBody = [mmsRequestparameter objectForKey:KEYMESSAGEBODY];
    NSDictionary* messageBody= [mmsRequestparameter objectForKey:KEYMESSAGEBODY];
    if(messageBody != nil)
    {
        switch (contentValue)
        {
            case CONTENTJSON:
            {
                NSData *data = [txtBody dataUsingEncoding:NSUTF8StringEncoding];
                if (!data) {
                    _sendErrorMessageToDelegate(_delegate,@"No data in the Body",ATT_MMS_REQUEST);
                    return;
                } else {
                    subject = [[NSString alloc] initWithData:data encoding:NSUTF8StringEncoding];
                }
                
                break;
            }
            case CONTENTXML:
            case CONTENTURLENCODED:
            {
                subject = (NSString*)messageBody;
                break;
            }
            default:
            {
                break;
            }
        }
        [body appendData:[[NSString stringWithFormat:@"%@\r\n",subject] dataUsingEncoding:NSUTF8StringEncoding]];
    }
#else
    _setRequiredParamAndCheckFailure(mmsRequestparameter,KEYMESSAGEBODY,subject,errorMessage);
    [body appendData:[subject dataUsingEncoding:NSUTF8StringEncoding]];
#endif
    //.... set attachment for the message
    NSArray* attachments = [mmsRequestparameter objectForKey:KEYATTACHMENT];
    if (attachments != nil && [attachments count] > 0) {
        for (NSDictionary* fileInfo in attachments)
        {
            if([[fileInfo allKeys] count] == 0)
            {
                [self sendErrorMessage:errorMessage];
                _ReleaseObj(request);
                return;
            }
            id attachmentBase64String = [fileInfo objectForKey:KEYFILEOBJECT]?[fileInfo objectForKey:KEYFILEOBJECT]:nil;
            NSData   *attachmentData = nil;
            NSString *attachmentfilename = [fileInfo objectForKey:KEYFILENAME];
            NSString *attachmentMimeType = [fileInfo objectForKey:KEYFILETYPE];
            if(attachmentBase64String == nil || [attachmentBase64String length] == 0)
            {
                NSString *attachmentPath = [fileInfo objectForKey:KEYFILEPATH];
                NSString *filePath = [[NSBundle mainBundle] pathForResource:attachmentfilename ofType:[attachmentPath pathExtension]];
                if(filePath == nil)
                    filePath = attachmentPath;
                attachmentData = [[NSData alloc] initWithContentsOfFile:filePath];
                attachmentBase64String = [attachmentData base64EncodedString];
            }
            if(attachmentBase64String == nil)
                continue;
            [body appendData:[[NSString stringWithFormat:@"\r\n--%@\r\n",requestBoundry] dataUsingEncoding:NSUTF8StringEncoding]];
            // where profile_photo is the key value or parameter value on server. must be confirm
            [body appendData:[[NSString stringWithFormat:@"Content-Type:%@\r\n",attachmentMimeType]dataUsingEncoding:NSUTF8StringEncoding ]];
            [body appendData:[[NSString stringWithFormat:@"Content-ID:<%@>\r\n",attachmentfilename] dataUsingEncoding:NSUTF8StringEncoding ]];
            [body appendData:[[NSString stringWithFormat:@"Content-Transfer-Encoding:base64\r\n"] dataUsingEncoding:NSUTF8StringEncoding ]];
            [body appendData:[[NSString stringWithFormat:@"Content-Disposition:attachment; name=\"%@\"\r\n\r\n",attachmentfilename] dataUsingEncoding:NSUTF8StringEncoding]];
            
            [body appendData:[attachmentBase64String dataUsingEncoding:NSUTF8StringEncoding]];
            _ReleaseObj(attachmentData);
            
        }
        [body appendData:[[NSString stringWithFormat:@"\r\n--%@--\r\n",requestBoundry] dataUsingEncoding:NSUTF8StringEncoding]];
        [request setHTTPBody:body];
    }
    
    //Send request and handle response
    ATTPluginHTTPRequest* httpRequest = [[ATTPluginHTTPRequest alloc] initRequest:request withDelegate:self];
    [httpRequest autorelease];
    _ReleaseObj(request);
    
    // setting the body of the post to the reqeust
}

- (void) sendErrorMessage:(const NSString*)message
{
    NSString *errorString = nil;
    if(message != nil)
        errorString = [NSString stringWithFormat:@"%@",message];
    else
        errorString = [NSString stringWithFormat:@"%@",@"Error while executing request"];
    _sendErrorMessageToDelegate(_delegate,errorString,ATT_MMS_REQUEST);
}

#pragma mark -
#pragma mark HTTP Delegate
- (void) httpRequest:(ATTPluginHTTPRequest*)request didCompleteRequestWithData:(NSData*)data
{
    if([_delegate respondsToSelector:@selector(pluginFeature:didCompleteRequestWithData:forRequest:)])
        [_delegate pluginFeature:self didCompleteRequestWithData:data forRequest:ATT_MMS_REQUEST];
}

- (void) httpRequest:(ATTPluginHTTPRequest*)request didFailWithError:(NSError*)error
{
    _sendErrorMessageToDelegate(_delegate,errorMessage,ATT_MMS_REQUEST);
}


@end
