import fs from 'node:fs/promises';
import YAML from 'yaml';
import type { MarkdownInstance } from 'astro';

const contentRoot = new URL('../../content/', import.meta.url);

async function readYaml<T>(relativePath: string): Promise<T> {
  const fileUrl = new URL(relativePath, contentRoot);
  const raw = await fs.readFile(fileUrl, 'utf-8');
  return YAML.parse(raw) as T;
}

type MarkdownModule<T> = MarkdownInstance<T> & {
  file: string;
};

export type SiteSettings = {
  siteTitle: string;
  tagline?: string;
  bioShort?: string;
  githubUrl?: string;
  email?: string;
  discord?: string;
  tumblrUrl?: string;
  bskyUrl?: string;
  showEndorsements?: boolean;
  showSkillTree?: boolean;
};

export type SkillNode = {
  id: string;
  label: string;
  level: number;
  description?: string;
  children?: SkillNode[];
};

export type ProjectFrontmatter = {
  title: string;
  slug?: string;
  shortDescription: string;
  techStack?: string[];
  tags?: string[];
  liveUrl?: string;
  repoUrl?: string;
  image?: string;
  featured?: boolean;
  order?: number;
};

export type BlogFrontmatter = {
  title: string;
  slug?: string;
  date: string;
  summary: string;
  category?: string;
  tags?: string[];
  cover?: string;
  featured?: boolean;
  published?: boolean;
};

export type Endorsement = {
  name: string;
  logo?: string;
  url?: string;
  blurb?: string;
  order?: number;
};

export type ProjectEntry = ProjectFrontmatter & {
  slug: string;
  Content: MarkdownModule<ProjectFrontmatter>['Content'];
};

export type BlogPost = BlogFrontmatter & {
  slug: string;
  Content: MarkdownModule<BlogFrontmatter>['Content'];
  readTime: number;
};

const projectModules = import.meta.glob<MarkdownModule<ProjectFrontmatter>>('../../content/projects/*.md', {
  eager: true,
});

const blogModules = import.meta.glob<MarkdownModule<BlogFrontmatter>>('../../content/blog/*.md', {
  eager: true,
});

const endorsementModules = import.meta.glob<MarkdownModule<Endorsement>>('../../content/endorsements/*.md', {
  eager: true,
});

const toSlug = (mod: MarkdownModule<any>) => {
  if (mod.frontmatter.slug) return mod.frontmatter.slug;
  const base = mod.file?.split('/').pop() ?? '';
  return base.replace(/\.md$/, '');
};

const calcReadTime = (mod: MarkdownModule<any>) => {
  const raw = typeof mod.rawContent === 'function' ? mod.rawContent() : '';
  const words = raw ? raw.split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 220));
};

const projects: ProjectEntry[] = Object.values(projectModules)
  .map((mod) => ({
    ...mod.frontmatter,
    slug: toSlug(mod),
    Content: mod.Content,
  }))
  .sort((a, b) => {
    const orderA = a.order ?? 0;
    const orderB = b.order ?? 0;
    if (orderA === orderB) {
      return a.title.localeCompare(b.title);
    }
    return orderA - orderB;
  });

const blogPosts: BlogPost[] = Object.values(blogModules)
  .filter((mod) => mod.frontmatter.published !== false)
  .map((mod) => ({
    ...mod.frontmatter,
    slug: toSlug(mod),
    Content: mod.Content,
    readTime: calcReadTime(mod),
  }))
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

const endorsements: Endorsement[] = Object.values(endorsementModules)
  .map((mod) => ({
    ...mod.frontmatter,
  }))
  .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

export function getProjects() {
  return projects;
}

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function getFeaturedProjects(limit = 4) {
  return projects.filter((project) => project.featured).slice(0, limit);
}

export function getBlogPosts() {
  return blogPosts;
}

export function getPostBySlug(slug: string) {
  return blogPosts.find((post) => post.slug === slug);
}

export function getLatestPosts(limit = 3) {
  return blogPosts.slice(0, limit);
}

export function getEndorsements() {
  return endorsements;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return readYaml<SiteSettings>('site/settings.yml');
}

export async function getSkills(): Promise<SkillNode[]> {
  return readYaml<SkillNode[]>('skills.yml');
}
