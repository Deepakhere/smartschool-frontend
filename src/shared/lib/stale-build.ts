const RELOADED_AT = "opscul:reloaded-for-new-version";

// after a deploy an open tab still asks for the old build's files, which no longer exist
export const isStaleBuildError = (error: unknown) =>
  /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module|ChunkLoadError/i.test(
    String((error as Error | undefined)?.message ?? error)
  );

// reloads onto the new build, at most once a minute so a real outage can't loop; false when it didn't reload
export const reloadForNewVersion = () => {
  try {
    if (Date.now() - Number(sessionStorage.getItem(RELOADED_AT) || 0) < 60_000) return false;
    sessionStorage.setItem(RELOADED_AT, String(Date.now()));
  } catch {
    return false;
  }
  window.location.reload();
  return true;
};
