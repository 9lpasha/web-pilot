import {useEffect, useRef} from 'react';

export const ComponentFromHTML = ({htmlContent}: {htmlContent: string}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  const bodyMatch = htmlContent.match(/<html[^>]*>([\s\S]*?)<\/html>/i);
  const bodyContent = bodyMatch ? bodyMatch[1] : htmlContent;

  useEffect(() => {
    if (!containerRef.current) return;

    const shadowRoot = containerRef.current.attachShadow({mode: 'open'});
    const wrapper = document.createElement('html');
    const style = document.createElement('style');

    style.textContent = `
        html {
          all: unset;
          font-family: initial !important;
        }
      `;

    wrapper.innerHTML = bodyContent;
    wrapper.querySelector('body')?.appendChild(style);
    shadowRoot.appendChild(wrapper);
  }, [containerRef, bodyContent]);

  const styleMatches = [...htmlContent.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)];
  const styles = styleMatches.map((match) => match[1]).join('\n');

  return (
    <>
      {styles && <style dangerouslySetInnerHTML={{__html: styles}} />}
      <div ref={containerRef} />
    </>
  );
};
