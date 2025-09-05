import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ locale }) => {
  async function load(l: string) {
    const [common, nav, home, properties, footer] = await Promise.all([
      import(`@/messages/${l}/common.json`),
      import(`@/messages/${l}/nav.json`),
      import(`@/messages/${l}/home.json`),
      import(`@/messages/${l}/properties.json`),
      import(`@/messages/${l}/footer.json`),
    ]);
    return {
      ...common.default,
      nav: nav.default,
      home: home.default,
      properties: properties.default,
      footer: footer.default,
    };
  }
  try {
    return { messages: await load(locale || 'pt'), locale: locale || 'pt' };
  } catch {
    return { messages: await load('en'), locale: 'en' };
  }
});
