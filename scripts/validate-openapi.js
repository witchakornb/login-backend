import { fileURLToPath } from 'url';
import path from 'path';
import SwaggerParser from '@apidevtools/swagger-parser';

async function main() {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const specPath = path.resolve(__dirname, '../docs/openapi.yaml');
  try {
    await SwaggerParser.validate(specPath);
    console.log('OpenAPI spec valid');
  } catch (e) {
    console.error('OpenAPI spec invalid');
    console.error(e.message);
    process.exit(1);
  }
}

main();
