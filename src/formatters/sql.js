export async function format(code, options = {}) {
  const { format: formatSql } = await import("sql-formatter");
  return formatSql(code, {
    language: options.dialect || "mysql",
    tabWidth: options.tabWidth ?? 2,
    keywordCase: options.keywordCase || "upper"
  });
}
