// __mocks__/react-native-device-info.js
export default {
  getSystemVersion: jest.fn(() => 'mocked-system-version'),
  getVersion: jest.fn(() => 'mocked-version'),
  getUniqueId: jest.fn(() => 'mocked-unique-id'),
  // Thêm các phương thức khác nếu cần
};
