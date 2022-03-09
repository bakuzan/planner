<nav class="app-bar">
    <a class="app-bar__home" href="/">Planner</a>
</nav>

<div class="app-page">
    <slot></slot>
</div>

<style lang="scss">
    :root {
        --top-bar-height: 50px;
        --theme-colour: #66023c;
        --constrast-colour: #fff;

        font-size: 16px;
        font-family: 'Lucida Console', Consolas, monospace;
    }

    body {
        margin: 0;
    }

    .app-bar {
        background-color: var(--theme-colour);
        color: var(--constrast-colour);
        height: var(--top-bar-height);
        width: 100%;
        padding: 5px;
        display:flex;
        

        &__home {
            font-size: 1.5rem;
            color: var(--constrast-colour);
            text-decoration: none;
            margin: auto 0;
        }
    }

    .app-page {
        padding: 0 5px;
    }
</style>