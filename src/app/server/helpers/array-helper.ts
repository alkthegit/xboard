/**
 * Возвращает случайный элемент указанном массива
 */
export function getRandomItem<A>(arr: A): A extends Array<infer R> ? R : never {
    if (arr == null) {
        return null;
    }

    if (!(arr instanceof Array)) {
        return null;
    }

    if (arr.length === 0) {
        return null;
    }

    const item = arr[Math.trunc(Math.random() * arr.length)];

    return item;
}

/**
 * Нормализцет границы диапазона [a; b] - защита от мусора
 * 
 */
export function normalizeLimits(a: number, b: number): [min: number, max: number] {
    a = a ?? 0;
    b = b ?? 0;

    if (a < 0) {
        a = 0;
    }

    if (b < 0) {
        b = 0;
    }

    if (b < a) {
        b = a;
    }

    return [a, b];
}

/**
 * Генератор строк с несколькими случайными цифрами
 */
export function getRandomNumberString(minLength: number = 1, maxLength: number = 10) {
    [minLength, maxLength] = normalizeLimits(minLength, maxLength);


    // выбираем случайную длину итоговой строки между указанными minLength и maxLength
    const length = minLength + Math.trunc(Math.random() * (maxLength + 1 - minLength));

    // создаем строку длины length из цифр от 0..9 
    let result = '';
    for (let i = 0; i < length; i++) {
        result += `${Math.trunc(Math.random() * 10)}`;
    }

    return result;
}
