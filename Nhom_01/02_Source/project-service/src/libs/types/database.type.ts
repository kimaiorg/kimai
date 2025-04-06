export interface CreateOptions {
  select?: Record<string, boolean>;
}

export interface GetOptions<T> {
  select?: Record<string, any>;
  where?: Partial<T> | any;
  orderBy?: Record<string, any>;
  skip?: number;
  take?: number;
}

export interface UpdateOptions<T> {
  select?: Record<string, any>;
  where: Partial<T>;
  data: Partial<T>;
}
