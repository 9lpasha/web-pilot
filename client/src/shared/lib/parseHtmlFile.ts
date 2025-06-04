import {DataNode} from 'antd/es/tree';

import {AppStore} from '@/app/store/types';

export async function parseHtmlFile(file: File, set: (partial: Partial<AppStore>) => void): Promise<DataNode[] | undefined> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(reader.result as string, 'text/html');
      const body = doc.body;
      let elementNumber = 0;

      if (!body) {
        reject(new Error('Файл не содержит body'));
        return;
      }

      const traverse = (element: Element): DataNode => {
        const key = `${new Date().getTime()}_${elementNumber++}`;

        element.id = key;

        return {
          key,
          title: element.tagName.toLowerCase(),
          children: Array.from(element.children).map(traverse),
        };
      };

      const arrayStore = Array.from(body.children).map(traverse);
      set({htmlContent: doc.documentElement.outerHTML});
      resolve(arrayStore);
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
