<script>
  export let item;
  console.log('Schedule > ', item);
</script>

<svelte:head>
  <title>{item.name} | Planner</title>
</svelte:head>

<h1 id="title" class="page-title">{item.name}</h1>
<div class="times">times to go here...</div>
<form
  id="deleteSchedule"
  name="deleteSchedule"
  method="post"
  action="/schedules/{item.id}?_method=DELETE"
>
  <button type="submit" class="button button--submit">Delete schedule</button>
</form>
