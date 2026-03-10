import fs from 'fs';
import { merge } from 'lodash';
import path from 'path';
import YAML from 'yamljs';

interface SwaggerSpec {
  openapi?: string;
  info?: {
    title: string;
    description: string;
    version: string;
  };
  servers?: Array<{ url: string; description: string }>;
  paths?: Record<string, unknown>;
  components?: Record<string, unknown>;
}

const baseSwaggerPath = path.join(__dirname, 'swagger.yml');
const docsPath = path.join(__dirname, 'docs');

export const loadAndMergeSwaggerSpecs = (): SwaggerSpec => {
  const baseSpec = YAML.load(baseSwaggerPath);

  let mergedSpec: SwaggerSpec = { ...baseSpec };

  const readYamlFiles = (dir: string): void => {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const fullPath = path.join(dir, file);

      if (fs.statSync(fullPath).isDirectory()) {
        readYamlFiles(fullPath);
      } else if (file.endsWith('.yml') || file.endsWith('.yaml')) {
        const yamlContent = YAML.load(fullPath);
        mergedSpec = merge(mergedSpec, yamlContent);
      }
    });
  };

  readYamlFiles(docsPath);

  return mergedSpec;
};

export const swaggerOptions = {
  swaggerOptions: {
    validatorUrl: null,
    persistAuthorization: true,
    withCredentials: true,
    docExpansion: 'none',
  },
};
