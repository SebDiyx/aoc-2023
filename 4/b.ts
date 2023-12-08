import fs from 'fs';

const input = await fs.readFileSync('./input.txt', 'utf-8');

const pointsCache = new Map<number, number>();
const countMap = new Map<number, number>();

const cards = input.split('\n');
const cardsStack = [...cards];
let totalCards = 0;

while (cardsStack.length > 0) {
    const card = cardsStack.shift()!;

    const [cardId, numbers] = card.replace('Card ', '').trim().split(': ');
    const cardNum = parseInt(cardId);

    const [winning, yours] = numbers.split(' | ').map((nums) =>
        nums
            .trim()
            .split(' ')
            .filter(Boolean)
            .map((num) => parseInt(num)),
    );

    const numCards =
        pointsCache.get(cardNum) ??
        yours.reduce((total, num) => {
            if (winning.includes(num)) return total + 1;
            return total;
        }, 0);
    totalCards += numCards;
    if (!pointsCache.has(cardNum)) {
        pointsCache.set(cardNum, numCards);
    }

    cardsStack.unshift(...cards.slice(cardNum, cardNum + numCards));
    for (let ii = cardNum + 1; ii <= cardNum + numCards; ii++) {
        console.log(cardNum, ii);

        const currCount = countMap.get(ii) ?? 0;
        countMap.set(ii, currCount + 1);
    }
    console.log(card);
}

console.log(totalCards);

// console.log(pointsCache);
// console.log(countMap);
