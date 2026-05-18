// Smart merge of site-content data: Blob (admin edits) overrides File (defaults),
// but for arrays of items keyed by id, missing fields on the Blob item inherit
// from the matching File item. This lets us add new fields (e.g. product
// subtitle, longDescription, features, gallery) to the file defaults and have
// them appear on existing products that were saved with the old shape.

type AnyObj = Record<string, unknown>;

function isPlainObject(v: unknown): v is AnyObj {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function mergeItemArray(
  fileArr: unknown[] | undefined,
  blobArr: unknown[] | undefined,
  key: string,
): unknown[] | undefined {
  if (!Array.isArray(blobArr)) return blobArr ?? fileArr;
  if (!Array.isArray(fileArr)) return blobArr;
  return blobArr.map((blobItem) => {
    if (!isPlainObject(blobItem)) return blobItem;
    const id = blobItem[key];
    if (typeof id !== "string") return blobItem;
    const fileMatch = fileArr.find(
      (f) => isPlainObject(f) && f[key] === id,
    ) as AnyObj | undefined;
    if (!fileMatch) return blobItem;
    // Blob overrides File, but File defaults fill in any missing keys.
    return { ...fileMatch, ...blobItem };
  });
}

export function mergeSiteContent(
  fileData: AnyObj | null,
  blobData: AnyObj | null,
): AnyObj | null {
  if (!blobData) return fileData;
  if (!fileData) return blobData;

  const merged: AnyObj = { ...fileData, ...blobData };

  // Products array: match by `id`, inherit defaults from file.
  const fileProducts = fileData.products as unknown[] | undefined;
  const blobProducts = blobData.products as unknown[] | undefined;
  const mergedProducts = mergeItemArray(fileProducts, blobProducts, "id");
  if (mergedProducts !== undefined) merged.products = mergedProducts;

  return merged;
}
