import { getCkBTCAccounts, getCkBTCToken } from "$lib/api/ckbtc-ledger.api";
import { CKBTC_UNIVERSE_CANISTER_ID } from "$lib/constants/canister-ids.constants";
import { queryAndUpdate } from "$lib/services/utils.services";
import { ckBTCAccountsStore } from "$lib/stores/ckbtc-accounts.store";
import { toastsError } from "$lib/stores/toasts.store";
import { tokensStore } from "$lib/stores/tokens.store";
import type { Account } from "$lib/types/account";
import type { IcrcTokenMetadata } from "$lib/types/icrc";

/**
 * This function performs only an insecure "query" and does not toast the error but throw it so that all errors are collected by its caller.
 */
const loadCkBTCAccountsBalance = (): Promise<void> => {
  return queryAndUpdate<Account[], unknown>({
    request: ({ certified, identity }) =>
      getCkBTCAccounts({ identity, certified }),
    onLoad: ({ response: accounts, certified }) =>
      ckBTCAccountsStore.set({
        accounts,
        certified,
      }),
    onError: ({ error: err }) => {
      console.error(err);
      throw err;
    },
    logMessage: "Syncing ckBTC Accounts Balance",
    strategy: "query",
  });
};

/**
 * This function performs only an insecure "query" and does not toast the error but throw it so that all errors are collected by its caller.
 */
const loadCkBTCToken = (): Promise<void> => {
  return queryAndUpdate<IcrcTokenMetadata, unknown>({
    request: ({ certified, identity }) =>
      getCkBTCToken({ identity, certified }),
    onLoad: ({ response: token, certified }) =>
      tokensStore.setToken({
        canisterId: CKBTC_UNIVERSE_CANISTER_ID,
        token,
        certified,
      }),
    onError: ({ error: err }) => {
      console.error(err);
      throw err;
    },
    logMessage: "Syncing ckBTC token",
    strategy: "query",
  });
};

/**
 * Load ckBTC accounts balances and token
 *
 * ⚠️ WARNING: this feature only performs "query" calls. Effective "update" is performed when the ckBTC universe is manually selected either through the token navigation switcher or accessed directly via the browser url.
 *
 * @param {RootCanisterIdText[] | undefined} params.excludeRootCanisterIds As the balance is also loaded by loadSnsAccounts() - to perform query and UPDATE call - this variable can be used to avoid to perform unnecessary query and per extension to override data in the balance store.
 */
export const uncertifiedLoadCkBTCAccountsBalance = async (): Promise<void> => {
  const results: PromiseSettledResult<void>[] = await Promise.allSettled([
    loadCkBTCAccountsBalance(),
    loadCkBTCToken(),
  ]);

  const error: boolean =
    results.find(({ status }) => status === "rejected") !== undefined;
  if (error) {
    toastsError({ labelKey: "error.sns_accounts_balance_load" });
  }
};