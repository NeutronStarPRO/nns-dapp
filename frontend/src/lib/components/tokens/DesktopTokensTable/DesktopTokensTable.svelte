<script lang="ts">
  import type { UserTokenData } from "$lib/types/tokens-page";
  import Row from "./DesktopTokensTableRow.svelte";

  export let userTokensData: UserTokenData[];
</script>

<table data-tid="desktop-tokens-table-component">
  <thead>
    <tr>
      <th class="header-left">Projects</th>
      <th class="header-right">Balance</th>
    </tr>
  </thead>
  <tbody>
    {#each userTokensData as userTokenData}
      <Row on:nnsAction {userTokenData} />
    {/each}
  </tbody>
</table>

<style lang="scss">
  table {
    width: 100%;
    border-collapse: collapse;
    border: 0;

    th {
      color: var(--text-description);
      background-color: var(--input-background);

      font-weight: normal;
      font-size: var(--font-size-small);

      padding: var(--padding) var(--padding-2x);

      border-bottom: 1px solid var(--elements-divider);
    }

    th.header-left {
      text-align: left;
    }

    th.header-right {
      text-align: right;
    }
  }
</style>
