<script lang="ts" context="module">
  /** @type {import('@sveltejs/kit').Load} */
  export async function load(event) {
    const response = await event.fetch('/schedules/__data.json', {
      accept: 'application/json'
    });
    const data = await response.json();
    return { ...event, props: { items: data.items } };
  }
</script>

<script lang="ts">
  import type { ISchedule } from '$lib/interfaces/ISchedule';

  export let items: ISchedule[];
  console.log('Home ... ', items);
</script>

<svelte:head>
  <title>Home | Planner</title>
</svelte:head>

<h1 class="page-title">Home</h1>
<div>
  <div>
    <form
      id="createSchedule"
      name="schedule"
      method="post"
      action="/schedules"
      autocomplete="off"
    >
      <div class="form">
        <label class="text-input">
          Schedule Name
          <input
            id="name"
            type="text"
            name="name"
            placeholder="Enter Unique Schedule Name"
            required
          />
        </label>

        <div class="button-group">
          <button type="submit" class="button button--submit"
            >Create schedule</button
          >
        </div>
      </div>
    </form>
  </div>
  <div>
    <ul class="list list--schedules">
      {#each items as item}
        <li class="schedule-item">
          <a href={`/schedules/${item.id}`}>{item.name}</a>
        </li>
      {:else}
        <li><p>No schedules found!</p></li>
      {/each}
    </ul>
  </div>
</div>

<style lang="scss">
  .page-title {
    font-size: 2rem;
    margin: 0;
  }

  .list {
    margin: 10px 0;
    padding: 0;
    padding-inline-start: 20px;

    &--schedules {
      list-style-type: disclosure-closed;
      max-width: 400px;
    }
  }

  .schedule-item {
    padding: 2px 5px;
    font-size: 1.25rem;

    &:focus,
    &:hover,
    &:active {
      background-color: var(--hover-colour);

      &::marker {
        color: var(--theme-colour);
      }
    }
  }
</style>
