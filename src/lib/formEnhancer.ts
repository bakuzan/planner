export interface EnhanceCallbacks {
  done: (result, form: HTMLFormElement) => void;
  error: (err: Error, form: HTMLFormElement) => void;
}

export function enhance(form: HTMLFormElement, callbacks: EnhanceCallbacks) {
  const { done, error } = callbacks;

  async function onSubmit(e: Event) {
    e.preventDefault();

    const payload = new FormData(form);

    try {
      const response = await fetch(form.action, {
        method: form.method,
        headers: {
          accept: 'application/json'
        },
        body: JSON.stringify(Object.fromEntries(payload))
      });

      if (response.ok) {
        const result = await response.json();
        done(result, form);
      } else {
        const body = await response.text();
        console.log(response.status);
        console.log(response.statusText);
        error(new Error(body), form);
      }
    } catch (e) {
      error(e, form);
    }
  }

  form.addEventListener('submit', onSubmit);

  return {
    destroy() {
      form.removeEventListener('submit', onSubmit);
    }
  };
}
