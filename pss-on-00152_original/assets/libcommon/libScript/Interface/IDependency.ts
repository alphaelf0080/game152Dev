export interface IDependency {
    /**註冊要放進Container的相依東西 */
    registerDep(): void;
}