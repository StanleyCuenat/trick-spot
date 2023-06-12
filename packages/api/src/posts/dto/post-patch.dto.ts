import * as Joi from 'joi';

export interface PostPatchDto {
  totalComments?: 1 | -1;
  totalLikes?: 1 | -1;
}

export const postUpdateSchema = Joi.object({
  totalComments: Joi.number().valid(1, -1),
  totalLikes: Joi.number().valid(1, -1),
});
