import fs from "node:fs";
import path from "node:path";
import { Buffer } from "node:buffer";

const ALLOWED_HOSTS = new Set([
  "github.com",
  "user-images.githubusercontent.com",
  "objects.githubusercontent.com",
]);

const MAX_IMAGE_SIZE = 10 * 1024 * 1024; 
const REQUEST_TIMEOUT = 10_000;

function extractImageUrl(value) {
  if (!value || typeof value !== "string") return null;

  let match = value.match(/src="([^"]+)"/i);
  if (match) return match[1];

  match = value.match(/!\[.*?\]\((.*?)\)/);
  if (match) return match[1];

  match = value.match(
    /https:\/\/github\.com\/user-attachments\/assets\/[^\s")]+/,
  );
  if (match) return match[0];

  return null;
}

function validateImageUrl(url) {
  const parsed = new URL(url);

  if (parsed.protocol !== "https:") {
    throw new Error("Only HTTPS image URLs are allowed.");
  }

  if (!ALLOWED_HOSTS.has(parsed.hostname)) {
    throw new Error(`Unsupported image host: ${parsed.hostname}`);
  }

  return parsed.toString();
}

function extensionFromContentType(contentType) {
  if (!contentType) return null;

  const type = contentType.split(";")[0].trim().toLowerCase();

  switch (type) {
    case "image/png":
      return "png";
    case "image/jpeg":
      return "jpg";
    case "image/webp":
      return "webp";
    case "image/svg+xml":
      return "svg";
    case "image/gif":
      return "gif";
    case "image/avif":
      return "avif";
    default:
      return null;
  }
}

async function downloadImage(markdown, outputDir, outputName) {
  const extractedUrl = extractImageUrl(markdown);

  if (!extractedUrl) {
    console.log(`No ${outputName} image found.`);
    return null;
  }

  const url = validateImageUrl(extractedUrl);

  console.log(`Downloading ${outputName} image...`);

  const response = await fetch(url, {
    signal: AbortSignal.timeout(REQUEST_TIMEOUT),
  });

  if (!response.ok) {
    throw new Error(
      `Failed to download ${outputName}: ${response.status} ${response.statusText}`,
    );
  }

  const contentLength = Number(response.headers.get("content-length"));

  if (contentLength && contentLength > MAX_IMAGE_SIZE) {
    throw new Error(
      `${outputName} image exceeds ${MAX_IMAGE_SIZE / (1024 * 1024)} MB limit.`,
    );
  }

  const ext = extensionFromContentType(response.headers.get("content-type"));

  if (!ext) {
    throw new Error(
      `Unsupported image type: ${response.headers.get("content-type")}`,
    );
  }

  const buffer = Buffer.from(await response.arrayBuffer());

  if (buffer.length > MAX_IMAGE_SIZE) {
    throw new Error(
      `${outputName} image exceeds ${MAX_IMAGE_SIZE / (1024 * 1024)} MB limit.`,
    );
  }

  const filename = `${outputName}.${ext}`;

  fs.writeFileSync(path.join(outputDir, filename), buffer);

  console.log(`Saved ${filename}`);

  return filename;
}

export async function downloadImages(raw, storyDir) {
  return {
    story: await downloadImage(raw.story_image, storyDir, "story"),
    quote: await downloadImage(raw.quote_image, storyDir, "quote"),
  };
}
