/**
 * Represents a single generated output from an AI model
 */
export interface FlyerOutput {
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
 * Represents a flyer prompt with its various model outputs
 */
export interface FlyerPrompt {
  /** Unique identifier for this flyer prompt */
  id: string;
  /** The prompt used to generate the flyer */
  prompt: string;
  /** Timestamp when this prompt was created */
  createdAt: string;
  /** Array of outputs from different AI models */
  outputs: FlyerOutput[];
}

/**
 * Structure of an individual flyer file (flyer-1.json, flyer-2.json, etc.)
 */
export interface FlyerFile {
  /** Unique identifier for this flyer file */
  id: string;
  /** Human-readable name for this collection */
  name: string;
  /** Timestamp when this collection was created */
  createdAt: string;
  /** Array of flyer prompts in this file */
  flyers: FlyerPrompt[];
}

/**
 * Entry in the flyers index file
 */
export interface FlyerFileEntry {
  /** Unique identifier for this flyer file */
  id: string;
  /** Human-readable name for this collection */
  name: string;
  /** Path to the JSON file */
  path: string;
  /** Timestamp when this collection was created */
  createdAt: string;
  /** Number of flyers in this file */
  flyerCount: number;
}

/**
 * Structure of the flyers index file (index.json)
 */
export interface FlyersIndex {
  /** Array of flyer file entries */
  files: FlyerFileEntry[];
  /** Total number of flyers across all files */
  totalFlyers: number;
  /** Timestamp when the index was last updated */
  lastUpdated: string;
}

/**
 * Flattened structure representing a single generation card
 * Combines prompt info with a single output for display
 */
export interface FlyerGeneration {
  /** Unique identifier for this generation (output id) */
  id: string;
  /** The prompt used to generate the flyer */
  prompt: string;
  /** The AI model used to generate this output */
  model: string;
  /** URL to the generated image */
  imageUrl: string;
  /** Timestamp when this output was generated */
  generatedAt: string;
}
