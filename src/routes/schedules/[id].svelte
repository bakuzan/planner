<script lang="ts" context="module">
  import type { IActivity } from '$lib/interfaces/IActivity';
  import type { IDropdownOption } from '$lib/interfaces/IDropdownOption';
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

  export async function load(event) {
    const response = await event.fetch('/activities/__data.json', {
      accept: 'application/json'
    });

    const data = await response.json();

    const slots = event.props.item.slots;
    const blocks = Array.from(
      slots.reduce(reduceSlotsByHour, new Map<string, ITimeSlot[]>([])).values()
    );

    return {
      ...event,
      props: {
        ...event.props,
        blocks,
        options: data.items.map((x: IActivity) => ({
          text: x.name,
          value: x.id
        }))
      }
    };
  }
</script>

<script lang="ts">
  export let item: IScheduleWithSlots;
  export let options: IDropdownOption[];
  export let blocks: IBlock[][];

  console.log('Schedule > ', item, options, blocks);
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
  <div>
    <input
      type="text"
      name="name"
      value={item.name}
      required
      aria-label="Schedule name"
      placeholder="Enter a schedule name"
    />
    <button type="submit" class="button button--submit"> Update </button>
  </div>
  <div class="times">
    {#each blocks as slots}
      <div class="times__block">
        <div class="times__number">{slots[0].slot}</div>
        <div class="block">
          {#each slots as half}
            <div class="block__half">
              <select
                id={`eventOption_${half.slot}`}
                name={`eventOption_${half.slot}`}
                placeholder="Select an event"
                aria-label="Select an event"
                class="event-option"
                bind:value={half.activityId}
              >
                <option value="" selected={'' === half.activityId}
                  >Select an event</option
                >
                {#each options as option}
                  <option
                    value={option.value}
                    selected={option.value === half.activityId}
                  >
                    {option.text}
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
    // border: 1px dashed var(--block-border-colour); // todo remove when more fleshed out

    &__half {
      width: 100%;
      height: 50%;
    }
  }

  .event-option {
    max-width: 100%;
    border: none;
  }
</style>
