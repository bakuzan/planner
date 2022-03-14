<script lang="ts" context="module">
  /** @type {import('@sveltejs/kit').Load} */
  export async function load(event) {
    const response = await event.fetch(
      '/schedules/__data.json?includeCurrentItems=1',
      {
        accept: 'application/json'
      }
    );

    const data = await response.json();

    return {
      ...event,
      props: { items: data.items, currentItems: data.currentItems }
    };
  }
</script>

<script lang="ts">
  import type {
    ISchedule,
    IScheduleWithSlotRanges
  } from '$lib/interfaces/ISchedule';

  export let items: ISchedule[];
  export let currentItems: IScheduleWithSlotRanges[];
  console.log('Home ... ', items, currentItems);
</script>

<svelte:head>
  <title>Home | Planner</title>
</svelte:head>

<h1 class="page-title">Home</h1>
<div>
  {#if currentItems.length > 0}
    <section class="schedule-section">
      <h2 class="section-title">Current Schedules</h2>
      <ul class="list list--typeless">
        {#each currentItems as item}
          <li>
            <a href={`/schedules/${item.id}`}>{item.name}</a>
            <ul class="timeline timeline--slots">
              {#each item.slots as ts}
                <li
                  class="slot-item"
                  aria-label={`${ts.activityName} from ${ts.slot} until ${ts.endSlot}`}
                  title={`${ts.activityName} from ${ts.slot} until ${ts.endSlot}`}
                  style={`background-color: ${ts.backgroundColour}; --slot-count: ${ts.slotCount};`}
                  data-slot-count={ts.slotCount}
                />
              {/each}
            </ul>
          </li>
        {/each}
      </ul>
    </section>
  {/if}
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
  <section class="schedule-section">
    <h2 class="section-title">All Schedules</h2>
    <ul class="list list--schedules">
      {#each items as item}
        <li class="schedule-item">
          <div class="schedule-item__icon">
            {#if item.isCurrent !== 0}
              <div class="icon">
                <!-- todo, put some icon here signalling is current -->
              </div>
            {/if}
          </div>
          <a href={`/schedules/${item.id}`}>{item.name}</a>
        </li>
      {:else}
        <li><p>No schedules found!</p></li>
      {/each}
    </ul>
  </section>
</div>

<style lang="scss">
  .schedule-section {
    margin: 25px 0;
  }

  .list {
    margin: 10px 0;
    padding: 0;
    padding-inline-start: 20px;

    &--typeless {
      list-style-type: none;
    }

    &--schedules {
      list-style-type: disclosure-closed;
      max-width: 400px;
      padding-inline-start: 40px;
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

  .timeline {
    display: flex;
    min-height: 50px;
    list-style-type: none;

    &--slots {
      padding: 0;
    }
  }

  .slot-item {
    width: calc((var(--slot-count) / 48) * 100%);
  }
</style>
