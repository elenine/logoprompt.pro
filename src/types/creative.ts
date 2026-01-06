/**
 * Represents a single generated output from an AI model
 */
export interface CreativeOutput {
  /** Unique identifier for this output */
  id: string;
  /** The AI model used to generate this output */
  model: string;
  /** URL to the generated image */
  imageUrl: string;
  /** Timestamp when this output was generated */
  generatedAt: string;
}

/**
 * Represents a creative prompt with its various model outputs
 */
export interface CreativePrompt {
  /** Unique identifier for this creative prompt */
  id: string;
  /** The prompt used to generate the creative */
  prompt: string;
  /** Timestamp when this prompt was created */
  createdAt: string;
  /** Array of outputs from different AI models */
  outputs: CreativeOutput[];
}

/**
 * Structure of an individual creative file (creative-1.json, creative-2.json, etc.)
 */
export interface CreativeFile {
  /** Unique identifier for this creative file */
  id: string;
  /** Human-readable name for this collection */
  name: string;
  /** Timestamp when this collection was created */
  createdAt: string;
  /** Array of creative prompts in this file */
  creatives: CreativePrompt[];
}

/**
 * Entry in the creatives index file
 */
export interface CreativeFileEntry {
  /** Unique identifier for this creative file */
  id: string;
  /** Human-readable name for this collection */
  name: string;
  /** Path to the JSON file */
  path: string;
  /** Timestamp when this collection was created */
  createdAt: string;
  /** Number of creatives in this file */
  creativeCount: number;
}

/**
 * Structure of the creatives index file (index.json)
 */
export interface CreativesIndex {
  /** Array of creative file entries */
  files: CreativeFileEntry[];
  /** Total number of creatives across all files */
  totalCreatives: number;
  /** Timestamp when the index was last updated */
  lastUpdated: string;
}

/**
 * Flattened structure representing a single generation card
 * Combines prompt info with a single output for display
 */
export interface CreativeGeneration {
  /** Unique identifier for this generation (output id) */
  id: string;
  /** The prompt used to generate the creative */
  prompt: string;
  /** The AI model used to generate this output */
  model: string;
  /** URL to the generated image */
  imageUrl: string;
  /** Timestamp when this output was generated */
  generatedAt: string;
}
