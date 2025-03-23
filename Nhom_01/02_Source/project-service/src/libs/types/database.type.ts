export interface CreateOptions {
  select?: Record<string, boolean>;
}

export interface GetOptions<T> {
  select?: Record<string, any>;
  where?: Partial<T>;
}

export interface UpdateOptions<T> {
  select?: Record<string, any>;
  where: Partial<T>;
  data: Partial<T>;
}
