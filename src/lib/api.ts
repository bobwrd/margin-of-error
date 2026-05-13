export interface ContentMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  summary: string;
  type: "article" | "newsletter";
}

export interface ContentItem extends ContentMeta {
  body: string;
}

export async function getFeed(): Promise<ContentMeta[]> {
  const res = await fetch("/api/feed");
  const data = await res.json();
  return data.items;
}

export async function getArticles(): Promise<ContentMeta[]> {
  const res = await fetch("/api/content/articles");
  const data = await res.json();
  return data.items;
}

export async function getArticle(slug: string): Promise<ContentItem | null> {
  const res = await fetch(`/api/content/articles/${slug}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.item;
}

export async function getNewsletterIssues(): Promise<ContentMeta[]> {
  const res = await fetch("/api/content/newsletter");
  const data = await res.json();
  return data.items;
}

export async function getNewsletterIssue(slug: string): Promise<ContentItem | null> {
  const res = await fetch(`/api/content/newsletter/${slug}`);
  if (!res.ok) return null;
  const data = await res.json();
  return data.item;
}

export async function getProfile(): Promise<string> {
  const res = await fetch("/api/profile");
  const data = await res.json();
  return data.markdown;
}

export async function getLikes(type: string, slug: string): Promise<number> {
  const res = await fetch(`/api/likes/${type}/${slug}`);
  const data = await res.json();
  return data.count;
}

export async function addLike(type: string, slug: string): Promise<number> {
  const res = await fetch(`/api/likes/${type}/${slug}`, { method: "POST" });
  const data = await res.json();
  return data.count;
}

export async function submitContact(payload: {
  name: string;
  email: string;
  subject: string;
  message: string;
}): Promise<{ success?: boolean; error?: string }> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}

export async function subscribeNewsletter(payload: {
  email: string;
  name?: string;
}): Promise<{ success?: boolean; error?: string }> {
  const res = await fetch("/api/newsletter/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
  return res.json();
}
