import {Entity} from '../entity.model';
import {EntityType} from '../entity-type.enum';

/**
 * Represents a team
 */
export class Team extends Entity {

  /** Index */
  index: number;
  /** Score of the team */
  score: number;
  /** Team icon */
  icon: string;
  /** Team color */
  color: string;

  /**
   * Constructor
   */
  constructor() {
    super();
    this.entityType = EntityType.TEAM;
    this.index = -1;
    this.score = 0;
    this.icon = '';
    this.color = '';
  }
}
