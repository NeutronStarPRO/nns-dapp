/**
 * @jest-environment jsdom
 */

import ParticipateButton from "$lib/components/project-detail/ParticipateButton.svelte";
import { accountsStore } from "$lib/stores/accounts.store";
import { authStore } from "$lib/stores/auth.store";
import { snsTicketsStore } from "$lib/stores/sns-tickets.store";
import type { SnsSwapCommitment } from "$lib/types/sns";
import { mockAccountsStoreData } from "$tests/mocks/accounts.store.mock";
import {
  authStoreMock,
  mockIdentity,
  mutableMockAuthStoreSubscribe,
} from "$tests/mocks/auth.store.mock";
import en from "$tests/mocks/i18n.mock";
import {
  createTransferableAmount,
  mockSnsFullProject,
  mockSnsParams,
  mockSnsSwapCommitment,
  principal,
  summaryForLifecycle,
} from "$tests/mocks/sns-projects.mock";
import { rootCanisterIdMock } from "$tests/mocks/sns.api.mock";
import { renderContextCmp, snsTicketMock } from "$tests/mocks/sns.mock";
import { clickByTestId } from "$tests/utils/utils.test-utils";
import { SnsSwapLifecycle } from "@dfinity/sns";
import { waitFor } from "@testing-library/svelte";

describe("ParticipateButton", () => {
  const { ticket: testTicket } = snsTicketMock({
    rootCanisterId: rootCanisterIdMock,
    owner: rootCanisterIdMock,
  });

  jest
    .spyOn(authStore, "subscribe")
    .mockImplementation(mutableMockAuthStoreSubscribe);

  describe("signed in", () => {
    beforeEach(() => {
      authStoreMock.next({
        identity: mockIdentity,
      });
      snsTicketsStore.reset();
      jest.clearAllMocks();
    });

    it("should render a text to increase participation", () => {
      snsTicketsStore.setNoTicket(rootCanisterIdMock);

      const { queryByTestId } = renderContextCmp({
        summary: mockSnsFullProject.summary,
        swapCommitment: mockSnsFullProject.swapCommitment as SnsSwapCommitment,
        Component: ParticipateButton,
      });
      expect(
        (
          queryByTestId("sns-project-participate-button")?.textContent ?? ""
        ).trim()
      ).toEqual(en.sns_project_detail.increase_participation);
    });

    it("should render a text to participate", async () => {
      snsTicketsStore.setNoTicket(rootCanisterIdMock);

      const { queryByTestId } = renderContextCmp({
        summary: mockSnsFullProject.summary,
        swapCommitment: mockSnsSwapCommitment(
          principal(3)
        ) as SnsSwapCommitment,
        Component: ParticipateButton,
      });
      await waitFor(() =>
        expect(
          (
            queryByTestId("sns-project-participate-button")?.textContent ?? ""
          ).trim()
        ).toEqual(en.sns_project_detail.participate)
      );
    });

    // TODO: Disable button until we have the commitment of the user
    it("should show button when user has no commitment", () => {
      snsTicketsStore.setNoTicket(rootCanisterIdMock);

      const { queryByTestId } = renderContextCmp({
        summary: summaryForLifecycle(SnsSwapLifecycle.Open),
        swapCommitment: {
          rootCanisterId: mockSnsFullProject.rootCanisterId,
          myCommitment: undefined,
        },
        Component: ParticipateButton,
      });
      expect(
        queryByTestId("sns-project-participate-button")
      ).toBeInTheDocument();
    });

    it("should open swap participation modal on participate click", async () => {
      snsTicketsStore.setNoTicket(rootCanisterIdMock);

      // When the modal appears, it will trigger `pollAccounts`
      // which trigger api calls if accounts are not loaded.
      accountsStore.set(mockAccountsStoreData);

      const { getByTestId } = renderContextCmp({
        summary: mockSnsFullProject.summary,
        swapCommitment: mockSnsFullProject.swapCommitment as SnsSwapCommitment,
        Component: ParticipateButton,
      });

      await waitFor(() =>
        expect(getByTestId("sns-project-participate-button")).not.toBeNull()
      );

      await clickByTestId(getByTestId, "sns-project-participate-button");
      await waitFor(() =>
        expect(getByTestId("transaction-step-1")).toBeInTheDocument()
      );
    });

    it("should hide button is state is not open", () => {
      const { queryByTestId } = renderContextCmp({
        summary: summaryForLifecycle(SnsSwapLifecycle.Pending),
        swapCommitment: mockSnsFullProject.swapCommitment as SnsSwapCommitment,
        Component: ParticipateButton,
      });
      expect(
        queryByTestId("sns-project-participate-button")
      ).not.toBeInTheDocument();
    });

    it("should display a spinner if user has an open ticket", async () => {
      snsTicketsStore.setTicket({
        rootCanisterId: rootCanisterIdMock,
        ticket: testTicket,
      });

      const { queryByTestId, getByTestId } = renderContextCmp({
        summary: summaryForLifecycle(SnsSwapLifecycle.Open),
        swapCommitment: mockSnsFullProject.swapCommitment as SnsSwapCommitment,
        Component: ParticipateButton,
      });

      await waitFor(() =>
        expect(getByTestId("connecting_sale_canister")).not.toBeNull()
      );

      expect(queryByTestId("sns-project-participate-button")).toBeNull();
    });

    it("should display spinner and hide button when there is loading ticket", async () => {
      const { queryByTestId, getByTestId, container } = renderContextCmp({
        summary: summaryForLifecycle(SnsSwapLifecycle.Open),
        swapCommitment: mockSnsFullProject.swapCommitment as SnsSwapCommitment,
        Component: ParticipateButton,
      });

      expect(container.querySelector("svg.small")).toBeInTheDocument();
      expect(getByTestId("connecting_sale_canister")).not.toBeNull();
      expect(queryByTestId("sns-project-participate-button")).toBeNull();
    });

    it("should enable button if user has not committed max already", async () => {
      snsTicketsStore.setNoTicket(rootCanisterIdMock);

      const { queryByTestId } = renderContextCmp({
        summary: summaryForLifecycle(SnsSwapLifecycle.Open),
        swapCommitment: mockSnsFullProject.swapCommitment as SnsSwapCommitment,
        Component: ParticipateButton,
      });

      const button = queryByTestId(
        "sns-project-participate-button"
      ) as HTMLButtonElement;

      await waitFor(() => expect(button.getAttribute("disabled")).toBeNull());
    });

    it("should disable button if user has committed max already", () => {
      const mock = mockSnsFullProject.swapCommitment as SnsSwapCommitment;

      const { queryByTestId } = renderContextCmp({
        summary: summaryForLifecycle(SnsSwapLifecycle.Open),
        swapCommitment: {
          rootCanisterId: mock.rootCanisterId,
          myCommitment: {
            icp: [
              createTransferableAmount(mockSnsParams.max_participant_icp_e8s),
            ],
          },
        },
        Component: ParticipateButton,
      });

      const button = queryByTestId(
        "sns-project-participate-button"
      ) as HTMLButtonElement;
      expect(button.getAttribute("disabled")).not.toBeNull();
    });
  });

  describe("not signed in", () => {
    beforeAll(() => {
      authStoreMock.next({
        identity: undefined,
      });
    });

    it("should not render participate button", () => {
      const { queryByTestId } = renderContextCmp({
        summary: summaryForLifecycle(SnsSwapLifecycle.Open),
        swapCommitment: mockSnsFullProject.swapCommitment as SnsSwapCommitment,
        Component: ParticipateButton,
      });

      expect(queryByTestId("sns-project-participate-button")).toBeNull();
    });

    it("should render a sign in button", () => {
      const { getByTestId } = renderContextCmp({
        summary: summaryForLifecycle(SnsSwapLifecycle.Open),
        swapCommitment: mockSnsFullProject.swapCommitment as SnsSwapCommitment,
        Component: ParticipateButton,
      });

      expect(getByTestId("login-button")).not.toBeNull();
    });
  });
});
