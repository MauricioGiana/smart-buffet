/**
 * UnitOfWork Pattern Interface
 * Manages transactional boundaries for atomic operations across multiple repositories
 */
export interface UnitOfWork {
  /**
   * Execute an operation within a database transaction
   * @template T - The return type of the operation
   * @param operation - Async function that receives the Prisma transaction client
   * @returns Promise that resolves when the transaction completes
   */
  runInTransaction<T>(operation: (tx: any) => Promise<T>): Promise<T>;
}
