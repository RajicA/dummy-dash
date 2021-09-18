export const buildElement = (htmlString: string): HTMLElement => {
  const dom = document.createElement('div');
  dom.innerHTML = htmlString.trim();

  return dom.firstChild as HTMLElement;
};
