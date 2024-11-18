import React, {useEffect} from 'react';

import RootNavigation from 'navigation/RootNavigation';
import {LogBox, TextInput} from 'react-native';
import {setCustomText} from 'react-native-global-props';
import {LogLevel, OneSignal} from 'react-native-onesignal';
import CodePush from 'react-native-code-push';
import * as Sentry from '@sentry/react-native';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {KEY_ONE_SIGNAL} from 'assets/config';
const customTextProps = {
  allowFontScaling: false,
};

const App = () => {
  useEffect(() => {
    setCustomText(customTextProps);
    TextInput.defaultProps = TextInput.defaultProps || {};
    TextInput.defaultProps.allowFontScaling = false;
    console.disableYellowBox = true;
    LogBox.ignoreAllLogs();
  }, []);

  useEffect(() => {
    Sentry.init({
      dsn: 'https://00ed983f1dc85bcf4a9d240c1d4163e2@o4504876032065536.ingest.sentry.io/4505985038483456',
      // Set tracesSampleRate to 1.0 to capture 100% of transactions for performance monitoring.
      // We recommend adjusting this value in production.
      tracesSampleRate: 1.0,
    });
  }, []);

  useEffect(() => {
    // OneSignal.initialize(KEY_ONE_SIGNAL);

    // // promptForPushNotificationsWithUserResponse will show the native iOS or Android notification permission prompt.
    // // We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step 8)
    // OneSignal.promptForPushNotificationsWithUserResponse();

    // //Method for handling notifications received while app in foreground
    // OneSignal.setNotificationWillShowInForegroundHandler(
    //   notificationReceivedEvent => {
    //     console.log(
    //       'OneSignal: notification will show in foreground:',
    //       notificationReceivedEvent,
    //     );
    //     let notification = notificationReceivedEvent.getNotification();
    //     console.log('notification: ', notification);
    //     const data = notification.additionalData;
    //     console.log('additionalData: ', data);
    //     // Complete with null means don't show a notification.
    //     notificationReceivedEvent.complete(notification);
    //   },
    // );

    // //Method for handling notifications opened
    // OneSignal.setNotificationOpenedHandler(notification => {
    //   console.log('OneSignal: notification opened:', notification);
    // });

    // Remove this method to stop OneSignal Debugging
    OneSignal.Debug.setLogLevel(LogLevel.Verbose);

    // OneSignal Initialization
    OneSignal.initialize(KEY_ONE_SIGNAL);

    // requestPermission will show the native iOS or Android notification permission prompt.
    // We recommend removing the following code and instead using an In-App Message to prompt for notification permission
    OneSignal.Notifications.requestPermission(true);

    // Method for listening for notification clicks
    // OneSignal.Notifications.addEventListener('click', event => {
    //   console.log('OneSignal: notification clicked:', event);
    // });
  }, []);

  return (
    // <GestureHandlerRootView style={{flex: 1}}>
    //   <BottomSheetModalProvider>
    <RootNavigation />
    //   </BottomSheetModalProvider>
    // </GestureHandlerRootView>
  );
};

export default CodePush({checkFrequency: CodePush.CheckFrequency.MANUAL})(
  Sentry.wrap(App),
);
