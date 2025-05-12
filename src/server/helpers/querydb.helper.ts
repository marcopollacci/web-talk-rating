import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { VoteFormInterface } from '../../app/features/events/models/vote.model';
import { queryEvents } from '../../models/rating.model';

export class QueryDBHelper {
  static #istance: QueryDBHelper;
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

  async getAllEvents() {
    return await this
      .#neonObj`SELECT name_event, year, description FROM events;`;
  }

  async getEvent(eventId: string) {
    return await this.#neonObj.query(
      `SELECT name_event, description, date_event_from, date_event_to, vote_enabled, talk FROM events WHERE random_value = $1`,
      [eventId]
    );
  }

  async getAllEventsRating<T>(event: queryEvents): Promise<T> {
    if (event) return this.getSingleEventRating<T>(event);
    return (await this.#neonObj`SELECT * from events_rating;`) as T;
  }

  async getSingleEventRating<T>(event: string): Promise<T> {
    return (await this.#neonObj.query(
      `SELECT * FROM events_rating WHERE id_event = $1;`,
      [event]
    )) as T;
  }

  async insertRating(eventId: string, formData: VoteFormInterface) {
    //get real ID
    const [realEventId] = await this.#neonObj.query(
      `SELECT id FROM events WHERE random_value = $1;`,
      [eventId]
    );

    return await this.#neonObj.query(
      `INSERT INTO rating (fk_events, value, comment) VALUES ($1, $2, $3);`,
      [realEventId['id'], formData.rating, formData.comment]
    );
  }

  async setSchema() {
    await this.#neonObj.query(
      `SET search_path TO ${process.env['NEON_SCHEMA']};`
    );
  }
}
