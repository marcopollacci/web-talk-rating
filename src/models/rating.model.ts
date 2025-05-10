export interface GetAllEventsRatingResponse {
  id_event: string;
  name_event: string;
  description: string;
  date_event_from: Date;
  date_event_to: Date;
  year: number;
  value: string;
}

export interface GetAllEventsRatingMapped
  extends Omit<GetAllEventsRatingResponse, 'value'> {
  ratings: number[];
  average: number;
}

export type queryEvents = string | undefined;
