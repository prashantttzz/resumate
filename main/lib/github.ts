import { graphql } from "@octokit/graphql";

// 1. GraphQL client setup
// Ensure you have GITHUB_TOKEN in your .env file
const gql = graphql.defaults({
  headers: { authorization: `token ${process.env.GITHUB_TOKEN}` },
});

// 2. Type definition for the final resume structure
interface FetchedResume {
  personalInfo: {
    fullName: string;
    email: string | null;
    phone: string | null;
    address: string | null;
    linkedin: string | null;
    github: string | null;
    website: string | null;
    summary: string;
    jobTitle: string;
  };
  projects: {
    title: string;
    role: string | null;
    startDate: Date;
    current: boolean;
    endDate: Date | null;
    link: string;
    description: string;
  }[];
  skills: {
    name: string; // e.g., "Languages", "Frameworks & Tools"
    skills: { name: string }[];
  }[];
}

// 3. Keyword list for identifying and categorizing skills
const FRAMEWORK_AND_TOOL_KEYWORDS = new Set([
  // JS Frameworks & Libraries
  'react', 'angular', 'vue', 'svelte', 'nextjs', 'nodejs', 'express', 'nestjs', 
  'jquery', 'redux', 'jest', 'webpack', 'vite', 'd3', 'threejs', 'typescript',
  // Python Frameworks & Libraries
  'django', 'flask', 'fastapi', 'pandas', 'numpy', 'tensorflow', 'pytorch', 'scikit-learn',
  // Other Languages & Frameworks
  'dotnet', 'springboot', 'laravel', 'rubyonrails', 'flutter', 'react-native',
  // Tools & Platforms
  'docker', 'kubernetes', 'aws', 'gcp', 'azure', 'firebase', 'mongodb', 'postgresql', 
  'mysql', 'graphql', 'rest-api', 'git', 'github-actions', 'linux', 'tailwindcss'
]);


/**
 * Fetches and processes a user's GitHub profile to generate a structured resume object.
 * @param username The GitHub username to fetch data for.
 * @returns A Promise that resolves to a FetchedResume object.
 */
export async function fetchGitHubResume(username: string): Promise<FetchedResume> {
  // 4. The comprehensive GraphQL query
  const query = `
    query($login: String!) {
      user(login: $login) {
        name
        login
        bio
        location
        websiteUrl
        url
        pinnedItems(first: 6, types: [REPOSITORY]) {
          nodes {
            ... on Repository {
              name
              url
              description
              createdAt
            }
          }
        }
        repositories(first: 50, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC, isFork: false) {
          nodes {
            name
            url
            description
            createdAt
            repositoryTopics(first: 10) { 
              nodes { 
                topic { 
                  name 
                } 
              } 
            }
            languages(first: 5, orderBy: {field: SIZE, direction: DESC}) {
              nodes {
                name
              }
            }
          }
        }
      }
    }
  `;

  const data: any = await gql(query, { login: username });
  const user = data.user;

  // 5. Process Personal Information
  const personalInfo = {
    fullName: user.name || user.login,
    email: null, // Not available from this API call for privacy
    phone: null,
    address: user.location || null,
    linkedin: null, // To be added from LinkedIn data
    github: user.url,
    website: user.websiteUrl || null,
    summary: user.bio || "",
    jobTitle: "", // To be added from LinkedIn data
  };

  // 6. Process Projects (Pinned items first, then recent repos)
  let projectsData: any[] = [];
  const pinnedProjects = user.pinnedItems.nodes;
  if (pinnedProjects.length > 0) {
    projectsData = pinnedProjects;
  } else {
    projectsData = user.repositories.nodes.slice(0, 2); // Fallback to 2 most recent repos
  }

  const projects = projectsData.map((repo: any) => ({
    title: repo.name,
    role: "Owner",
    startDate: new Date(repo.createdAt),
    current: true, // Assuming recent projects are ongoing for simplicity
    endDate: null,
    link: repo.url,
    description: repo.description || "",
  }));

  // 7. Process and Categorize Skills
  const languageSet = new Set<string>();
  const frameworkAndToolSet = new Set<string>();

  user.repositories.nodes.forEach((repo: any) => {
    // Categorize languages
    if (repo.languages && repo.languages.nodes) {
      repo.languages.nodes.forEach((lang: any) => {
        if (!['HTML', 'CSS', 'Markdown', 'Shell'].includes(lang.name)) {
          languageSet.add(lang.name);
        }
      });
    }

    // Categorize frameworks and tools from topics
    if (repo.repositoryTopics && repo.repositoryTopics.nodes) {
      repo.repositoryTopics.nodes.forEach((n: any) => {
        const topic = n.topic.name.toLowerCase();
        if (FRAMEWORK_AND_TOOL_KEYWORDS.has(topic)) {
          frameworkAndToolSet.add(topic);
        }
      });
    }
  });

  const skills = [];
  
  if (languageSet.size > 0) {
    skills.push({
      name: "Languages",
      skills: Array.from(languageSet).map((s) => ({ name: s })),
    });
  }

  if (frameworkAndToolSet.size > 0) {
    skills.push({
      name: "Frameworks & Tools",
      skills: Array.from(frameworkAndToolSet).map((s) => ({ name: s.charAt(0).toUpperCase() + s.slice(1) })),
    });
  }

  // 8. Assemble the final object
  const fetchedData: FetchedResume = { personalInfo, projects, skills };
  return fetchedData;
}