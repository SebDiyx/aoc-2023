import fs from 'fs';

type Card = {
    id: number;
    winningNumbers: number[];
    yourNumbers: number[];
    winningPoints: number;
};
const cardsCache = new Map<number, number>();

function getCardFromInputLine(line: string): Card {
    const [cardId, numbers] = line.replace('Card ', '').trim().split(': ');
    const id = parseInt(cardId);
    const [winningNumbers, yourNumbers] = numbers.split(' | ').map((nums) =>
        nums
            .trim()
            .split(' ')
            .filter(Boolean)
            .map((num) => parseInt(num)),
    );
    const winningPoints = yourNumbers.reduce((total, num) => {
        if (winningNumbers.includes(num)) return total + 1;
        return total;
    }, 0);
    return { id, winningNumbers, yourNumbers, winningPoints };
}

function processCard(card: Card, allCards: readonly Card[]) {
    // Initialise our card count to 1 as it's the current card
    let numCards = 1;

    // Each winning point on the card, we need to copy that number of cards after this one
    // e.g. Card 1 has 3 winning points -> we need to copy cards 2, 3, 4
    for (let i = card.id; i < card.id + card.winningPoints; i++) {
        const additionalCard = allCards[i];
        if (!additionalCard) break;
        if (cardsCache.has(additionalCard.id)) {
            numCards += cardsCache.get(additionalCard.id)!;
        } else {
            // console.log(additionalCard.id);
            const cardCount = processCard(additionalCard, allCards);
            cardsCache.set(additionalCard.id, cardCount);
            numCards += cardCount;
        }
    }
    return numCards;
}

const input = await fs.readFileSync('./input.txt', 'utf-8');
const cards: readonly Card[] = input.split('\n').map((line) => getCardFromInputLine(line));
let totalCards = 0;
for (const card of cards) {
    totalCards += processCard(card, cards);
}
console.log(totalCards);
