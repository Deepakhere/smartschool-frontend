import { Paged } from "@/types";

// the largest page the backend serves
const PAGE_LIMIT = 100;

// reads a paged list one page at a time until `count` rows are in hand or the list ends
export const fetchRows = async <T>(fetchPage: (page: number, limit: number) => Promise<Paged<T>>, count: number) => {
  const rows: T[] = [];
  for (let page = 1; rows.length < count; page++) {
    const result = await fetchPage(page, PAGE_LIMIT);
    rows.push(...result.rows);
    if (!result.pagination.hasNextPage) break;
  }
  return rows.slice(0, count);
};
