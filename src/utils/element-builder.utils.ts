export const buildElement = <T>(htmlString: string, input?: T): HTMLElement => {

  if (input) {
    for(const prop in input) {
      if (input.hasOwnProperty(prop)) {
        htmlString = replaceAll(htmlString, `{{${prop}}}`, input[prop].toString());
      }
    }
  }

  const dom = document.createElement('div');
  dom.innerHTML = htmlString.trim();

  return dom.firstChild as HTMLElement;
};

export const replaceAll = (str: string, find: string, replace: string) => {
  return str.replace(new RegExp(find, 'g'), replace);
};
