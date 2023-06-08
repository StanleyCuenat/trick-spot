import * as Joi from 'joi';

export const userUpdateSchema = Joi.object({
  nickname: Joi.string().required(),
  description: Joi.string().required(),
  links: Joi.array().items(Joi.string()),
});

export interface UserUpdateDto {
  nickname: string;
  description: string;
  links: string[];
}
