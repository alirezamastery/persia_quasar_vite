export const logger = (...msg: string[]): void => {
  let txt = ''
  msg.forEach(item => {
    txt += ' ' + item
  })
  console.log('PERSIA-LOG |', txt)
}
