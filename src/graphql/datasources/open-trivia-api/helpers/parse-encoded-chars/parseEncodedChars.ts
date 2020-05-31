const parseUTFString = (text: string): string => {
  return text
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&rsquo;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/&eacute;/g, 'é');
};

export default parseUTFString;
