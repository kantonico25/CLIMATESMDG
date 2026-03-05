const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const OPTIMIZED_UPLOAD_SETTINGS = {
  sizeOptimization: true,
  autoOrientation: true,
  responsiveDimensions: true
};

module.exports = {
  register({ strapi }) {
    strapi.customFields.register({
      name: "theme-color",
      type: "string"
    });
  },

  async bootstrap({ strapi }) {
    const uploadService = strapi.plugin("upload")?.service("upload");
    const imageManipulationService = strapi.plugin("upload")?.service("image-manipulation");

    if (!uploadService) {
      strapi.log.warn("Upload plugin service not found; skipped upload optimization setup.");
      return;
    }

    const currentSettings = (await uploadService.getSettings()) ?? {};
    const nextSettings = {
      ...currentSettings,
      ...OPTIMIZED_UPLOAD_SETTINGS
    };

    const hasChanges = Object.keys(OPTIMIZED_UPLOAD_SETTINGS).some(
      (key) => currentSettings[key] !== nextSettings[key]
    );

    if (!hasChanges) {
      // keep going; we still want to ensure runtime WebP conversion is patched
    } else {
      await uploadService.setSettings(nextSettings);
      strapi.log.info("Enabled automatic Strapi image optimization settings.");
    }

    if (!imageManipulationService || imageManipulationService.__forceWebpPatched) {
      return;
    }

    const originalOptimize = imageManipulationService.optimize.bind(imageManipulationService);

    imageManipulationService.optimize = async (file) => {
      const optimizedFile = await originalOptimize(file);

      if (!optimizedFile?.filepath) {
        return optimizedFile;
      }

      try {
        const metadata = await sharp(optimizedFile.filepath).metadata();
        const format = metadata.format;

        if (!format || format === "webp") {
          return optimizedFile;
        }

        const settings = (await uploadService.getSettings()) ?? {};
        const outputPath = optimizedFile.tmpWorkingDirectory
          ? path.join(optimizedFile.tmpWorkingDirectory, `webp-${optimizedFile.hash}`)
          : `webp-${optimizedFile.hash}`;

        const webpInfo = await sharp(optimizedFile.filepath)
          .webp({ quality: settings.sizeOptimization ? 80 : 100 })
          .toFile(outputPath);

        const parsedName = path.parse(optimizedFile.name || "image");
        const sizeInBytes = webpInfo.size ?? optimizedFile.sizeInBytes;

        return {
          ...optimizedFile,
          name: `${parsedName.name}.webp`,
          ext: ".webp",
          mime: "image/webp",
          filepath: outputPath,
          getStream: () => fs.createReadStream(outputPath),
          width: webpInfo.width ?? optimizedFile.width,
          height: webpInfo.height ?? optimizedFile.height,
          sizeInBytes,
          size: sizeInBytes ? sizeInBytes / 1000 : optimizedFile.size
        };
      } catch (error) {
        strapi.log.warn(`Failed to convert upload to WebP: ${error.message}`);
        return optimizedFile;
      }
    };

    imageManipulationService.__forceWebpPatched = true;
    strapi.log.info("Enabled automatic WebP conversion for uploaded images.");
  }
};
