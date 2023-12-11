export abstract class GenericRepository<T> {
  abstract create(item: T): Promise<T>;
  abstract fetchAll(): Promise<T[]>;
  abstract fetchById(id: number): Promise<T>;
  abstract update(item: T): Promise<T>;
  abstract deleteById(id: number): Promise<boolean>;
}
