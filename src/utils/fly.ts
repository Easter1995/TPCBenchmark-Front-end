// @ts-ignore
import FlyConstrustor from 'flyio/dist/npm/fly'
// @ts-ignore
import { Fly } from 'flyio/index'
const fly: Fly = new FlyConstrustor()
export const flyAny: Fly = new FlyConstrustor()
import { flyInit, ExtendedRequest as _ExtendedRequest } from './flyMiddleware'

flyInit(fly)
export default fly
export interface ExtendedRequest extends _ExtendedRequest {}
