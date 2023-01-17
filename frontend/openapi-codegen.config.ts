import {
  generateSchemaTypes,
  generateReactQueryComponents,
} from "@openapi-codegen/typescript";
import { defineConfig } from "@openapi-codegen/cli";
export default defineConfig({
  backend: {
    from: {
      source: "url",
      url: "http://localhost:5072/swagger/v1/swagger.json",
    },
    outputDir: "src/api",
    to: async (context) => {
      const filenamePrefix = "backend";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
