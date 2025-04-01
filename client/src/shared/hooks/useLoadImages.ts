import {useEffect} from 'react';

import EntryIcon from '@shared/assets/images/entry.png';

export const useLoadImages = (setIsReadyForRendering: React.Dispatch<React.SetStateAction<boolean>>) => {
  useEffect(() => {
    const images = [EntryIcon];
    let n = 0;

    images.forEach((i) => {
      const image = new Image();
      image.src = i;

      image.onload = () => {
        n++;

        if (n === images.length) setIsReadyForRendering(true);
      };
    });
  }, [setIsReadyForRendering]);
};
