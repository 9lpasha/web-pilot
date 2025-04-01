import {ConnectSide} from '@/shared/types';
import {DEFAULT_NODE_SIZE} from '@shared/constants';

const {lowerCircle, topCircle, leftCircle, rightCircle} = DEFAULT_NODE_SIZE;

const sizes: Record<
  ConnectSide,
  {
    x: number;
    y: number;
    radius: number;
  }
> = {
  bottom: lowerCircle,
  left: leftCircle,
  right: rightCircle,
  top: topCircle,
};

export const getConnectPointSize = (side: ConnectSide) => sizes[side];
