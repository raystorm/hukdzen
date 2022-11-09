import { Xbiis } from '../boxTypes';

/**
 * Local BoxList Type
 */
export interface BoxList {
    boxes: Xbiis[];
}


export const emptyBoxList: BoxList = {
    boxes: [] as Xbiis[]
};