declare module '*.module.css' {
  interface ClassNames {
    [name: string]: string;
  }

  const classNames: ClassNames;
  export = classNames;
}

declare module '*.png' {
  const value: string;
  export default value;
}

declare module '*.jpg' {
  const value: string;
  export default value;
}

declare module '*.jpeg' {
  const value: string;
  export default value;
}

declare module '*.svg' {
  import React from 'react';
  const SVG: React.VFC<React.SVGProps<SVGSVGElement>>;
  export default SVG;
}

declare const __IS_DEV__: string;
declare const __IS_PROD__: string;
declare const __ENVIRONMENT__: string;
