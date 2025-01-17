<script lang="ts">
  import { Html } from "@dfinity/gix-components";
  import type { TreeJsonValueType } from "$lib/utils/json.utils";
  import { getTreeJsonValueRenderType } from "$lib/utils/json.utils";
  import { stringifyJson } from "$lib/utils/utils.js";

  // To avoid having quotes around all the value types
  const formatData = (value: unknown) => {
    const valueType = getTreeJsonValueRenderType(value);
    if (valueType === "base64Encoding") {
      return (data as { [key: string]: unknown })["base64Encoding"];
    }
    if (
      (
        [
          "undefined",
          "null",
          "number",
          "bigint",
          "boolean",
          "object",
        ] as Array<TreeJsonValueType>
      ).includes(valueType)
    ) {
      return `${value}`;
    }
    // more reliable (functions etc), but adds quotes
    return stringifyJson(value);
  };

  export let data: unknown | undefined = undefined;
  export let key: string | undefined = undefined;

  let valueType: TreeJsonValueType;
  $: valueType = getTreeJsonValueRenderType(data);

  let value: unknown;
  $: value = formatData(data);

  let title: string | undefined;
  $: title = valueType === "hash" ? (data as number[]).join() : undefined;
</script>

{#if valueType === "base64Encoding"}
  <!-- base64 encoded image (use <Html> to sanitize the content from XSS) -->
  <Html
    text={`<img class="value ${valueType}" alt="${key}" src="${value}" loading="lazy" />`}
  />
{:else}
  <span class="value {valueType}" {title}>{value}</span>
{/if}

<style lang="scss">
  @use "@dfinity/gix-components/dist/styles/mixins/fonts";

  .key {
    display: flex;
    align-items: center;
    margin-right: var(--padding-2x);

    @include fonts.standard(true);
    color: var(--content-color);

    &.root {
      @include fonts.h4();
    }
    &.key--expandable {
      margin-right: 0;
      // no icon gap compensation
      margin-left: 0;
    }
    &.key--is-index {
      // monospace for array indexes to avoid different widths
      font-family: monospace;
    }
  }

  .value {
    // better shrink the value than the key
    flex: 1 1 0;
    // We want to break the value, so that the keys stay on the same line.
    word-break: break-all;
    color: var(--description-color);
  }

  // base64 encoded image
  :global(.value.base64Encoding) {
    vertical-align: top;
    max-width: var(--padding-3x);
    overflow: hidden;
    transition: max-width ease-out var(--animation-time-normal);

    // increase size on hover (128px max size)
    &:hover {
      max-width: calc(16 * var(--padding));
    }
  }
</style>
