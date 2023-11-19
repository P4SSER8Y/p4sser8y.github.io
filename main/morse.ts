export class MorseGenerator {
  raw: string;
  sequence: string;
  index: number;
  current: string;

  public constructor(raw: string) {
    this.raw = raw;
    this.index = -1;
    this.sequence = '';
    this.current = '';
    for (let ch of raw.toUpperCase()) {
      this.sequence = this.sequence.concat(MORSE_MAP.get(ch) ?? '', '/');
    }
    console.log(this.sequence);
  }

  public getSequence(): [string | null, number] {
    this.index = (this.index + 1) % this.sequence.length;
    switch (this.sequence[this.index]) {
      case '.':
        return ['o', 1];
      case '-':
        return ['x', 3];
      case '/':
        return [null, 3];
      default:
        return [null, 7];
    }
  }
}

const MORSE_MAP = new Map([
  ['A', '.-'],
  ['B', '-...'],
  ['C', '-.-.'],
  ['D', '-..'],
  ['E', '.'],
  ['F', '..-.'],
  ['G', '--.'],
  ['H', '....'],
  ['I', '..'],
  ['J', '.---'],
  ['K', '-.-'],
  ['L', '.-..'],
  ['M', '--'],
  ['N', '-.'],
  ['O', '---'],
  ['P', '.--.'],
  ['Q', '--.-'],
  ['R', '.-.'],
  ['S', '...'],
  ['T', '-'],
  ['U', '..-'],
  ['V', '...-'],
  ['W', '.--'],
  ['X', '-..-'],
  ['Y', '-.--'],
  ['Z', '--..'],
  ['0', '-----'],
  ['1', '.----'],
  ['2', '..---'],
  ['3', '...--'],
  ['4', '....-'],
  ['5', '.....'],
  ['6', '-....'],
  ['7', '--...'],
  ['8', '---..'],
  ['9', '----.'],
  ['.', '.-.-.-'],
  [',', '--..--'],
  ['?', '..--..'],
  ['/', '-..-.'],
  [' ', ' '],
]);
