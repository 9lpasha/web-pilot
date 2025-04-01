import {Point, Sizes} from '../../common';

export interface GlobalCanvasInfo {
  FullCanvasSize: Sizes;
  CanvasHtmlOptions: Sizes;
  CanvasWindowOptions: Sizes & {min: Point; max: Point};
  Scale: number;
}
