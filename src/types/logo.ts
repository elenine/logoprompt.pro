/**
 * Represents a single generated output from an AI model
 */
export interface LogoOutput {
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
 * Represents a logo prompt with its various model outputs
 */
export interface LogoPrompt {
  /** Unique identifier for this logo prompt */
  id: string;
  /** The prompt used to generate the logo */
  prompt: string;
  /** Timestamp when this prompt was created */
  createdAt: string;
  /** Array of outputs from different AI models */
  outputs: LogoOutput[];
}

/**
 * Structure of an individual logo file (logo-1.json, logo-2.json, etc.)
 */
export interface LogoFile {
  /** Unique identifier for this logo file */
  id: string;
  /** Human-readable name for this collection */
  name: string;
  /** Timestamp when this collection was created */
  createdAt: string;
  /** Array of logo prompts in this file */
  logos: LogoPrompt[];
}

/**
 * Entry in the logos index file
 */
export interface LogoFileEntry {
  /** Unique identifier for this logo file */
  id: string;
  /** Human-readable name for this collection */
  name: string;
  /** Path to the JSON file */
  path: string;
  /** Timestamp when this collection was created */
  createdAt: string;
  /** Number of logos in this file */
  logoCount: number;
}

/**
 * Structure of the logos index file (index.json)
 */
export interface LogosIndex {
  /** Array of logo file entries */
  files: LogoFileEntry[];
  /** Total number of logos across all files */
  totalLogos: number;
  /** Timestamp when the index was last updated */
  lastUpdated: string;
}

/**
 * Flattened structure representing a single generation card
 * Combines prompt info with a single output for display
 */
export interface LogoGeneration {
  /** Unique identifier for this generation (output id) */
  id: string;
  /** The prompt used to generate the logo */
  prompt: string;
  /** The AI model used to generate this output */
  model: string;
  /** URL to the generated image */
  imageUrl: string;
  /** Timestamp when this output was generated */
  generatedAt: string;
}
