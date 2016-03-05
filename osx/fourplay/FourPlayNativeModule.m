#import "FourPlayNativeModule.h"

@import AppKit;

@implementation FourPlayNativeModule

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(openFilePicker:(NSDictionary *)params
                  callback:(RCTResponseSenderBlock)callback)
{
  dispatch_async(dispatch_get_main_queue(), ^() {
    BOOL chooseDirectories = params[@"chooseDirectories"] == @(YES);
    
    NSOpenPanel *panel = [NSOpenPanel openPanel];
    panel.canChooseFiles = !chooseDirectories;
    panel.canChooseDirectories = chooseDirectories;
    panel.allowsMultipleSelection = params[@"allowMultiple"] == @(YES);
    [panel runModal];

    NSMutableArray *urls = [[NSMutableArray alloc] init];
    for (NSURL *url in [panel URLs]) {
      [urls addObject:url.path];
    }
    callback(@[urls]);
  });
}

@end