export interface GetAllEventsRatingResponse {
  id_event: string;
  name_event: string;
  description: string;
  date_event_from: Date;
  date_event_to: Date;
  year: number;
  number_of_rating: number;
  average: number;
}

export interface GetSingleEventResponse {
  name_event: string;
  talk: string;
  description: string;
  date_event_from: string;
  date_event_to: string;
  vote_enabled: boolean;
  url_image: string;
}

export type GetEvents = GetEventResponse[];

export interface GetEventResponse {
  name_event: string;
  id: string;
  talk?: string;
  date_event_from: string;
  vote_enabled: boolean;
}

export type queryEvents = string | undefined;
