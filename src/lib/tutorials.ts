import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import type { Tutorial, TutorialFrontmatter } from './types';

const tutorialsDirectory = path.join(process.cwd(), 'src/content/tutorials');

export function getAllTutorials(): Tutorial[] {
  const fileNames = fs.readdirSync(tutorialsDirectory).filter((f) => f.endsWith('.mdx'));

  return fileNames
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx$/, '');
      const fullPath = path.join(tutorialsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      const frontmatter = data as TutorialFrontmatter;
      const stats = readingTime(content);

      return {
        ...frontmatter,
        slug,
        estimatedReadTime: Math.ceil(stats.minutes),
        content,
      };
    })
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getTutorialBySlug(slug: string): Tutorial | undefined {
  const fullPath = path.join(tutorialsDirectory, `${slug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return undefined;
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const frontmatter = data as TutorialFrontmatter;
  const stats = readingTime(content);

  return {
    ...frontmatter,
    slug,
    estimatedReadTime: Math.ceil(stats.minutes),
    content,
  };
}

export function getTutorialSlugs(): string[] {
  return fs
    .readdirSync(tutorialsDirectory)
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''));
}
