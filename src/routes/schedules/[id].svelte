<script lang="ts">
  export let item;

  export let blocks = Array(24)
    .fill(1)
    .map((_, i) => i);

  export let options = [
    { value: 1, text: 'Anime' },
    { value: 2, text: 'Cartoon' },
    { value: 3, text: 'Manga' },
    { value: 4, text: 'Comics' },
    { value: 5, text: 'Eat' },
    { value: 6, text: 'Sleep' }
  ];

  console.log('Schedule > ', item);

  function formatNumberAsTime(num: number) {
    const begin = `${num}`.padStart(2, '0');
    return `${begin}:00`;
  }
</script>

<svelte:head>
  <title>{item.name} | Planner</title>
</svelte:head>

<h1 id="title" class="page-title">{item.name}</h1>

<form
  id="scheduler"
  name="scheduler"
  method="post"
  action="/schedule/{item.id}?_method=PUT"
  autocomplete="off"
>
  <div>
    <input type="text" name="dayName" placeholder="Enter name for day" />

    <select id="eventOption" name="eventOption" placeholder="Select an event">
      <option value="">Select an event</option>
      {#each options as option}
        <option value={option.value}>
          {option.text}
        </option>
      {/each}
    </select>
    <button type="submit" class="button button--submit"> Update </button>
  </div>
  <div class="times">
    {#each blocks as block}
      <div class="times__block">
        <div class="times__number">{formatNumberAsTime(block)}</div>
        <div class="block">
          <div class="block__half">
            <input type="checkbox" name={`block_${block}_0`} />
          </div>
          <div class="block__half">
            <input type="checkbox" name={`block_${block}_30`} />
          </div>
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

    &__block {
    }

    &__number {
      text-align: center;
      background-color: var(--theme-colour);
      color: var(--constrast-colour);
    }
  }

  .block {
    height: var(--block-height);
    border: 1px dashed var(--block-border-colour); // todo remove when more fleshed out

    &__half {
      width: 100%;
      height: 50%;
    }
  }
</style>
