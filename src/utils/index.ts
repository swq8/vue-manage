import * as math from 'mathjs'
/**
 * 从目标对象中拷贝已有的属性
 * 
 * @param objA 
 * @param objB 
 */
export const objAssign = (objA: any, objB: any): void => {
    let keysA = Object.keys(objA)
    let keysB = Object.keys(objB)
    //交集
    let arr = keysA.filter(item => keysB.indexOf(item) > -1)
    for (const key of arr) {
        objA[key] = objB[key]
    }

}

export const priceToNumber = (price: number | string): number => {
    return parseInt(math.multiply(math.bignumber(price), math.bignumber(100)).toString())
}

/**
 * price format, like this: 1020 -> 10.20
 * 
 * @param 
 */
export const priceFormat = (price: number | string): string => {
    const num = Number(price)
    if (num < 10) {
        return "0.0" + price;
    } else if (num < 100) {
        return "0." + num;
    }
    let rem = num % 100;
    let i = Math.floor(num / 100);
    if (rem < 10) {
        return i + ".0" + rem;
    } else {
        return i + "." + rem;
    }
}