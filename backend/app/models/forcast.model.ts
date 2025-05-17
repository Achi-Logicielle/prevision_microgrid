import { Schema, model, Document } from 'mongoose';
import mqttService from '../services/mqtt.service';

export interface IForecast extends Document {
    forecast_type: string;
    timestamp: Date;
    predicted_value: number;
    unit: string;
    valid_until: Date;
    source: string;
}

export type ForecastInput = {
    forecast_type: string;
    timestamp: Date;
    predicted_value: number;
    unit: string;
    valid_until: Date;
    source: string;
};

const ForecastSchema = new Schema<IForecast>({
    forecast_type: { type: String, required: true },
    timestamp: { type: Date, required: true },
    predicted_value: { type: Number, required: true },
    unit: { type: String, required: true },
    valid_until: { type: Date, required: true },
    source: { type: String, required: true }
});

// Add middleware to publish to MQTT after saving
ForecastSchema.post('save', async function(doc) {
    try {
        await mqttService.publishForecast(doc);
    } catch (error) {
        console.error('Error publishing forecast to MQTT:', error);
    }
});

export const Forecast = model<IForecast>('Forecast', ForecastSchema);