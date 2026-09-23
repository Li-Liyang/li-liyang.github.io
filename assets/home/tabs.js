// Local, accessible tabs; all sections remain readable when JavaScript is off.
(() => {
  const navigation = document.querySelector('[data-tabs]');
  const tabs = [...navigation.querySelectorAll('a')];
  const panels = tabs.map(tab => document.querySelector(tab.hash));
  navigation.setAttribute('role', 'tablist');
  tabs.forEach((tab, index) => {
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-controls', panels[index].id);
    panels[index].setAttribute('role', 'tabpanel');
    panels[index].setAttribute('aria-labelledby', tab.id);
    panels[index].tabIndex = 0;
  });
  document.documentElement.classList.add('tabs-enabled');

  function select(index, {focus = false, updateUrl = false} = {}) {
    tabs.forEach((tab, i) => {
      const active = i === index;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      panels[i].hidden = !active;
    });
    if (focus) tabs[index].focus({preventScroll: true});
    if (updateUrl && location.hash !== tabs[index].hash) {
      history.pushState(null, '', tabs[index].hash);
    }
  }
  function restore() {
    const index = tabs.findIndex(tab => tab.hash === location.hash);
    select(index < 0 ? 0 : index);
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || event.button !== 0) return;
      event.preventDefault();
      select(index, {updateUrl: true});
    });
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = tabs.length - 1;
      if (next === undefined) return;
      event.preventDefault();
      select(next, {focus: true, updateUrl: true});
    });
  });
  addEventListener('popstate', restore);
  addEventListener('hashchange', restore);
  restore();
})();
