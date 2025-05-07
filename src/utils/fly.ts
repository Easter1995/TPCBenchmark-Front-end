// @ts-ignore
import FlyConstrustor from 'flyio/dist/npm/fly'
// @ts-ignore
import { Fly } from 'flyio/index'
const fly: Fly = new FlyConstrustor()
export const flyAny: Fly = new FlyConstrustor()
import { flyInit } from './flyMiddleware'

flyInit(fly)
export default fly
