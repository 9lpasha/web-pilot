import {SIDEBAR_WIDTH, DEFAULT_CANVAS_SIZE} from '@/shared/constants';
import {Sizes, Point} from '@/shared/types';

const min = {x: DEFAULT_CANVAS_SIZE.width / 2, y: DEFAULT_CANVAS_SIZE.height / 2};
const max = {x: DEFAULT_CANVAS_SIZE.width / 2, y: DEFAULT_CANVAS_SIZE.height / 2};

/** Размер полотна в своей условной величине */
export let FullCanvasSize = DEFAULT_CANVAS_SIZE;
/** Размер полотна (видного пользователю) в пикселях */
export let CanvasHtmlOptions: Sizes = {width: window.innerWidth - SIDEBAR_WIDTH, height: window.innerHeight};
/** Размер полотна (видного пользователю) в своей условной величине и координаты */
export let CanvasWindowOptions = {min, max, ...DEFAULT_CANVAS_SIZE};
/** Масштаб */
export let Scale = 1;

export const setFullCanvasSize = (size: Sizes) => (FullCanvasSize = size);
export const setCanvasHtmlOptions = (options: Sizes) => (CanvasHtmlOptions = options);
export const setCanvasWindowOptions = (options: {min: Point; max: Point} & Sizes) => (CanvasWindowOptions = options);
export const setScale = (multiplier: number) => (Scale *= multiplier);
