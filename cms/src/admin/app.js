import { Microphone } from "@strapi/icons";

export default {
  register(app) {
    app.customFields.register({
      name: "theme-color",
      type: "string",
      intlLabel: {
        id: "climates.theme-color.label",
        defaultMessage: "Theme color"
      },
      intlDescription: {
        id: "climates.theme-color.description",
        defaultMessage: "Pick a custom color or use one of the theme colors."
      },
      icon: Microphone,
      components: {
        Input: async () => import("./components/ThemeColorInput")
      }
    });
  }
};
