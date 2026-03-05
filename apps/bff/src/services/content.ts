import { strapiFetch } from "../strapi/client.js";
import {
  toProjectListDTO,
  toProjectDTO,
  toBlogListDTO,
  toBlogPostDTO,
  toGlobalDTO,
  toPageDTO
} from "../strapi/transform.js";
import {
  BlogListDTO,
  BlogPostDTO,
  GlobalDTO,
  PageDTO,
  ProjectDTO,
  ProjectSummaryDTO
} from "../types.js";

export async function fetchGlobal(): Promise<GlobalDTO> {
  const response = await strapiFetch("global", {
    populate: "*"
  });
  return toGlobalDTO(response as Parameters<typeof toGlobalDTO>[0]);
}

export async function fetchPageBySlug(slug: string): Promise<PageDTO | null> {
  const response = await strapiFetch("pages", {
    filters: { slug: { $eq: slug } },
    populate: {
      seo: { populate: "*" },
      sections: {
        on: {
          "sections.hero": { populate: "*" },
          "sections.features": { populate: "*" },
          "sections.logos": { populate: "*" },
          "sections.testimonials": { populate: "*" },
          "sections.faq": { populate: "*" },
          "sections.cta": { populate: "*" },
          "sections.rich-text": { populate: "*" },
          "sections.about": { populate: "*" },
          "sections.mission": { populate: "*" },
          "sections.team": { populate: "*" },
          "sections.team-page": {
            populate: {
              heroImage: { populate: "*" },
              organizationImage: { populate: "*" },
              orgBranches: { populate: "*" },
              executiveMembers: { populate: "*" },
              boardMembers: { populate: "*" },
              joinImage: { populate: "*" }
            }
          },
          "sections.projects": { populate: "*" },
          "sections.articles": { populate: "*" },
          "sections.podcast": { populate: "*" },
          "sections.contact": { populate: "*" },
          "sections.carbon-predictor": { populate: "*" },
          "sections.carbon-cta": { populate: "*" },
          "sections.gallery": {
            populate: {
              items: { populate: "*" }
            }
          },
          "sections.project-gallery": {
            populate: {
              backgroundImage: { populate: "*" },
              filters: { populate: "*" }
            }
          }
        }
      }
    },
    publicationState: "live",
    pagination: { pageSize: 1 }
  });

  return toPageDTO(response as Parameters<typeof toPageDTO>[0]);
}

export async function fetchBlogList(options: {
  page: number;
  pageSize: number;
  category?: string;
  tag?: string;
}): Promise<BlogListDTO> {
  const filters: Record<string, unknown> = {};

  if (options.category) {
    filters.categories = { slug: { $eq: options.category } };
  }

  if (options.tag) {
    filters.tags = { slug: { $eq: options.tag } };
  }

  const response = await strapiFetch("blog-posts", {
    filters,
    sort: ["publishedAt:desc"],
    populate: { coverImage: true, categories: true, tags: true },
    publicationState: "live",
    pagination: { page: options.page, pageSize: options.pageSize }
  });

  return toBlogListDTO(response as Parameters<typeof toBlogListDTO>[0]);
}

export async function fetchBlogPost(slug: string): Promise<BlogPostDTO | null> {
  const response = await strapiFetch("blog-posts", {
    filters: { slug: { $eq: slug } },
    populate: { coverImage: true, categories: true, tags: true },
    publicationState: "live",
    pagination: { pageSize: 1 }
  });

  return toBlogPostDTO(response as Parameters<typeof toBlogPostDTO>[0]);
}

export async function fetchProjectList(limit?: number): Promise<ProjectSummaryDTO[]> {
  const pageSize = Math.min(100, Math.max(1, Number(limit ?? 100)));

  const response = await strapiFetch("projects", {
    sort: ["isFeatured:desc", "publishedAt:desc", "title:asc"],
    fields: ["title", "slug", "category", "statusLabel", "statusTone", "year", "excerpt", "isFeatured"],
    populate: { coverImage: true },
    publicationState: "live",
    pagination: { page: 1, pageSize }
  });

  return toProjectListDTO(response as Parameters<typeof toProjectListDTO>[0]);
}

export async function fetchProjectBySlug(slug: string): Promise<ProjectDTO | null> {
  const response = await strapiFetch("projects", {
    filters: { slug: { $eq: slug } },
    populate: { coverImage: true, gallery: true, stats: true },
    publicationState: "live",
    pagination: { pageSize: 1 }
  });

  return toProjectDTO(response as Parameters<typeof toProjectDTO>[0]);
}
