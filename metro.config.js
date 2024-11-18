/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */

//config SVG
const {getDefaultConfig} = require('metro-config');
module.exports = (async () => {
  const {
    resolver: {sourceExts, assetExts},
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve('react-native-svg-transformer'),
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'svg'),
      sourceExts: [...sourceExts, 'svg'],
    },

    //thêm đoạn dưới để sửa lỗi Error: Unable to resolve module ./Libraries/Components/DatePicker/DatePickerIOS fromnode_modules/react-native/index.js
    //lỗi này thông báo khi nào sẽ tự fix, lúc đó mình bỏ đoạn dưới đi sau
    //start
    server: {
      rewriteRequestUrl: url => {
        if (!url.endsWith('.bundle')) {
          return url;
        }
        // https://github.com/facebook/react-native/issues/36794
        // JavaScriptCore strips query strings, so try to re-add them with a best guess.
        return (
          url +
          '?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true'
        );
      },
    },
    //end
  };
})();

// module.exports = {
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: true,
//       },
//     }),
//   },
//   //thêm đoạn dưới để sửa lỗi Error: Unable to resolve module ./Libraries/Components/DatePicker/DatePickerIOS fromnode_modules/react-native/index.js
//   //lỗi này thông báo khi nào sẽ tự fix, lúc đó mình bỏ đoạn dưới đi sau
//   //start
//   server: {
//     rewriteRequestUrl: url => {
//       if (!url.endsWith('.bundle')) {
//         return url;
//       }
//       // https://github.com/facebook/react-native/issues/36794
//       // JavaScriptCore strips query strings, so try to re-add them with a best guess.
//       return (
//         url +
//         '?platform=ios&dev=true&minify=false&modulesOnly=false&runModule=true'
//       );
//     },
//   },
//   //end
// };
