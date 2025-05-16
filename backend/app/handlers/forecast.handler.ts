import { FastifyRequest, FastifyReply } from 'fastify';
import { ForecastService } from '../services/forecast.service';
import { ForecastInput } from '../models/forcast.model';


interface PredictionInput {
    data_type: string;
    historical_data: number[];
    horizon: number;
}

export class ForecastHandler {
    static async createForecast(
        request: FastifyRequest<{ Body: Omit<ForecastInput, 'timestamp'> & { valid_until: string } }>,
        reply: FastifyReply
    ) {
        try {
            const forecast = await ForecastService.createForecast({
                ...request.body,
                timestamp: new Date(),
                valid_until: new Date(request.body.valid_until)
            });
            return reply.code(201).send(forecast);
        } catch (err) {
            request.log.error(err);
            return reply.code(500).send({ message: 'Error creating forecast' });
        }
    }
    
    static async getAllForecasts(request: FastifyRequest, reply: FastifyReply) {
        try {
            const forecasts = await ForecastService.getAllForecasts();
            return reply.send(forecasts);
        } catch (err) {
            request.log.error(err);
            return reply.code(500).send({ message: 'Error fetching forecasts' });
        }
    }

static async generatePrediction(
    request: FastifyRequest<{ Body: PredictionInput }>,
    reply: FastifyReply
) {
    try {
        const { data_type, historical_data, horizon } = request.body;
        const { forecast, fromCache } = await ForecastService.generatePrediction(
            data_type,
            historical_data,
            horizon
        );
        
        return reply.code(201).send({
            prediction: forecast.predicted_value,
            forecast_id: forecast._id,
            cached: fromCache
        });
    } catch (err) {
        request.log.error(err);
        return reply.code(500).send({ message: 'Error generating prediction' });
    }
}

}