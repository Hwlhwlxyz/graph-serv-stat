export function map2JSON(m:Map<any,any>) {
    let outputmap = JSON.stringify(m, (key, value) => (value instanceof Map ? [...value] : value));
    return outputmap;
}