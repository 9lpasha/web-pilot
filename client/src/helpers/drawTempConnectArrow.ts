import {Point, Sizes, ConnectSide} from '@/types';
import {CANVAS_WINDOW_OPTIONS, SCALE} from '@/components/CanvasReact/CanvasReact.state';

interface ConnectArrowParams {
  ctx: CanvasRenderingContext2D;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  nodeParams: Sizes;
  side: ConnectSide;
  finishSide?: ConnectSide;
  nodeFinishParams?: {
    width: number;
    height: number;
  };
}

/** Получить path для соединенных стрелок, выходящих из верхней стороны */
const getConnectedArrowPathForTop = ({
  startX,
  startY,
  endX,
  endY,
  nodeParams,
  nodeFinishParams,
  finishSide,
}: Omit<ConnectArrowParams, 'ctx' | 'side'>) => {
  let currPoint = {x: startX, y: startY};
  const path = [currPoint];
  const finalPath = [];

  const padding = 25 * SCALE;
  const margin = 20 * SCALE;
  const gap = padding + margin;

  // Если навелись на входную точку соединения
  if (nodeFinishParams?.height) {
    if (endY <= startY - gap) {
      if (finishSide === 'top') {
        if (endX - margin - nodeFinishParams.width / 2 >= startX || endX + margin + nodeFinishParams.width / 2 <= startX) {
          path.push({x: startX, y: endY - gap}, {x: endX, y: endY - gap}, {x: endX, y: endY});
          return path;
        }

        finalPath.push({x: endX, y: endY});
        finalPath.push({x: endX, y: endY - gap});
        finalPath.push({x: endX + (nodeFinishParams.width / 2 + margin) * (endX > startX ? -1 : 1), y: endY - gap});
        const finishY = Math.min(endY - gap + nodeFinishParams.height + margin * 2, startY - gap);
        finalPath.push({
          x: endX + (nodeFinishParams.width / 2 + margin) * (endX > startX ? -1 : 1),
          y: finishY,
        });
        endX = endX + (nodeFinishParams.width / 2 + margin) * (endX > startX ? -1 : 1);
        endY = finishY;
      } else if (finishSide === 'left') {
        if (endX - gap >= startX) {
          path.push({x: startX, y: endY}, {x: endX, y: endY});
          return path;
        }

        finalPath.push({x: endX, y: endY});
        finalPath.push({x: endX - gap, y: endY});
        let finishCoord = {x: endX - gap, y: endY + nodeFinishParams.height / 2 + margin};
        finalPath.push(finishCoord);
        if (endY >= startY - gap - margin - nodeFinishParams.height / 2) {
          finishCoord = {
            x: Math.min(endX - padding + nodeFinishParams.width + margin, startX - nodeFinishParams.width / 2 - margin),
            y: endY + nodeFinishParams.height / 2 + margin,
          };
          finalPath.push(finishCoord);
        }

        endX = finishCoord.x;
        endY = finishCoord.y;
      } else if (finishSide === 'right') {
        if (endX + gap <= startX) {
          path.push({x: startX, y: endY}, {x: endX, y: endY});
          return path;
        }

        finalPath.push({x: endX, y: endY});
        finalPath.push({x: endX + gap, y: endY});
        let finishCoord = {x: endX + gap, y: endY + nodeFinishParams.height / 2 + margin};
        finalPath.push(finishCoord);
        if (endY >= startY - gap - margin - nodeFinishParams.height / 2) {
          finishCoord = {
            x: Math.max(endX + padding - nodeFinishParams.width - margin, startX + nodeFinishParams.width / 2 + margin),
            y: endY + nodeFinishParams.height / 2 + margin,
          };
          finalPath.push(finishCoord);
        }

        endX = finishCoord.x;
        endY = finishCoord.y;
      } else if (finishSide === 'bottom') {
        finalPath.push({x: endX, y: endY});
        finalPath.push({x: endX, y: endY + gap});
        endY = endY + gap;
      }
    } else {
      if (finishSide === 'top') {
        if (endY >= startY - gap && endY <= startY) {
          path.push({x: startX, y: endY - gap}, {x: endX, y: endY - gap}, {x: endX, y: endY});
          return path;
        }

        if (endX - nodeFinishParams.width / 2 - margin >= startX || endX + nodeFinishParams.width / 2 + margin <= startX) {
          finalPath.push({x: endX, y: endY});
          finalPath.push({x: endX, y: startY - gap});
          endY = startY - gap;
        }
      } else if (finishSide === 'left') {
        if (endX - padding >= startX - nodeFinishParams.width / 2) {
          finalPath.push({x: endX, y: endY});
          finalPath.push({x: endX - gap, y: endY});
          endX = endX - gap;
        } else {
          path.push(
            {x: startX, y: Math.min(startY - gap, endY - nodeFinishParams.height / 2 - margin)},
            {x: endX - gap, y: Math.min(startY - gap, endY - nodeFinishParams.height / 2 - margin)},
            {x: endX - gap, y: endY},
            {x: endX, y: endY},
          );
          return path;
        }
      } else if (finishSide === 'right') {
        if (endX + padding <= startX + nodeFinishParams.width / 2) {
          finalPath.push({x: endX, y: endY});
          finalPath.push({x: endX + gap, y: endY});
          endX = endX + gap;
        } else {
          path.push(
            {x: startX, y: Math.min(startY - gap, endY - nodeFinishParams.height / 2 - margin)},
            {x: endX + gap, y: Math.min(startY - gap, endY - nodeFinishParams.height / 2 - margin)},
            {x: endX + gap, y: endY},
            {x: endX, y: endY},
          );
          return path;
        }
      } else if (finishSide === 'bottom') {
        finalPath.push({x: endX, y: endY});
        finalPath.push({x: endX, y: endY + gap});
        const finishCoord =
          endX < startX
            ? {
                x: endX + (nodeFinishParams.width / 2 + margin) * (endX + nodeFinishParams.width / 2 + margin <= startX ? 1 : -1),
                y: endY + gap,
              }
            : {
                x: endX - (nodeFinishParams.width / 2 + margin) * (endX - nodeFinishParams.width / 2 - margin >= startX ? 1 : -1),
                y: endY + gap,
              };
        finalPath.push(finishCoord);
        endY = finishCoord.y;
        endX = finishCoord.x;
      }
    }
  }

  if (endY <= startY - gap) {
    if (endY + gap * 2 <= startY) {
      currPoint = {x: currPoint.x, y: currPoint.y - (startY - endY) / 2};
      path.push(currPoint);
    } else {
      currPoint = {x: currPoint.x, y: currPoint.y - gap};
      path.push(currPoint);
    }

    currPoint = {x: currPoint.x + (endX - startX), y: currPoint.y};
    path.push(currPoint);
    path.push({x: endX, y: endY});
  } else {
    currPoint = {x: currPoint.x, y: currPoint.y - gap};
    path.push(currPoint);

    if (endX >= startX) {
      currPoint = {x: currPoint.x + nodeParams.width / 2 + margin, y: currPoint.y};
      path.push(currPoint);
    } else {
      currPoint = {x: currPoint.x - nodeParams.width / 2 - margin, y: currPoint.y};
      path.push(currPoint);
    }

    if (Math.abs(endY - startY) + padding - nodeParams.height >= 0) {
      if (Math.abs(endX - startX) - (nodeParams.width / 2 + margin) >= 0) {
        currPoint = {x: endX, y: currPoint.y};
        path.push(currPoint);

        currPoint = {x: endX, y: endY};
        path.push(currPoint);
      } else {
        if (Math.abs(endY - startY) + padding - nodeParams.height * 2 - margin >= 0) {
          currPoint = {x: currPoint.x, y: (currPoint.y + endY + margin * 2) / 2};
          path.push(currPoint);
        } else {
          currPoint = {x: currPoint.x, y: currPoint.y + nodeParams.height + margin * 2};
          path.push(currPoint);
        }

        currPoint = {x: endX, y: currPoint.y};
        path.push(currPoint);

        currPoint = {x: endX, y: endY};
        path.push(currPoint);
      }
    } else {
      if (Math.abs(endX - startX) - nodeParams.width - gap >= 0) {
        currPoint = {x: (endX + startX + (gap + (endX + startX)) / Math.abs(endX + startX)) / 2, y: currPoint.y};
        path.push(currPoint);
      }

      currPoint = {x: currPoint.x, y: endY};
      path.push(currPoint);

      currPoint = {x: endX, y: endY};
      path.push(currPoint);
    }
  }

  const unitedPath = path.concat(finalPath.reverse());

  // Удаление ненужных точек пути
  for (let i = 0; i < unitedPath.length; ) {
    const coord = unitedPath[i];
    const extraPoint = coord.x === unitedPath[i + 1]?.x && coord.y === unitedPath[i + 1]?.y;
    const intermediatePoint =
      (coord.x === unitedPath[i - 1]?.x && coord.x === unitedPath[i + 1]?.x) ||
      (coord.y === unitedPath[i - 1]?.y && coord.y === unitedPath[i + 1]?.y);

    if (extraPoint) {
      unitedPath.splice(i, 1);
    } else if (intermediatePoint) {
      unitedPath.splice(i, 1);
    } else {
      i++;
    }
  }

  return unitedPath;
};

/** Получить path для стрелок, выходящих не из верхней стороны (с помощью поворота системы координат) */
const getArrowPath = ({startX, startY, endX, endY, nodeParams, side, finishSide, nodeFinishParams}: Omit<ConnectArrowParams, 'ctx'>) => {
  switch (side) {
    case 'top':
      return getConnectedArrowPathForTop({startX, startY, endX, endY, nodeParams, finishSide, nodeFinishParams});
    case 'right': {
      const rightStartX = 0;
      const rightStartY = 0;
      const rightEndX = endY - startY;
      const rightEndY = -(endX - startX);
      const rightNodeParams = {
        width: nodeParams.height,
        height: nodeParams.width,
      };
      const firstPath = getConnectedArrowPathForTop({
        startX: rightStartX,
        startY: rightStartY,
        endX: rightEndX,
        endY: rightEndY,
        nodeParams: rightNodeParams,
        finishSide: finishSide === 'right' ? 'top' : finishSide === 'top' ? 'left' : finishSide === 'left' ? 'bottom' : 'right',
        nodeFinishParams: {
          width: nodeFinishParams?.height || 0,
          height: nodeFinishParams?.width || 0,
        },
      });
      return firstPath.map(({x, y}) => ({x: -y + startX, y: x + startY}));
    }
    case 'bottom': {
      const bottomStartX = 0;
      const bottomStartY = 0;
      const bottomEndX = -(endX - startX);
      const bottomEndY = -(endY - startY);
      const firstPath = getConnectedArrowPathForTop({
        startX: bottomStartX,
        startY: bottomStartY,
        endX: bottomEndX,
        endY: bottomEndY,
        nodeParams,
        finishSide: finishSide === 'top' ? 'bottom' : finishSide === 'right' ? 'left' : finishSide === 'bottom' ? 'top' : 'right',
        nodeFinishParams,
      });
      return firstPath.map(({x, y}) => ({x: -x + startX, y: -y + startY}));
    }
    case 'left': {
      const leftStartX = 0;
      const leftStartY = 0;
      const leftEndX = -(endY - startY);
      const leftEndY = endX - startX;
      const leftNodeParams = {
        width: nodeParams.height,
        height: nodeParams.width,
      };
      const firstPath = getConnectedArrowPathForTop({
        startX: leftStartX,
        startY: leftStartY,
        endX: leftEndX,
        endY: leftEndY,
        nodeParams: leftNodeParams,
        finishSide: finishSide === 'left' ? 'top' : finishSide === 'top' ? 'right' : finishSide === 'right' ? 'bottom' : 'left',
        nodeFinishParams: {
          width: nodeFinishParams?.height || 0,
          height: nodeFinishParams?.width || 0,
        },
      });
      return firstPath.map(({x, y}) => ({x: y + startX, y: -x + startY}));
    }
  }
};

/** Рисование временной стрелки (во время перетягивания) */
export const drawTempConnectArrow = ({
  ctx,
  startX,
  startY,
  endX,
  endY,
  nodeParams,
  side,
  finishSide,
  nodeFinishParams,
}: ConnectArrowParams): Point[] => {
  const path = getArrowPath({startX, startY, endX, endY, nodeParams, side, finishSide, nodeFinishParams});
  const arrowHeight = 12 * SCALE;

  // Настройка цвета заливки и обводки
  ctx.fillStyle = 'black';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 3 * SCALE;

  // Рисуем основную линию стрелки
  ctx.beginPath();
  ctx.moveTo(startX, startY);

  for (const {x, y} of path) {
    ctx.lineTo(x, y);
  }

  ctx.stroke();

  // Вычисляем угол наклона стрелки
  const prevLast = path.length > 1 ? path[path.length - 2] : {x: startX, y: startY};
  const angle = Math.atan2(endY - prevLast.y, endX - prevLast.x);
  const arrowHeadX = endX + (arrowHeight / 3) * Math.cos(angle);
  const arrowHeadY = endY + (arrowHeight / 3) * Math.sin(angle);

  // Координаты для наконечника стрелки
  const arrowPoint1X = arrowHeadX - arrowHeight * Math.cos(angle - Math.PI / 6);
  const arrowPoint1Y = arrowHeadY - arrowHeight * Math.sin(angle - Math.PI / 6);
  const arrowPoint2X = arrowHeadX - arrowHeight * Math.cos(angle + Math.PI / 6);
  const arrowPoint2Y = arrowHeadY - arrowHeight * Math.sin(angle + Math.PI / 6);

  // Рисуем наконечник стрелки в виде треугольника
  ctx.beginPath();
  ctx.moveTo(arrowHeadX, arrowHeadY);
  ctx.lineTo(arrowPoint1X, arrowPoint1Y);
  ctx.lineTo(arrowPoint2X, arrowPoint2Y);
  ctx.closePath();
  ctx.fill();

  return path.map((point) => ({x: point.x / SCALE + CANVAS_WINDOW_OPTIONS.min.x, y: point.y / SCALE + CANVAS_WINDOW_OPTIONS.min.y}));
};
