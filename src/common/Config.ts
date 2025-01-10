import { configSchema } from '/src/common/validations/config.schema';

export class Config {
  constructor(private readonly vars: ImportMetaEnv) {
    configSchema.validateSync(vars, { strict: true });
  }

  get baseUrl() {
    return this.vars.VITE_BASE_URL;
  }

  get title() {
    return this.vars.VITE_TITLE;
  }

  get description() {
    return this.vars.VITE_DESCRIPTION;
  }
}

export default new Config(import.meta.env);
