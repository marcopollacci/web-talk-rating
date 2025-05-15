import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { VoteFormInterface } from '../../app/features/events/models/vote.model';
import { queryEvents } from '../../models/rating.model';

export class QueryDBHelper {
  static #istance: QueryDBHelper;
  readonly #schemaPrefix = process.env['NEON_SCHEMA'] || 'public';
  #neonObj!: NeonQueryFunction<false, false>;

  constructor(database_url: string) {
    if (QueryDBHelper.#istance) {
      return QueryDBHelper.#istance;
    }

    this.#neonObj = neon(database_url);
    QueryDBHelper.#istance = this;
  }

  async getVersion() {
    return await this.#neonObj`SELECT version();`;
  }

  async getAllEvents<T>(): Promise<T> {
    return (await this.#neonObj.query(
      `SELECT name_event, random_value as id, talk, date_event_from, vote_enabled, place FROM ${
        this.#schemaPrefix
      }.events ORDER BY date_event_from DESC limit 5;`
    )) as T;
  }

  async getEvent(eventId: string) {
    return await this.#neonObj.query(
      `SELECT name_event, description, date_event_from, date_event_to, vote_enabled, talk, url_image FROM ${
        this.#schemaPrefix
      }.events WHERE random_value = $1`,
      [eventId]
    );
  }

  async getAllEventsRating<T>(event: queryEvents): Promise<T> {
    if (event) return this.getSingleEventRating<T>(event);
    return (await this.#neonObj.query(
      `SELECT * from ${this.#schemaPrefix}.events_rating_avg;`
    )) as T;
  }

  async getSingleEventRating<T>(event: string): Promise<T> {
    return (await this.#neonObj.query(
      `SELECT * FROM ${
        this.#schemaPrefix
      }.events_rating_avg WHERE id_event = $1;`,
      [event]
    )) as T;
  }

  async insertRating(eventId: string, formData: VoteFormInterface) {
    //get real ID
    const [realEventId] = await this.#neonObj.query(
      `SELECT id FROM ${this.#schemaPrefix}.events WHERE random_value = $1;`,
      [eventId]
    );

    return await this.#neonObj.query(
      `INSERT INTO ${
        this.#schemaPrefix
      }.rating (fk_events, value, comment) VALUES ($1, $2, $3);`,
      [realEventId['id'], formData.rating, formData.comment]
    );
  }
}
