import * as Joi from 'joi';

export const userPatchSchema = Joi.object({
  nickname: Joi.string(),
  description: Joi.string(),
  links: Joi.array().items(Joi.string()),
  lastConnection: Joi.number(),
  lastUpdate: Joi.number(),
}).min(1);

export interface UserPatchDto {
  nickname?: string;
  description?: string;
  links?: string[];
  lastConnection?: number;
  lastUpdate?: number;
}
