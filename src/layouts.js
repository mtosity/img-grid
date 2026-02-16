// Layout definitions for image combinations
// Each layout defines the grid areas for a given number of images and aspect ratio

export const ASPECT_RATIOS = [
  { label: "1:1", value: "1/1", width: 1, height: 1 },
  { label: "4:3", value: "4/3", width: 4, height: 3 },
  { label: "16:9", value: "16/9", width: 16, height: 9 },
  { label: "9:16", value: "9/16", width: 9, height: 16 },
  { label: "3:4", value: "3/4", width: 3, height: 4 },
];

// Layouts define how blocks are positioned within a 1x1 normalized space
// Each block: { x, y, w, h } as fractions of the total canvas
export function getLayouts(count) {
  switch (count) {
    case 2:
      return [
        {
          name: "Side by side",
          blocks: [
            { x: 0, y: 0, w: 0.5, h: 1 },
            { x: 0.5, y: 0, w: 0.5, h: 1 },
          ],
        },
        {
          name: "Top and bottom",
          blocks: [
            { x: 0, y: 0, w: 1, h: 0.5 },
            { x: 0, y: 0.5, w: 1, h: 0.5 },
          ],
        },
      ];
    case 3:
      return [
        {
          name: "1 left + 2 right",
          blocks: [
            { x: 0, y: 0, w: 0.5, h: 1 },
            { x: 0.5, y: 0, w: 0.5, h: 0.5 },
            { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
          ],
        },
        {
          name: "1 top + 2 bottom",
          blocks: [
            { x: 0, y: 0, w: 1, h: 0.5 },
            { x: 0, y: 0.5, w: 0.5, h: 0.5 },
            { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
          ],
        },
        {
          name: "3 columns",
          blocks: [
            { x: 0, y: 0, w: 1 / 3, h: 1 },
            { x: 1 / 3, y: 0, w: 1 / 3, h: 1 },
            { x: 2 / 3, y: 0, w: 1 / 3, h: 1 },
          ],
        },
      ];
    case 4:
      return [
        {
          name: "2x2 Grid",
          blocks: [
            { x: 0, y: 0, w: 0.5, h: 0.5 },
            { x: 0.5, y: 0, w: 0.5, h: 0.5 },
            { x: 0, y: 0.5, w: 0.5, h: 0.5 },
            { x: 0.5, y: 0.5, w: 0.5, h: 0.5 },
          ],
        },
        {
          name: "1 left + 3 right",
          blocks: [
            { x: 0, y: 0, w: 0.5, h: 1 },
            { x: 0.5, y: 0, w: 0.5, h: 1 / 3 },
            { x: 0.5, y: 1 / 3, w: 0.5, h: 1 / 3 },
            { x: 0.5, y: 2 / 3, w: 0.5, h: 1 / 3 },
          ],
        },
        {
          name: "4 columns",
          blocks: [
            { x: 0, y: 0, w: 0.25, h: 1 },
            { x: 0.25, y: 0, w: 0.25, h: 1 },
            { x: 0.5, y: 0, w: 0.25, h: 1 },
            { x: 0.75, y: 0, w: 0.25, h: 1 },
          ],
        },
      ];
    case 5:
      return [
        {
          name: "2 top + 3 bottom",
          blocks: [
            { x: 0, y: 0, w: 0.5, h: 0.5 },
            { x: 0.5, y: 0, w: 0.5, h: 0.5 },
            { x: 0, y: 0.5, w: 1 / 3, h: 0.5 },
            { x: 1 / 3, y: 0.5, w: 1 / 3, h: 0.5 },
            { x: 2 / 3, y: 0.5, w: 1 / 3, h: 0.5 },
          ],
        },
        {
          name: "1 top + 4 bottom",
          blocks: [
            { x: 0, y: 0, w: 1, h: 0.5 },
            { x: 0, y: 0.5, w: 0.25, h: 0.5 },
            { x: 0.25, y: 0.5, w: 0.25, h: 0.5 },
            { x: 0.5, y: 0.5, w: 0.25, h: 0.5 },
            { x: 0.75, y: 0.5, w: 0.25, h: 0.5 },
          ],
        },
      ];
    case 6:
      return [
        {
          name: "3x2 Grid",
          blocks: [
            { x: 0, y: 0, w: 1 / 3, h: 0.5 },
            { x: 1 / 3, y: 0, w: 1 / 3, h: 0.5 },
            { x: 2 / 3, y: 0, w: 1 / 3, h: 0.5 },
            { x: 0, y: 0.5, w: 1 / 3, h: 0.5 },
            { x: 1 / 3, y: 0.5, w: 1 / 3, h: 0.5 },
            { x: 2 / 3, y: 0.5, w: 1 / 3, h: 0.5 },
          ],
        },
        {
          name: "2x3 Grid",
          blocks: [
            { x: 0, y: 0, w: 0.5, h: 1 / 3 },
            { x: 0.5, y: 0, w: 0.5, h: 1 / 3 },
            { x: 0, y: 1 / 3, w: 0.5, h: 1 / 3 },
            { x: 0.5, y: 1 / 3, w: 0.5, h: 1 / 3 },
            { x: 0, y: 2 / 3, w: 0.5, h: 1 / 3 },
            { x: 0.5, y: 2 / 3, w: 0.5, h: 1 / 3 },
          ],
        },
      ];
    default:
      return [];
  }
}

export const IMAGE_COUNTS = [2, 3, 4, 5, 6];

export const EXPORT_SIZES = [
  { label: "1080px", value: 1080 },
  { label: "1440px", value: 1440 },
  { label: "2160px", value: 2160 },
  { label: "4320px", value: 4320 },
];

export const GAP_OPTIONS = [
  { label: "None", value: 0 },
  { label: "Small", value: 8 },
  { label: "Medium", value: 16 },
  { label: "Large", value: 24 },
];
