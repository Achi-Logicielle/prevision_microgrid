import mqtt, { MqttClient } from 'mqtt';
import { IForecast } from '../models/forcast.model';

class MQTTService {
    private client: MqttClient;
    private readonly MQTT_BROKER = process.env.MQTT_BROKER || 'mqtt://localhost:1883';
    private readonly FORECAST_TOPIC = 'microgrid/forecast';

    constructor() {
        this.client = mqtt.connect(this.MQTT_BROKER);
        this.setupMQTTClient();
    }

    private setupMQTTClient() {
        this.client.on('connect', () => {
            console.log('Connected to MQTT broker');
        });

        this.client.on('error', (error) => {
            console.error('MQTT Client Error:', error);
        });
    }

    public publishForecast(forecast: IForecast) {
        return new Promise<void>((resolve, reject) => {
            this.client.publish(
                this.FORECAST_TOPIC,
                JSON.stringify(forecast),
                { qos: 1 },
                (error) => {
                    if (error) {
                        console.error('Error publishing forecast:', error);
                        reject(error);
                    } else {
                        console.log('Forecast published successfully');
                        resolve();
                    }
                }
            );
        });
    }

    public disconnect() {
        this.client.end();
    }
}

export default new MQTTService(); 