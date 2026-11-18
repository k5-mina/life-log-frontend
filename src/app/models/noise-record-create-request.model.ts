export interface NoiseRecordCreateRequest {
  occurrenceDate: string;
  occurrenceTime: string;
  durationCategory: number;
  occurrenceSource: string;
  soundLevel: number;
  soundTypes: string[];
  memo: string;
}
