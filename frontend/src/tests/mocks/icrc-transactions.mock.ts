import type { IcrcTransactionsStoreData } from "$lib/stores/icrc-transactions.store";
import type {
  IcrcTransaction,
  IcrcTransactionWithId,
} from "@dfinity/ledger-icrc";
import { Principal } from "@dfinity/principal";
import type { Subscriber } from "svelte/store";

export interface IcrcCandidAccount {
  owner: Principal;
  subaccount: [] | [Uint8Array];
}

export const createIcrcTransactionWithId = ({
  from,
  to,
}: {
  to: IcrcCandidAccount;
  from: IcrcCandidAccount;
}): IcrcTransactionWithId => ({
  id: BigInt(123),
  transaction: {
    kind: "transfer",
    timestamp: BigInt(12354),
    burn: [],
    mint: [],
    transfer: [
      {
        to,
        from,
        memo: [],
        created_at_time: [BigInt(123)],
        amount: BigInt(33),
        fee: [BigInt(1)],
        spender: [],
      },
    ],
    approve: [],
  },
});

const fakeAccount = {
  owner: Principal.fromText("aaaaa-aa"),
  subaccount: [] as [],
};

const mockIcrcTransactionTransfer: IcrcTransaction = {
  kind: "transfer",
  timestamp: BigInt(12354),
  burn: [],
  mint: [],
  transfer: [
    {
      to: fakeAccount,
      from: fakeAccount,
      memo: [],
      created_at_time: [BigInt(123)],
      amount: BigInt(33),
      fee: [BigInt(1)],
      spender: [],
    },
  ],
  approve: [],
};

export const mockIcrcTransactionBurn: IcrcTransaction = {
  kind: "burn",
  timestamp: BigInt(12354),
  burn: [
    {
      amount: BigInt(33),
      from: fakeAccount,
      memo: [],
      created_at_time: [BigInt(123)],
      spender: [],
    },
  ],
  mint: [],
  transfer: [],
  approve: [],
};

export const mockIcrcTransactionMint: IcrcTransaction = {
  kind: "mint",
  timestamp: BigInt(12354),
  burn: [],
  mint: [
    {
      amount: BigInt(33),
      memo: [],
      created_at_time: [BigInt(123)],
      to: fakeAccount,
    },
  ],
  transfer: [],
  approve: [],
};

export const mockIcrcTransactionWithId: IcrcTransactionWithId = {
  id: BigInt(123),
  transaction: mockIcrcTransactionTransfer,
};

export const mockIcrcTransactionsStoreSubscribe =
  (store: IcrcTransactionsStoreData) =>
  (run: Subscriber<IcrcTransactionsStoreData>): (() => void) => {
    run(store);

    return () => undefined;
  };
