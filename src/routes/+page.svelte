<script lang="ts">
  import { currentUser } from "$lib/store";
  import type { PageData } from "./$types";
  import AddHome from "./AddHome.svelte";
  import Homes from "./Homes.svelte";

  export let data: PageData;
  const { user } = data;

  if (user) {
    if (!$currentUser) {
      $currentUser = user;
    }
  }
</script>

<section>
  <article>
    {#if $currentUser && $currentUser.homes.length > 0}
      <Homes />
    {:else}
      <AddHome />
    {/if}
  </article>
</section>

<style>
  section {
    display: flex;
    justify-content: center;
    min-height: 100vh;
  }
  article {
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
    max-width: 1068px;
  }
</style>
