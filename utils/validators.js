import Joi from "joi";

const eventSchema = Joi.object({
  title: Joi.string().max(200).required(),
  event_time: Joi.date().iso().greater('now').required(),
  location: Joi.string().max(200).required(),
  capacity: Joi.number().integer().min(1).max(1000).required()
});
export { eventSchema };
