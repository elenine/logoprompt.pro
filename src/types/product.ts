/**
 * Represents a single generated output from an AI model for a product
 */
export interface ProductOutput {
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
 * Represents a product prompt with its various model outputs
 */
export interface ProductPrompt {
  /** Unique identifier for this product prompt */
  id: string;
  /** The prompt used to generate the product image */
  prompt: string;
  /** Timestamp when this prompt was created */
  createdAt: string;
  /** Array of outputs from different AI models */
  outputs: ProductOutput[];
}

/**
 * Structure of an individual product file (product-1.json, product-2.json, etc.)
 */
export interface ProductFile {
  /** Unique identifier for this product file */
  id: string;
  /** Human-readable name for this collection */
  name: string;
  /** Timestamp when this collection was created */
  createdAt: string;
  /** Array of product prompts in this file */
  products: ProductPrompt[];
}

/**
 * Entry in the products index file
 */
export interface ProductFileEntry {
  /** Unique identifier for this product file */
  id: string;
  /** Human-readable name for this collection */
  name: string;
  /** Path to the JSON file */
  path: string;
  /** Timestamp when this collection was created */
  createdAt: string;
  /** Number of products in this file */
  productCount: number;
}

/**
 * Structure of the products index file (index.json)
 */
export interface ProductsIndex {
  /** Array of product file entries */
  files: ProductFileEntry[];
  /** Total number of products across all files */
  totalProducts: number;
  /** Timestamp when the index was last updated */
  lastUpdated: string;
}

/**
 * Flattened structure representing a single product generation card
 * Combines prompt info with a single output for display
 */
export interface ProductGeneration {
  /** Unique identifier for this generation (output id) */
  id: string;
  /** The prompt used to generate the product image */
  prompt: string;
  /** The AI model used to generate this output */
  model: string;
  /** URL to the generated image */
  imageUrl: string;
  /** Timestamp when this output was generated */
  generatedAt: string;
}
