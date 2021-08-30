<template>
  <div
    v-show="isLoaded"
  >
    <div>
      <img
        alt="Vue"
        src="./assets/logo.png"
        id="logo"
      >
      <div>
        <template
          v-for="(locale, i) in state.locales"
          :key="locale.locale"
        >
          <span
            class="cursor-pointer"
            @click="changeLanguage(locale.locale)"
          >
            <span
              :class="[locale.locale === state.locale ? 'selected' : '']"
              v-text="locale.name"
            />
            <span
              v-if="i < state.locales.length - 1"
              v-text="' ‧ '"
            />
          </span>
        </template>
      </div>
      <table>
        <tr>
          <th>
            Key
          </th>
          <th>
            Value
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
      <div>
        <div
          id="ecosystem"
        >
          <a
            href="https://github.com/memochou1993/localiser"
            rel="noopener noreferrer"
            target="_blank"
            v-text="'Localiser'"
          />
          <span
            v-text="' ‧ '"
          />
          <a
            href="https://github.com/memochou1993/localiser-ui"
            rel="noopener noreferrer"
            target="_blank"
            v-text="'Localiser UI'"
          />
          <span
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
      messages: null,
    });
    (async () => {
      state.locales = await api.fetchLocales();
      state.messages = await loadMessage(DEFAULT_LOCALE);
      setLanguage(DEFAULT_LOCALE);
      state.locale = DEFAULT_LOCALE;
    })();
    const isLoaded = computed(() => !!state.locales && !!state.messages);
    const changeLanguage = async (locale) => {
      if (!i18n.global.availableLocales.includes(locale)) {
        await loadMessage(locale);
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
  display: flex;
  justify-content: center;
}
#logo {
  width: 80px;
  margin-bottom: 20px;
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
.selected {
  border-bottom: 1px #2c3e50 solid;
}
.cursor-pointer {
  cursor: pointer;
}
#ecosystem {
  margin: 12px 0;
}

a, a:link {
  color: #2c3e50;
  text-decoration: none;
}
</style>
