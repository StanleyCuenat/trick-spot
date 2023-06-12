import * as Joi from 'joi';

export interface PostCreateDto {
  videoId: string;
  description: string;
  geoPoint: {
    longitude: number;
    latitude: number;
  };
  tags: string[];
}

export const postCreateSchema = Joi.object({
  videoId: Joi.string().required(),
  description: Joi.string().required(),
  geoPoint: Joi.object({
    longitude: Joi.number().required(),
    latitude: Joi.number().required(),
  }).required(),
  tags: Joi.array().items(Joi.string()).required(),
});
