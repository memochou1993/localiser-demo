<template>
  <div
    v-show="isLoaded"
  >
    <div
      id="logo"
    >
      <a
        href="https://localiser.epoch.tw/"
        rel="noopener noreferrer"
        target="_blank"
      >
        <img
          alt="Vue"
          src="./assets/logo.png"
        />
      </a>
    </div>
    <div>
      <template
        v-for="(locale, i) in state.locales"
        :key="locale.locale"
      >
        <span
          :class="[
            'locale cursor-pointer',
            locale.locale === state.locale ? 'underline' : '',
            state.availableLocales.includes(locale.locale) ? 'highlight' : '',
          ]"
          @click="changeLanguage(locale.locale)"
          v-text="locale.name"
        />
        <span
          v-if="i < state.locales.length - 1"
          class="divider"
          v-text="' ‧ '"
        />
      </template>
    </div>
    <div
      id="body"
    >
      <table>
        <tr>
          <th>
            <span
              v-text="'Key'"
            />
          </th>
          <th>
            <span
              v-text="'Value'"
            />
          </th>
        </tr>
        <tr
          v-for="(value, key) in state.messages"
          :key="key"
        >
          <td
            class="key"
          >
            <span
              v-text="key"
            />
          </td>
          <td
            class="value"
          >
            <span
              v-if="value.includes('{n}')"
              v-text="`${t(key, { n: 1 })} ‧ ${t(key, { n: 2 })}`"
            />
            <span
              v-else
              v-text="t(key)"
            />
          </td>
        </tr>
      </table>
    </div>
    <div>
      <a
        href="https://github.com/memochou1993/localiser"
        rel="noopener noreferrer"
        target="_blank"
        v-text="'Localiser'"
      />
      <span
        class="divider"
        v-text="' ‧ '"
      />
      <a
        href="https://github.com/memochou1993/localiser-ui"
        rel="noopener noreferrer"
        target="_blank"
        v-text="'Localiser UI'"
      />
      <span
        class="divider"
        v-text="' ‧ '"
      />
      <a
        href="https://github.com/memochou1993/localiser-cli"
        rel="noopener noreferrer"
        target="_blank"
        v-text="'Localiser CLI'"
      />
    </div>
  </div>
</template>

<script>
import {
  computed,
  reactive,
} from 'vue';
import {
  useI18n,
} from 'vue-i18n/index';
import i18n, {
  DEFAULT_LOCALE,
  loadMessage,
  setLanguage,
} from '@/plugins/i18n';
import api from "./api";

export default {
  name: 'App',
  setup() {
    const state = reactive({
      locale: '',
      locales: null,
      availableLocales: [],
      messages: null,
    });
    (async () => {
      state.locales = await api.fetchLocales();
      const locale = state.locales.some((l) => l.locale === DEFAULT_LOCALE) ? DEFAULT_LOCALE : 'en';
      state.messages = await loadMessage(locale);
      state.availableLocales.push(locale);
      setLanguage(locale);
      state.locale = locale;
    })();
    const isLoaded = computed(() => !!state.locales && !!state.messages);
    const changeLanguage = async (locale) => {
      if (!i18n.global.availableLocales.includes(locale)) {
        await loadMessage(locale);
        state.availableLocales.push(locale);
      }
      setLanguage(locale);
      state.locale = locale;
    };
    const { t } = useI18n();
    return {
      t,
      state,
      isLoaded,
      changeLanguage,
    };
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin: 60px 0;
}
#logo {
  margin-bottom: 40px;
}
#logo img {
  width: 80px;
}
#body {
  display: flex;
  justify-content: center;
}
table {
  margin: 40px 0;
  width: 80vw;
}
table, th, td {
  border: 1px #2c3e50 solid;
  height: 50px;
}
table > tr > td {
  padding: 8px 16px;
}
.key {
  text-align: right;
  width: 25%;
}
.value {
  text-align: left;
  width: 75%;
}
.divider {
  padding: 0 4px;
}
a, a:link {
  color: #2c3e50;
  text-decoration: none;
}
.underline {
  border-bottom: 2px solid cornflowerblue;
}
.locale {
  padding: 4px 8px;
}
.locale:hover {
  background-color: aliceblue;
}
.highlight {
  background-color: aliceblue;
}
.cursor-pointer {
  cursor: pointer;
}
</style>
