export const convertSecondsToLocalDateTime = (seconds: number): string => {
    return new Date(seconds * 1000).toLocaleString();
};
