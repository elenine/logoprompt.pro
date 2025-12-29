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
  /** Brief title/name for this logo concept */
  title: string;
  /** Category or style of the logo */
  category: string;
  /** Tags for filtering/searching */
  tags: string[];
  /** Timestamp when this prompt was created */
  createdAt: string;
  /** Array of outputs from different AI models */
  outputs: LogoOutput[];
}

/**
 * Root structure of the logos JSON file
 */
export interface LogosData {
  logos: LogoPrompt[];
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
  /** Brief title/name for this logo concept */
  title: string;
  /** Category or style of the logo */
  category: string;
  /** Tags for filtering/searching */
  tags: string[];
  /** The AI model used to generate this output */
  model: string;
  /** URL to the generated image */
  imageUrl: string;
  /** Timestamp when this output was generated */
  generatedAt: string;
}
