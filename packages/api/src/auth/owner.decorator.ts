import { SetMetadata } from '@nestjs/common';

export const Owner = (resourceId: string) =>
  SetMetadata('resourceId', resourceId);
