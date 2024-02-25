import mitt from 'mitt';

const TABLE_INVESTOR_NAME = 'Coop-Investor';
const TABLE_TRANSACTION_NAME = 'Coop-Transaction';

let investors: Investor[] = [];
let transactions: Transaction[] = [];

export let Bus = mitt<Events>();

type Events = {
    update: number | null;
};

export type Investor = {
    id: number;
    name: string;
    avatar: string;
};

export type Transaction = {
    timestamp: number;
    src: number;
    dst: number;
    balance: number;
};

export function init_db() {
    investors = JSON.parse(localStorage.getItem(TABLE_INVESTOR_NAME) ?? '[]') as Investor[];
    transactions = JSON.parse(localStorage.getItem(TABLE_TRANSACTION_NAME) ?? '[]') as Transaction[];
    if (investors.length == 0) {
        investors.push({ id: -1, name: 'Bank', avatar: 'text' });
    }
    Bus.emit('update', null);
}

export function drop_db() {
    console.log('drop db');
    investors = [];
    transactions = [];
    update_db();
}

function update_db() {
    localStorage.setItem(TABLE_INVESTOR_NAME, JSON.stringify(investors));
    localStorage.setItem(TABLE_TRANSACTION_NAME, JSON.stringify(transactions));
    console.log('update db');
}

export function get_transactions(id: number) {
    return transactions.filter((v) => v.src == id || v.dst == id);
}

export function get_balance(id: number) {
    return get_transactions(id)
        .map((x) => {
            let v = 0;
            if (x.src == id) {
                v -= x.balance;
            }
            if (x.dst == id) {
                v += x.balance;
            }
            return v;
        })
        .reduce((a, b) => a + b, 0);
}

export function new_investor(id: number, name: string, avatar: string) {
    let v: Investor = {
        id: id,
        name: name,
        avatar: avatar,
    };
    investors.push(v);
    update_db();
    console.log(`new investor: ${JSON.stringify(v)}`);
}

export function list_investors() {
    return investors;
}

export function new_transaction(src: number, dst: number, balance: number) {
    let v: Transaction = {
        timestamp: Date.now(),
        src: src,
        dst: dst,
        balance: balance,
    };
    transactions.push(v);
    update_db();
    console.log(`new transaction: ${JSON.stringify(v)}`);
    Bus.emit('update', src);
    Bus.emit('update', dst);
}

export function dump_all() {
    console.log(investors);
    console.log(transactions);
}
