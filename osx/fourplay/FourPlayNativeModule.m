#import "FourPlayNativeModule.h"

@import AppKit;

#import <VDKQueue/VDKQueue.h>

#import "RCTBridge.h"
#import "RCTEventDispatcher.h"

@interface FourPlayNativeModule() <VDKQueueDelegate>
@end

@implementation FourPlayNativeModule {
  VDKQueue *_vdkQueue;
}

@synthesize bridge = _bridge;

-(VDKQueue *)vdkQueue
{
  if (!_vdkQueue) {
    _vdkQueue = [[VDKQueue alloc] init];
    _vdkQueue.delegate = self;
  }
  return _vdkQueue;
}

RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(openFilePicker:(NSDictionary *)params
                  callback:(RCTResponseSenderBlock)callback)
{
  dispatch_async(dispatch_get_main_queue(), ^() {
    BOOL chooseDirectories = [params[@"chooseDirectories"] boolValue];

    NSOpenPanel *panel = [NSOpenPanel openPanel];
    panel.canChooseFiles = !chooseDirectories;
    panel.canChooseDirectories = chooseDirectories;
    panel.allowsMultipleSelection = [params[@"allowMultiple"] boolValue];
    [panel runModal];

    NSMutableArray *urls = [[NSMutableArray alloc] init];
    for (NSURL *url in [panel URLs]) {
      [urls addObject:url.path];
    }
    callback(@[urls]);
  });
}

RCT_EXPORT_METHOD(subpathsInDirectory:(NSString *)dirPath
                  callback:(RCTResponseSenderBlock)callback)
{
  NSURL *dirURL = [NSURL fileURLWithPath:dirPath isDirectory:YES];
  NSFileManager *fileManager = [NSFileManager defaultManager];
  NSDirectoryEnumerator *dirEnum = [fileManager enumeratorAtURL:dirURL
                                     includingPropertiesForKeys:@[NSURLPathKey, NSURLIsDirectoryKey]
                                                        options:0
                                                   errorHandler:nil];
  NSMutableArray *filepaths = [NSMutableArray array];

  for (NSURL *url in dirEnum) {
    NSString *path;
    [url getResourceValue:&path forKey:NSURLPathKey error:NULL];

    NSNumber *isDirValue;
    [url getResourceValue:&isDirValue forKey:NSURLIsDirectoryKey error:NULL];

    NSDictionary *fileObj = @{
      @"isDir": @([isDirValue boolValue]),
      @"path": path,
    };
    [filepaths addObject:fileObj];
  }

  callback(@[filepaths]);
}

RCT_EXPORT_METHOD(watchFile:(NSString *)filepath)
{
  [self.vdkQueue addPath:filepath];
}

RCT_EXPORT_METHOD(unwatchFile:(NSString *)filepath)
{
  [self.vdkQueue removePath:filepath];
}

#pragma mark - VDKQueueDelegate

-(void)VDKQueue:(VDKQueue *)queue receivedNotification:(NSString*)noteName forPath:(NSString*)fpath
{
  NSDictionary *event = @{
    @"noteName": noteName,
    @"path": fpath,
  };
  [self.bridge.eventDispatcher sendAppEventWithName:@"FourPlayFileChange" body:event];
}


@end
