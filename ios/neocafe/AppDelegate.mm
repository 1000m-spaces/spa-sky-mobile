#import "AppDelegate.h"
// #import <Firebase.h>
#import <CodePush/CodePush.h>

#import <React/RCTBundleURLProvider.h>

#import <React/RCTLinkingManager.h>

#import <zpdk/ZaloPaySDK.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  // [FIRApp configure];
  self.moduleName = @"neocafe";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  [[ZaloPaySDK sharedInstance] initWithAppId:3850 uriScheme:@"spa://app/orderStatusResult" environment: ZPZPIEnvironment_Production]; // Init ZPDK


  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [CodePush bundleURL];
#endif
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  // Xử lý ZaloPay
  if ([[ZaloPaySDK sharedInstance] application:application openURL:url sourceApplication:@"vn.com.vng.zalopay" annotation:nil]) {
    return YES;
  }

  // Xử lý React Native Linking
  return [RCTLinkingManager application:application openURL:url options:options];
}

@end
