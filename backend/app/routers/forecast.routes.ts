import { FastifyInstance } from 'fastify';
import { ForecastHandler } from '../handlers/forecast.handler';

export async function forecastRoutes(fastify: FastifyInstance) {
    // Create a new forecast
fastify.post(
  '/forecasts',
  {
    schema: {
      body: {
        type: 'object',
        required: ['forecast_type', 'predicted_value', 'unit', 'valid_until', 'source'],
        properties: {
          forecast_type: { type: 'string' },
          predicted_value: { type: 'number' },
          unit: { type: 'string' },
          valid_until: { type: 'string', format: 'date-time' },
          source: { type: 'string' }
        }
      }
    }
  },
  ForecastHandler.createForecast
);

    // Get all forecasts
    fastify.get('/forecasts', ForecastHandler.getAllForecasts);

    // Generate a prediction
fastify.post(
  '/predict',
  {
    schema: {
      body: {
        type: 'object',
        required: ['data_type', 'historical_data', 'horizon'],
        properties: {
          data_type: { type: 'string' },
          historical_data: {
            type: 'array',
            items: { type: 'number' },
            minItems: 2
          },
          horizon: { type: 'number', minimum: 1 }
        }
      },
      response: {
        201: {
          type: 'object',
          properties: {
            prediction: { type: 'number' },
            forecast_id: { type: 'string' },
            cached: { type: 'boolean' }
          }
        }
      }
    }
  },
  ForecastHandler.generatePrediction
);
}