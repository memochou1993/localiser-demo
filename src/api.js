const fetchLocales = async () => {
  const url = `${process.env.VUE_APP_API_URL}/projects/${process.env.VUE_APP_API_PROJECT_ID}/locales`;
  const data = await fetch(`${url}`);
  return await data.json();
};

const fetchMessages = async ({
 locale
 } = {}) => {
  const url = `${process.env.VUE_APP_API_URL}/projects/${process.env.VUE_APP_API_PROJECT_ID}/messages`;
  const query = new URLSearchParams({ locale });
  const data = await fetch(`${url}?${query}`);
  return await data.json();
};

export default {
  fetchLocales,
  fetchMessages,
};
