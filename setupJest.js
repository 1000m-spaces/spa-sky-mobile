import {renderWithRedux} from 'helpers/RenderWithRedux';

global.renderWithRedux = renderWithRedux;
jest.mock('axios');
