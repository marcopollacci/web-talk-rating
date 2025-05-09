import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { GetAllEventsRatingResponse } from '../../models/rating.model';

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

  async getAllEventsRating<T>() {
    return (await this.#neonObj`SELECT * from events_rating;`) as T;
  }

  async setSchema() {
    await this.#neonObj.query(`SET SCHEMA '${process.env['NEON_SCHEMA']}';`);
  }
}
