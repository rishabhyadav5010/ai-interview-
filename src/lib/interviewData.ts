import { InterviewConfig, InterviewQuestion, RoleType } from '@/types/interview';

export const ROLE_INFO: Record<RoleType, { title: string; description: string; icon: string; defaultTech: string[] }> = {
  'frontend': {
    title: 'Frontend Engineer',
    description: 'React, Next.js, TypeScript, State Management, Web Performance, CSS',
    icon: 'Layout',
    defaultTech: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Redux / Zustand']
  },
  'backend': {
    title: 'Backend Engineer',
    description: 'Node.js, Express, Python, Databases, APIs, Distributed Systems, Caching',
    icon: 'Server',
    defaultTech: ['Node.js', 'PostgreSQL', 'Redis', 'REST/GraphQL', 'Docker']
  },
  'fullstack': {
    title: 'Full Stack Developer',
    description: 'End-to-end web apps, DB design, Auth, API integrations, DevOps basics',
    icon: 'Layers',
    defaultTech: ['React/Next.js', 'Node.js', 'SQL / MongoDB', 'Cloud Deployment']
  },
  'data-science': {
    title: 'Data Science & AI/ML',
    description: 'Python, Pandas, Machine Learning, Deep Learning, SQL, Model Evaluation',
    icon: 'Brain',
    defaultTech: ['Python', 'Pandas', 'Scikit-Learn', 'PyTorch', 'SQL']
  },
  'devops': {
    title: 'DevOps & Cloud Engineer',
    description: 'CI/CD, Docker, Kubernetes, AWS/GCP, Terraform, Monitoring & SRE',
    icon: 'Terminal',
    defaultTech: ['Docker', 'Kubernetes', 'AWS', 'GitHub Actions', 'Terraform']
  },
  'product-manager': {
    title: 'Product Manager',
    description: 'Product sense, metrics definition, user empathy, prioritization, go-to-market',
    icon: 'Target',
    defaultTech: ['Product Strategy', 'A/B Testing', 'User Journeys', 'Wireframing']
  },
  'hr-behavioral': {
    title: 'HR & Behavioral (STAR)',
    description: 'Conflict resolution, leadership, communication, adaptability, teamwork',
    icon: 'Users',
    defaultTech: ['STAR Method', 'Conflict Resolution', 'Culture Fit', 'Leadership']
  }
};

export const QUESTION_BANK: Record<RoleType, InterviewQuestion[]> = {
  'frontend': [
    {
      id: 1,
      category: 'Core React & Architecture',
      difficulty: 'Medium',
      question: 'Can you explain the Virtual DOM mechanism in React? How does reconciliation and the Diffing Algorithm work under the hood?',
      expectedKeyPoints: [
        'Virtual DOM is a lightweight JavaScript representation of real DOM',
        'Reconciliation process compares Virtual DOM snapshots',
        'Keys in lists help identify element identity and minimize repaints',
        'Batch updates in modern React 18/19'
      ],
      idealAnswer: 'The Virtual DOM is an in-memory JS object mirroring the browser DOM. When component state changes, React creates a new VDOM tree and runs a diffing algorithm (Reconciliation) with O(n) heuristic complexity. It compares node types, attributes, and uses unique `key` props to avoid unnecessary node recreations, then computes minimal DOM mutations and applies them in batches to prevent costly browser layout thrashing.'
    },
    {
      id: 2,
      category: 'Web Performance & Optimization',
      difficulty: 'Medium',
      question: 'How do you optimize Core Web Vitals (LCP, FID/INP, and CLS) for a high-traffic Next.js or React application?',
      expectedKeyPoints: [
        'LCP: image optimization, next/image priority, CDN, preloading fonts',
        'FID/INP: minimizing long tasks, code splitting (dynamic imports), web workers',
        'CLS: reserving aspect ratio sizes on images/ads, avoiding layout shifts'
      ],
      idealAnswer: 'To optimize LCP, we ensure hero assets use `next/image` with `priority` flags, serve via modern formats (WebP/AVIF) over CDN, and minimize server response time. For INP/FID, we break down long main-thread tasks using React concurrent features, code-split heavy routes with dynamic imports, and defer analytics. For CLS, we assign explicit aspect-ratio dimensions to all media and prevent injecting dynamic content above the fold.'
    },
    {
      id: 3,
      category: 'Coding & Algorithmic Problem',
      difficulty: 'Medium',
      question: 'Implement a custom debounce function in TypeScript/JavaScript that delays invoking a callback until after a specified wait time.',
      starterCode: `function debounce<T extends (...args: any[]) => any>(
  fn: T, 
  delay: number
): (...args: Parameters<T>) => void {
  // Write your debounce implementation here
}`,
      expectedKeyPoints: [
        'Closure over timer identifier (NodeJS.Timeout / number)',
        'Clear existing timeout via clearTimeout before setting a new one',
        'Preserve this context and argument forwarding'
      ],
      idealAnswer: `function debounce(fn, delay) {
  let timerId;
  return function (...args) {
    if (timerId) clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}`
    },
    {
      id: 4,
      category: 'State Management & Async Data',
      difficulty: 'Hard',
      question: 'How would you architect state management in a large dashboard app? When would you use Context API vs Server State (TanStack Query) vs Client Store (Zustand)?',
      expectedKeyPoints: [
        'Context API is best for low-frequency changes (theme, current user)',
        'TanStack Query/SWR owns server state (caching, deduplication, invalidation)',
        'Zustand/Redux for complex cross-component client state with selectors to avoid re-renders'
      ],
      idealAnswer: 'I separate state by lifecycle and origin: Server state (API queries, mutations, cache invalidation) is handled by TanStack Query or Next.js server actions. High-frequency client UI state (e.g., active filters, interactive modals, sidebar states) goes into Zustand for atomic subscriptions without unnecessary subtree re-renders. Context is reserved strictly for low-frequency, globally accessible data like theme and localization.'
    }
  ],
  'backend': [
    {
      id: 1,
      category: 'System Design & Scalability',
      difficulty: 'Medium',
      question: 'How do you handle a sudden 10x traffic spike on an API endpoint that queries a relational database like PostgreSQL?',
      expectedKeyPoints: [
        'Caching layer using Redis (read-aside pattern)',
        'Database connection pooling (PgBouncer)',
        'Read replicas for read-heavy traffic',
        'Rate limiting and message queues (BullMQ/Kafka) for write surges'
      ],
      idealAnswer: 'First, I introduce an in-memory caching layer with Redis using the cache-aside strategy with TTL and cache invalidation. Second, I configure connection pooling via PgBouncer so Postgres processes aren\'t overwhelmed. Third, I route read queries to read-replicas. For write-heavy endpoints, I decouple synchronous processing using an async message broker (RabbitMQ/Kafka) with worker consumers to smooth out throughput spikes.'
    },
    {
      id: 2,
      category: 'Database & Concurrency',
      difficulty: 'Hard',
      question: 'What are database race conditions and how do you prevent the "Double Booking" or "Double Spend" problem in concurrent transactions?',
      expectedKeyPoints: [
        'Pessimistic Locking (SELECT ... FOR UPDATE)',
        'Optimistic Locking with version numbers',
        'Transaction isolation levels (Serializable / Repeatable Read)',
        'Atomic database constraints (unique composite keys)'
      ],
      idealAnswer: 'The double-spend issue happens when two concurrent requests read the same balance or inventory before either has committed a deduction. To prevent this, we can use Pessimistic Locking with `SELECT ... FOR UPDATE`, ensuring row-level exclusive locks during the transaction. Alternatively, Optimistic Locking checks a `version` or timestamp column at update time (`WHERE version = :currentVersion`); if another worker touched it, the update fails and triggers an application retry.'
    },
    {
      id: 3,
      category: 'Coding & Architecture',
      difficulty: 'Medium',
      question: 'Write a middleware function in Node.js/Express (or conceptual TypeScript) that enforces rate-limiting of 100 requests per minute per IP address.',
      starterCode: `// Rate Limiter Middleware
import { Request, Response, NextFunction } from 'express';

export function rateLimiter(req: Request, res: Response, next: NextFunction) {
  // Implement sliding window or token bucket check
}`,
      expectedKeyPoints: [
        'Tracking requests per client IP / Token',
        'Sliding window log or fixed window counter with timestamp expiration',
        'Returning HTTP 429 Too Many Requests with Retry-After header'
      ],
      idealAnswer: 'A robust rate limiter uses Redis with the Token Bucket or Sliding Window Log algorithm. We extract the client IP, check the count within a 60-second sliding key window via multi-exec atomic commands. If count > 100, return 429 status code with headers (`X-RateLimit-Remaining: 0`, `Retry-After: 30`); otherwise increment counter, set TTL, and call `next()`.'
    },
    {
      id: 4,
      category: 'Authentication & Security',
      difficulty: 'Medium',
      question: 'Explain how JWT authentication works compared to Session-based auth. What are the security risks of storing JWTs in LocalStorage and how do you mitigate them?',
      expectedKeyPoints: [
        'JWT is stateless, signed token; Session is stateful, stored on server/Redis',
        'LocalStorage is vulnerable to XSS (Cross-Site Scripting)',
        'Mitigation: Store refresh tokens in HttpOnly, Secure, SameSite cookies',
        'Short-lived access tokens stored in memory'
      ],
      idealAnswer: 'JWTs are stateless cryptographic tokens containing claims, verified via signatures without a DB lookup. Session auth stores session IDs in cookies mapped to a server/Redis session store. Storing JWTs in LocalStorage makes them accessible to any malicious script injected via XSS. The best practice is storing a short-lived access token in client memory, and storing the refresh token inside an `HttpOnly`, `Secure`, `SameSite=Strict` cookie which JavaScript cannot access directly.'
    }
  ],
  'fullstack': [
    {
      id: 1,
      category: 'Architecture & Fullstack Flow',
      difficulty: 'Medium',
      question: 'Walk me through the lifecycle of an authenticated request from a Next.js frontend to a database, detailing the security and caching layers.',
      expectedKeyPoints: [
        'DNS resolution & CDN edge caching',
        'Next.js Middleware verifying JWT/Session cookie',
        'Server Action or API route validation (Zod)',
        'Database query with ORM/parameterized queries to prevent SQL injection',
        'Response hydration on the client'
      ],
      idealAnswer: 'The request hits the edge CDN, where static assets are served. For dynamic requests, it reaches Next.js Edge Middleware which verifies auth tokens. Next, server components or API routes validate payloads using a schema validator like Zod. The server queries Postgres through parameterized statements or Prisma. Sensitive credentials never leak to the client, and responses are streamed back with appropriate caching headers.'
    },
    {
      id: 2,
      category: 'Data Modeling & REST/GraphQL',
      difficulty: 'Medium',
      question: 'Design a schema for a real-time Notification System that supports multiple channels (in-app, email, push) and tracking read/unread status.',
      expectedKeyPoints: [
        'User, Notification, and UserNotification tables',
        'Enum for channels (EMAIL, PUSH, IN_APP)',
        'Status flags: is_read, read_at, is_sent',
        'Indexes on (user_id, is_read, created_at) for fast query speeds'
      ],
      idealAnswer: 'We create a `NotificationTemplate` or `Notification` table holding message content, type, and metadata. A junction table `UserNotification` links `userId`, `notificationId`, `channel`, `isRead` (boolean), `readAt` (timestamp), and `createdAt`. We place a composite index on `(user_id, is_read, created_at DESC)` to power the fast "unread notification bell count" and paginated lists. WebSockets (Socket.io) or Server-Sent Events (SSE) push live in-app notifications.'
    },
    {
      id: 3,
      category: 'Coding & Fullstack Logic',
      difficulty: 'Medium',
      question: 'Write a robust TypeScript function to retry an async API call with exponential backoff and jitter.',
      starterCode: `async function fetchWithRetry<T>(
  fn: () => Promise<T>, 
  maxRetries = 3, 
  baseDelay = 500
): Promise<T> {
  // Implement exponential backoff with jitter
}`,
      expectedKeyPoints: [
        'Loop up to maxRetries',
        'Delay formula: delay * 2^attempt + jitter',
        'Promise with setTimeout for delay',
        'Catch and rethrow error if retries are exhausted'
      ],
      idealAnswer: `async function fetchWithRetry(fn, maxRetries = 3, baseDelay = 500) {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt >= maxRetries) throw err;
      const jitter = Math.random() * 100;
      const delay = baseDelay * Math.pow(2, attempt) + jitter;
      await new Promise(res => setTimeout(res, delay));
    }
  }
  throw new Error("Retries exceeded");
}`
    }
  ],
  'data-science': [
    {
      id: 1,
      category: 'Machine Learning Fundamentals',
      difficulty: 'Medium',
      question: 'How do you handle severe class imbalance in a dataset (e.g. Fraud detection where 99.8% cases are legitimate)?',
      expectedKeyPoints: [
        'Accuracy is misleading; use Precision, Recall, F1-Score, and PR-AUC',
        'Resampling techniques: SMOTE, Random Oversampling, Undersampling',
        'Cost-sensitive learning / Class weights in loss function',
        'Ensemble techniques like Balanced Random Forest'
      ],
      idealAnswer: 'First, standard accuracy must be discarded in favor of Precision-Recall AUC, Recall (Sensitivity), and F1-score. Second, at the data level, we can apply techniques like SMOTE (Synthetic Minority Over-sampling Technique) on training splits only. Third, at the algorithm level, we adjust class weights in the loss function (e.g. `scale_pos_weight` in XGBoost or `class_weight="balanced"` in scikit-learn) so false negatives carry a much higher penalty.'
    },
    {
      id: 2,
      category: 'Model Evaluation & Overfitting',
      difficulty: 'Medium',
      question: 'What is the Bias-Variance tradeoff, and what specific steps do you take when your model exhibits high variance?',
      expectedKeyPoints: [
        'High bias = underfitting; High variance = overfitting',
        'Steps for high variance: Regularization (L1/L2, Dropout), feature selection, more training data, cross-validation, simplifying model architecture'
      ],
      idealAnswer: 'High bias implies the model is too simple and misses key patterns (underfitting). High variance means the model learned the training noise and fails to generalize to unseen test data (overfitting). To reduce high variance, we apply L1 (Lasso) or L2 (Ridge) regularization, add Dropout in neural nets, perform stratified K-fold cross-validation, prune decision trees, use early stopping, and gather or augment more data.'
    }
  ],
  'devops': [
    {
      id: 1,
      category: 'Containerization & Orchestration',
      difficulty: 'Medium',
      question: 'What is the difference between a Docker image and a Docker container? How do multi-stage Docker builds reduce image size?',
      expectedKeyPoints: [
        'Image is an immutable read-only blueprint; Container is a running instance with a writable layer',
        'Multi-stage builds separate build dependencies (compilers, npm modules) from final lean production runtime'
      ],
      idealAnswer: 'A Docker image is a read-only template with layers defining the OS and application code. A container is a runtime instantiation of that image with an isolated execution sandbox and top read-write layer. Multi-stage builds use separate `FROM` instructions in a single Dockerfile: the first stage compiles and builds artifacts using full SDKs/tooling, while the final stage copies only the compiled output into a minimal base (e.g. Alpine or Distroless), reducing image size from gigabytes to megabytes.'
    },
    {
      id: 2,
      category: 'CI/CD & Zero-Downtime Deployment',
      difficulty: 'Medium',
      question: 'Explain Blue-Green deployment vs Canary deployment. What are the pros and cons of each in Kubernetes?',
      expectedKeyPoints: [
        'Blue-Green: Two identical environments, instant traffic switch at router/load balancer; fast rollback, high cost',
        'Canary: Gradually route 5% -> 25% -> 100% of user traffic to new version; safer, monitors error rates'
      ],
      idealAnswer: 'In Blue-Green, two identical environments (Blue=Live, Green=New) exist. When Green passes health checks, the ingress router switches 100% traffic to Green. Rollback is instant by pointing back to Blue, but requires double infrastructure. In Canary deployment, new versions are deployed to a tiny subset of pods (e.g., 5% traffic). Metrics and errors are monitored in real time before ramping up to 100%, offering superior safety with minimal extra compute.'
    }
  ],
  'product-manager': [
    {
      id: 1,
      category: 'Product Design & Strategy',
      difficulty: 'Medium',
      question: 'How would you improve the onboarding experience for a B2B SaaS platform that suffers from a 60% drop-off in the first 7 days?',
      expectedKeyPoints: [
        'Data analysis: identify exact drop-off step (funnel analysis, Hotjar, Mixpanel)',
        'Time to "Aha!" moment reduction',
        'Interactive checklist vs forced long tours',
        'Progressive profiling rather than upfront lengthy setup forms'
      ],
      idealAnswer: 'First, I analyze event analytics (Mixpanel/Amplitude) to pinpoint the exact funnel step where users abandon. Second, I focus on accelerating the user\'s "Aha!" moment—the core value action. I replace lengthy static tours with an interactive gamified checklist of 3 high-impact tasks, pre-fill sample data so users don\'t face a blank state, and postpone non-critical account configuration until after they experience immediate value.'
    }
  ],
  'hr-behavioral': [
    {
      id: 1,
      category: 'Conflict Resolution (STAR)',
      difficulty: 'Medium',
      question: 'Tell me about a time when you strongly disagreed with a team member or technical lead on an architectural decision. How did you resolve it?',
      expectedKeyPoints: [
        'Situation: Context of the technical disagreement',
        'Task: What needed to be delivered',
        'Action: Objective data/benchmarks gathered, collaborative 1-on-1 discussion, disagreement expressed respectfully',
        'Result: Outcome, consensus reached, delivery success, relationship maintained'
      ],
      idealAnswer: 'Using the STAR framework: In my previous project, we needed to choose between REST and GraphQL for a mobile app. My lead preferred GraphQL, but our timeline was tight and the team lacked GraphQL experience. Rather than arguing opinions, I benchmarked two endpoints, measured payload differences, and proposed a pragmatic hybrid: ship MVP with optimized REST endpoints to meet the launch deadline, while designing modular services to adopt GraphQL in Phase 2. The project shipped on time and the lead appreciated the data-driven approach.'
    },
    {
      id: 2,
      category: 'Failure & Ownership (STAR)',
      difficulty: 'Medium',
      question: 'Can you describe a time when you made a mistake in production or missed a critical deadline? What happened and what did you learn?',
      expectedKeyPoints: [
        'Honest ownership without blaming others',
        'Immediate mitigation and clear communication to stakeholders',
        'Root cause analysis (blameless postmortem)',
        'Preventative safeguards put in place'
      ],
      idealAnswer: 'In a previous release, I pushed a database migration script that didn\'t account for null values in an older table, causing 500 errors on the checkout endpoint. I immediately alerted our team Slack, rolled back the deployment within 6 minutes, and communicated status to support. Afterward, I led a blameless postmortem and implemented automated migration checks against a sanitized staging DB in our CI pipeline so this category of error could never reach production again.'
    }
  ]
};

export function getInterviewQuestions(config: InterviewConfig): InterviewQuestion[] {
  const roleBank = QUESTION_BANK[config.role] || QUESTION_BANK['frontend'];
  // If behavioral mode, mix in behavioral questions
  if (config.mode === 'behavioral') {
    return QUESTION_BANK['hr-behavioral'].slice(0, config.questionCount);
  }
  return roleBank.slice(0, config.questionCount);
}
