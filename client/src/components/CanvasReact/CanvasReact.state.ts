import {Sizes, Point} from '@/types';
import {DEFAULT_CANVAS_SIZE, SIDEBAR_WIDTH} from './CanvasReact.constants';

const min = {x: DEFAULT_CANVAS_SIZE.width / 2, y: DEFAULT_CANVAS_SIZE.height / 2};
const max = {x: DEFAULT_CANVAS_SIZE.width / 2, y: DEFAULT_CANVAS_SIZE.height / 2};

/** Размер полотна в своей условной величине */
export let FULL_CANVAS_SIZE = DEFAULT_CANVAS_SIZE;
/** Размер полотна (видного пользователю) в пикселях */
export let CANVAS_HTML_OPTIONS = {width: window.innerWidth - SIDEBAR_WIDTH, height: window.innerHeight};
/** Размер полотна (видного пользователю) в своей условной величине и координаты */
export let CANVAS_WINDOW_OPTIONS = {min, max, ...DEFAULT_CANVAS_SIZE};
/** Масштаб */
export let SCALE = 1;

export const setFullCanvasSize = (size: Sizes) => (FULL_CANVAS_SIZE = size);
export const setCanvasHtmlOptions = (options: Sizes) => (CANVAS_HTML_OPTIONS = options);
export const setCanvasWindowOptions = (options: {min: Point; max: Point} & Sizes) => (CANVAS_WINDOW_OPTIONS = options);
export const updateScale = (multiplier: number) => (SCALE *= multiplier);
