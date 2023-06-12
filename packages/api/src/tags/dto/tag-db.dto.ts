import * as assert from 'assert';

export interface TagDbEntity {
  id: string;
  tag: string;
  totalPost: number;
}

export class TagDbDto {
  private id: string;
  private tag: string;
  private totalPost: number;
  constructor(data: Record<string, unknown>) {
    assert(typeof data.id === 'string', 'id for tag is not a string');
    assert(typeof data.tag === 'string', 'tag for tag is not a string');
    assert(
      typeof data.totalPost === 'number',
      `tag ${data.id} totalPost is not a number`,
    );
    this.id = data.id;
    this.tag = data.tag;
    this.totalPost = data.totalPost;
  }

  toJson(): TagDbEntity {
    return {
      id: this.id,
      tag: this.tag,
      totalPost: this.totalPost,
    };
  }
}
