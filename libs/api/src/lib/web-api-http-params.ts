export const flattenParamsObject = (data: any): any => {
    return new NestedObjectParamsBuilder().flatten(data);
};

export class NestedObjectParamsBuilder {
    flatten(data: any, currentPath: string = '', flattenParams: any = {}): any {
        Object.keys(data).forEach(key => {
            if (data[key] instanceof Object) {
                if (currentPath) {
                    this.flatten(data[key], `${currentPath}[${key}]`, flattenParams);
                } else {
                    this.flatten(data[key], key, flattenParams);
                }
            } else {
                flattenParams[`${currentPath}${currentPath ? '[' + key + ']' : key}`] = data[key];
            }
        });
        return flattenParams;
    }
}
