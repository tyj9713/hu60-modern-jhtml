function numericId(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function normalizeUserInfo(source = {}, fallback = {}) {
  const nested =
    source.uinfo ||
    source.userInfo ||
    source.user ||
    source._uinfo ||
    {};
  const uid = numericId(
    nested.uid ??
      nested.id ??
      source._u_uid ??
      source.uid ??
      source.user_id ??
      fallback.uid ??
      fallback.id
  );
  const name = String(
    nested.name ??
      source._u_name ??
      source.username ??
      source.name ??
      fallback.name ??
      ""
  );
  const avatar = String(
    nested.avatar ??
      source._u_avatar ??
      source.avatar ??
      fallback.avatar ??
      ""
  );

  return {
    ...fallback,
    ...source,
    ...nested,
    uid,
    name,
    avatar
  };
}
