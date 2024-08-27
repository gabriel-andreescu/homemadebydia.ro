// utils/convert-images-to-webp.js
import fs from "fs";
import path from "path";
import sharp from "sharp";

// Define the path to the gallery folder
const galleryPath = path.resolve("public/gallery");

// Function to recursively convert images to webp
function convertImagesToWebP(directory) {
  fs.readdir(directory, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(`Error reading directory ${directory}: ${err.message}`);
      return;
    }

    files.forEach((file) => {
      const filePath = path.join(directory, file.name);

      if (file.isDirectory()) {
        // Recursively process subdirectories
        convertImagesToWebP(filePath);
      } else if (file.isFile()) {
        // Check if the file is an image we want to convert
        if (/\.(jpg|jpeg|png)$/i.test(file.name)) {
          const outputFilePath = filePath.replace(/\.(jpg|jpeg|png)$/i, ".webp");

          // Check if the webp file already exists and is up to date
          fs.stat(outputFilePath, (err, outputStats) => {
            if (err && err.code !== "ENOENT") {
              console.error(`Error accessing ${outputFilePath}: ${err.message}`);
              return;
            }

            if (err && err.code === "ENOENT") {
              // Output file does not exist, proceed with conversion
              convertImage(filePath, outputFilePath);
            } else {
              // Output file exists, check modification times
              fs.stat(filePath, (err, inputStats) => {
                if (err) {
                  console.error(`Error accessing ${filePath}: ${err.message}`);
                  return;
                }

                if (inputStats.mtime > outputStats.mtime) {
                  // Source image has been modified since last conversion, convert again
                  convertImage(filePath, outputFilePath);
                } else {
                  console.log(`Skipping ${filePath} (already converted and up to date)`);
                }
              });
            }
          });
        }
      }
    });
  });
}

// Function to convert image to webp
function convertImage(inputPath, outputPath) {
  sharp(inputPath)
    .toFormat("webp")
    .toFile(outputPath)
    .then(() => {
      console.log(`Converted ${inputPath} to ${outputPath}`);
    })
    .catch((err) => {
      console.error(`Error converting ${inputPath}: ${err.message}`);
    });
}

// Start the conversion process for the gallery path
convertImagesToWebP(galleryPath);
