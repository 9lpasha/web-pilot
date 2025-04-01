import {DataNode} from 'antd/es/tree';

export async function parseHtmlFile(file: File): Promise<DataNode[] | undefined> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(reader.result as string, 'text/html');
      const body = doc.body;

      if (!body) {
        reject(new Error('Файл не содержит body'));
        return;
      }

      const traverse = (element: Element): DataNode => ({
        key: element.tagName.toLowerCase(),
        title: element.tagName.toLowerCase(),
        children: Array.from(element.children).map(traverse),
      });

      resolve(Array.from(body.children).map(traverse));
    };

    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}
