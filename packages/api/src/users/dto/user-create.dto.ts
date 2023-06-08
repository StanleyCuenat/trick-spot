import * as Joi from 'joi';

export const userCreateSchema = Joi.object({
  nickname: Joi.string().required(),
  description: Joi.string().required(),
  links: Joi.array().items(Joi.string()),
});

export interface UserCreateDto {
  nickname: string;
  description: string;
  links: string[];
}
