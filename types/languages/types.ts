import { PropertyType } from '../word';

export interface PropertyConfig {
  name: string;
  type: PropertyType;
  isRequired: boolean;
  options?: string[];
  persons?: Record<string, string>;
  label?: string;
}

export interface WordTypeConfig {
  type: string;
  icon: string;
  text: string;
  description: string;
  properties: PropertyConfig[];
}

export interface LanguageConfig {
  iso: string;
  name: string;
  wordTypes: WordTypeConfig[];
} 