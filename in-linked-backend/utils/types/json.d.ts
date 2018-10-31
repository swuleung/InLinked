// Allow for JSON import
declare module "*.json" {
    const value: any;
    export default value;
}