import { c as create_ssr_component, v as validate_component, d as each, e as escape } from './index-5807c32b.js';
import 'mapbox-gl';

const Mapbox = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div id="map" style="height: 500px;"></div>`;
});
const Map = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `${validate_component(Mapbox, "Mapbox").$$render($$result, {}, {}, {})}`;
});
const AnalysisElement = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { name } = $$props;
  if ($$props.name === void 0 && $$bindings.name && name !== void 0)
    $$bindings.name(name);
  return `<button>${escape(name)}</button>`;
});
const Sidebar = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  const elementNames = ["Buffer", "Intersect", "Dissolve"];
  return `<div>${each(elementNames, (e) => {
    return `${validate_component(AnalysisElement, "AnalysisElement").$$render($$result, { name: e }, {}, {})}`;
  })}</div>`;
});
const css = {
  code: ".container.svelte-wdncsn{display:grid}.sidebar.svelte-wdncsn{grid-row:1 / 4;background-color:red}.map.svelte-wdncsn{grid-column:2 / 5}",
  map: null
};
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  $$result.css.add(css);
  return `<div class="container svelte-wdncsn"><div class="sidebar svelte-wdncsn">${validate_component(Sidebar, "Sidebar").$$render($$result, {}, {}, {})}</div>
	<div class="map svelte-wdncsn">${validate_component(Map, "Map").$$render($$result, {}, {}, {})}</div>
</div>`;
});

export { Page as default };
//# sourceMappingURL=_page.svelte-887527f0.js.map
