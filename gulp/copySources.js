import cpy from "cpy";

import { config } from "./config.js";
import { fileExist } from "./utils/fileExist.js";

export function copySources(cb) {
  for (let source in config.sources) {
    let dest = config.sources[source][0];
    let isFlat = config.sources[source][1];
    cpy(source, dest, {
      filter: (file) => file.nameWithoutExtension !== ".gitkeep",
      flat: isFlat,
    });
  }
  cb();
}

export function copyBlockImg(cb) {
  config.blocksFromHtml.forEach(function (block) {
    let images = `${config.from.blocks}/${block}/img`;
    if (fileExist(images)) {
      if (fileExist(images)) {
        (async () => {
          if (config.isSeparatedBlockImg === "collected") {
            await cpy(`${images}/*.{${config.fileFormats}}`, `${config.to.img}/blocks/${block}`);
          } else if (config.isSeparatedBlockImg) {
            await cpy(`${images}/*.{${config.fileFormats}}`, `${config.to.img}/${block}`);
          } else {
            await cpy(`${images}/*.{${config.fileFormats}}`, `${config.to.img}`);
          }
          cb();
        })();
      }
    }

    let assets = `${config.from.blocks}/${block}/assets`;
    if (fileExist(assets)) {
      if (fileExist(assets)) {
        (async () => {
          if (config.isSeparatedBlockImg === "collected") {
            await cpy(`${assets}/*.{${config.fileFormats}}`, `${config.to.assets}/blocks/${block}`);
          } else if (config.isSeparatedBlockImg) {
            await cpy(`${assets}/*.{${config.fileFormats}}`, `${config.to.assets}/${block}`);
          } else {
            await cpy(`${assets}/*.{${config.fileFormats}}`, `${config.to.assets}`);
          }
          cb();
        })();
      }
    }
  });
  cb();
}
