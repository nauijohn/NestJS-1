import { classes } from '@automapper/classes';
import { CreateMapperOptions } from '@automapper/core';

export const automapperConfig: CreateMapperOptions = {
  strategyInitializer: classes(),
};
