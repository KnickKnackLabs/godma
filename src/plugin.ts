figma.showUI(__html__, { width: 480, height: 600 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === "generate") {
    const design = msg.design as Design;

    // Pre-load fonts before building anything
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    await figma.loadFontAsync({ family: "Inter", style: "Bold" });

    const frames = buildDesign(design);
    figma.viewport.scrollAndZoomIntoView(frames);
    figma.ui.postMessage({ type: "done" });
  }
};

// --- Types matching Claude's output schema ---

interface Design {
  title: string;
  slides: Slide[];
  theme: Theme;
}

interface Slide {
  layout: "title" | "content" | "split" | "image-left" | "bullets" | "quote" | "blank";
  title?: string;
  subtitle?: string;
  body?: string;
  bullets?: string[];
  quote?: string;
  attribution?: string;
}

interface Theme {
  bgColor: RGB;
  textColor: RGB;
  accentColor: RGB;
  fontFamily: string;
}

interface RGB {
  r: number;
  g: number;
  b: number;
}

// --- Builder ---

const SLIDE_W = 1920;
const SLIDE_H = 1080;
const PADDING = 120;

function buildDesign(design: Design): FrameNode[] {
  const { slides, theme } = design;
  const frames: FrameNode[] = [];

  for (let i = 0; i < slides.length; i++) {
    const slide = slides[i];
    const frame = figma.createFrame();
    frame.name = `Slide ${i + 1}${slide.title ? " — " + slide.title : ""}`;
    frame.resize(SLIDE_W, SLIDE_H);
    frame.x = i * (SLIDE_W + 100);
    frame.y = 0;
    frame.fills = [{ type: "SOLID", color: theme.bgColor }];

    buildSlide(frame, slide, theme);
    frames.push(frame);
  }

  return frames;
}

function buildSlide(frame: FrameNode, slide: Slide, theme: Theme) {
  switch (slide.layout) {
    case "title":
      buildTitleSlide(frame, slide, theme);
      break;
    case "content":
    case "bullets":
      buildContentSlide(frame, slide, theme);
      break;
    case "split":
      buildSplitSlide(frame, slide, theme);
      break;
    case "quote":
      buildQuoteSlide(frame, slide, theme);
      break;
    default:
      buildContentSlide(frame, slide, theme);
  }
}

function buildTitleSlide(frame: FrameNode, slide: Slide, theme: Theme) {
  if (slide.title) {
    const title = createText(slide.title, {
      x: PADDING,
      y: SLIDE_H / 2 - 100,
      width: SLIDE_W - PADDING * 2,
      fontSize: 80,
      color: theme.textColor,
      fontWeight: "Bold",
    });
    frame.appendChild(title);
  }

  if (slide.subtitle) {
    const subtitle = createText(slide.subtitle, {
      x: PADDING,
      y: SLIDE_H / 2 + 20,
      width: SLIDE_W - PADDING * 2,
      fontSize: 36,
      color: theme.accentColor,
      fontWeight: "Regular",
    });
    frame.appendChild(subtitle);
  }
}

function buildContentSlide(frame: FrameNode, slide: Slide, theme: Theme) {
  let yOffset = PADDING;

  if (slide.title) {
    const title = createText(slide.title, {
      x: PADDING,
      y: yOffset,
      width: SLIDE_W - PADDING * 2,
      fontSize: 48,
      color: theme.textColor,
      fontWeight: "Bold",
    });
    frame.appendChild(title);
    yOffset += 80;
  }

  // Accent bar under title
  const bar = figma.createRectangle();
  bar.x = PADDING;
  bar.y = yOffset;
  bar.resize(80, 4);
  bar.fills = [{ type: "SOLID", color: theme.accentColor }];
  frame.appendChild(bar);
  yOffset += 40;

  if (slide.body) {
    const body = createText(slide.body, {
      x: PADDING,
      y: yOffset,
      width: SLIDE_W - PADDING * 2,
      fontSize: 28,
      color: theme.textColor,
      fontWeight: "Regular",
      lineHeight: 44,
    });
    frame.appendChild(body);
  }

  if (slide.bullets && slide.bullets.length > 0) {
    for (const bullet of slide.bullets) {
      const text = createText(`•  ${bullet}`, {
        x: PADDING + 20,
        y: yOffset,
        width: SLIDE_W - PADDING * 2 - 40,
        fontSize: 28,
        color: theme.textColor,
        fontWeight: "Regular",
        lineHeight: 44,
      });
      frame.appendChild(text);
      yOffset += 60;
    }
  }
}

function buildSplitSlide(frame: FrameNode, slide: Slide, theme: Theme) {
  const halfW = SLIDE_W / 2;

  // Left side — accent background
  const leftBg = figma.createRectangle();
  leftBg.x = 0;
  leftBg.y = 0;
  leftBg.resize(halfW, SLIDE_H);
  leftBg.fills = [{ type: "SOLID", color: theme.accentColor }];
  frame.appendChild(leftBg);

  if (slide.title) {
    const title = createText(slide.title, {
      x: PADDING,
      y: SLIDE_H / 2 - 60,
      width: halfW - PADDING * 1.5,
      fontSize: 48,
      color: theme.bgColor,
      fontWeight: "Bold",
    });
    frame.appendChild(title);
  }

  if (slide.body) {
    const body = createText(slide.body, {
      x: halfW + PADDING / 2,
      y: PADDING,
      width: halfW - PADDING * 1.5,
      fontSize: 24,
      color: theme.textColor,
      fontWeight: "Regular",
      lineHeight: 40,
    });
    frame.appendChild(body);
  }

  if (slide.bullets && slide.bullets.length > 0) {
    let yOffset = PADDING;
    for (const bullet of slide.bullets) {
      const text = createText(`•  ${bullet}`, {
        x: halfW + PADDING / 2,
        y: yOffset,
        width: halfW - PADDING * 1.5,
        fontSize: 24,
        color: theme.textColor,
        fontWeight: "Regular",
        lineHeight: 40,
      });
      frame.appendChild(text);
      yOffset += 56;
    }
  }
}

function buildQuoteSlide(frame: FrameNode, slide: Slide, theme: Theme) {
  const quoteText = slide.quote || slide.body || "";

  // Large quote mark
  const quoteMark = createText("\u201C", {
    x: PADDING,
    y: SLIDE_H / 2 - 200,
    width: 200,
    fontSize: 200,
    color: theme.accentColor,
    fontWeight: "Bold",
  });
  frame.appendChild(quoteMark);

  const quote = createText(quoteText, {
    x: PADDING + 40,
    y: SLIDE_H / 2 - 40,
    width: SLIDE_W - PADDING * 2 - 40,
    fontSize: 36,
    color: theme.textColor,
    fontWeight: "Regular",
    lineHeight: 56,
  });
  frame.appendChild(quote);

  if (slide.attribution) {
    const attr = createText(`— ${slide.attribution}`, {
      x: PADDING + 40,
      y: SLIDE_H / 2 + 100,
      width: SLIDE_W - PADDING * 2,
      fontSize: 24,
      color: theme.accentColor,
      fontWeight: "Regular",
    });
    frame.appendChild(attr);
  }
}

// --- Text helper ---

interface TextOptions {
  x: number;
  y: number;
  width: number;
  fontSize: number;
  color: RGB;
  fontWeight: "Regular" | "Bold";
  lineHeight?: number;
}

function createText(content: string, opts: TextOptions): TextNode {
  const node = figma.createText();
  node.x = opts.x;
  node.y = opts.y;
  node.resize(opts.width, 10);

  // Fonts are pre-loaded in the message handler
  const fontName: FontName = { family: "Inter", style: opts.fontWeight };
  node.fontName = fontName;
  node.characters = content;
  node.fontSize = opts.fontSize;
  node.fills = [{ type: "SOLID", color: opts.color }];
  node.textAutoResize = "HEIGHT";
  if (opts.lineHeight) {
    node.lineHeight = { value: opts.lineHeight, unit: "PIXELS" };
  }

  return node;
}
