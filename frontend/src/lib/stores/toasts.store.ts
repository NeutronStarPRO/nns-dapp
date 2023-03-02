/* eslint-disable no-console */
import { DEFAULT_TOAST_DURATION_MILLIS } from "$lib/constants/constants";
import type { ToastMsg } from "$lib/types/toast";
import { errorToString } from "$lib/utils/error.utils";
import type { I18nSubstitutions } from "$lib/utils/i18n.utils";
import { replacePlaceholders, translate } from "$lib/utils/i18n.utils";
import { toastsStore } from "@dfinity/gix-components";
import { get } from "svelte/store";

const mapToastText = ({ labelKey, substitutions, detail }: ToastMsg): string =>
  `${replacePlaceholders(translate({ labelKey }), substitutions ?? {})}${
    detail !== undefined ? ` ${detail}` : ""
  }`;

/**
 * Toast messages.
 *
 * - toastsShow: display a message in toast component
 * - toastsSuccess: display a message of type "success" - something went really well ;)
 * - toastsError: display an error and print the issue in the console as well
 * - toastsHide: remove the toast message with that timestamp or the first one.
 * - toastsReset: reset toasts
 */

export const toastsShow = (msg: ToastMsg): symbol => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { labelKey, substitutions, detail, ...rest } = msg;

  return toastsStore.show({
    text: mapToastText(msg),
    ...rest,
  });
};

export const toastsSuccess = ({
  labelKey,
  substitutions,
}: Pick<ToastMsg, "labelKey" | "substitutions">) =>
  toastsShow({
    labelKey,
    substitutions,
    level: "success",
    duration: DEFAULT_TOAST_DURATION_MILLIS,
  });

export const toastsError = ({
  labelKey,
  err,
  substitutions,
}: {
  labelKey: string;
  err?: unknown;
  substitutions?: I18nSubstitutions;
}): symbol => {
  if (err !== undefined) {
    console.error(err);
  }

  return toastsShow({
    labelKey,
    level: "error",
    detail: errorToString(err),
    substitutions,
  });
};

export const toastsHide = (idToHide: symbol) => toastsStore.hide(idToHide);

export const toastsReset = () => {
  // TODO: Workaround, implement better solution
  const toasts = [...get(toastsStore)];
  const customToasts = toasts.filter(({ level }) => level === "custom");

  toastsStore.reset();

  customToasts.forEach((msg) => toastsStore.show(msg));
};

export const toastsUpdate = ({
  id,
  content,
}: {
  id: symbol;
  content: ToastMsg;
}): void => {
  toastsStore.update({
    id,
    content: {
      id,
      ...content,
      text: mapToastText(content),
    },
  });
};
