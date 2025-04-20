export declare class ExceptionService {
    private readonly logger;
    handleDBExceptions(error: any): never;
    throwNotFound(resource: string, id: string): never;
}
