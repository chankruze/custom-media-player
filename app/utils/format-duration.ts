export const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = Math.floor((duration % 3600) % 60);

  if (hours === 0) {
    return `${minutes.toString()}:${seconds.toString().padStart(2, "0")}`;
  }

  return `${hours.toString()}:${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
};
