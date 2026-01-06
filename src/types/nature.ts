/**
 * Represents a single generated output from an AI model
 */
export interface NatureOutput {
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
 * Represents a nature prompt with its various model outputs
 */
export interface NaturePrompt {
  /** Unique identifier for this nature prompt */
  id: string;
  /** The prompt used to generate the nature image */
  prompt: string;
  /** Timestamp when this prompt was created */
  createdAt: string;
  /** Array of outputs from different AI models */
  outputs: NatureOutput[];
}

/**
 * Structure of an individual nature file (nature-1.json, nature-2.json, etc.)
 */
export interface NatureFile {
  /** Unique identifier for this nature file */
  id: string;
  /** Human-readable name for this collection */
  name: string;
  /** Timestamp when this collection was created */
  createdAt: string;
  /** Array of nature prompts in this file */
  natures: NaturePrompt[];
}

/**
 * Entry in the natures index file
 */
export interface NatureFileEntry {
  /** Unique identifier for this nature file */
  id: string;
  /** Human-readable name for this collection */
  name: string;
  /** Path to the JSON file */
  path: string;
  /** Timestamp when this collection was created */
  createdAt: string;
  /** Number of natures in this file */
  natureCount: number;
}

/**
 * Structure of the natures index file (index.json)
 */
export interface NaturesIndex {
  /** Array of nature file entries */
  files: NatureFileEntry[];
  /** Total number of natures across all files */
  totalNatures: number;
  /** Timestamp when the index was last updated */
  lastUpdated: string;
}

/**
 * Flattened structure representing a single generation card
 * Combines prompt info with a single output for display
 */
export interface NatureGeneration {
  /** Unique identifier for this generation (output id) */
  id: string;
  /** The prompt used to generate the nature image */
  prompt: string;
  /** The AI model used to generate this output */
  model: string;
  /** URL to the generated image */
  imageUrl: string;
  /** Timestamp when this output was generated */
  generatedAt: string;
}
