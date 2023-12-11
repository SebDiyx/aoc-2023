import fs from 'fs';

/**
 * Every hand is exactly one type. From strongest to weakest, they are:
 *
 * - Five of a kind, where all five cards have the same label: AAAAA
 * - Four of a kind, where four cards have the same label and one card has a different label: AA8AA
 * - Full house, where three cards have the same label, and the remaining two cards share a different label: 23332
 * - Three of a kind, where three cards have the same label, and the remaining two cards are each different from any other card in the hand: TTT98
 * - Two pair, where two cards share one label, two other cards share a second label, and the remaining card has a third label: 23432
 * - One pair, where two cards share one label, and the other three cards have a different label from the pair and each other: A23A4
 * - High card, where all cards' labels are distinct: 23456
 */
const CARD_RANKING = '23456789TJQKA';
const handTypes = [
    'five-of-a-kind',
    'four-of-a-kind',
    'full-house',
    'three-of-a-kind',
    'two-pair',
    'one-pair',
    'high-card',
] as const;
type HandType = (typeof handTypes)[number];
type Hand = {
    cards: string[];
    type: HandType;
    bid: number;
};

const input = await fs.readFileSync('./input.txt', 'utf-8');
const hands: Hand[] = input.split('\n').map((line) => {
    const [cardsStr, bid] = line.split(' ');
    const cards = cardsStr.split('');
    const cardsMap = new Map();
    for (const card of cards) {
        if (cardsMap.has(card)) {
            cardsMap.set(card, cardsMap.get(card) + 1);
        } else {
            cardsMap.set(card, 1);
        }
    }

    const mapVals = [...cardsMap.values()];

    let type: HandType = 'high-card';
    if (mapVals.length === 4) type = 'one-pair';
    if (mapVals.length === 3) type = 'two-pair';
    if (mapVals.some((v) => v === 3)) type = 'three-of-a-kind';
    if (mapVals.some((v) => v === 2) && mapVals.some((v) => v === 3)) {
        type = 'full-house';
    }
    if (mapVals.some((v) => v === 4)) type = 'four-of-a-kind';
    if (mapVals.length === 1) type = 'five-of-a-kind';

    return { cards, type, bid: Number(bid) };
});

hands.sort((a, b) => {
    // If our types are the same, we need to compare the cards in order to see who has the higher card to the left
    if (a.type === b.type) {
        for (let i = 0; i < a.cards.length; i++) {
            const aRank = CARD_RANKING.indexOf(a.cards[i]);
            const bRank = CARD_RANKING.indexOf(b.cards[i]);
            if (aRank === bRank) continue;
            return bRank - aRank;
        }
    }
    return handTypes.indexOf(a.type) - handTypes.indexOf(b.type);
});

console.log(hands);

const res = hands.reduce((total, hand, i) => {
    const rank = hands.length - i;
    return total + hand.bid * rank;
}, 0);

console.log(res);
