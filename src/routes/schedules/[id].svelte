<script lang="ts" context="module">
  import type { IActivity } from '$lib/interfaces/IActivity';
  import type { IScheduleWithSlots } from '$lib/interfaces/ISchedule';
  import type { ITimeSlot, IBlock } from '$lib/interfaces/ITimeSlot';

  function reduceSlotsByHour(p: Map<string, IBlock[]>, x: ITimeSlot) {
    const timeSlot = { ...x, activityId: x.activityId || '' };

    if (timeSlot.slot.includes(':30')) {
      const slot = timeSlot.slot.replace(':30', ':00');
      const item = p.get(slot);

      p.set(slot, [...item, timeSlot]);
    } else {
      p.set(x.slot, [timeSlot]);
    }

    return p;
  }

  /** @type {import('@sveltejs/kit').Load} */
  export async function load(event) {
    const response = await event.fetch('/activities/__data.json', {
      accept: 'application/json'
    });

    const data = await response.json();

    const slots = event.props.item.slots;
    const emptyMap = new Map<string, ITimeSlot[]>([]);
    const blocks = Array.from(
      slots.reduce(reduceSlotsByHour, emptyMap).values()
    );

    return {
      ...event,
      props: {
        ...event.props,
        blocks,
        options: data.items
      }
    };
  }
</script>

<script lang="ts">
  export let item: IScheduleWithSlots;
  export let options: IActivity[];
  export let blocks: IBlock[][];

  function getActivityColours(block: IBlock) {
    if (!block.activityId) {
      return '';
    }

    const activity = options.find((x) => x.id === block.activityId);
    const background = activity.backgroundColour || 'transparent';
    const colour = activity.colour || '#000';

    return `background-color: ${background}; color: ${colour};`;
  }

  $: console.log('Schedule > ', item);
  $: console.log('  Blocks > ', blocks);
</script>

<svelte:head>
  <title>{item.name} | Planner</title>
</svelte:head>

<h1 id="title" class="page-title">{item.name}</h1>

<form
  id="scheduler"
  name="scheduler"
  method="post"
  action="/schedules/{item.id}?_method=PUT"
  autocomplete="off"
>
  <div class="form">
    <label class="text-input">
      Schedule Name
      <input
        type="text"
        name="name"
        value={item.name}
        required
        aria-label="Schedule name"
        placeholder="Enter a schedule name"
      />
    </label>

    <div class="button-group">
      <button type="submit" class="button button--submit"> Update </button>
    </div>
  </div>
  <div class="times">
    {#each blocks as slots}
      <div class="times__block">
        <div class="times__number">{slots[0].slot}</div>
        <div class="block">
          {#each slots as half}
            <div class="block__half" style={getActivityColours(half)}>
              <select
                id={`eventOption_${half.slot}`}
                name={`eventOption_${half.slot}`}
                placeholder="Select an event"
                aria-label="Select an event"
                class="event-selector"
                bind:value={half.activityId}
              >
                <option
                  class="event-selector__option"
                  value=""
                  selected={'' === half.activityId}>Select an event</option
                >
                {#each options as option}
                  <option
                    class="event-selector__option"
                    value={option.id}
                    selected={option.id === half.activityId}
                  >
                    {option.name}
                  </option>
                {/each}
              </select>
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
</form>

<form
  id="deleteSchedule"
  name="deleteSchedule"
  method="post"
  action="/schedules/{item.id}?_method=DELETE"
>
  <button type="submit" class="button button--submit">Delete schedule</button>
</form>

<style scoped lang="scss">
  :root {
    --block-height: 100px;
  }

  .times {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(var(--block-height), 1fr));
    gap: 2px;
    margin: 20px 0;

    &__number {
      text-align: center;
      background-color: var(--theme-colour);
      color: var(--constrast-colour);
    }
  }

  .block {
    height: var(--block-height);

    &__half {
      width: 100%;
      height: 50%;
    }
  }

  .event-selector {
    max-width: 100%;
    border: none;
    background: transparent;
    color: inherit;

    &__option {
      color: var(--base-colour, #000);
    }
  }
</style>
