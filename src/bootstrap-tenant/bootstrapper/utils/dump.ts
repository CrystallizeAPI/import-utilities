import util from 'util'
export const dump = (obj: any, depth = 200) => {
    console.log(util.inspect(obj, false, depth, true))
}
