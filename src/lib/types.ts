export interface Tutorial {
  title: string;
  slug: string;
  description: string;
  tier: 'free' | 'premium';
  category: 'ai' | 'ml' | 'automation';
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedReadTime: number;
  publishedAt: string;
  updatedAt: string;
  author: string;
  content: string;
}

export interface TutorialFrontmatter {
  title: string;
  description: string;
  tier: 'free' | 'premium';
  category: 'ai' | 'ml' | 'automation';
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  publishedAt: string;
  updatedAt: string;
  author: string;
}

export interface BlogPost {
  title: string;
  slug: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
  content: string;
}

export interface BlogFrontmatter {
  title: string;
  description: string;
  publishedAt: string;
  updatedAt: string;
  author: string;
  tags: string[];
}
