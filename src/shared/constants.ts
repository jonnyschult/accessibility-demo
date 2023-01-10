import {Dimensions, Platform} from 'react-native';

export const IS_IOS = Platform.OS === 'ios';

export enum ZIndex {
  MAX = 10,
  MIDDLE = 5,
  NORMAL = 1,
  MIN = -1,
}
export const SCREEN_WIDTH = Dimensions.get('screen').width;
export const SCREEN_HEIGHT = Dimensions.get('screen').height;
