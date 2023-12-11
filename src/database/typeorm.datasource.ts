import { DataSource, DataSourceOptions } from 'typeorm';

import { typeormOpts } from '../config/typeorm.config';

export const connectionSource = new DataSource(
  typeormOpts as DataSourceOptions,
);
