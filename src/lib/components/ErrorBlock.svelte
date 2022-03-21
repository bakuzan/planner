<script lang="ts">
  export let errors: string[];
</script>

{#if errors}
  <div class="errors">
    {#each errors as message}
      <p class="errors__message">{message}</p>
    {/each}
  </div>
{/if}

<style lang="scss" scoped>
  .errors {
    &__message {
      margin: 5px 0;
      color: var(--danger-colour, #f00);
    }
  }
</style>
