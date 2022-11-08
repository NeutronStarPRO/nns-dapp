/**
 * @jest-environment jsdom
 */

import {
  sortedSnsCFNeuronsStore,
  sortedSnsUserNeuronsStore,
} from "$lib/derived/sorted-sns-neurons.derived";
import SnsNeurons from "$lib/pages/SnsNeurons.svelte";
import { authStore } from "$lib/stores/auth.store";
import { page } from "$mocks/$app/stores";
import type { SnsNeuron } from "@dfinity/sns";
import { render, waitFor } from "@testing-library/svelte";
import {
  mockAuthStoreSubscribe,
  mockPrincipal,
} from "../../mocks/auth.store.mock";
import {
  buildMockSortedSnsNeuronsStoreSubscribe,
  createMockSnsNeuron,
} from "../../mocks/sns-neurons.mock";
import { rootCanisterIdMock } from "../../mocks/sns.api.mock";

jest.mock("$lib/services/sns-neurons.services", () => {
  return {
    loadSnsNeurons: jest.fn().mockReturnValue(undefined),
  };
});

describe("SnsNeurons", () => {
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  let authStoreMock: jest.MockedFunction<any>;

  beforeEach(() => {
    page.mock({ data: { universe: rootCanisterIdMock.toText() } });
    authStoreMock = jest
      .spyOn(authStore, "subscribe")
      .mockImplementation(mockAuthStoreSubscribe);
  });

  afterEach(() => jest.clearAllMocks());

  describe("without neurons from CF", () => {
    beforeEach(() => {
      const neuron1 = createMockSnsNeuron({
        id: [1, 2, 3],
      });
      const neuron2 = createMockSnsNeuron({
        id: [1, 2, 4],
      });
      jest
        .spyOn(sortedSnsUserNeuronsStore, "subscribe")
        .mockImplementation(
          buildMockSortedSnsNeuronsStoreSubscribe([neuron1, neuron2])
        );
      jest
        .spyOn(sortedSnsCFNeuronsStore, "subscribe")
        .mockImplementation(buildMockSortedSnsNeuronsStoreSubscribe([]));
    });

    afterEach(() => jest.clearAllMocks());

    it("should subscribe to store", () => {
      render(SnsNeurons);
      expect(authStoreMock).toHaveBeenCalled();
    });

    it("should render a principal as text", () => {
      const { getByText } = render(SnsNeurons);

      expect(
        getByText(mockPrincipal.toText(), { exact: false })
      ).toBeInTheDocument();
    });

    it("should render SnsNeuronCards for each neuron", async () => {
      const { queryAllByTestId } = render(SnsNeurons);

      await waitFor(() =>
        expect(queryAllByTestId("sns-neuron-card-title").length).toBe(2)
      );
    });
  });

  describe("with neurons from CF", () => {
    beforeEach(() => {
      const neuron1 = createMockSnsNeuron({
        id: [1, 2, 3],
      });
      const neuron2: SnsNeuron = {
        ...createMockSnsNeuron({
          id: [1, 2, 4],
        }),
        source_nns_neuron_id: [BigInt(123)],
      };
      jest
        .spyOn(sortedSnsUserNeuronsStore, "subscribe")
        .mockImplementation(buildMockSortedSnsNeuronsStoreSubscribe([neuron1]));
      jest
        .spyOn(sortedSnsCFNeuronsStore, "subscribe")
        .mockImplementation(buildMockSortedSnsNeuronsStoreSubscribe([neuron2]));
    });

    afterEach(() => jest.clearAllMocks());

    it("should render SnsNeuronCards for each neuron", async () => {
      const { queryAllByTestId } = render(SnsNeurons);

      await waitFor(() =>
        expect(queryAllByTestId("sns-neuron-card-title").length).toBe(2)
      );
    });

    it("should render Community Fund title", async () => {
      const { queryByTestId } = render(SnsNeurons);

      await waitFor(() =>
        expect(queryByTestId("community-fund-title")).toBeInTheDocument()
      );
    });
  });
});