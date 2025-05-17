import { Forecast, IForecast, ForecastInput } from '../models/forcast.model';
import redis from '../utils/redis';
import mqttService from './mqtt.service';

export class ForecastService {
    // Create a new forecast
    static async createForecast(forecastData: ForecastInput): Promise<IForecast> {
        const forecast = new Forecast(forecastData);
        
        return await forecast.save();
    }

    // Get all forecasts
    static async getAllForecasts(): Promise<IForecast[]> {
        return await Forecast.find().sort({ timestamp: -1 });
    }


static async generatePrediction(data_type: string, historical_data: number[], horizon: number) {
    const cacheKey = `${data_type}:${historical_data.join(',')}:${horizon}`;
    
    const cached = await redis.get(cacheKey);
    if (cached) {
        console.log('📦 Cache HIT');
        const forecast = JSON.parse(cached);
        // Publish cached forecast to MQTT
        await mqttService.publishForecast(forecast);
        return { forecast, fromCache: true };
    }

    // Dummy prediction logic
    const avg = historical_data.reduce((sum, val) => sum + val, 0) / historical_data.length;
    const predicted_value = avg + (Math.random() * 2 - 1);

    const forecast = await Forecast.create({
        forecast_type: data_type,
        timestamp: new Date(),
        predicted_value,
        unit: "kWh",
        valid_until: new Date(Date.now() + horizon * 60 * 60 * 1000),
        source: "prediction-module"
    });

    await redis.set(cacheKey, JSON.stringify(forecast), 'EX', 300); // expires in 5 minutes

    // Publish new forecast to MQTT
    await mqttService.publishForecast(forecast);

    console.log('🧠 Cache MISS – computed and stored');
    return { forecast, fromCache: false };
}

}