import BigNumber from 'bignumber.js';

export const BIG_NUMBER_ROUNDING_MODE = BigNumber.ROUND_FLOOR;
export const DEFAULT_DECIMALS = 18;
export const convertWeiToEsdt = (amount: BigNumber.Value | null, decimals?: number, precision?: number): BigNumber => {
    if (amount == null) {
        return new BigNumber(0);
    } else {
        return new BigNumber(amount)
            .decimalPlaces(0, BIG_NUMBER_ROUNDING_MODE)
            .shiftedBy(typeof decimals !== 'undefined' ? -decimals : -DEFAULT_DECIMALS)
            .decimalPlaces(typeof precision !== 'undefined' ? precision : 4, BIG_NUMBER_ROUNDING_MODE);
    }
};

export const convertEsdtToWei = (amount: BigNumber.Value, decimals?: number): BigNumber => {
    return new BigNumber(amount).shiftedBy(typeof decimals !== 'undefined' ? decimals : DEFAULT_DECIMALS).decimalPlaces(0, BIG_NUMBER_ROUNDING_MODE);
};


export const parseBigNumber = (value: BigNumber.Value | null): BigNumber => {
    try {
        if (value != null) {
            return new BigNumber(value);
        }
    } catch (err) {
    }
    return new BigNumber(0);
};

export const isPositiveOrZeroBigNumber = (value: BigNumber.Value): boolean => {
    try {
        return new BigNumber(value).comparedTo(0) >= 0;
    } catch (err) {
        return false;
    }
};

export const isPositiveBigNumber = (value: BigNumber.Value): boolean => {
    try {
        return new BigNumber(value).comparedTo(0) > 0;
    } catch (err) {
        return false;
    }
};

//
const localDecimalSeparator = 0.1.toLocaleString().replace(/\d/g, '');
const bgFormatter = {
    decimalSeparator: localDecimalSeparator,
    groupSeparator: localDecimalSeparator == '.' ? ',' : '.',
    groupSize: 3
};

export const convertBigNumberToLocalString = (
    value: BigNumber.Value,
    precision?: number,
): string => {
    let v = new BigNumber(value).toFormat(precision ? precision : 4, BIG_NUMBER_ROUNDING_MODE, bgFormatter);
    
    // remove trailing zeros
    if (v.search(localDecimalSeparator) >= 0) {
        v = v.replace(/\.?0+$/, '');
    }
    
    return v;
};

const convertBigNumberToInputStringFormatter = {
    decimalSeparator: localDecimalSeparator,
    groupSeparator: '',
    groupSize: 3
};

export const convertBigNumberToInputString = (
    value: BigNumber.Value,
    decimals: number,
): string => {
    let v = new BigNumber(value).toFormat(decimals, BIG_NUMBER_ROUNDING_MODE, convertBigNumberToInputStringFormatter);
    
    // remove trailing zeros
    if (v.search(localDecimalSeparator) >= 0) {
        v = v.replace(/\.?0+$/, '');
    }
    
    return v;
};

export function parseNumberOrFail(value: string): number | null {
    try {
        return Number(value);
    } catch (err) {
        return null;
    }
}
