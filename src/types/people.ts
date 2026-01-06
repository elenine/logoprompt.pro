/**
 * Represents a single generated output from an AI model
 */
export interface PeopleOutput {
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
 * Represents a people prompt with its various model outputs
 */
export interface PeoplePrompt {
  /** Unique identifier for this people prompt */
  id: string;
  /** The prompt used to generate the people image */
  prompt: string;
  /** Timestamp when this prompt was created */
  createdAt: string;
  /** Array of outputs from different AI models */
  outputs: PeopleOutput[];
}

/**
 * Structure of an individual people file (people-1.json, people-2.json, etc.)
 */
export interface PeopleFile {
  /** Unique identifier for this people file */
  id: string;
  /** Human-readable name for this collection */
  name: string;
  /** Timestamp when this collection was created */
  createdAt: string;
  /** Array of people prompts in this file */
  peoples: PeoplePrompt[];
}

/**
 * Entry in the peoples index file
 */
export interface PeopleFileEntry {
  /** Unique identifier for this people file */
  id: string;
  /** Human-readable name for this collection */
  name: string;
  /** Path to the JSON file */
  path: string;
  /** Timestamp when this collection was created */
  createdAt: string;
  /** Number of peoples in this file */
  peopleCount: number;
}

/**
 * Structure of the peoples index file (index.json)
 */
export interface PeoplesIndex {
  /** Array of people file entries */
  files: PeopleFileEntry[];
  /** Total number of peoples across all files */
  totalPeoples: number;
  /** Timestamp when the index was last updated */
  lastUpdated: string;
}

/**
 * Flattened structure representing a single generation card
 * Combines prompt info with a single output for display
 */
export interface PeopleGeneration {
  /** Unique identifier for this generation (output id) */
  id: string;
  /** The prompt used to generate the people image */
  prompt: string;
  /** The AI model used to generate this output */
  model: string;
  /** URL to the generated image */
  imageUrl: string;
  /** Timestamp when this output was generated */
  generatedAt: string;
}
