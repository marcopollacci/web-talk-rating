export interface GetAllEventsRatingResponse {
  id_event: number;
  name_event: string;
  description: string;
  year: number;
  value: string;
}

export interface GetAllEventsRatingMapped
  extends Omit<GetAllEventsRatingResponse, 'value'> {
  value: string[];
  average: number;
}
