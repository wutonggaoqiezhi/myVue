import script from "./App.vue?vue&type=script&lang=ts&"
export * from "./App.vue?vue&type=script&lang=ts&"
import style0 from "./App.vue?vue&type=style&index=0&lang=less&"

import { defineComponent, h } from 'vue';
import Home from './components/Home.vue';

export default defineComponent({
  name: 'App',
  components: {
    Home,
  },
  render() {
    return h('div', { id: 'app' }, [h(Home)]);
  },
});
