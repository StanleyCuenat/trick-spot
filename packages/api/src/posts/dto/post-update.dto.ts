import * as Joi from 'joi';

export interface PostUpdateDto {
  description: string;
  geoPoint: {
    longitude: number;
    latitude: number;
  };
  tags: string[];
}

export const postUpdateSchema = Joi.object({
  description: Joi.string().required(),
  geoPoint: Joi.object({
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
  }).required(),
  tags: Joi.array().items(Joi.string()).required(),
});
