<nav id="appTopbar" class="app-bar">
  <a class="app-bar__home" href="/">Planner</a>
</nav>

<main id="appMain" class="app-page">
  <slot />
</main>

<footer id="appFooter" class="app-footer">
  <hr class="app-footer__break" />
  <a
    rel="external nofollow noreferer noopener"
    href="https://github.com/bakuzan/planner">Source</a
  >
</footer>

<style lang="scss">
  :global {
    @import '../styles/_reset.scss';
    @import '../styles/_mixins.scss';
    @import '../styles/_global.scss';
    @import '../styles/_general.scss';

    .page-title {
      font-size: 2rem;
      margin: 0;
    }

    .section-title {
      font-size: 1.5rem;
      margin: 0;
    }
  }

  .app-bar {
    background-color: var(--theme-colour);
    color: var(--constrast-colour);
    height: var(--top-bar-height);
    width: 100%;
    padding: 5px;
    display: flex;
    box-sizing: border-box;

    &__home {
      font-size: 1.5rem;
      color: var(--constrast-colour);
      text-decoration: none;
      margin: auto 0;
    }
  }

  .app-page {
    display: flex;
    flex-direction: column;
    padding: 0 5px;
    min-height: calc(100vh - var(--top-bar-height));
  }

  .app-footer {
    padding: 5px;
    margin: 5px 0;

    &__break {
      background-color: var(--theme-colour);
      border: 1px solid var(--theme-colour);
      width: 100%;
      margin: 5px 0 10px 0;
    }
  }
</style>
