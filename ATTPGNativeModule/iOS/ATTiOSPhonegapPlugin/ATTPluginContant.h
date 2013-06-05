//
//  ATTPluginContant.h
//  ATTiOSPhonegapPlugin
//
//  Created by Global Logic on 10/23/12.
//  Copyright (c) 2012 Global Logic. All rights reserved.
//

#ifndef ATTiOSPhonegapPlugin_ATTPluginContant_h
#define ATTiOSPhonegapPlugin_ATTPluginContant_h


#define    REQUESTMETHOD                @"POST"
#define    CONTENTTYPEJSON              @"application/json"
#define    CONTENTTYPEXML               @"application/xml"
#define    CONTENTTYPEURLENCODED        @"application/x-www-form-urlencoded"

#define    KEYTOKEN                     @"accessToken"
#define    KEYURL                       @"url"
#define    KEYADDRESS                   @"recipentPhoneNumber"
#define    KEYSUBJECT                   @"messageSubject"
#define    KEYPRIORITY                  @"messagePriority"
#define    KEYTEXT                      @"messageText"
#define    KEYATTACHMENT                @"attachments"
#define    KEYFILENAME                  @"fileName"
#define    KEYFILETYPE                  @"fileType"
#define    KEYFILEPATH                  @"filePath"
#define    KEYACCEPTTYPE                @"accept"
#define    KEYCONTENTTYPE               @"contentType"
#define    KEYFILEOBJECT                @"fileObject"
#define    KEYMESSAGEBODY               @"body"

#define    BODYHASTOBECREATED
#define   _ReleaseObj(obj)           if(obj != nil) \
[obj release];\
obj = nil;

#define _sendErrorMessageToDelegate(delegate,message,requestType)              \
{                                                                               \
    if([_delegate respondsToSelector:@selector(pluginFeature:didFailWithErrorString:forRequest:)])  \
    [_delegate pluginFeature:self didFailWithErrorString:message forRequest:requestType];   \
}

#define   _setRequiredParamAndCheckFailure(dict,key,paramVar,faliuremessage)           if((paramVar = [dict objectForKey:key]) == nil\
|| [paramVar length] == 0){\
[self sendErrorMessage:faliuremessage];\
[request release] ;                      \
return;                         \
}
#define   _setOptionalParam(dict,key,paramVar)             { if((paramVar = [dict objectForKey:key]) == nil ) \
paramVar = @""; }
#define   _optinalValueForKey(dict,key,paramVar)           ((paramVar = [dict objectForKey:key]) == nil ? @"" : paramVar)

typedef enum
{
    CONTENTJSON,
    CONTENTXML,
    CONTENTURLENCODED
}ContentType;

static const NSString*  requestBoundry = @"---------------------------14737809831466499882746641449";
static const NSString*  errorMessage   = @"Error in executing";

#endif
