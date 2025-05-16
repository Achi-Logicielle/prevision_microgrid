export function validateForecastInput(data: any): string[] | null {
  const errors: string[] = [];
  
  if (!data.forecast_type) errors.push('forecast_type is required');
  if (typeof data.predicted_value !== 'number') errors.push('predicted_value must be a number');
  if (!data.unit) errors.push('unit is required');
  if (!data.valid_until || isNaN(Date.parse(data.valid_until))) errors.push('valid_until must be a valid date');
  
  return errors.length ? errors : null;
}