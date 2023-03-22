import { BasePageObject } from "$tests/page-objects/base.page-object";
import { NnsNeuronsPo } from "$tests/page-objects/NnsNeurons.page-object";
import { SnsNeuronsPo } from "$tests/page-objects/SnsNeurons.page-object";
import type { PageObjectElement } from "$tests/types/page-object.types";
import { nonNullish } from "@dfinity/utils";

export class NeuronsPo extends BasePageObject {
  static readonly tid = "neurons-component";

  private constructor(root: PageObjectElement) {
    super(root);
  }

  static under(element: PageObjectElement): NeuronsPo | null {
    const el = element.querySelector(`[data-tid=${NeuronsPo.tid}]`);
    return el && new NeuronsPo(el);
  }

  getNnsNeuronsPo(): NnsNeuronsPo | null {
    return NnsNeuronsPo.under(this.root);
  }

  getSnsNeuronsPo(): SnsNeuronsPo | null {
    return SnsNeuronsPo.under(this.root);
  }

  hasNnsNeuronsPo(): boolean {
    return nonNullish(this.getNnsNeuronsPo());
  }

  hasSnsNeuronsPo(): boolean {
    return nonNullish(this.getSnsNeuronsPo());
  }

  isContentLoaded() {
    return (
      this.getNnsNeuronsPo()?.isContentLoaded() ||
      this.getSnsNeuronsPo()?.isContentLoaded() ||
      false
    );
  }
}
