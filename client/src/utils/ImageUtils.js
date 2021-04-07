export const bufferToImgSrc = bufferArray => {
  let src = bufferArray;
  if(typeof bufferArray === 'object') {
    src = new Buffer.from(bufferArray).toString('base64');
  }
  return `data:image/jpeg;base64,${src}`;
};