<script lang="ts">
  import { enhance, type SubmitFunction } from "$app/forms";
  import { currentUser } from "$lib/store";

  $: homes = $currentUser?.homes;

  const handleSubmit: SubmitFunction = () => {
    return async ({ result }) => {
      if (result.type === "success") {
        currentUser.set(null);
      }
    };
  };
</script>

{#if homes && homes.length > 0}
  {#each homes as home}
    <form method="post" action="?/removeUser" use:enhance={handleSubmit}>
      <span>{home.name}</span>
      <button>Delete</button>
    </form>
  {/each}
{/if}

<style>
  form {
    display: flex;
    justify-content: space-between;
    border: 1px solid #000;
  }
</style>
